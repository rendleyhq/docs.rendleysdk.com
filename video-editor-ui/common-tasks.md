# Common Tasks

Practical recipes for the most common integration work. All examples assume you already have a reference to the `<rendley-video-editor>` element and that you're running code inside an `onReady` listener (see [Events & Methods](/video-editor-ui/events-and-methods.md)).

```typescript
const editor = document.getElementById("rendley");

editor.addEventListener("onReady", async () => {
  const Engine = await editor.getEngine();
  const SDK = await editor.getRendleySDK();

  // ...your code here...
});
```

## Save a Project

Serialize the editor state to JSON and send it to your backend:

```typescript
async function saveProject() {
  if (!Engine.getInstance().isSafeToSerialize()) {
    // Media still processing, either wait or skip this save.
    return;
  }

  const state = Engine.getInstance().serialize();
  await fetch("/api/projects/123", {
    method: "PUT",
    body: JSON.stringify(state),
  });
}
```

For a full autosave pattern (debounced, event-driven, with `beforeunload` beacon), see the [Autosave pattern](/getting-started/save-restore.md#serialization).

## Load a Project

On a fresh page, wait for `onReady` and then deserialize into the Engine:

```typescript
editor.addEventListener("onReady", async () => {
  const Engine = await editor.getEngine();
  const response = await fetch("/api/projects/123");
  const state = await response.json();

  await Engine.deserialize(state);
});
```

The editor's UI re-renders automatically from SDK events, so the timeline, library tiles, and canvas preview all update without any extra calls.

## Upload Media Programmatically

Drag-and-drop works out of the box, but you can also add files from code, for example, from a server-provided URL or a hidden file input:

```typescript
const library = Engine.getInstance().getLibrary();

const mediaId = await library.addMedia("https://example.com/intro.mp4");
```

The new media appears in the sidebar's Media tab immediately because the editor listens to the `library:added` SDK event.

## Add a Clip to the Timeline

```typescript
const timeline = Engine.getInstance().getTimeline();
const layer = timeline.createLayer();

const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/clip.mp4");

await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

## Trigger an Export Programmatically

You don't have to wait for the user to click Export. Kick it off directly:

```typescript
async function exportVideo() {
  const result = await Engine.getInstance().export();
  if (result?.blob) {
    downloadBlob(result.blob, `video.${result.extension}`);
  }
}
```

The editor's built-in Export button uses the same method internally, so both paths fire the same `onRenderSuccess` / `onRenderError` events you've already attached to the element.

## React to User Actions

Everything the user does in the editor flows through SDK events. Attach listeners to drive your own state:

```typescript
const events = Engine.getInstance().events;

events.on("clip:added", ({ clipId }) => {
  trackAnalytics("clip_added", { clipId });
});

events.on("library:added", ({ mediaDataId }) => {
  // User uploaded a file
});

events.on("clip:style:updated", ({ clipId, property, value }) => {
  // User moved, scaled, or restyled a clip
});
```

See the full [event catalog](/user-interface/listening-to-events.md).

## Change the Theme at Runtime

The `theme` attribute is mutable, set it from JavaScript to re-theme on the fly:

```typescript
editor.setAttribute("theme", "light");
editor.setAttribute("highcontrast", "true");
```

Valid values for `theme`: `dark`, `light`, `system`.

## Add Custom Effects or Filters

The editor ships with a default effect and filter pack loaded from Rendley's CDN. To extend them, register extras through the [Library](/getting-started/library.md) after `onReady`:

```typescript
await Engine.getInstance().getLibrary().addFilter({
  id: "brand-lut",
  name: "Brand LUT",
  lutUrl: "https://cdn.yourdomain.com/luts/brand.png",
  serializable: true,
});

await Engine.getInstance()
  .getLibrary()
  .addEffect({
    id: "vignette",
    name: "Vignette",
    fragmentSrc: myVignetteShader,
    properties: { uRadius: 0.5 },
    serializable: true,
  });
```

Custom items appear alongside the built-ins in the user-facing UI.

## Undo / Redo From the Outside

The editor has built-in keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z). If you need the same behavior from a custom toolbar button:

```typescript
const undo = Engine.getInstance().getUndoManager();

myUndoButton.onclick = () => undo.undo();
myRedoButton.onclick = () => undo.redo();

Engine.getInstance().events.on("undo:redo:changed", ({ canUndo, canRedo }) => {
  myUndoButton.disabled = !canUndo;
  myRedoButton.disabled = !canRedo;
});
```

## Embed the Editor in a Modal

Web components keep their state across mounts, but the SDK destroys itself when the element leaves the DOM. To show the editor in a modal that repeatedly opens and closes, either:

1. Keep the editor mounted and toggle CSS `display`.
2. Recreate it each time, and re-apply any saved project through `Engine.deserialize`.

Option 1 is faster. Option 2 gives you a clean slate every open.

## Check If It's Safe to Save

Media processing is asynchronous, hashing, transcoding, waveform sampling, filmstrip generation. Before every save:

```typescript
if (Engine.getInstance().isSafeToSerialize()) {
  save();
} else {
  // Retry later, or schedule the save after library:media:ready fires
}
```

## See Also

- [Events & Methods](/video-editor-ui/events-and-methods.md)
- [Configuration](/video-editor-ui/configuration.md)
- [Save & Restore the Project](/getting-started/save-restore.md): the SDK-level save/load reference.
- [Listening to Events](/user-interface/listening-to-events.md): full SDK event catalog.
