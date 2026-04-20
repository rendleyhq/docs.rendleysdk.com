# Styling

Every clip exposes its visual state through the `style` property, an instance of [ClipStyle](https://docs.rendleysdk.com/api-reference/classes/ClipStyle.html). For text and shape clips, the style also includes type-specific fields (font, fill color, stroke). This page covers the shared controls. See [TextStyle](https://docs.rendleysdk.com/api-reference/classes/TextStyle.html) and [ShapeStyle](https://docs.rendleysdk.com/api-reference/classes/ShapeStyle.html) for type-specific extras.

You can apply style on creation or update it later on an existing clip.

## Position

`setPosition(x, y)` moves a clip on the canvas. Coordinates are in pixels, with the origin at the top-left of the display (the default 1920×1080 canvas centers at `(960, 540)`).

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 300, height: 300 },
});

clip.style.setPosition(960, 540); // center of a 1920x1080 canvas
```

</LiveRun>

## Scale

`setScale(scaleX, scaleY)` multiplies the clip's size. `1` is natural size; `2` doubles it. X and Y scale independently, so you can stretch a clip asymmetrically.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#FF4D6D", width: 200, height: 200 },
});
clip.style.setPosition(960, 540);

clip.style.setScale(2, 1); // stretch horizontally
```

</LiveRun>

## Rotation

`setRotation(radians)` rotates the clip around its center. Positive values rotate clockwise.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "text",
  text: "Tilted",
  startTime: 0,
  duration: 5,
  style: { fontSize: 160, color: "#FFFFFF" },
});
clip.style.setPosition(960, 540);

clip.style.setRotation(Math.PI / 8); // 22.5 degrees
```

</LiveRun>

## Alpha (Opacity)

`setAlpha(value)` sets the opacity. `1` is fully opaque, `0` is invisible.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 600, height: 300 },
});
clip.style.setPosition(960, 540);

clip.style.setAlpha(0.4);
```

</LiveRun>

## Corner Radius

`setCornerRadius([tl, tr, br, bl])` rounds the corners of a clip (media clips and shapes). The tuple order goes clockwise from the top-left corner.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 600, height: 300 },
});
clip.style.setPosition(960, 540);

clip.style.setCornerRadius([60, 60, 60, 60]);
```

</LiveRun>

Pass a single number to round all four corners equally:

```typescript
clip.style.setCornerRadius(60);
```

## Relative Corner Radius

By default, the corner radius is in pixels. Pass `true` as the second argument to interpret the values as a fraction of the clip's smaller dimension:

```typescript
clip.style.setCornerRadius([0.5, 0.5, 0.5, 0.5], true); // fully circular
```

## Size

On media clips, `width` and `height` are defined by the source. For text and shapes, you can set them via style fields at creation or with `setSize` afterwards:

```typescript
clip.style.setSize(400, 200);
const [w, h] = clip.style.getSize();
```

## Setting Style at Creation

Every controller has a corresponding option on `addClip` so you can configure a clip in one call:

```typescript
const clip = await layer.addClip({
  type: "text",
  text: "Hello",
  startTime: 0,
  duration: 3,
  style: {
    fontSize: 120,
    color: "#FF4D6D",
    position: [960, 540],
    rotation: 0.1,
    alpha: 0.9,
  },
});
```

## Animating Style

Every property documented above is animatable through the [Property Animator](/getting-started/property-animator.md). The track keys match the method names without `set`: `positionX`, `positionY`, `scaleX`, `scaleY`, `rotation`, `alpha`, `cornerRadius`.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 0,
  duration: 3,
  style: { fillColor: "#FF4D6D", width: 200, height: 200 },
});
clip.style.setPosition(960, 540);

clip.propertyAnimator.addKeyframe("rotation", 0, 0);
clip.propertyAnimator.addKeyframe("rotation", 3, Math.PI * 2);
```

</LiveRun>

## See Also

- [Clip API Reference](/getting-started/clips.md#common-api)
- [Property Animator](/getting-started/property-animator.md): animate any style property.
- [Text](/getting-started/clips/text.md): `TextStyle` extras (font, stroke, drop shadow, letter spacing).
- [Shape](/getting-started/clips/shape.md): `ShapeStyle` extras (fill and stroke colors).
- API reference: [`ClipStyle`](https://docs.rendleysdk.com/api-reference/classes/ClipStyle.html)
