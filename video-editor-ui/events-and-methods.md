# Events & Methods

The `<rendley-video-editor>` element emits lifecycle events and exposes a handful of methods for reaching into the underlying Rendley SDK. Use them to hook the editor up to your app's state, persist projects, trigger exports, and listen for user actions.

## Events

Attach listeners with `addEventListener` on the element. For React, map them to props (`onOnReady`, `onOnRenderSuccess`). Stencil emits the raw DOM event names below.

| Event             | Detail              | Fires when                                                                   |
| ----------------- | ------------------- | ---------------------------------------------------------------------------- |
| `onReady`         | `void`              | The editor finished initializing the SDK and is ready for interaction.       |
| `onError`         | `unknown`           | Init or setup failed. Inspect the detail for the cause.                      |
| `onRenderSuccess` | `string` (blob URL) | An export finished. The detail is a blob URL pointing at the rendered video. |
| `onRenderError`   | `string` (message)  | An export failed.                                                            |

```typescript
const editor = document.getElementById("rendley");

editor.addEventListener("onReady", () => {
  console.log("Editor is ready");
});

editor.addEventListener("onRenderSuccess", (event) => {
  const blobUrl = event.detail;
  download(blobUrl, "my-video.mp4");
});

editor.addEventListener("onRenderError", (event) => {
  showToast(event.detail);
});

editor.addEventListener("onError", (event) => {
  console.error("Editor error", event.detail);
});
```

::: warning
Wait for `onReady` before calling any method. The editor has to load the SDK, fetch asset packs, and boot its stores first; calls made earlier will throw.
:::

## Methods

Stencil web components expose methods as async functions returned from the element. Call them after the element is in the DOM.

| Method            | Returns             | Description                                                                                                                 |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `getEngine()`     | `typeof Engine`     | The Rendley SDK `Engine` singleton class. Use `Engine.getInstance()` from there.                                            |
| `getRendleySDK()` | `typeof RendleySDK` | The full `@rendley/sdk` namespace, so you can reference types, enums, and classes without importing the package separately. |
| `getElement()`    | `HTMLElement`       | The editor's own host element (useful for measuring layout from outside).                                                   |

```typescript
const editor = document.getElementById("rendley");

editor.addEventListener("onReady", async () => {
  const Engine = await editor.getEngine();
  const SDK = await editor.getRendleySDK();

  // Any SDK call works from here, the editor has already initialized it.
  Engine.getInstance().events.on(SDK.EventsEnum.LIBRARY_ADDED, (payload) => {
    console.log("User added media", payload.mediaDataId);
  });
});
```

## Reacting to SDK Events

Once you have the Engine, you can subscribe to any [SDK event](/user-interface/listening-to-events.md). Common ones:

```typescript
const Engine = await editor.getEngine();
const events = Engine.getInstance().events;

events.on("library:added", ({ mediaDataId }) => {
  // A media file was uploaded
});

events.on("clip:added", ({ clipId }) => {
  // A clip was added to the timeline
});

events.on("playing", ({ isPlaying }) => {
  // Playback started or paused
});

events.on("render:completed", () => {
  // Export finished (also fires onRenderSuccess above)
});
```

## Unloading

Remove the element from the DOM and the editor tears itself down automatically, destroying the SDK engine, disposing MobX reactions, and unmounting the shortcut handlers. Nothing else is required.

If you want to tear down manually without removing the element, call the SDK's destroy instead:

```typescript
const Engine = await editor.getEngine();
await Engine.getInstance().destroy(true);
```

## Framework Examples

### React

```tsx
import { useEffect, useRef } from "react";
import { defineCustomElements } from "@rendley/video-editor-ui/loader";

defineCustomElements();

export function Editor({
  onBlobReady,
}: {
  onBlobReady: (url: string) => void;
}) {
  const editorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const handleReady = async () => {
      const Engine = await (el as any).getEngine();
      Engine.getInstance().events.on("library:added", () => {
        console.log("Media added");
      });
    };

    const handleSuccess = (e: Event) => onBlobReady((e as CustomEvent).detail);

    el.addEventListener("onReady", handleReady);
    el.addEventListener("onRenderSuccess", handleSuccess);

    return () => {
      el.removeEventListener("onReady", handleReady);
      el.removeEventListener("onRenderSuccess", handleSuccess);
    };
  }, [onBlobReady]);

  return (
    <rendley-video-editor
      ref={editorRef}
      licensename="YOUR_LICENSE_NAME"
      licensekey="YOUR_LICENSE_KEY"
    />
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { defineCustomElements } from "@rendley/video-editor-ui/loader";

defineCustomElements();

const editorEl = ref<HTMLElement | null>(null);

const handleSuccess = (event: Event) => {
  const blobUrl = (event as CustomEvent).detail;
  console.log("Rendered", blobUrl);
};

onMounted(() => {
  editorEl.value?.addEventListener("onRenderSuccess", handleSuccess);
});

onUnmounted(() => {
  editorEl.value?.removeEventListener("onRenderSuccess", handleSuccess);
});
</script>

<template>
  <rendley-video-editor
    ref="editorEl"
    licensename="YOUR_LICENSE_NAME"
    licensekey="YOUR_LICENSE_KEY"
  />
</template>
```

## See Also

- [Common Tasks](/video-editor-ui/common-tasks.md): practical recipes using these hooks.
- [Listening to Events](/user-interface/listening-to-events.md): full SDK event catalog.
- [Configuration](/video-editor-ui/configuration.md)
