# Video Clip

The [VideoClip](https://docs.rendleysdk.com/api-reference/classes/VideoClip.html) loads a video file, decodes it through WebCodecs (or a WASM fallback), and renders it on the canvas. It supports trimming, freeze frames, playback speed, and audio extraction.

## Create a Video Clip

The duration is inferred from the media data, so you only need to specify the start time.

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/clip.mp4");

await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

::: details List of Supported Formats {open}
| Format | Support |
| ------ | :-----: |
| MP4 | ✅ |
| MOV | ✅ |
| AVI | ✅ |
| WEBM | ✅ |
| MKV | ✅ |
| M3U8 | ✅ |
:::

## Freeze a Frame

Pause the video on a specific frame for the rest of the clip duration with [`setFreezeTime`](https://docs.rendleysdk.com/api-reference/classes/VideoClip.html#setfreezetime). Useful for a poster frame or a hold at the end of a segment.

```typescript
videoClip.setFreezeTime(2.0); // freeze at second 2
videoClip.setFreezeTime(); // unfreeze
```

## Extract a Frame

Export the current frame of the video as a base64 image. `extractFrameAsBase64Image` takes an options object with `mimeType` and `quality`:

```typescript
const image = await videoClip.extractFrameAsBase64Image({
  mimeType: "image/jpeg",
  quality: 0.9,
});
```

To capture a specific time rather than the current frame, seek first: `Engine.getInstance().seek(1.5)` then call `extractFrameAsBase64Image`. Or use [`Engine.getInstance().getFrameAsBase64Image(time, mimeType, quality)`](/getting-started/engine.md#capturing-a-frame) which accepts a time and works across the whole composition.

## Extract the Audio Track

Split the audio onto a separate audio clip on another layer. The original video stays silent.

```typescript
const audioClip = videoClip.extractAudioClip();
```

If you want a brand-new independent media entry (for example to reuse the audio without re-downloading), call [`Library.extractAudioFromMedia`](/getting-started/library.md#extract-audio-from-a-video) instead.

## Playback Speed and Audio Fade

Speed, pitch preservation, volume, and volume fades are covered on the dedicated [Playback Speed & Fades](/getting-started/playback-speed.md) page.

## See Also

- [Audio](/getting-started/clips/audio.md)
- [Clip API Reference](/getting-started/clips.md#common-api)
- [Playback Speed & Fades](/getting-started/playback-speed.md)
- API reference: [`VideoClip`](https://docs.rendleysdk.com/api-reference/classes/VideoClip.html)
