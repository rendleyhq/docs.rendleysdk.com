# Export

Rendley SDK is able to export the final video using both, a client side approach and server side approach. Both of these mechanisms have their strenghts and weaknesses, and it is up to you to decide which one is best for your application.
To export the final video, it is sufficient to call the `export()` function wich will return a blob url for the final video.

```typescript
const result = await Engine.getInstance().getTimeline().export();
```

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

If the rendering succeeded, the `result` variable will contain a the final blob of the video, as well as the extension of the file.

::: info
To learn more about on device rendering and best practices, check out this [guide](/getting-started/render-on-device.md)
:::

::: info
To learn more about server rendering and best practices, check out this [guide](/getting-started/render-on-device.md)
:::
