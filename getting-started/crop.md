# Crop and Zoom

The Crop API masks the visible area of a media clip without duplicating the asset. Cropping happens in the shader, so it is non-destructive and can be animated through the [Property Animator](/getting-started/property-animator.md).

::: info
Crop is available on [VideoClip](/getting-started/clips/video.md), [ImageClip](/getting-started/clips/image.md), and [GifClip](/getting-started/clips/gif.md). It is not available on text, shapes, or Lottie clips.
:::

The examples below use shape clips for clarity, the API is identical for media clips, but shapes don't need a remote media upload to demonstrate.

## setCrop

`setCrop(left, top, right, bottom)` cuts pixels off each side of the source. Values are in source pixels, not display pixels.

<LiveRun>

```typescript
// Load a sample image from Pexels and crop it into a wide cinematic slice.
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

// Cut 300 source pixels off the top and 300 off the bottom.
clip.style.setCrop(0, 300, 0, 300);

const [left, top, right, bottom] = clip.style.getCrop();
```

</LiveRun>

## setCropOffset

When a crop is active, `setCropOffset(x, y)` pans the visible window across the source. Positive `x` moves the source to the right (revealing more of the left edge).

```typescript
clip.style.setCropOffset(20, -10);
```

## setZoom

`setZoom(zoomX, zoomY)` scales the source inside the cropped frame. `1` is natural size; `2` zooms in 2×. The frame does not resize, this is independent of `setScale`.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 4,
  style: { fillColor: "#6d6ff2", width: 900, height: 500 },
});
clip.style.setPosition(960, 540);

// Animate a slow zoom over four seconds.
clip.propertyAnimator.addKeyframe("zoomX", 0, 1);
clip.propertyAnimator.addKeyframe("zoomX", 4, 1.4);
clip.propertyAnimator.addKeyframe("zoomY", 0, 1);
clip.propertyAnimator.addKeyframe("zoomY", 4, 1.4);
```

</LiveRun>

Use `zoom` for proportional zoom on both axes, or `scale` when you want to resize the clip on the canvas (not the source inside it).

## Animatable Crop Properties

The following properties are animatable through both animation systems:

- `cropLeft`: `cropTop`, `cropRight`, `cropBottom`
- `cropOffsetX`: `cropOffsetY`
- `zoomX`: `zoomY`
- `localPositionX`: `localPositionY` (position of the media inside the crop window)

Read-only animation inputs are also available: `rawWidth`, `rawHeight`, `uncropWidth`, `uncropHeight`, `uncropRawWidth`, `uncropRawHeight`, `width`, `height`. Useful when building expressions that need the original dimensions.

## Ken Burns Effect

Combining `zoom` and `cropOffset` gives the slow-pan-and-zoom motion common in documentary footage:

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 6,
  style: { fillColor: "#6d6ff2", width: 900, height: 500 },
});
clip.style.setPosition(960, 540);

clip.propertyAnimator.addKeyframe("zoomX", 0, 1.0);
clip.propertyAnimator.addKeyframe("zoomX", 6, 1.3);
clip.propertyAnimator.addKeyframe("zoomY", 0, 1.0);
clip.propertyAnimator.addKeyframe("zoomY", 6, 1.3);

clip.propertyAnimator.addKeyframe("cropOffsetX", 0, -60);
clip.propertyAnimator.addKeyframe("cropOffsetX", 6, 60);
```

</LiveRun>

## See Also

- [Property Animator](/getting-started/property-animator.md): animate every crop property.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`ClipStyle.setCrop`](https://docs.rendleysdk.com/api-reference/classes/ClipStyle.html#setcrop), [`ClipStyle.setZoom`](https://docs.rendleysdk.com/api-reference/classes/ClipStyle.html#setzoom), [`ClipStyle.setCropOffset`](https://docs.rendleysdk.com/api-reference/classes/ClipStyle.html#setcropoffset)
