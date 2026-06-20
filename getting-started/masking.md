# Masking

Masks use one clip as an alpha mask for another. Only the pixels where the mask is opaque are rendered on the target. Common use cases: shape masks (circle/star/polygon), text-shaped masks (video inside text), animated reveal transitions.

::: info
Masking is supported on [video](/getting-started/clips/video.md), [image](/getting-started/clips/image.md), [gif](/getting-started/clips/gif.md), [HTML text](/getting-started/clips/html-text.md), and [Lottie](/getting-started/clips/lottie.md) clips.
:::

## Add a Mask

Add a mask clip to its own layer, then reference it as a mask for another clip.

<LiveRun>

```typescript
const target = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 1200, height: 700 },
});
target.style.setPosition(960, 540);

// The mask goes on its own layer so it can live independently.
const maskLayer = Engine.getInstance().getTimeline().createLayer();
maskLayer.setVisibility(false); // hide the raw mask from the preview

const mask = await maskLayer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#FFFFFF", width: 500, height: 500 },
});
mask.style.setPosition(960, 540);

target.addClipMask(mask);
```

</LiveRun>

The target clip is rendered only where the mask has non-zero alpha. The mask itself is hidden from the preview because we marked its layer invisible.

## Remove a Mask

[`removeClipMask`](https://docs.rendleysdk.com/api-reference/classes/Clip.html#removeclipmask) takes the mask's `Clip` instance, not an id:

```typescript
target.removeClipMask(mask);
```

Call `target.getMasks()` to get the list of masks currently applied.

## Animating the Mask

Because the mask is a regular clip, it can be animated with the [Property Animator](/getting-started/property-animator.md). Animate the mask's `scaleX` and `scaleY` to create a reveal:

<LiveRun>

```typescript
const target = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 4,
  style: { fillColor: "#FF4D6D", width: 1200, height: 700 },
});
target.style.setPosition(960, 540);

const maskLayer = Engine.getInstance().getTimeline().createLayer();
maskLayer.setVisibility(false);

const mask = await maskLayer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 0,
  duration: 4,
  style: { fillColor: "#FFFFFF", width: 800, height: 800 },
});
mask.style.setPosition(960, 540);

// Grow the mask from nothing to full size in one second.
mask.propertyAnimator.addKeyframe("scaleX", 0, 0);
mask.propertyAnimator.addKeyframe("scaleX", 1, 1);
mask.propertyAnimator.addKeyframe("scaleY", 0, 0);
mask.propertyAnimator.addKeyframe("scaleY", 1, 1);

target.addClipMask(mask);
```

</LiveRun>

## Text-Shaped Mask

Any clip can serve as a mask, including a text clip. This creates a "window" through the target that takes the shape of the text glyphs, a common effect for title reveals and branding moments.

<LiveRun>

```typescript
// Target: a bright gradient-like rectangle that will only show through text.
const target = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#FF4D6D", width: 1600, height: 900 },
});
target.style.setPosition(960, 540);

// Mask: big bold text on its own hidden layer.
const maskLayer = Engine.getInstance().getTimeline().createLayer();
maskLayer.setVisibility(false);

const mask = await maskLayer.addClip({
  type: "text",
  text: "HELLO",
  startTime: 0,
  duration: 5,
  style: {
    fontSize: 400,
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
mask.style.setPosition(960, 540);

target.addClipMask(mask);
```

</LiveRun>

Only the pixels where the text has non-zero alpha show the pink fill, everywhere else is transparent. Swap the target for an image, GIF, or video clip and you get the classic video-in-text effect.

## Wrap Mode

Masks expose wrap modes that control what happens outside the mask bounds:

- `clamp` (default): hide everything outside the mask.
- `repeat`: tile the mask.
- `mirror`: tile and mirror.

Set the wrap mode on the [MaskFilter](https://docs.rendleysdk.com/api-reference/classes/MaskFilter.html) returned from `getMasks()`.

## Hiding the Source Mask Clip

You usually want the mask clip itself invisible, since it renders on its own layer too. Use `setVisible(false)` on the clip, or `setVisibility(false)` on its layer. Hidden clips and layers still participate in masking and do not affect the final export.

## See Also

- [Shape](/getting-started/clips/shape.md): shapes are the most common mask source.
- [Property Animator](/getting-started/property-animator.md)
- API reference: [`Clip.addClipMask`](https://docs.rendleysdk.com/api-reference/classes/Clip.html#addclipmask), [`MaskFilter`](https://docs.rendleysdk.com/api-reference/classes/MaskFilter.html)
