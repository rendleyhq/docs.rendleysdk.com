<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from "vue";

const props = defineProps<{
  // Inline snippet fallback. Prefer the default slot for readability.
  code?: string;
  // Optional height of the preview. When unset, the preview uses a 16:9
  // aspect ratio so the SDK's 1920x1080 canvas fits edge to edge.
  height?: string | number;
  // Optional code prepended to the snippet before it runs. Overrides the
  // default auto-injected boilerplate when set.
  setup?: string;
  // If true, skip boilerplate auto-injection. The snippet is expected to be
  // a complete program (imports, Engine init, play, everything).
  standalone?: boolean;
  // Pin the SDK version used inside the Sandpack iframe. Defaults to the
  // current production version.
  sdkVersion?: string;
}>();

const sourceEl = ref<HTMLDivElement | null>(null);
const previewEl = ref<HTMLDivElement | null>(null);
const isRunning = ref(false);
// `isBooting` is true from the Run click until the iframe posts a
// `live-run:ready` message, which fires only after the snippet's async IIFE
// (including the Engine init) resolves. This covers the full cold start.
const isBooting = ref(false);
const loadingMessage = ref("Starting");
const error = ref<string | null>(null);
const showFull = ref(false);

let client: any = null;
let unsubscribe: (() => void) | null = null;
let iframeElement: HTMLIFrameElement | null = null;
let messageListener: ((e: MessageEvent) => void) | null = null;

const sdkVersion = computed(() => props.sdkVersion ?? "1.15.4");

const previewStyle = computed(() => {
  if (props.height != null) {
    const h =
      typeof props.height === "number" ? `${props.height}px` : props.height;
    return { height: h, aspectRatio: "auto" };
  }
  return { height: "auto", aspectRatio: "16 / 9" };
});

// Read the code fenced inside the slot. VitePress turns fenced blocks into
// <div class="language-*"><pre><code>...</code></pre></div>, so we grab the
// textContent of the first <pre>.
function readRenderedCode(): string {
  if (props.code) return props.code;
  const pre = sourceEl.value?.querySelector("pre");
  return pre?.textContent?.replace(/\n$/, "") ?? "";
}

// Common named exports from @rendley/sdk that recipes reach for. We only
// import the ones the snippet actually references so the compiled module
// stays clean.
const SDK_EXPORTS = [
  "Engine",
  "AnimationTypeEnum",
  "AnimationSpaceEnum",
  "OutOfRangeEnum",
  "EasingEnum",
  "ClipTypeEnum",
  "WrapModeEnum",
  "BlendModeEnum",
  "FadeCurveEnum",
  "FitStyleEnum",
  "HighlightAnimationEnum",
  "MediaProcessStatusEnum",
  "HashAlgorithmEnum",
  "PropertyDescriptionTypeEnum",
  "Subtitles",
  "SubtitlesClip",
  "CustomClip",
  "LottieClip",
  "MaskFilter",
];

function detectUsedExports(code: string): string[] {
  return SDK_EXPORTS.filter((name) =>
    new RegExp(`\\b${name}\\b`).test(code),
  );
}

// Default init block. `await` is legal here because composeSnippet wraps the
// body in an async IIFE before compilation.
const DEFAULT_INIT = [
  "await Engine.getInstance().init({",
  "  license: {",
  '    licenseName: "DOCS_PLAYGROUND",',
  '    licenseKey: "DOCS_KEY",',
  "  },",
  "  display: {",
  "    width: 1920,",
  "    height: 1080,",
  '    backgroundColor: "#000000",',
  '    view: document.getElementById("rendley-canvas") as HTMLCanvasElement,',
  "  },",
  "});",
  "",
  "const layer = Engine.getInstance().getTimeline().createLayer();",
].join("\n");

const DEFAULT_TAIL = "await Engine.getInstance().getTimeline().play();";

