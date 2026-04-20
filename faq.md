# FAQ

Short answers to questions that come up often. For hands-on guides, see the [Getting Started](/concepts.md) pages.

## Getting Started

::: details Do I need a server to use the SDK?
No. By default, the SDK runs entirely in the browser, decoding, rendering, and encoding all happen on the client. Use [server-side rendering](/rendering/render-on-server.md) only when you need batch export or centralized compute.
:::

::: details What browsers are supported?
The SDK runs in any modern browser. Hardware-accelerated encoding and decoding through [WebCodecs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) is the fast path on Chrome, Edge, and recent Safari; the SDK falls back to a WASM pipeline elsewhere.
:::

::: details Where do I get a license?
Free evaluation licenses are available at [app.rendleysdk.com](https://app.rendleysdk.com/). For production, contact the Rendley team for a domain-locked key.
:::

## Authoring

::: details How do I animate a property?
Use the [Property Animator](/getting-started/property-animator.md). Two keyframes on the same property give you linear interpolation; add bezier handles for ease curves.
:::

::: details How do I add a GLSL shader to a clip?
Register it in the Library with [`addEffect({ fragmentSrc })`](/getting-started/effects.md#adding-custom-effects), then call `clip.addEffect(libraryEffectId)` on the target clip. The effect can be animated through the Property Animator using the `effect:{instanceId}:{property}` track key.
:::

::: details How do I fade a clip in and out?
Animate the `alpha` property with the Property Animator. See the [Fade In / Fade Out](/getting-started/animation.md#quick-example) snippet, and [Playback Speed & Fades](/getting-started/playback-speed.md) for audio fades.
:::

::: details How do I make text reveal one letter at a time?
Add one hold keyframe per letter on the `text` property. See [Hold Keyframes](/getting-started/property-animator.md#hold-keyframes).
:::

::: details How do I reuse the same asset on multiple clips?
Upload it once with `addMedia` and reference the returned `mediaDataId` from every `addClip` call. The SDK deduplicates by content hash, so even if you upload the same file twice you don't pay extra memory.
:::

## Media & Library

::: details How do I know when a media file finished loading?
Listen for `library:media:ready` on the Engine event bus. The payload has `{ mediaDataId }`. See [Listening to Events](/user-interface/listening-to-events.md).
:::

::: details How do I extract audio from a video clip?
Either call [`videoClip.extractAudioClip()`](/getting-started/clips/video.md#extract-the-audio-track) to clone the audio onto a new layer, or [`library.extractAudioFromMedia(mediaId)`](/getting-started/library.md#extract-audio-from-a-video) to create a new standalone audio entry in the Library.
:::

::: details Can I persist media between page reloads?
Yes, plug in a [Storage](/getting-started/storage.md) provider. The SDK ships with `StorageIndexedDB` for local persistence; bring your own for server-side storage (S3 with presigned URLs, GCS, etc.).
:::

::: details Why do large files take a long time to hash?
SHA-256 is slow on big inputs. For files larger than a few hundred megabytes, switch to xxhash via [`setMediaHashAlgorithm`](/getting-started/settings.md#media). Not cryptographically secure, but sufficient for content addressing.
:::

## Rendering

::: details How do I track export progress?
Listen for the `time` event during export, the payload is the current render time in seconds. Divide by the composition duration for a percentage. See [Track Export Progress](/getting-started/export.md#tracking-progress).
:::

::: details How do I export a video larger than 2 GB?
Enable [chunked output](/getting-started/export.md#large-files-and-chunked-output) in the Settings. The export returns an `outputChunkHelper` instead of a blob, and you stream each chunk to disk or a network endpoint.
:::

::: details Can I preview the render without actually rendering?
Call `Engine.getInstance().play()` to play the composition in real time with the same pipeline used for export. The output matches bit-for-bit in most cases (except for some quality trade-offs in the preview path).
:::

::: details Why does my WebM export not have transparency?
Transparent WebM output needs the WASM renderer. Set `setEncoderUseWebCodecs(false)` and `setEncoderUseAlpha(true)` with codec `vp8` or `vp9`. See [Rendering Videos with Alpha](/getting-started/settings.md#alpha-channel-output).
:::

## Playback & Timeline

::: details Can I play a video in reverse?
No. Playback speed is positive only, in the range `[0.25, 4]` (`[0.25, 2]` on Safari).
:::

::: details How do I freeze the last frame of a video?
Use [`VideoClip.setFreezeTime`](/getting-started/clips/video.md#freeze-a-frame). Pass the source timestamp you want to hold on.
:::

::: details Why do my clips rearrange themselves when I add one?
By default, overlapping clips on the same layer push each other to make room. Disable with `{ adjustLayout: false }` on `addClip`. See [Adjust Layout on Add](/getting-started/clips.md#adjust-layout-on-add).
:::

## State & Persistence

::: details How do I save a project?
Call [`Engine.getInstance().serialize()`](/getting-started/save-restore.md) to get a JSON snapshot, then send it to your backend. Before saving, check [`Engine.isSafeToSerialize()`](/getting-started/engine.md#checking-readiness) to avoid writing mid-transcode.
:::

::: details How do I load a project on a fresh page?
Call `Engine.deserialize(state)` after `Engine.init`. See [Save & Restore](/getting-started/save-restore.md).
:::

::: details How do I auto-save?
Listen to SDK events, debounce changes, and call `serialize()` when the user has been idle briefly. Gate every save on `isSafeToSerialize()`. See the full [autosave pattern](/getting-started/save-restore.md#serialization).
:::

## Extending the SDK

::: details How do I build a custom clip type?
Extend the [`CustomClip`](/getting-started/clips/custom.md) base class, override `update(time)`, and register it with `Engine.getInstance().registerCustomClip(YourClass, "your-type")` **before** any deserialization.
:::

::: details Can I bring my own transcoder?
Yes. Implement the [`ITranscodeProvider`](https://docs.rendleysdk.com/api-reference/interfaces/ITranscodeProvider.html) interface and pass your instance as the `transcoder` option to `Engine.init`. Useful for server-side transcoding or when you need a codec the built-in transcoder doesn't support.
:::

::: details Can I use a different font than what's loaded by default?
Yes. Load it with [`fontRegistry.loadFromCssUrl`](/getting-started/fonts.md) or `loadFromUrl`, then reference the family name in a text clip's `style.fontFamily`.
:::
