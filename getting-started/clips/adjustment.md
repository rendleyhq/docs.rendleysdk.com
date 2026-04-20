# Adjustment Clip

An **Adjustment** clip does not render visual content itself. Instead, the effects and filters attached to it are applied to everything rendered below it on the same frame. Think of it as a Photoshop adjustment layer, scoped by timeline position.

Use an adjustment clip when you want a color grade, blur, or any other shader pass to affect multiple underlying clips at once, without duplicating the effect on every single clip.

## Create an Adjustment Clip

<LiveRun>

```typescript
// Something to blur underneath the adjustment.
const target = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 6,
  style: { fillColor: "#6d6ff2", width: 900, height: 500 },
});
target.style.setPosition(960, 540);

// Adjustment clips live on their own layer above the content they affect.
const adjustmentLayer = Engine.getInstance().getTimeline().createLayer();

const adjustment = await adjustmentLayer.addClip({
  type: ClipTypeEnum.ADJUSTMENT,
  startTime: 0,
  duration: 6,
});

adjustment.addEffect("builtin-blur", { strength: 16 });
```

</LiveRun>

Anything added to the adjustment (effects, filters) applies to everything rendered below it during the adjustment clip's time range.

## Layer Order Matters

The SDK renders layers bottom-to-top. For the adjustment to affect a given clip, the adjustment clip must sit on a layer **above** it:

```typescript
const timeline = Engine.getInstance().getTimeline();
const backgroundLayer = timeline.createLayer(); // bottom
const adjustmentLayer = timeline.createLayer(); // middle, adjustment lives here
const foregroundLayer = timeline.createLayer(); // top, stays sharp
```

Clips on `foregroundLayer` are unaffected by the adjustment because they render after the adjustment has been applied to everything below it.

## Transforms

Adjustment clips support position, scale, and rotation. These change the area of influence rather than drawing anything visible, handy for limiting a local blur or grade to a region of the frame.

## See Also

- [Effects](/getting-started/effects.md): attach built-in or custom effects to the adjustment clip.
- [Filters](/getting-started/filters.md): LUT-based color grades.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`ClipTypeEnum`](https://docs.rendleysdk.com/api-reference/enums/ClipTypeEnum.html)
