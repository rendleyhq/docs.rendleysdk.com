# Playback Speed and Audio Fade

Video, audio, GIF, and Lottie clips can be slowed down or sped up. Video and audio clips additionally support pitch preservation and volume fades.

## Playback Speed

```typescript
videoClip.setPlaybackSpeed(2); // twice as fast
audioClip.setPlaybackSpeed(0.5); // half speed
lottieClip.setPlaybackSpeed(3);
gifClip.setPlaybackSpeed(1.5);
```

`setPlaybackSpeed` is available on [VideoClip](/getting-started/clips/video.md), [AudioClip](/getting-started/clips/audio.md), [GifClip](/getting-started/clips/gif.md), and [LottieClip](/getting-started/clips/lottie.md), the clip types with their own playback timeline.

The supported speed range is `[0.25, 4]`. On Safari it is limited to `[0.25, 2]` because of a platform bug that affects higher speeds.

::: warning
Calling `setPlaybackSpeed` mutates both `duration` and `startTime` of the clip. After confirming the new speed, call [`Timeline::adjustClipsLayout`](/getting-started/timeline.md#adjust-layout) so the layer repositions conflicting clips.
:::

### Preserve Bounds

The second and third arguments control what stays constant:

```typescript
videoClip.setPlaybackSpeed(2, true, false);
// true: preserve the left bound (startTime + leftTrim stays the same)
// false: do not preserve trimmed duration (the visible range will change)
```

This is useful when a user scrubs the playback speed inside the UI: you typically want the left edge of the clip to stay anchored.

## Preserve Pitch

By default, audio is pitch-shifted along with the speed change. To keep the original pitch (useful for voiceovers):

```typescript
videoClip.setPreservePitch(true);
audioClip.setPreservePitch(true);
```

## Volume Fade

Video and audio clips expose fade in and fade out controls that work independently of any animation or keyframe:

```typescript
import { FadeCurveEnum } from "@rendley/sdk";

videoClip.setVolumeFadeInDuration(1);
videoClip.setVolumeFadeInCurve(FadeCurveEnum.LINEAR);

videoClip.setVolumeFadeOutDuration(2);
videoClip.setVolumeFadeOutCurve(FadeCurveEnum.EXPONENTIAL);
```

Supported curves include linear, quarter sine, half sine, exponential, logarithmic, quadratic, cubic, and more. See [FadeCurveEnum](https://docs.rendleysdk.com/api-reference/enums/FadeCurveEnum.html) for the full list.

## Freezing a Video Frame

Video clips can be frozen on a specific frame for the rest of the clip duration with [`setFreezeTime`](https://docs.rendleysdk.com/api-reference/classes/VideoClip.html#setfreezetime):

```typescript
videoClip.setFreezeTime(2); // freeze on second 2
videoClip.setFreezeTime(); // unfreeze
```

Freeze is useful for keeping a poster frame after the media ends, or for extending a clip without duplicating it.
