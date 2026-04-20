# Text Clip

The [TextClip](https://docs.rendleysdk.com/api-reference/classes/TextClip.html) renders text directly on the canvas. It supports font selection, color, stroke, drop shadow, letter spacing, line height, and more.

## Create a Text Clip

<LiveRun>

```typescript
const textClip = await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 5,
  style: {
    fontSize: 120,
    color: "#FFFFFF",
  },
});

textClip.style.setPosition(960, 540);
```

</LiveRun>

## Change the Text

```typescript
textClip.setText("New Text");
const current = textClip.getText();
```

## Background Color

The text clip supports a solid background that sits behind the text:

```typescript
textClip.style.setBackgroundColor("#0000FF");
```

## Typography

The [TextStyle](https://docs.rendleysdk.com/api-reference/classes/TextStyle.html) exposes additional controls for typography:

```typescript
textClip.style.setFontFamily("Inter");
textClip.style.setFontWeight("700");
textClip.style.setLetterSpacing(2);
textClip.style.setLineHeight(1.5);
textClip.style.setStrokeColor("#000000");
textClip.style.setStrokeThickness(2);
textClip.style.setPadding(10);
```

Custom fonts must be loaded through the [FontRegistry](/getting-started/fonts.md) before you can use them here.

## Resizing Text

Text clips have two independent ways to change size:

- **`style.setFontSize(px)`**: changes the glyph size. Re-rasterizes the text, so edges stay crisp.
- **`style.setScale(scaleX, scaleY)`**: scales the rendered clip uniformly. Cheaper if you want to animate size (scale can be keyframed without re-rasterizing on every frame).

Use `setFontSize` for static sizing and final layout. Use `setScale` when you're animating or responding to the canvas size at runtime.

<LiveRun>

```typescript
const textClip = await layer.addClip({
  type: "text",
  text: "Resize me",
  startTime: 0,
  duration: 5,
  style: { fontSize: 60, color: "#FFFFFF" },
});
textClip.style.setPosition(960, 540);

// Grow the font size and then scale further. Both stack.
textClip.style.setFontSize(200);
textClip.style.setScale(1.2, 1.2);
```

</LiveRun>

To animate the size over time, keyframe `scaleX` and `scaleY` through the [Property Animator](/getting-started/property-animator.md), don't animate `fontSize` per frame; it's not an animatable property and would re-rasterize constantly.

## Drop Shadow

<LiveRun>

```typescript
const textClip = await layer.addClip({
  type: "text",
  text: "Drop Shadow",
  startTime: 0,
  duration: 5,
  style: { fontSize: 160, color: "#FFFFFF" },
});
textClip.style.setPosition(960, 540);

textClip.style.setDropShadowColor("#000000");
textClip.style.setDropShadowAlpha(0.6);
textClip.style.setDropShadowBlur(8);
textClip.style.setDropShadowDistance(10);
textClip.style.setDropShadowAngle(Math.PI / 4);
```

</LiveRun>

## See Also

- [Styling](/getting-started/styling.md)
- [Fonts](/getting-started/fonts.md)
- [HTML Text](/getting-started/clips/html-text.md): for richer in-line markup.
- API reference: [`TextClip`](https://docs.rendleysdk.com/api-reference/classes/TextClip.html), [`TextStyle`](https://docs.rendleysdk.com/api-reference/classes/TextStyle.html)
