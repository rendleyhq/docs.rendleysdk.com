# Render on device

The advance of this approach is that you can laverage the device's CPU and GPU for rendering and also cut costs from sending over all the assets of the composition. The rendering works on both, web browsers and mobile devices.

We laverage [WebCodecs APIs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) for hardware-accelerated encoding and decoding. If your browser doesn't support WebCodecs API, we fallback to a WASM based approach which is widely supported everywhere, but is a little bit slower.

### Export video

To export the final video, it is sufficient to call the `export()` function wich will return a blob url for the final video.

```typescript
const result = await Engine.getInstance().getTimeline().export();
```

If the rendering succeeded, the `result` variable will contain a the final blob of the video, as well as the extension of the file.

### Export segments of the video

Besides exporting the complete video, you can also exports segments of the video. To do so, simply specify the `from` and `to` parameters in seconds.

```typescript
const result = await Engine.getInstance().getTimeline().export({
  from: 1.02,
  to: 5.33,
});
```

### Export specific tracks

You can also specify which tracks to export, by setting the `type` parameter to `video_only` or `audio_only`.

```typescript
const result = await Engine.getInstance().getTimeline().export({
  type: "video_only",
});
```

Or

```typescript
const result = await Engine.getInstance().getTimeline().export({
  type: "audio_only",
});
```
