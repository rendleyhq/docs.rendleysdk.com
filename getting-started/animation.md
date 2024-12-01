# Animation

The SDK supports keframe animations that enables you to animate any of the elements of the composition.

Clips support three distinct animation types that can seamlessly work together:

- `In`: The animation that plays when the clip starts.
- `Out`: The animation that plays when the clip reaches its end.
- `Loop`: The animation that plays between the In and Out animations, cycling based on the loop count.

## Key Concepts

### The animation object

An animation is structured as AnimationData, which includes details like speed, offsets, and property-specific animations.

- `name`: Identifier used for display/debugging
- `speed`: Playback speed, 2 = faster, 0.5 = slower
- `offset`: Offset in seconds for the animation keyframes
- `amplification`: Amplifies the effect for relative properties
- `inOutOfRange`: Handle values out of range: original or first keyframe?
- `outOutOfRange`: Handle values out of range: original or last keyframe
- `propertyAnimations`: List of individual property animations

### Property Animations

Each property of a clip can have its own animation, defined by the PropertyAnimation interface. This interface includes a list of keyframes that specify the animation's timing and behavior:

- `property`: Identifier for a specific property (e.g., PositionX, ScaleX, etc.)
- `inOutOfRange`: Handle values out of range: original or first keyframe?
- `outOutOfRange`: Handle values out of range: original or last keyframe
- `keyframes`: List of keyframes, with easing determined by the previous keyframe

### Keyframes

Keyframes are the building blocks of animations, defining specific values at certain times within the animation timeline. They can handle both numeric and string values and are applied in various visual spaces such as absolute or relative:

- `time`: Time in seconds, offset by AnimationData.offset if set
- `value`: Value at that time; numeric values are interpolated, strings are set as-is (e.g., text properties)
- `easing`: Easing preset for the time segment defined by this and the next keyframe
- `space`: Space to use for the keyframe
- `relativeProperty`: Base value property for relative animations

  ::: tip

  You can specify a base property using the `relativeProperty` field, which defaults to the same property if not set.
  :::

  ::: tip

  Keyframe values apply to the same base value and do not stack up.
  :::

## Animation Controls

### Set Animation

Apply new animations to a clip. The type can be `"in"`, `"out"`, or `"loop"` and the animation data is defined by the AnimationData interface.

```typescript
clip.animationController.setAnimation(type, animationData);
```

### Load Animation

Load animations from JSON.

```typescript
clip.animationController.loadAnimation(type, JSON.stringify(animationData));
```

### Set Duration

Adjust animation duration.

```typescript
clip.animationController.setAnimationDuration(type, durationInSeconds);
```

### Remove Animation

Remove existing animations.

```typescript
clip.animationController.removeAnimation(type);
```

### Set Loop Count

Define how many times the Loop animation should repeat.

```typescript
clip.animationController.setLoopCount(loopCount);
```

## Prioritization

The controller prioritizes the In, Out, and Loop points in that order. If all three cannot fit within the clip’s timeline, the In animation is prioritized first, followed by Out, and then Loop.

- `Loop Time`: Automatically determined based on the durations of the In and Out animations and is stretched to cover the entire clip timeline (from StartBounds to EndBounds).

- `Loop Count`: Set the number of times the Loop animation should repeat between the In and Out animations using the `setLoopCount` method.

## Example Animation

```typescript
import {
  AnimationData,
  AnimationSpaceEnum,
  EasingEnum,
  OutOfRangeEnum,
} from "@rendley/sdk";

const animationData: AnimationData = {
  name: "Sample",
  outOutOfRange: OutOfRangeEnum.LOOP,
  propertyAnimations: [
    {
      property: "positionX",
      inOutOfRange: OutOfRangeEnum.EXTEND,
      outOutOfRange: OutOfRangeEnum.EXTEND,
      keyframes: [
        {
          time: 0,
          value: -3000,
          easing: EasingEnum.ElasticOut,
          space: AnimationSpaceEnum.RELATIVE_ADDITIVE,
        },
        { time: 0.75, value: 0, space: AnimationSpaceEnum.RELATIVE_ADDITIVE },
      ],
    },
    {
      property: "scaleX",
      inOutOfRange: OutOfRangeEnum.EXTEND,
      outOutOfRange: OutOfRangeEnum.EXTEND,
      keyframes: [
        {
          time: 0,
          value: 0.5,
          easing: EasingEnum.LinearIn,
          space: AnimationSpaceEnum.ABSOLUTE,
        },
        {
          time: 1,
          value: 0.5,
          easing: EasingEnum.ElasticInOut,
          space: AnimationSpaceEnum.ABSOLUTE,
        },
        { time: 2, value: 2, space: AnimationSpaceEnum.ABSOLUTE },
      ],
    },
    {
      property: "scaleY",
      inOutOfRange: OutOfRangeEnum.EXTEND,
      outOutOfRange: OutOfRangeEnum.EXTEND,
      keyframes: [
        {
          time: 0,
          value: 0.5,
          easing: EasingEnum.LinearIn,
          space: AnimationSpaceEnum.ABSOLUTE,
        },
        {
          time: 1,
          value: 0.5,
          easing: EasingEnum.ElasticInOut,
          space: AnimationSpaceEnum.ABSOLUTE,
        },
        { time: 2, value: 2, space: AnimationSpaceEnum.ABSOLUTE },
      ],
    },
  ],
};
```
