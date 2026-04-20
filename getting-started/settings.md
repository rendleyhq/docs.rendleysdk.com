# Settings

Global configuration for the SDK, encoder, decoder, render loop, media processing, subtitles, and canvas behavior. Access through:

```typescript
const settings = Engine.getInstance().getSettings();
```

Every setting has a paired getter and setter. This page groups them by domain and lists defaults inline. For deep-dive explanations of settings tied to a specific feature (filmstrip, audio samples, chunked output), follow the link at the end of each section to the topical guide where they're used.

## Encoder

Controls the codec, quality, and acceleration used when exporting the final video.

| Setting                                       | Default  | Description                                                                      |
| --------------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `setEncoderCodec(codec)`                      | `"h264"` | Output codec: `"h264"`, `"vp8"`, or `"vp9"`.                                     |
| `setEncoderBitrate(bitsPerSecond)`            |          | Target bitrate in bits per second.                                               |
| `setEncoderCrf(crf)`                          |          | Constant Rate Factor (0 = lossless, higher = smaller).                           |
| `setEncoderKeyframeInterval(frames)`          |          | How often keyframes are inserted (shorter = easier to seek, bigger file).        |
| `setEncoderUseWebCodecs(bool)`                | `true`   | Use WebCodecs for hardware acceleration. Disable for the WASM fallback.          |
| `setEncoderUseAlpha(bool)`                    | `false`  | Include alpha channel in the output. Requires `vp8` or `vp9` and WASM rendering. |
| `setEncoderPreferredAcceleration(preference)` |          | `"prefer-hardware"` or `"prefer-software"`.                                      |

### Alpha Channel Output

```typescript
settings.setEncoderUseWebCodecs(false);
settings.setEncoderUseAlpha(true);
settings.setEncoderCodec("vp8");
```

## Decoder

Controls how video files are decoded during playback and export.

| Setting                                       | Default | Description                                                                                                                            |
| --------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `setDecoderPreferredAcceleration(preference)` |         | `"prefer-hardware"` or `"prefer-software"`.                                                                                            |
| `setDecoderUseSeparateWorker(bool)`           | `false` | Decode videos in individual workers. Useful when compositions have many videos on multiple layers. Not always faster, benchmark first. |
| `setDecoderUseSubImage(bool)`                 | `false` | Fill the old texture instead of creating a new one per frame. Benchmark for your use case.                                             |

## Render Loop

Controls the preview and export render loop.

