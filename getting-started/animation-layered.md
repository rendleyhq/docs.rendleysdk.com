# Animation Controller

Every clip exposes an [AnimationController](https://docs.rendleysdk.com/api-reference/classes/AnimationController.html) through `clip.animationController`. It groups keyframes into three time zones on the clip: an **In** animation that plays at the start, an **Out** animation that plays at the end, and a **Loop** animation that cycles between them.

The Animation Controller runs side by side with the [Keyframe Animation](/getting-started/property-animator.md) system. Use the controller when you want entrance, exit, and looping phases with fixed durations that fit the clip; use the keyframe animator when you want full control over keyframes, bezier handles, and effect or filter parameters.

## Animation Data

Each In/Out/Loop zone is defined by an [`AnimationData`](https://docs.rendleysdk.com/api-reference/interfaces/AnimationData.html) object:

- **name**: Identifier used for display and debugging.
- **speed**: Playback speed multiplier (`2` for faster, `0.5` for slower).
- **offset**: Shift in seconds applied to the animation's internal timeline.
- **amplification**: Multiplier for relative keyframe values.
- **inOutOfRange** / **outOutOfRange**: What the SDK does when the current time is before the first keyframe or after the last. See [OutOfRangeEnum](https://docs.rendleysdk.com/api-reference/enums/OutOfRangeEnum.html).
- **propertyAnimations**: Array of per-property keyframe lists.

## Keyframes

A [`Keyframe`](https://docs.rendleysdk.com/api-reference/interfaces/Keyframe.html) is a `(time, value)` pair plus optional easing and a keyframe space:

- **time**: Time in seconds (shifted by `AnimationData.offset`).
- **value**: Either a number (interpolated) or a string (set as-is, for text properties).
- **easing**: One of [`EasingEnum`](https://docs.rendleysdk.com/api-reference/enums/EasingEnum.html), applied on the segment between this keyframe and the next.
- **space**: How the keyframe's value is interpreted. See [Spaces](#spaces) below.
- **relativeProperty**: Optional base property name for relative modes. Defaults to the same property.

## Spaces

[`AnimationSpaceEnum`](https://docs.rendleysdk.com/api-reference/enums/AnimationSpaceEnum.html) controls how the keyframe's value combines with the clip's current property value:

| Space | Formula | Use Case |
| ----- | ------- | -------- |
| `ABSOLUTE` | `value` | Snap to an exact value. |
| `RELATIVE_ADDITIVE` | `currentValue + value` | Offset from wherever the clip currently sits. Great for slide-in from off-screen. |
| `RELATIVE_MULTIPLICATIVE` | `currentValue * value` | Scale proportional to current. `0` is invisible, `1` is natural size. |
| `PERCENTAGE` | `currentValue * value / 100` | Same as multiplicative but in percent. |
| `ADDITIVE_MULTIPLICATIVE_TO_RELATIVE` | `propValue + relativeValue * value` | Advanced: combine the animated property with another. Useful for crop-offset compensation. |

## Basic Example

```typescript
import {
  AnimationTypeEnum,
  AnimationSpaceEnum,
  EasingEnum,
} from "@rendley/sdk";

clip.animationController.setAnimation(AnimationTypeEnum.IN, {
  name: "Slide + Fade",
  propertyAnimations: [
    {
      property: "positionX",
      keyframes: [
        {
          time: 0,
          value: -1920,
          easing: EasingEnum.CubicOut,
          space: AnimationSpaceEnum.RELATIVE_ADDITIVE,
        },
        {
          time: 1,
          value: 0,
          space: AnimationSpaceEnum.RELATIVE_ADDITIVE,
        },
      ],
    },
    {
      property: "alpha",
      keyframes: [
        {
          time: 0,
          value: 0,
          easing: EasingEnum.QuadraticOut,
          space: AnimationSpaceEnum.ABSOLUTE,
        },
        { time: 1, value: 1, space: AnimationSpaceEnum.ABSOLUTE },
      ],
    },
  ],
});

clip.animationController.setAnimationDuration(AnimationTypeEnum.IN, 0.8);
```

## Controls

```typescript
// Apply a new animation
clip.animationController.setAnimation(type, animationData);

// Load from JSON over the network
await clip.animationController.loadAnimation(type, url);

// Override the computed duration
clip.animationController.setAnimationDuration(type, seconds);

// Remove a specific zone
clip.animationController.removeAnimation(type);

// Loop-specific: how many times the Loop animation cycles
clip.animationController.setLoopCount(count);
```

Where `type` is `AnimationTypeEnum.IN`, `AnimationTypeEnum.OUT`, or `AnimationTypeEnum.LOOP`.

## Prioritization

If all three zones (In, Out, Loop) cannot fit within the clip's visible duration, the controller prioritizes In first, then Out, then Loop. The Loop zone's time range is computed automatically to fill whatever is left between In and Out.

## See Also

- [Animation Overview](/getting-started/animation.md)
- [Keyframe Animation](/getting-started/property-animator.md)
- API reference: [`AnimationController`](https://docs.rendleysdk.com/api-reference/classes/AnimationController.html), [`AnimationData`](https://docs.rendleysdk.com/api-reference/interfaces/AnimationData.html), [`OutOfRangeEnum`](https://docs.rendleysdk.com/api-reference/enums/OutOfRangeEnum.html)
