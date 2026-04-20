# Render on Device

The advantage of this approach is that you can use the device's CPU and GPU for rendering, significantly reducing costs by avoiding the need to send all the assets of the composition. This rendering method works on both web browsers and mobile devices.

We use the [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) for hardware-accelerated encoding and decoding. If your browser does not support the WebCodecs API, we fall back to a WASM-based approach, which is widely supported but slightly slower.

### Export Video

To export the final video, simply call the [`export()`](https://docs.rendleysdk.com/api-reference/classes/Engine.html#export) function, which will return a blob URL for the completed video.

```typescript
const result = await Engine.getInstance().export();
```

If the rendering is successful, the [`result`](https://docs.rendleysdk.com/api-reference/interfaces/ExportResult.html) variable will contain the final blob of the video, along with the file extension.
