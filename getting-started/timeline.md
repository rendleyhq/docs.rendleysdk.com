# Timeline

The [Timeline](https://docs.rendleysdk.com/api-reference/classes/Timeline.html) drives the composition. It owns all layers and clips, controls playback, and tracks the current frame. You access it through `Engine.getInstance().getTimeline()`.

## Playback

```typescript
const timeline = Engine.getInstance().getTimeline();

await timeline.play();
timeline.pause();
timeline.stop(); // pauses and moves to time 0
timeline.seek(5.5); // jump to second 5.5
```

The `Engine` also exposes shortcuts for the same methods: `Engine.getInstance().play()`, `pause()`, `stop()`, and `seek(time)`.

<LiveRun>

```typescript
// Put two shapes on the timeline and start playback from second 1.
const first = await layer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 0,
  duration: 3,
  style: { fillColor: "#6d6ff2", width: 400, height: 400 },
});
first.style.setPosition(960, 540);

const second = await layer.addClip({
  type: "shape",
  shape: "circle",
  startTime: 3,
  duration: 3,
  style: { fillColor: "#FF4D6D", width: 400, height: 400 },
});
second.style.setPosition(960, 540);

const timeline = Engine.getInstance().getTimeline();
timeline.seek(1);
await timeline.play();
```

</LiveRun>

::: info
`seek` aligns the requested time to the closest frame boundary based on the configured FPS. Use [`alignTime`](#frame-alignment) if you need manual control over the rounding direction.
:::

## Frames Per Second

```typescript
timeline.setFps(30);
timeline.getFps();
timeline.getFrameDuration(); // returns 1 / fps
```

The default is 30. Changing the FPS reflows the internal time tracking to the new cadence.

## Frame Alignment

The SDK works in seconds on the public API but internally snaps to frames to avoid floating-point drift between preview and render.

```typescript
import { AlignRoundEnum } from "@rendley/sdk";

const aligned = timeline.alignTime(2.31, AlignRoundEnum.NEAREST); // CEIL | FLOOR | NEAREST
const frameNumber = timeline.getFrameNumberFromTime(2.31);
const frameNumbers = timeline.getFrameNumberFromTimeValues([1.5, 2.5, 3.5]);
```

Use `getFrameNumberFromTimeValues` when you have many time values to convert. It is faster than calling `getFrameNumberFromTime` in a loop.

## Creating and Removing Layers

```typescript
const layer = timeline.createLayer(); // append
const layer = timeline.createLayer({ index: 2 }); // insert at index

timeline.removeLayer(layer.id);
```

See [Layer](/getting-started/layer.md) for layer-level controls.

## Looking Up Clips and Layers

```typescript
timeline.getLayerById(layerId);
timeline.getLayerByClipId(clipId);
timeline.getClipById(clipId);
timeline.getClipsByMediaId(mediaId); // all clips that reference this media
timeline.getClipsBySubtitlesId(subtitlesId);
timeline.getClips(); // every clip across layers
```

## Adjust Layout

`adjustClipsLayout` walks every layer and pushes overlapping clips to the next available empty space. It is useful after programmatic changes (for example, after calling [`setPlaybackSpeed`](/getting-started/playback-speed.md) which can mutate clip duration):

```typescript
timeline.adjustClipsLayout();
```

The method returns `true` if it had to move anything.

## Splitting and Trimming Clips

Two common edits: split a clip into two pieces at a point in time, and trim the ends of a clip.

### Split at Time

`layer.splitClip(clipId, time)` cuts the clip at a timeline time (not a source time). It keeps the left piece in place and returns the newly created right piece.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 6,
  style: { fillColor: "#6d6ff2", width: 900, height: 500 },
});
clip.style.setPosition(960, 540);

// Cut at second 3, produces two clips on the same layer, butted end to end.
const rightHalf = await layer.splitClip(clip.getId(), 3);

// Recolor the right half so the split is visible.
if (rightHalf && rightHalf.getType() === "shape") {
  (rightHalf as any).style.setFillColor("#FF4D6D");
}
```

</LiveRun>

### Trim the Ends

`setLeftTrim(seconds)` hides content from the start of the clip. `setRightTrim(seconds)` hides content from the end. Both are in seconds, and both clamp to the clip's real media duration.

```typescript
clip.setLeftTrim(1.0); // skip the first second
clip.setRightTrim(0.5); // skip the last half second

const visible = clip.getTrimmedDuration(); // returns duration - leftTrim - rightTrim
```

For a video clip, trimming changes the visible range without re-encoding, playback and export seek into the source.

## Moving Clips to Another Layer

```typescript
layer.moveClipToLayer(clipId, destinationLayerId);
```

The destination layer reflows to fit (subject to `adjustLayout`). Useful for implementing drag-and-drop between tracks.

## Duration

```typescript
const end = timeline.getFitDuration(); // right-most clip end time across visible layers
```

Use this for trimming the preview bar or for configuring export ranges.

## Volume

The timeline has a master volume that multiplies the volume of every audio and video clip:

```typescript
timeline.setVolume(0.5);
timeline.getVolume();
```

## Extract Audio

Take the audio track out of a video clip and get a standalone [AudioClip](/getting-started/clips/audio.md) on a new layer:

```typescript
const audioClip = timeline.extractAudio(videoClip);
```

The original video clip is muted automatically. The returned audio clip is added to a new layer and can be moved, trimmed, or processed independently.

## Subtitles Across Clips

Attach the same subtitles to multiple clips in a single call:

```typescript
timeline.setSubtitles(subtitlesId, 0, [clipIdA, clipIdB]);
```

Omit the `clipIds` argument to apply subtitles to every clip in the timeline.

## Partial Deserialization

`loadSerializedData` loads timeline state on top of the current Engine without resetting the rest of the project:

```typescript
await timeline.loadSerializedData(serializedTimeline);
```

This is useful when you want to swap the composition but keep the Library, display, and settings intact.

## Reset

To clear the timeline without affecting the Library or Display:

```typescript
timeline.reset();
```

All layers, clips, and transitions are removed.
