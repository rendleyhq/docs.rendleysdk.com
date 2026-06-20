# SVG Clip

The [SvgClip](https://docs.rendleysdk.com/api-reference/classes/SvgClip.html) renders vector graphics on the canvas. Ideal for logos, icons, and any asset that needs to stay sharp at any resolution.

When you add an SVG file to the [Library](/getting-started/library.md), an `SvgClip` is created automatically instead of an `ImageClip`. Resizing up to 4096×4096 pixels is supported without visible quality loss.

## Create an SVG Clip

<LiveRun>

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/SVG_logo.svg/240px-SVG_logo.svg.png",
  );

const clip = await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
clip.style.setPosition(960, 540);
```

</LiveRun>

## See Also

- [Image](/getting-started/clips/image.md)
- [Shape](/getting-started/clips/shape.md): generate simple shapes programmatically instead of loading an SVG.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`SvgClip`](https://docs.rendleysdk.com/api-reference/classes/SvgClip.html)
