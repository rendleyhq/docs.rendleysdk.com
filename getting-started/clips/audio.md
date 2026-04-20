# Audio Clip

The [AudioClip](https://docs.rendleysdk.com/api-reference/classes/AudioClip.html) plays an audio file on the timeline. It supports trimming, playback speed, pitch preservation, and volume fades.

## Create an Audio Clip

The duration is inferred from the media data.

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/voiceover.mp3");

await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

::: details List of Supported Formats {open}
| Format | Support |
| ------ | :-----: |
| MP3 | ✅ |
| M4A | ✅ |
| OGG | ✅ |
| WAV | ✅ |
| AAC | ✅ |
:::

## Volume and Mute

```typescript
audioClip.setVolume(0.5);
audioClip.setMuted(true);
```

## Adding Background Music

Background music is just an audio clip on its own layer, trimmed to the composition length and faded in / out so it doesn't start or end abruptly. A typical setup:

```typescript
const musicMediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/song.mp3");

const musicLayer = Engine.getInstance().getTimeline().createLayer();
const music = await musicLayer.addClip({
  mediaDataId: musicMediaId,
  startTime: 0,
});

// Trim the music to the composition length.
const duration = Engine.getInstance().getTimeline().getFitDuration();
music.setRightTrim(Math.max(0, music.getDuration() - duration));

// Keep the music quieter than dialogue.
music.setVolume(0.3);

// Smooth fade-in and fade-out at the boundaries.
music.setVolumeFadeInDuration(1.0);
music.setVolumeFadeOutDuration(2.0);
```

If the music is longer than the composition, `setRightTrim` cuts the tail. If it's shorter, duplicate the clip on the same layer to extend playback, or use a single long track.

## Playback Speed and Fades

Speed, pitch, and fade in/out are covered on the [Playback Speed & Fades](/getting-started/playback-speed.md) page.

## Waveform Samples

If you enable [`clipAudioStoreSamples`](/getting-started/settings.md#audio-samples) in the Settings before adding the media, the SDK extracts normalized `Float32Array` samples you can use to draw a waveform or drive custom clips.

```typescript
const samples = audioClip.getAudioSamples(0); // start at 0, full duration
```

See [Filmstrip & Waveforms](/getting-started/filmstrip.md) for the full workflow.

## See Also

- [Video](/getting-started/clips/video.md)
- [Clip API Reference](/getting-started/clips.md#common-api)
- [Playback Speed & Fades](/getting-started/playback-speed.md)
- [Filmstrip & Waveforms](/getting-started/filmstrip.md)
- API reference: [`AudioClip`](https://docs.rendleysdk.com/api-reference/classes/AudioClip.html)
