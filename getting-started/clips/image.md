# Image Clip

The [ImageClip](https://docs.rendleysdk.com/api-reference/classes/ImageClip.html) renders a static image on the canvas. Use it for photos, logos, or any non-animated visual asset.

## Create an Image Clip

<LiveRun>

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1600",
  );

const clip = await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
clip.style.setPosition(960, 540);
clip.style.setScale(0.6, 0.6);
```

</LiveRun>

::: details List of Supported Formats {open}
| Format | Support |
| ------ | :-----: |
| JPEG | ✅ |
| PNG | ✅ |
| GIF | ✅ |
| WEBP | ✅ |
| BMP | ✅ |
| HEIC | ✅ |
:::

::: info
Animated GIFs should use the [Gif](/getting-started/clips/gif.md) clip instead so the animation plays back correctly. Static PNG/WebP with transparency work fine here.
:::

## See Also

- [Gif](/getting-started/clips/gif.md)
- [Svg](/getting-started/clips/svg.md)
- [Crop and Zoom](/getting-started/crop.md)
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`ImageClip`](https://docs.rendleysdk.com/api-reference/classes/ImageClip.html)
