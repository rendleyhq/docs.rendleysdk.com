# Filmstrip and Audio Samples

For building timelines that show video thumbnails and audio waveforms, the SDK can extract filmstrip frames and audio samples from each media entry in the Library.

## Filmstrip (Video Thumbnails)

Enable filmstrip extraction from the [Settings](/getting-started/settings.md) before adding media:

```typescript
Engine.getInstance().getSettings().setClipVideoStoreFilmstrip(true);
Engine.getInstance().getSettings().setClipVideoFilmstripInterval(1.0); // one frame per second
Engine.getInstance().getSettings().setClipVideoFilmstripMaxWidth(160);
Engine.getInstance().getSettings().setClipVideoFilmstripMaxHeight(90);
Engine.getInstance().getSettings().setClipVideoFilmstripMaxFrames(120);
Engine.getInstance().getSettings().setClipVideoFilmstripMaxWorkers(2);
Engine.getInstance().getSettings().setClipVideoFilmstripKeyframesOnly(false);
```

### Reading the Filmstrip

The filmstrip is attached to the `MediaData`. You can also access it directly on the clip:

```typescript
import { MediaProcessStatusEnum } from "@rendley/sdk";

const state = videoClip.getFilmstripState();

if (state === MediaProcessStatusEnum.DONE) {
  const frames = videoClip.getFilmstripData();

  for (const frame of frames) {
    const blob = new Blob([frame.data], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    // Render `url` in your UI
  }
}
```

Each frame exposes its timestamp and a `Uint8Array` of image data.

### Listening for Progress

```typescript
Engine.getInstance().events.on(
  "library:media_filmstrip_updated",
  ({ mediaDataId, status }) => {
    if (status === "done") {
      refreshTimelineUi(mediaDataId);
    }
  },
);
```

## Audio Samples (Waveforms)

To draw waveforms for audio or video clips, enable sample storage:

```typescript
Engine.getInstance().getSettings().setClipAudioStoreSamples(true);
Engine.getInstance().getSettings().setClipAudioSampleRate(8000);
Engine.getInstance().getSettings().setClipAudioSampleForceMono(true);
Engine.getInstance().getSettings().setClipVideoStoreSamples(true); // for videos with audio
```

Samples are processed in a background thread and reported through the `library:media_samples_updated` event.

### Reading Samples

`getAudioSamples` is synchronous. It returns an array of `Float32Array`, one per channel, or `null` if samples have not been extracted yet (make sure `library:media:samples:updated` fired with `status: "done"` first).

```typescript
const samples = audioClip.getAudioSamples(0); // start at 0, full duration

if (samples) {
  for (const channel of samples) {
    // channel is a Float32Array of normalized samples in [-1, 1]
  }
}

// Read only a window (start=5s, length=10s):
const partial = audioClip.getAudioSamples(5, 10);
```

Video clips expose the same `getAudioSamples` method. If you want the samples without adding the media to the timeline, query them directly on the [`MediaData`](https://docs.rendleysdk.com/api-reference/classes/MediaData.html#getaudiosamples):

```typescript
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);
const samples = mediaData?.getAudioSamples(0);
```

### Listening for Progress

```typescript
Engine.getInstance().events.on(
  "library:media_samples_updated",
  ({ mediaDataId, status }) => {
    if (status === "done") {
      refreshWaveform(mediaDataId);
    }
  },
);
```

## Example: Waveform Animated by Audio

For a full example that turns audio samples into an animated visualizer, see the [Custom Clip](/getting-started/clips/custom.md) guide.