function snippetHandlesInit(code: string): boolean {
  return /Engine\.getInstance\(\)\.init\s*\(/.test(code);
}

function snippetCallsPlay(code: string): boolean {
  return /\.play\s*\(\s*\)/.test(code);
}

// Compose the final snippet module:
// - Extract imports, dedupe across boilerplate + snippet, hoist to top.
// - Auto-import SDK named exports referenced by the snippet.
// - Wrap the non-import body in an async IIFE so `await` works without
//   relying on top-level await (which Sandpack's bundler does not support).
// - Append play() unless the snippet already calls it.
function composeSnippet(userCode: string): string {
  const standalone = props.standalone === true || snippetHandlesInit(userCode);

  const head = standalone ? "" : (props.setup ?? DEFAULT_INIT);
  const headParts = splitImports(head);
  const bodyParts = splitImports(userCode);

  // Auto-import any SDK exports referenced by the snippet that aren't already
  // imported. `Engine` is always added when we inject init boilerplate.
  const usedExports = detectUsedExports(userCode);
  const implicitImports = standalone
    ? []
    : [
        `import { ${Array.from(new Set(["Engine", ...usedExports]))
          .sort()
          .join(", ")} } from "@rendley/sdk";`,
      ];

  const imports = dedupeImports([
    ...implicitImports,
    ...headParts.imports,
    ...bodyParts.imports,
  ]);

  const tail =
    standalone || snippetCallsPlay(userCode) ? "" : DEFAULT_TAIL;

  const bodyPieces = [
    headParts.rest.trim(),
    bodyParts.rest.trim(),
    tail,
  ].filter(Boolean);

  return (
    imports.join("\n") +
    (imports.length ? "\n\n" : "") +
    wrapInIIFE(bodyPieces.join("\n\n")) +
    "\n"
  );
}

function wrapInIIFE(body: string): string {
  if (!body.trim()) return "";
  const indented = body
    .split("\n")
    .map((line) => (line.length ? "  " + line : line))
    .join("\n");
  return "(async () => {\n" + indented + "\n})();";
}

// A readable version of the composed snippet for the "Show full code" view.
// Same imports + boilerplate + snippet + play tail as the executed module,
// but without the async IIFE wrapper, so the code looks the way a developer
// would actually write it in their own project (top-level await + all).
const readableCode = computed(() => {
  const userCode = readRenderedCode();
  if (!userCode) return "";

  const standalone = props.standalone === true || snippetHandlesInit(userCode);
  const head = standalone ? "" : (props.setup ?? DEFAULT_INIT);
  const headParts = splitImports(head);
  const bodyParts = splitImports(userCode);

  const usedExports = detectUsedExports(userCode);
  const implicitImports = standalone
    ? []
    : [
        `import { ${Array.from(new Set(["Engine", ...usedExports]))
          .sort()
          .join(", ")} } from "@rendley/sdk";`,
      ];

  const imports = dedupeImports([
    ...implicitImports,
    ...headParts.imports,
    ...bodyParts.imports,
  ]);

  const tail =
    standalone || snippetCallsPlay(userCode) ? "" : DEFAULT_TAIL;

  const bodyPieces = [
    headParts.rest.trim(),
    bodyParts.rest.trim(),
    tail,
  ].filter(Boolean);

  return (
    imports.join("\n") +
    (imports.length ? "\n\n" : "") +
    bodyPieces.join("\n\n")
  );
});

async function copyFull() {
  try {
    await navigator.clipboard.writeText(readableCode.value);
  } catch {}
}

// Extract every top-level `import ... from "..."` declaration from the
// source, handling both single-line and multi-line forms. Anything that is
// not an import is returned in `rest` with the original line order preserved.
function splitImports(src: string): { imports: string[]; rest: string } {
  const imports: string[] = [];
  const re = /import\s+.*?\s+from\s+["'][^"']+["']\s*;?/gs;

  let lastIndex = 0;
  let rest = "";
  let match: RegExpExecArray | null;
  while ((match = re.exec(src)) !== null) {
    imports.push(match[0]);
    rest += src.slice(lastIndex, match.index);
    lastIndex = match.index + match[0].length;
  }
  rest += src.slice(lastIndex);

  return { imports, rest };
}

// Collapse `import { A } from "x"` and `import { B } from "x"` into a single
// declaration.
function dedupeImports(statements: string[]): string[] {
  const named = new Map<string, Set<string>>();
  const others: string[] = [];
  const reNamed =
    /^\s*import\s+\{\s*([^}]+)\s*\}\s+from\s+["']([^"']+)["']\s*;?\s*$/s;

  for (const stmt of statements) {
    const m = reNamed.exec(stmt);
    if (m) {
      const names = m[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const source = m[2];
      if (!named.has(source)) named.set(source, new Set());
      names.forEach((n) => named.get(source)!.add(n));
    } else {
      others.push(stmt);
    }
  }

  const merged: string[] = [];
  for (const [source, names] of named) {
    merged.push(
      `import { ${Array.from(names).sort().join(", ")} } from "${source}";`,
    );
  }
  return [...merged, ...others];
}

// Minimal HTML shell. A status bar floats over the canvas and is only
// visible when there's something to show (errors, mainly).
// Each end-tag token for script and style is split across string
// concatenations so the Vue SFC tokenizer does not mistake them for the end
// of this component's own blocks.
function buildIndexHtml(): string {
  // Canvas uses intrinsic-sizing CSS:
  //   width: auto !important; height: auto !important;
  //   max-width: 100% !important; max-height: 100% !important;
  //
  // The canvas has intrinsic dimensions (1920x1080) from the Engine's render
  // resolution. width/height set to "auto" keeps the intrinsic aspect ratio
  // while max-width/max-height cap the display size to the container.
  //
  // The !important is required because Pixi (via the SDK's Engine init) sets
  // inline style.width / style.height to "1920px" / "1080px" on the canvas.
  // Without !important, the inline styles win and the canvas overflows.
  return [
    "<!DOCTYPE html>",
    "<html>",
    "  <head>",
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "    <" + "style>",
    "      html, body { margin: 0; padding: 0; height: 100%; background: transparent; color: #e3e7ef; font: 13px/1.4 -apple-system, Segoe UI, sans-serif; overflow: hidden; }",
    "      #app { position: relative; display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; overflow: hidden; }",
    "      #rendley-canvas { width: auto !important; height: auto !important; max-width: 100% !important; max-height: 100% !important; display: block; }",
    '      #status { position: absolute; left: 0; right: 0; bottom: 0; padding: 8px 12px; background: rgba(14, 17, 24, 0.9); border-top: 1px solid rgba(255, 255, 255, 0.06); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; max-height: 40%; overflow: auto; white-space: pre-wrap; word-break: break-word; transition: opacity 0.15s ease; }',
    '      #status[data-kind="hidden"] { opacity: 0; pointer-events: none; }',
    '      #status[data-kind="error"] { color: #ff9a9a; background: rgba(80, 20, 20, 0.95); }',
    "    </" + "style>",
    "  </head>",
    "  <body>",
    '    <div id="app"><canvas id="rendley-canvas"></canvas></div>',
    '    <div id="status" data-kind="hidden"></div>',
    '    <' + 'script type="module" src="/src/main.ts"></' + 'script>',
    "  </body>",
    "</html>",
  ].join("\n");
}

// Host module. Installs error handlers, enforces canvas sizing against
// Pixi's own style writes, then dynamically imports the user's snippet.
// Reports lifecycle back to the parent via postMessage so the parent can
// keep the loading overlay up until the snippet truly finishes.
const HOST_TS = [
  'const status = document.getElementById("status")!;',
  "",
  'function setStatus(msg: string, kind: "info" | "error" | "hidden" = "info") {',
  "  status.textContent = msg;",
  "  status.dataset.kind = kind;",
  "}",
  "",
  "function postReady(ok: boolean, message?: string) {",
  "  try {",
  '    window.parent?.postMessage(',
  "      { type: ok ? \"live-run:ready\" : \"live-run:error\", message },",
  '      "*",',
  "    );",
  "  } catch {}",
  "}",
  "",
  "function applyCanvasFit(canvas: HTMLCanvasElement) {",
  '  canvas.style.setProperty("width", "auto", "important");',
  '  canvas.style.setProperty("height", "auto", "important");',
  '  canvas.style.setProperty("max-width", "100%", "important");',
  '  canvas.style.setProperty("max-height", "100%", "important");',
  '  canvas.style.setProperty("display", "block", "important");',
  "}",
  "",
  "// Pixi's Renderer writes style.width and style.height on every resize.",
  "// A MutationObserver keeps our fit rules authoritative for the lifetime of",
  "// the sandbox, no matter how many times Pixi reapplies its own values.",
  'const canvas = document.getElementById("rendley-canvas") as HTMLCanvasElement | null;',
  "if (canvas) {",
  "  applyCanvasFit(canvas);",
  "  new MutationObserver(() => applyCanvasFit(canvas)).observe(canvas, {",
  "    attributes: true,",
  '    attributeFilter: ["style", "width", "height"],',
  "  });",
  "}",
  "",
  'window.addEventListener("error", (e) => {',
  '  setStatus("Error: " + (e.message || String(e)), "error");',
  "  postReady(false, e.message || String(e));",
  "});",
  'window.addEventListener("unhandledrejection", (e) => {',
  "  const r = (e as any).reason;",
  "  const msg = r?.message ?? String(r);",
  '  setStatus("Error: " + msg, "error");',
  "  postReady(false, msg);",
  "});",
  "",
  'import("./snippet")',
  "  .then(() => {",
  '    setStatus("", "hidden");',
  "    postReady(true);",
  "  })",
  "  .catch((err) => {",
  "    const msg = err?.message ?? String(err);",
  '    setStatus("Error: " + msg, "error");',
  "    postReady(false, msg);",
  "  });",
].join("\n");

// Build the Sandpack file map. `@rendley/sdk` is pinned in the Sandpack
// `dependencies` so the bundler resolves it through its npm proxy. Sandpack
// caches the resolved bundle across runs via a service worker, so the slow
// part only happens once per browser session.
function buildSandboxSetup(userCode: string) {
  const snippet = composeSnippet(userCode);

  return {
    files: {
      "/index.html": { code: buildIndexHtml() },
      "/tsconfig.json": {
        code: JSON.stringify(
          {
            compilerOptions: {
              target: "ESNext",
              module: "ESNext",
              moduleResolution: "bundler",
              strict: false,
              lib: ["DOM", "ESNext"],
              skipLibCheck: true,
            },
          },
          null,
          2,
        ),
      },
      "/src/main.ts": { code: HOST_TS },
      "/src/snippet.ts": { code: snippet },
    },
    dependencies: {
      "@rendley/sdk": sdkVersion.value,
    },
    template: "vite" as const,
    entry: "/src/main.ts",
  };
}

async function run() {
  if (isBooting.value || isRunning.value) return;
  error.value = null;
  isBooting.value = true;
  loadingMessage.value = "Starting";

  try {
    const code = readRenderedCode();
    if (!code) {
      throw new Error("No code snippet found inside <LiveRun>.");
    }

    loadingMessage.value = "Loading bundler";
    const { loadSandpackClient } = await import(
      "@codesandbox/sandpack-client"
    );

    if (!previewEl.value) throw new Error("Preview element not ready.");

    isRunning.value = true;
    await nextFrame();

    previewEl.value.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.className = "live-run-iframe";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms allow-modals allow-popups",
    );
    previewEl.value.appendChild(iframe);
    iframeElement = iframe;

    // Listen for the ready/error message posted by the host module inside
    // the iframe. That message fires AFTER the snippet's async IIFE resolves,
    // which is when the SDK has finished initializing. Sandpack's own "done"
    // event fires much earlier (as soon as the module script starts) and is
    // not a reliable signal for when the user can actually see the canvas.
    messageListener = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow) return;
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "live-run:ready") {
        isBooting.value = false;
        loadingMessage.value = "";
      } else if (e.data.type === "live-run:error") {
        isBooting.value = false;
        error.value = e.data.message || "Snippet error";
      }
    };
    window.addEventListener("message", messageListener);

    loadingMessage.value = "Installing SDK";
    client = await loadSandpackClient(iframe, buildSandboxSetup(code), {
      showOpenInCodeSandbox: false,
      showErrorScreen: true,
      showLoadingScreen: false,
    });

    // Sandpack lifecycle drives the loading label up to the point where the
    // snippet begins evaluating. After that, only the postMessage from inside
    // the iframe can clear the overlay (see messageListener above).
    unsubscribe = client.listen((msg: any) => {
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "start") {
        loadingMessage.value = "Compiling";
      } else if (msg.type === "status" && msg.status === "transpiling") {
        loadingMessage.value = "Compiling";
      } else if (msg.type === "status" && msg.status === "evaluating") {
        loadingMessage.value = "Initializing SDK";
      } else if (
        msg.type === "action" &&
        msg.action === "show-error"
      ) {
        error.value = msg.title || msg.message || "Sandbox error";
        isBooting.value = false;
      }
    });
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    isRunning.value = false;
    isBooting.value = false;
  }
}

