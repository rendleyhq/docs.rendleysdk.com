# Shape Clip

The [ShapeClip](https://docs.rendleysdk.com/api-reference/classes/ShapeClip.html) draws vector shapes directly on the canvas. Prefer it over image assets for anything geometric, rectangles, circles, triangles, stars, and polygons. Shapes render crisply at any resolution.

## Create a Shape Clip

<LiveRun>

```typescript
const shape = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: {
    fillColor: "#6d6ff2",
    strokeColor: "#FFFFFF",
    strokeWidth: 4,
    width: 600,
    height: 300,
  },
});

shape.style.setPosition(960, 540);
shape.style.setCornerRadius([40, 40, 40, 40]);
```

</LiveRun>

## Supported Shapes

::: details List of Supported Shapes {open}
| Shape | Support |
| ----- | :-----: |
| Rectangle | ✅ |
| Rounded Rectangle | ✅ |
| Circle | ✅ |
| Ellipse | ✅ |
| Triangle | ✅ |
| Star | ✅ |
| Polygon | ✅ |
| Bezier | ✅ |
:::

## Shape-Specific Style

Each shape accepts a shared set of style fields plus a few shape-specific ones.

- **Star**: `nrPoints`, `innerRadius`, `outerRadius`.
- **Rounded Rectangle**: `rectRadius`.
- **Polygon** and **Bezier**: pass a list of points. Use `null` to separate multiple shapes drawn in the same clip.

Colors, stroke, stroke alignment, and corner radius live on [ShapeStyle](https://docs.rendleysdk.com/api-reference/classes/ShapeStyle.html).

## See Also

- [Styling](/getting-started/styling.md)
- [Masking](/getting-started/masking.md): use a Shape clip as an alpha mask for another clip.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`ShapeClip`](https://docs.rendleysdk.com/api-reference/classes/ShapeClip.html), [`ShapeStyle`](https://docs.rendleysdk.com/api-reference/classes/ShapeStyle.html)
