# Troubleshooting

Common problems and how to fix them. If your issue isn't listed, open one on [GitHub](https://github.com/rendleyhq/rendley-sdk-issues/issues).

## Initialization

::: details You need to have a valid license to use this function
This error is thrown by the renderer when no license is found. Pass `licenseName` and `licenseKey` to `Engine.init`'s `license` option, or enable [remote validation](/getting-started/engine.md#remote-validation). Grab a free evaluation key at [app.rendleysdk.com](https://app.rendleysdk.com/).
:::

::: details Engine is already initialized. Use Engine.isInitialized() to check if the instance was already created
`Engine.init()` was called twice without a destroy in between. Either call `Engine.getInstance().destroy()` first, or guard with `if (!Engine.getInstance().isInitialized())` before initializing.
:::

::: details The preview canvas stays blank
Check that the `view` option in `Engine.init`'s `display` config points at a canvas element that's actually in the DOM, and that the canvas has non-zero size (either via CSS or via the parent container's size). The SDK draws to it on init and on every play loop.
:::

## Media & Library

::: details A deserialized project doesn't show its videos, images, or audio
The serialized project references media by hash, not by bytes. Configure a [Storage provider](/getting-started/storage.md) so the raw files can be restored when the project is deserialized. Without storage, only `permanentUrl` assets survive a reload.
:::

::: details Hashing is slow or fails on large files
SHA-256 is slow past a few hundred megabytes. Switch to xxHash with [`setMediaHashAlgorithm`](/getting-started/settings.md#media) before adding the large files.
:::

::: details `addMedia` fails silently on an HTTPS URL
Usually a CORS problem. The remote origin must serve the asset with `Access-Control-Allow-Origin` either `*` or your docs host. Confirm in the Network tab that the asset returns with the right CORS headers; the SDK uses `fetch` internally.
:::

::: details The `library:media:filmstrip:updated` event never fires with `status: "done"`
Filmstrip generation is opt-in. Enable it with [`setClipVideoStoreFilmstrip(true)`](/getting-started/settings.md#clip-video) **before** adding the video; the setting isn't retroactive for media that's already loaded.
:::

## Playback

::: details Video preview flickers when seeking
`clipVideoDynamicLoad` is probably on. It creates and destroys decoders on demand to avoid hitting the browser's decoder cap. For timelines with fewer than ~100 videos, turn it off via [`setClipVideoDynamicLoad(false)`](/getting-started/settings.md#clip-video). Only enable it when you actually have many videos.
:::

::: details `setPlaybackSpeed` moves other clips on the timeline
That's the expected behavior. Faster playback makes the clip shorter, which can overlap its neighbors and trigger layout adjustment. Call [`Timeline.adjustClipsLayout()`](/getting-started/timeline.md#adjust-layout) after setting the speed to reflow the layer cleanly.
:::

## Rendering

::: details Rendering is slow on macOS
Direct frame rendering (`RenderVideoUseDirectFrames`) is enabled by default and can be slower on Apple Silicon for some projects. Disable it through `forcedSettings` on `Engine.init`:

```typescript
await Engine.getInstance().init({
  forcedSettings: { renderVideoUseDirectFrames: false },
  // ...license, display
});
```
:::

::: details Export fails on a large file because of browser memory limits
The single-blob allocation limit is around 2 GB on Chrome. Enable [chunked output](/getting-started/export.md#large-files-and-chunked-output) in the Settings and stream the chunks to disk, OPFS, or a network endpoint. The `readMergedChunks*` helpers on `OutputChunkHelper` also hit this limit, so avoid them for big outputs.
:::

::: details WebM export has no transparency
Transparent WebM requires the WASM encoder, not WebCodecs. Set `setEncoderUseWebCodecs(false)`, `setEncoderUseAlpha(true)`, and `setEncoderCodec("vp8")` (or `"vp9"`) before exporting.
:::

::: details `render:error` fires but the message is empty or generic
Listen to the Engine's `log` event and capture entries with level `ERROR` from the console. Common culprits: a missing dependency for a custom effect, a media file that failed to load, or a codec that WebCodecs couldn't negotiate. Checking `Engine.isSafeToSerialize()` before exporting also catches cases where media is still being processed.
:::

## State & Serialization

::: details Serializing a project produces incomplete data
Gate on [`Engine.isSafeToSerialize()`](/getting-started/engine.md#checking-readiness). It returns `true` only when the Engine is ready **and** the Library isn't currently hashing, transcoding, or generating previews for any media.
:::

::: details Custom effect, filter, or transition is missing after deserialization
Assets added with `serializable: false` are not embedded in the project JSON. Restore them during deserialization through the [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) callback on `Engine.init`.
:::

::: details Custom clip instance is missing after deserialization
Register the class with `Engine.registerCustomClip(YourClass, typeString)` **before** calling `Engine.deserialize`. The SDK uses the `typeString` to find the constructor.
:::

## Integration

::: details `<rendley-video-editor>` doesn't render in React, Vue, or Angular
Make sure `defineCustomElements()` has been called during app init, and that your framework is configured to treat unknown tags as custom elements. See the [framework notes in the Video Editor UI Installation guide](/video-editor-ui/installation.md#framework-integrations).
:::
