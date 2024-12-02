# Export

The Rendley SDK allows you to export the final video using both [client-side](/rendering/render-on-device.md) and [server-side](/rendering/render-on-server.md) approaches. Each method has its strengths and weaknesses, so you can choose the one that best fits your application needs.

To export the final video, simply call the [`export()`](/api-reference/classes/Engine.html#export) function, which will return a Blob URL for the final video.

```typescript
const result = await Engine.getInstance().getTimeline().export();
```

### Export Segments of the Video

In addition to exporting the complete video, you can also export specific segments. To do this, specify the `from` and `to` parameters in seconds.

```typescript
const result = await Engine.getInstance().getTimeline().export({
  from: 1.02,
  to: 5.33,
});
```

### Export Specific Tracks

You can specify which tracks to export by setting the `type` parameter to either `video_only` or `audio_only`.

To export only the video track:

```typescript
const result = await Engine.getInstance().getTimeline().export({
  type: "video_only",
});
```

To export only the audio track:

```typescript
const result = await Engine.getInstance().getTimeline().export({
  type: "audio_only",
});
```

If the rendering is successful, the [`result`](/api-reference/interfaces/ExportResult.html) variable will contain the final Blob of the video, along with the file extension.

::: info
To learn more about on-device rendering and best practices, check out this [guide](/rendering/render-on-device.md).
:::

::: info
To learn more about server rendering and best practices, check out this [guide](/rendering/render-on-server.md).
:::
