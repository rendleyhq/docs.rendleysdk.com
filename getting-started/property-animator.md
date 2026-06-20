# Property Animator

The [PropertyAnimator](https://docs.rendleysdk.com/api-reference/classes/Clip.html#propertyanimator) is the keyframe-based animation system introduced in 1.15.0. It lives alongside the [Animation Controller](/getting-started/animation-layered.md). Use it when you want to work with keyframes the way you would in After Effects or Lottie: one track per property, keyframes you can inspect and move, and smooth curves between them.

Every clip exposes its animator as `clip.propertyAnimator`.

## The Basics

A **keyframe** is a `(time, value)` pair. When you add two or more keyframes on the same property, the Property Animator plays back the values by interpolating between them.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "text",
  text: "Slide",
  startTime: 0,
  duration: 4,
  style: { fontSize: 140, color: "#FFFFFF" },
});
clip.style.setPosition(100, 540);

clip.propertyAnimator.addKeyframe("positionX", 0, 100);
clip.propertyAnimator.addKeyframe("positionX", 2, 1600);
```

</LiveRun>

Between time 0 and time 2, the clip slides from x=100 to x=1600. No extra code is needed; the animator evaluates the property on every frame.

Times are local to the clip, so `time: 0` is the start of the clip, not the start of the composition.

## What You Can Animate

Every clip registers a default set of animatable properties. They mirror the clip's [style](/getting-started/styling.md) and [crop](/getting-started/crop.md) controls:

- Transform: `positionX`, `positionY`, `position`, `scaleX`, `scaleY`, `scale`, `rotation`, `alpha`
- Crop: `cropLeft`, `cropTop`, `cropRight`, `cropBottom`, `crop`
- Pan and zoom inside the crop: `cropOffsetX`, `cropOffsetY`, `cropOffset`, `zoomX`, `zoomY`, `zoom`
- Corner radius: `cornerRadiusTL`, `cornerRadiusTR`, `cornerRadiusBR`, `cornerRadiusBL`, `cornerRadius`

Text clips add `text`. Shape clips add their shape color properties. [Custom clips](/getting-started/clips/custom.md) can register their own.

Effect and filter parameters use a special track-key format: `effect:{instanceId}:{property}` and `filter:{instanceId}:{property}`. See [Animating Effects and Filters](#animating-effects-and-filters) below.

## Interpolation and Bezier Handles

The animator needs to know **how** to interpolate from one keyframe to the next. Linear interpolation gives a straight path; ease-in or ease-out curves the path so the motion starts slow or ends slow. The Property Animator exposes this curve through two control points called **bezier handles**.

Think of each segment between two keyframes as a rectangle:

- The left edge is the first keyframe.
- The right edge is the second keyframe.
- The horizontal axis is time, going from `0` (first keyframe) to `1` (second keyframe).
- The vertical axis is the property value, normalized from `0` (the first keyframe's value) to `1` (the second keyframe's value).

A bezier handle is a point inside that rectangle (or outside of it, for overshoot). The handle influences the shape of the curve:

- `handleOut` belongs to the first keyframe and bends the curve as it leaves.
- `handleIn` belongs to the second keyframe and bends the curve as it arrives.

```typescript
clip.propertyAnimator.addKeyframe(
  "positionX",
  0, // time of this keyframe
  100, // value at this keyframe
  { time: 0.33, value: 0 }, // handleIn (only used for the segment before)
  { time: 0.66, value: 1 }, // handleOut (used for the segment after)
);
clip.propertyAnimator.addKeyframe("positionX", 2, 500);
```

Values outside `[0, 1]` are allowed and produce overshoot. For example, `{ time: 0.83, value: 1.23 }` on `handleOut` means the curve reaches above the final value before settling back, a bouncy effect.

If you do not care about curves, omit both handles and the animator uses sensible defaults (an ease curve similar to CSS `ease`).

## Hold Keyframes

A **hold** keyframe is a keyframe that does not interpolate. The value stays flat until the next keyframe hits, then jumps. Use hold for discrete changes like a counter tick, a toggled color, or a typewriter reveal.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "text",
  text: "",
  startTime: 0,
  duration: 3,
  style: { fontSize: 140, color: "#FFFFFF" },
});
clip.style.setPosition(960, 540);

// Typewriter reveal, one hold keyframe per visible state.
const words = ["", "Hold", "Hold on", "Hold on tight"];
words.forEach((text, i) => {
  clip.propertyAnimator.addKeyframe(
    "text",
    i * 0.5,
    text,
    undefined,
    undefined,
    true, // hold = true
  );
});
```

</LiveRun>

Hold is automatically used for text tracks (strings cannot be interpolated), but you can apply it to number tracks too.

## Editing Existing Keyframes

