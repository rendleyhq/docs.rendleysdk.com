# Animation

Rendley SDK has two animation systems. Pick based on the job:

| System                                                            | API                        | Use when                                                                                                                                          |
| ----------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Keyframe Animation](/getting-started/property-animator.md)       | `clip.propertyAnimator`    | You want full control: one track per property, bezier handles, hold keyframes, effect and filter parameters, compound properties.                  |
| [Animation Controller](/getting-started/animation-layered.md)     | `clip.animationController` | You want preset entrance, exit, and looping phases with fixed durations that fit the clip (the classic In / Out / Loop model).                     |

Both systems run on the same clip without conflict.

## Quick Example

A minimum fade-in with the keyframe system:

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "text",
  text: "Animate me",
  startTime: 0,
  duration: 4,
  style: { fontSize: 140, color: "#FFFFFF" },
});

clip.style.setPosition(960, 540);

clip.propertyAnimator.addKeyframe("alpha", 0, 0);
clip.propertyAnimator.addKeyframe("alpha", 1, 1);
```

</LiveRun>

That's it, two keyframes on the `alpha` property. See [Keyframe Animation](/getting-started/property-animator.md) for hold keyframes, bezier handles, compound properties, and animating effect or filter parameters.

## What You Can Animate

Every clip registers a default set of animatable properties:

- **Transform**: `positionX`, `positionY`, `position`, `scaleX`, `scaleY`, `scale`, `rotation`, `alpha`
- **Crop and zoom**: `cropLeft`, `cropTop`, `cropRight`, `cropBottom`, `crop`, `cropOffsetX`, `cropOffsetY`, `cropOffset`, `zoomX`, `zoomY`, `zoom`
- **Corner radius**: `cornerRadiusTL`, `cornerRadiusTR`, `cornerRadiusBR`, `cornerRadiusBL`, `cornerRadius`

Text clips add a `text` track. [Custom clips](/getting-started/clips/custom.md) can register their own.

## See Also

- [Keyframe Animation](/getting-started/property-animator.md): full keyframe reference.
- [Animation Controller](/getting-started/animation-layered.md): In / Out / Loop phases driven by `clip.animationController`.
- [Crop and Zoom](/getting-started/crop.md): the non-destructive properties you'll most often keyframe on media clips.
