# Export

Rendley SDK is able to export the final video using both, a client side approach and server side approach. Both of these mechanisms have their strenghts and weaknesses, and it is up to you to decide which one is best for your application.
To export the final video, it is sufficient to call the `export()` function wich will return a blob url for the final video.

```typescript
const result = await Engine.getInstance().getTimeline().export();
```

If the rendering succeeded, the `result` variable will contain a the final blob of the video, as well as the extension of the file.
