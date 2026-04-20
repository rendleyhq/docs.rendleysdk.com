# Export

The Rendley SDK allows you to export the final video using both [client-side](/rendering/render-on-device.md) and [server-side](/rendering/render-on-server.md) approaches. Each method has its strengths and weaknesses, so you can choose the one that best fits your application needs.

To export the final video, simply call the [`export()`](https://docs.rendleysdk.com/api-reference/classes/Engine.html#export) function, which will return an [`ExportResult`](https://docs.rendleysdk.com/api-reference/interfaces/ExportResult.html) containing a Blob (or an `outputChunkHelper` for chunked output) and the file extension.

```typescript
const result = await Engine.getInstance().export();
```

### Export Segments of the Video

In addition to exporting the complete video, you can also export specific segments. To do this, specify the `from` and `to` parameters in seconds.

```typescript
const result = await Engine.getInstance().export({
  from: 1.02,
  to: 5.33,
});
```

### Export Specific Tracks

You can specify which tracks to export by setting the `type` parameter to either `video_only` or `audio_only`.

To export only the video track:

```typescript
const result = await Engine.getInstance().export({
  type: "video_only",
});
```

To export only the audio track:

```typescript
const result = await Engine.getInstance().export({
  type: "audio_only",
});
```

If the rendering is successful, the [`result`](https://docs.rendleysdk.com/api-reference/interfaces/ExportResult.html) variable will contain the final Blob of the video, along with the file extension.

### Resolution Scaling

You can export the project at a different resolution than the one configured on the [Display](/getting-started/display.md). `resolutionScale` multiplies both dimensions:

```typescript
const result = await Engine.getInstance().export({
  resolutionScale: 0.5, // 1920x1080 becomes 960x540
});
```

### Canceling an Export

An export can be canceled in flight:

```typescript
await Engine.getInstance().cancelExport();
```

The SDK emits `render:canceled` on the event bus once the cancellation is done. Use [`Settings.setRenderCancelFailTimeout`](/getting-started/settings.md#cancel-timeout) to configure how long the SDK waits before forcing the stop.

### Large Files and Chunked Output

When your rendered file exceeds the browser's allocation limit (around 2GB on Chrome), enable chunked output in the [Settings](/getting-started/settings.md#chunked-output-2gb-files). The exported result will be returned as an [`OutputChunkHelper`](https://docs.rendleysdk.com/api-reference/classes/OutputChunkHelper.html) instead of a single blob:

```typescript
Engine.getInstance().getSettings().setRenderUseChunkedOutput(true);

const result = await Engine.getInstance().export();

if (result?.outputChunkHelper) {
  const helper = result.outputChunkHelper;
  const chunks = helper.getChunks();

  for (const chunk of chunks) {
    const bytes = await helper.readChunkAsBytes(chunk.id);
    await uploadToServer(bytes); // or stream to OPFS, a worker, etc.
    helper.removeChunk(chunk.id); // free memory as soon as the chunk is written
  }
}
```

Each chunk reports its `id`, `size`, and position in the output. Read it in whichever form suits the destination:

| Method                 | Returns               | When to use                                                                       |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `readChunkAsBytes(id)` | `Uint8Array`          | Streaming to a fetch body, OPFS, or a worker.                                     |
| `readChunkAsBlob(id)`  | `Blob`                | Passing to a browser API that needs a `Blob`. Doubles memory use during the read. |
| `readChunkAsUrl(id)`   | `string` (object URL) | Previewing a chunk in a `<video>` or an `<a href>`. Revoke the URL after use.     |
| `removeChunk(id)`      | `void`                | Free a chunk once you've moved it somewhere safe.                                 |
| `removeAllChunks()`    | `void`                | Tear everything down at once.                                                     |

#### Native Save Dialog

On browsers that support the File System Access API, `OutputChunkHelper` can pipe every chunk into a user-chosen file in one call:

```typescript
const helper = result.outputChunkHelper;

if (helper.isSaveToFileSupported()) {
  await helper.browseAndSaveToFile("my-video.mp4", (progress) =>
    console.log(`Saved ${Math.round(progress * 100)}%`),
  );
}
```

The picker returns control when the user selects a destination, then streams chunks straight to disk without keeping them all in memory.

::: warning
Avoid using the `readMergedChunks*` helpers on `OutputChunkHelper` for browser-side merging, they are bound to the browser's max allocation size. Stream the chunks directly to disk, OPFS, or a network endpoint.
:::

### Tracking Progress

Listen to the [Engine events](/user-interface/listening-to-events.md) to track progress and completion:

```typescript
Engine.getInstance().events.on("time", (time) => {
  console.log("Current time:", time);
});

Engine.getInstance().events.on("render:completed", () => {
  console.log("Export completed");
});

Engine.getInstance().events.on("render:error", ({ name, message }) => {
  console.error("Export failed:", name, message);
});
```

::: info
To learn more about on-device rendering and best practices, check out this [guide](/rendering/render-on-device.md).
:::

::: info
To learn more about server rendering and best practices, check out this [guide](/rendering/render-on-server.md).
:::
