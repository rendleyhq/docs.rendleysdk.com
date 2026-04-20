# Subtitles Clip

The [SubtitlesClip](https://docs.rendleysdk.com/api-reference/classes/SubtitlesClip.html) renders time-synced captions on the canvas. It pulls its text from a [Subtitles](https://docs.rendleysdk.com/api-reference/classes/Subtitles.html) object stored in the Library, so multiple subtitles clips can share the same source.

See the full [Subtitles / Captions](/getting-started/subtitles.md) guide for styling, text modes, word timings, highlight animations, and the parser for SRT files. This page covers only the clip itself.

## Create a Subtitles Clip

<LiveRun>

```typescript
const subtitles = new Subtitles({
  textBlocks: [
    { text: "Hello", time: 0, duration: 1 },
    { text: "World", time: 1, duration: 1 },
  ],
});

const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);

const subtitlesClip = new SubtitlesClip({ subtitlesId });
await layer.addClip(subtitlesClip);

Engine.getInstance().getSubtitlesManager().setPosition(960, 540);
Engine.getInstance().getSubtitlesManager().setMainTextStyle({
  fontSize: 140,
  color: "#FFFFFF",
  fontWeight: "900",
  strokeColor: "#000000",
  strokeThickness: 4,
});
```

</LiveRun>

## Attach Subtitles to an Existing Clip

When you want the subtitles to move, trim, and mute alongside a specific video or audio clip:

```typescript
clip.setSubtitles(subtitlesId, 0); // id + offset in seconds
clip.setSubtitlesOffset(0.5); // shift without re-attaching
```

## See Also

- [Subtitles / Captions](/getting-started/subtitles.md): styling, word timings, highlight animations.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`SubtitlesClip`](https://docs.rendleysdk.com/api-reference/classes/SubtitlesClip.html), [`Subtitles`](https://docs.rendleysdk.com/api-reference/classes/Subtitles.html)