| Setting                                | Default | Description                                                                                                                                      |
| -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setRenderShowPreview(bool)`           | `true`  | Show frames on the canvas while exporting.                                                                                                       |
| `setRenderAudioUseWorker(bool)`        | `true`  | Mix audio in a Web Worker instead of the main thread.                                                                                            |
| `setRenderVideoUseDirectFrames(bool)`  | `true`  | Use a direct frame-grab path. Faster on most devices; can be slower on Apple Silicon. Disable through `forcedSettings` if you hit render issues. |
| `setRenderMaxQueueSize(size)`          |         | Max async pixel buffer queue size.                                                                                                               |
| `setRenderThrottleFactor(factor)`      |         | Back-pressure throttle when direct-frame rendering is enabled.                                                                                   |
| `setRenderCancelFailTimeout(ms)`       |         | Failsafe for [`Engine.cancelExport`](/getting-started/export.md#canceling-an-export).                                                            |
| `setRenderUseChunkedOutput(bool)`      | `false` | Split output into chunks for files >2GB. See [chunked output](/getting-started/export.md#large-files-and-chunked-output).                        |
| `setRenderChunkedOutputMaxSize(bytes)` |         | Max size of each chunk when chunked output is on.                                                                                                |

## Clip Audio

Controls audio sample handling and fade behavior.

| Setting                                   | Default  | Description                                                                 |
| ----------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `setClipAudioStoreSamples(bool)`          | `false`  | Cache normalized samples per media entry. Required for waveforms.           |
| `setClipAudioSampleRate(hz)`              |          | Sample rate at which audio is extracted (lower = smaller memory footprint). |
| `setClipAudioSampleForceMono(bool)`       |          | Downmix stereo to mono during extraction.                                   |
| `setClipAudioMonoMixType(type)`           |          | How channels combine on mono mix: `"average"`, `"max"`, or `"min"`.         |
| `setClipAudioMonoChannelsWeight(weights)` | `[1, 1]` | Per-channel weight array applied before the mono mix.                       |
| `setClipAudioSeekThreshold(seconds)`      |          | Precision for audio seeking. Smaller = more precise, more expensive.        |

See [Filmstrip & Waveforms](/getting-started/filmstrip.md#audio-samples-waveforms) for the full sample extraction workflow.

## Clip Video

Controls video decoding, filmstrip thumbnails, and dynamic loading.

| Setting                                    | Default | Description                                                            |
| ------------------------------------------ | ------- | ---------------------------------------------------------------------- |
| `setClipVideoSeekThreshold(seconds)`       |         | Precision for video seeking.                                           |
| `setClipVideoStoreSamples(bool)`           | `false` | Cache audio samples extracted from videos.                             |
| `setClipVideoStoreFilmstrip(bool)`         | `false` | Generate timeline thumbnails for each video.                           |
| `setClipVideoFilmstripInterval(seconds)`   |         | Thumbnail sampling interval.                                           |
| `setClipVideoFilmstripMaxFrames(count)`    |         | Maximum number of thumbnails per video.                                |
| `setClipVideoFilmstripMaxWidth(px)`        |         | Thumbnail max width.                                                   |
| `setClipVideoFilmstripMaxHeight(px)`       |         | Thumbnail max height.                                                  |
| `setClipVideoFilmstripMaxWorkers(count)`   |         | Parallel thumbnail workers.                                            |
| `setClipVideoFilmstripKeyframesOnly(bool)` |         | Only sample on keyframes (faster, lower precision).                    |
| `setClipVideoDynamicLoad(bool)`            | `false` | Lazy-load video decoders. Enable only for 128+ videos in the timeline. |
| `setClipVideoDynamicLoadTime(seconds)`     |         | Look-ahead window for dynamic loading.                                 |

See [Filmstrip & Waveforms](/getting-started/filmstrip.md) for the full filmstrip setup.

## View

Controls how the canvas responds to resolution changes.

| Setting                           | Default | Description                                                                                                                                                        |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setViewAutoLayoutOnResize(mode)` | `NONE`  | Reposition/resize existing clips when the display resolution changes. See [`AutoLayoutMode`](https://docs.rendleysdk.com/api-reference/enums/AutoLayoutMode.html). |

## Subtitles

| Setting                              | Default | Description                                                |
| ------------------------------------ | ------- | ---------------------------------------------------------- |
| `setSubtitlesScaleOnResize(bool)`    | `false` | Auto-scale subtitles when the display resolution changes.  |
| `setSubtitlesAutoWrapOnResize(bool)` | `false` | Auto-rewrap subtitles when the display resolution changes. |

## Media

| Setting                               | Default   | Description                                                                                                                                                                                                     |
| ------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setMediaHashAlgorithm(algorithm)`    | `SHA_256` | Algorithm used for content hashing. Use `XX_HASH_64` / `XX_HASH_128` for files larger than a few hundred MB. See [`HashAlgorithmEnum`](https://docs.rendleysdk.com/api-reference/enums/HashAlgorithmEnum.html). |
| `setM3u8MaxResolution(width, height)` |           | Cap the resolution picked from HLS/m3u8 sources.                                                                                                                                                                |
| `setUseInternalTranscoder(bool)`      | `true`    | Use the SDK's built-in transcoder. Set to `false` when providing a custom [`ITranscodeProvider`](https://docs.rendleysdk.com/api-reference/interfaces/ITranscodeProvider.html).                                 |

## Forced Settings

Some settings can be applied at init time and take precedence over anything stored in a serialized project:

```typescript
await Engine.getInstance().init({
  forcedSettings: {
    renderVideoUseDirectFrames: false,
    encoderBitrate: 8_000_000,
  },
  // ...license, display
});
```

Useful when you want to override per-project values across the board (for example, to force software encoding on a specific deployment regardless of what the saved project requested).

## See Also

- [Export](/getting-started/export.md): encoder and chunked-output options in context.
- [Filmstrip & Waveforms](/getting-started/filmstrip.md): filmstrip and sample settings in context.
- [Storage](/getting-started/storage.md#big-files): big-file hashing and storage.
- API reference: [`Settings`](https://docs.rendleysdk.com/api-reference/classes/Settings.html)