function nextFrame() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => resolve()),
  );
}

function reset() {
  try {
    unsubscribe?.();
  } catch {}
  unsubscribe = null;
  if (messageListener) {
    window.removeEventListener("message", messageListener);
    messageListener = null;
  }
  try {
    client?.destroy?.();
  } catch {}
  client = null;
  iframeElement = null;
  if (previewEl.value) previewEl.value.innerHTML = "";
  isRunning.value = false;
  isBooting.value = false;
  error.value = null;
  loadingMessage.value = "";
}

async function reload() {
  if (isBooting.value) return;
  reset();
  await nextFrame();
  await run();
}

onBeforeUnmount(() => {
  reset();
});
</script>

<template>
  <div class="live-run">
    <div ref="sourceEl" class="live-run-source">
      <slot />
    </div>

    <div
      v-if="showFull"
      class="live-run-full"
      aria-label="Complete runnable example including Engine init"
    >
      <div class="live-run-full-header">
        <span class="live-run-full-label">Full runnable example</span>
        <button class="live-run-btn-ghost-sm" @click="copyFull" title="Copy">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="9" height="10" rx="1.5" />
            <path d="M3 11V3a1.5 1.5 0 0 1 1.5-1.5H10" />
          </svg>
          Copy
        </button>
      </div>
      <pre class="live-run-full-code"><code>{{ readableCode }}</code></pre>
    </div>

    <div class="live-run-toolbar">
      <div class="live-run-actions">
        <button
          v-if="!isRunning && !isBooting"
          class="live-run-btn live-run-btn-primary"
          @click="run"
          :disabled="isBooting"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 1.5 10 6 3 10.5z" />
          </svg>
          Run
        </button>

        <button
          v-if="isRunning || isBooting"
          class="live-run-btn live-run-btn-secondary"
          @click="reload"
          :disabled="isBooting"
          title="Reload"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M1.5 2.5v4h4" />
            <path d="M14.5 13.5v-4h-4" />
            <path d="M3.6 6.5a5 5 0 0 1 8.3-1.6L14.5 6.5" />
            <path d="M12.4 9.5a5 5 0 0 1-8.3 1.6L1.5 9.5" />
          </svg>
          Reload
        </button>

        <button
          v-if="isRunning || isBooting"
          class="live-run-btn live-run-btn-ghost"
          @click="reset"
          :disabled="isBooting"
          title="Stop"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="2.5" y="2.5" width="7" height="7" rx="1" />
          </svg>
          Stop
        </button>

        <button
          class="live-run-btn live-run-btn-ghost"
          @click="showFull = !showFull"
          :aria-pressed="showFull"
          title="Show full example with Engine init"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 5-3 3 3 3" />
            <path d="m11 5 3 3-3 3" />
          </svg>
          {{ showFull ? "Hide full code" : "Show full code" }}
        </button>
      </div>

      <div class="live-run-status">
        <span
          class="live-run-dot"
          :data-state="
            isBooting
              ? 'loading'
              : isRunning
                ? 'running'
                : error
                  ? 'error'
                  : 'idle'
          "
        ></span>
        <span class="live-run-status-label">
          <template v-if="isBooting">Starting</template>
          <template v-else-if="isRunning">Running</template>
          <template v-else-if="error">Error</template>
          <template v-else>Idle</template>
        </span>
      </div>
    </div>

    <div v-if="error" class="live-run-error">{{ error }}</div>

    <div
      v-show="isRunning || isBooting"
      class="live-run-preview"
      :style="previewStyle"
    >
      <div ref="previewEl" class="live-run-frame"></div>
      <div v-if="isBooting" class="live-run-loading">
        <div class="live-run-spinner" aria-hidden="true"></div>
        <span class="live-run-loading-text">{{
          loadingMessage || "Loading"
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-run {
  /* Match VitePress's default vertical rhythm for paragraphs and code
     blocks so the component sits flush with surrounding content. */
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.live-run-source :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.live-run-full {
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg, var(--vp-c-bg-alt));
}

.live-run-full-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.live-run-full-label {
  font-weight: 600;
}

.live-run-full-code {
  margin: 0;
  padding: 16px 24px;
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
}

.live-run-btn-ghost-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.live-run-btn-ghost-sm:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.live-run-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.live-run-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.live-run-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: inherit;
  font-weight: 500;
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;
  line-height: 1;
}

.live-run-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.live-run-btn svg {
  flex-shrink: 0;
}

.live-run-btn-primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.live-run-btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.live-run-btn-secondary {
  background: var(--vp-c-bg-alt, var(--vp-c-bg-soft));
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.live-run-btn-secondary:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.live-run-btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--vp-c-text-2);
}