Use [`updateKeyframe`](https://docs.rendleysdk.com/api-reference/classes/Clip.html#propertyanimator) to patch any field of an existing keyframe. You pass the property name, the keyframe's time, and the fields you want to change.

```typescript
// Change the value at time=2
clip.propertyAnimator.updateKeyframe("positionX", 2, { value: 700 });

// Tweak the handles
clip.propertyAnimator.updateKeyframe("positionX", 2, {
  handleIn: { time: 0.3, value: 0 },
  handleOut: { time: 0.7, value: 1 },
});

// Convert to a hold keyframe
clip.propertyAnimator.updateKeyframe("positionX", 2, { hold: true });
```

To move a keyframe in time, use `moveKeyframe`:

```typescript
clip.propertyAnimator.moveKeyframe("positionX", 2, 2.5); // from t=2 to t=2.5
```

## Removing Keyframes

```typescript
clip.propertyAnimator.removeKeyframeAtTime("positionX", 0);
clip.propertyAnimator.removeTrack("positionX"); // clear all keyframes for this property
```

## Inspecting Tracks and Keyframes

```typescript
const track = clip.propertyAnimator.getTrack("positionX");
const keyframes = track?.keyframes ?? [];
const count = keyframes.length;
const has = clip.propertyAnimator.hasTrack("positionX");

const at = clip.propertyAnimator.getKeyframeAtTime("positionX", 2);
const range = clip.propertyAnimator.getKeyframesBetween("positionX", 0, 5);

// Evaluate the interpolated value at any time
const value = clip.propertyAnimator.evaluateProperty("positionX", 1.5);
```

## Compound Properties

Some properties come in related groups. For example, `position` is the pair `(positionX, positionY)`. The animator exposes these as **compound tracks** so you can keyframe the whole group at once:

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 0,
  duration: 4,
  style: { fillColor: "#FF4D6D", width: 240, height: 240 },
});

// Move diagonally with a single track instead of keying X and Y separately.
clip.propertyAnimator.addKeyframe("position", 0, [200, 200]);
clip.propertyAnimator.addKeyframe("position", 1.5, [1700, 880]);
```

</LiveRun>

If you later want to animate the axes independently, split the compound into its components:

```typescript
clip.propertyAnimator.splitTrack("position");

// Now positionX and positionY have their own tracks
clip.propertyAnimator.addKeyframe("positionY", 1.5, 500);
```

Merge the components back into a compound when their timing aligns:

```typescript
if (clip.propertyAnimator.canMergeTrack("position")) {
  clip.propertyAnimator.mergeTrack("position");
}
```

Default compound groups: `position`, `scale`, `crop`, `cropOffset`, `zoom`, `cornerRadius`.

## Initial Values

When you add the first keyframe on a property, the animator remembers the value the property had right before. If you later remove every keyframe on that track, the original value is restored. You can also set it manually:

```typescript
clip.propertyAnimator.setInitialPropertyValue("positionX", 0);
const initial = clip.propertyAnimator.getInitialPropertyValue("positionX");
```

## Animating Effects and Filters

Any [effect](/getting-started/effects.md) or [filter](/getting-started/filters.md) property can be animated by using the `effect:{instanceId}:{property}` or `filter:{instanceId}:{property}` track key. Grab the instance id from the object returned by `addEffect` / `addFilter`:

<LiveRun>

```typescript
const shape = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 4,
  style: { fillColor: "#6d6ff2", width: 600, height: 300 },
});
shape.style.setPosition(960, 540);

const blur = shape.addEffect("builtin-blur", { strength: 0 });
const blurId = blur.getId();

shape.propertyAnimator.addKeyframe(`effect:${blurId}:strength`, 0, 0);
shape.propertyAnimator.addKeyframe(`effect:${blurId}:strength`, 2, 24);
```

</LiveRun>

The same pattern works for filter intensity:

```typescript
const filter = clip.addFilter(libraryFilterId);
const filterId = filter.getId();

clip.propertyAnimator.addKeyframe(`filter:${filterId}:intensity`, 0, 0);
clip.propertyAnimator.addKeyframe(`filter:${filterId}:intensity`, 1, 1);
```

## Registering Custom Properties

[Custom clips](/getting-started/clips/custom.md) can expose their own animatable properties. Override `registerAnimatableProperties` on your clip subclass and call `registerProperty` for each property you want to animate:

```typescript
import { PropertyDescriptionTypeEnum } from "@rendley/sdk";

this.propertyAnimator.registerProperty({
  key: "amplitude",
  type: PropertyDescriptionTypeEnum.NUMBER,
  get: () => this.amplitude,
  set: (value) => (this.amplitude = value),
});
```

Supported value types:

- Number
- RGB / RGBA color
- Vector2 / Vector3 / Vector4
- Text (hold-only interpolation)

## Events

Keyframe changes emit `clip:keyframe:changed` on the Engine event bus. Use it to drive your UI (a keyframe editor, a curve view, a summary badge on the clip).

## See Also

- [Animation](/getting-started/animation.md): the older In/Out/Loop animation system.
- [Custom Clips](/getting-started/clips/custom.md)
- API reference: [`PropertyAnimator`](https://docs.rendleysdk.com/api-reference/classes/Clip.html#propertyanimator), [`PropertyKeyframe`](https://docs.rendleysdk.com/api-reference/interfaces/PropertyKeyframe.html)
