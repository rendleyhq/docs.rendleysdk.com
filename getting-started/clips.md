# Clips

A [clip](https://docs.rendleysdk.com/api-reference/classes/Clip.html) is the smallest unit of a composition. Every clip lives on a [layer](/getting-started/layer.md) on the [timeline](/getting-started/timeline.md). Clips expose a common API for timing, visibility, effects, filters, animation, and masking, on top of that, each clip type (text, video, shape, lottie, and so on) adds its own specific methods.

This page covers:

- [How to add a clip to a layer](#adding-a-clip)
- [What each clip type does and where to find the full reference](#clip-types)
- [The shared API every clip exposes](#common-api)

## Adding a Clip

Call [`layer.addClip()`](https://docs.rendleysdk.com/api-reference/classes/Layer.html) with the clip's options. The return value is the created clip.

<LiveRun>

```typescript
await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 3,
  style: { fontSize: 140, color: "#FFFFFF", position: [960, 540] },
});
```

</LiveRun>

Media-based clips (video, audio, image, GIF, SVG) need a `mediaDataId` pointing to an entry in the [Library](/getting-started/library.md):

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/photo.jpg");

await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
```

> [!NOTE]
> Two clips cannot overlap on the same layer. If you want a clip to sit on top of another, create a new layer and add it there.

### Adjust Layout on Add

By default, adding a clip that overlaps existing clips on the same layer pushes the others to make room. Disable this behavior when you want the call to fail silently rather than reflow:

```typescript
await layer.addClip({ mediaDataId, startTime: 0 }, { adjustLayout: false });
```

## Clip Types

Each clip type has its own page covering its constructor options and type-specific API.

### Media

| Clip                                     | What it renders                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| [Video](/getting-started/clips/video.md) | A video file with trim, freeze frame, playback speed, and audio extraction. |
| [Audio](/getting-started/clips/audio.md) | An audio file with trim, volume, fade in / fade out, and playback speed.    |
| [Image](/getting-started/clips/image.md) | A static image (JPEG, PNG, WebP, HEIC).                                     |
| [Gif](/getting-started/clips/gif.md)     | An animated GIF.                                                            |
| [Svg](/getting-started/clips/svg.md)     | A vector graphic that stays crisp at any resolution.                        |

### Generative

| Clip                                             | What it renders                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| [Text](/getting-started/clips/text.md)           | Text drawn on the canvas with font, color, stroke, and drop shadow controls. |
| [HTML Text](/getting-started/clips/html-text.md) | An HTML snippet rendered as a visual element.                                |
| [Shape](/getting-started/clips/shape.md)         | Rectangles, circles, triangles, stars, polygons, beziers.                    |
| [Lottie](/getting-started/clips/lottie.md)       | An After Effects composition (Lottie JSON).                                  |

### Special

| Clip                                                 | What it does                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Subtitles](/getting-started/clips/subtitles.md)     | Time-synced captions sourced from the Library.                                                                      |
| [Adjustment](/getting-started/clips/adjustment.md)   | Applies effects and filters to everything below it on the frame.                                                    |
| [Placeholder](/getting-started/clips/placeholder.md) | Holds a timeline slot until its media finishes loading.                                                             |
| [Custom](/getting-started/clips/custom.md)           | Your own clip type, extending the base [`Clip`](https://docs.rendleysdk.com/api-reference/classes/Clip.html) class. |

## Common API

Every clip type inherits the following controls. Use this section as a reference when you're unsure which page to look at.

### Timing and Trimming

```typescript
clip.setStartTime(2);
clip.setLeftTrim(0.5);
clip.setRightTrim(0.5);
clip.moveBy(1);

clip.getStartTime();
clip.getEndTime();
clip.getDuration();
clip.getTrimmedDuration();
```

### Visibility and Audio

```typescript
clip.setVisible(false);
clip.setMuted(true);
clip.setVolume(0.5);
```

For smooth fade-in / fade-out on audio, see [Playback Speed & Fades](/getting-started/playback-speed.md).

### Blend Mode

Controls how the clip blends with content on layers below it:

```typescript
import { BlendModeEnum } from "@rendley/sdk";

clip.setBlendMode(BlendModeEnum.SCREEN); // NORMAL | ADD | SCREEN | MULTIPLY
```

### Wrap Mode

Controls what happens outside the clip's duration for looping clips (Lottie, GIF, custom):

```typescript
import { WrapModeEnum } from "@rendley/sdk";

clip.setWrapMode(WrapModeEnum.PING_PONG); // CLAMP | REPEAT | PING_PONG | EMPTY
```

### Effects, Filters, and Masking

All clips can receive effects and filters, and any clip can be used as an alpha mask for another.

- [Effects](/getting-started/effects.md)
- [Filters](/getting-started/filters.md)
- [Masking](/getting-started/masking.md)

### Animation

Every clip exposes two animation systems. Use whichever fits the task:

- [Keyframe Animation](/getting-started/property-animator.md) (recommended) via `clip.propertyAnimator`.
- [Animation Controller](/getting-started/animation-layered.md) via `clip.animationController`.

### Custom Data

Attach metadata that survives serialization:

```typescript
clip.setCustomData("source", "https://example.com/source");
const src = clip.getCustomData("source");
clip.hasCustomData("source");
clip.clearAllCustomData();
```

The same API is available on [Engine](https://docs.rendleysdk.com/api-reference/classes/Engine.html), [Library](https://docs.rendleysdk.com/api-reference/classes/Library.html), [Timeline](https://docs.rendleysdk.com/api-reference/classes/Timeline.html), [Layer](https://docs.rendleysdk.com/api-reference/classes/Layer.html), and [MediaData](https://docs.rendleysdk.com/api-reference/classes/MediaData.html).

## See Also

- [Layer](/getting-started/layer.md): where clips live.
- [Timeline](/getting-started/timeline.md): the playback surface.
- [Styling](/getting-started/styling.md): position, scale, rotation, color, corner radius.
- [Crop and Zoom](/getting-started/crop.md): non-destructive cropping for media clips.
- [Custom Clips](/getting-started/clips/custom.md): author your own clip type.