.live-run-btn-ghost:hover:not(:disabled) {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.live-run-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.live-run-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-text-3, #888);
  transition: background 0.15s ease;
}

.live-run-dot[data-state="running"] {
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  animation: live-run-pulse 1.8s ease-in-out infinite;
}

.live-run-dot[data-state="loading"] {
  background: var(--vp-c-warning-1, #eab308);
  animation: live-run-pulse 1s ease-in-out infinite;
}

.live-run-dot[data-state="error"] {
  background: var(--vp-c-danger-1, #e5484d);
}

@keyframes live-run-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.live-run-error {
  padding: 8px 12px;
  background: color-mix(
    in srgb,
    var(--vp-c-danger-1, #e5484d) 10%,
    transparent
  );
  color: var(--vp-c-danger-1, #e5484d);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  white-space: pre-wrap;
  word-break: break-word;
}

.live-run-preview {
  width: 100%;
  background:
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02) 10px,
      rgba(255, 255, 255, 0.04) 10px,
      rgba(255, 255, 255, 0.04) 20px
    ),
    #0b0e14;
  position: relative;
  min-height: 200px;
  overflow: hidden;
}

.live-run-frame {
  position: absolute;
  inset: 0;
}

.live-run-frame :deep(.live-run-iframe),
.live-run-frame :deep(iframe) {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.live-run-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(11, 14, 20, 0.85);
  backdrop-filter: blur(4px);
  color: #d1d5db;
  font-size: 13px;
  pointer-events: none;
}

.live-run-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: live-run-spin 0.9s linear infinite;
}

@keyframes live-run-spin {
  to {
    transform: rotate(360deg);
  }
}

.live-run-loading-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  letter-spacing: 0.02em;
}
</style>
