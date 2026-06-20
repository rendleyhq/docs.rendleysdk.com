# Subtitles / Captions

The [Subtitles](https://docs.rendleysdk.com/api-reference/classes/SubtitlesClip) clip is responsible for displaying and syncing subtitles or captions with your video content.

## Adding Subtitles Manually

Build a [Subtitles](https://docs.rendleysdk.com/api-reference/classes/Subtitles.html) object with a list of text blocks. Each block has a `text` string, a `time` (when it appears, in seconds), and a `duration`.

<LiveRun>

```typescript
const subtitles = new Subtitles({
  textBlocks: [
    { text: "Hello", time: 0, duration: 1 },
    { text: "beautiful", time: 1, duration: 1 },
    { text: "world", time: 2, duration: 1 },
  ],
});

const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);

const subtitlesClip = new SubtitlesClip({ subtitlesId });
await layer.addClip(subtitlesClip);

Engine.getInstance().getSubtitlesManager().setPosition(960, 540);
Engine.getInstance().getSubtitlesManager().setMainTextStyle({
  fontSize: 120,
  color: "#FFFFFF",
  strokeColor: "#000000",
  strokeThickness: 4,
  fontWeight: "900",
});
```

</LiveRun>

## Adding Subtitles to Layer

To import subtitles from an SRT file, the SDK can automatically parse the SRT string and construct the corresponding `Subtitles` object.

<LiveRun>

```typescript
const srtContent = `
1
00:00:00,500 --> 00:00:02,000
Hello, subtitles

2
00:00:02,500 --> 00:00:04,500
from an SRT file
`;

const subtitles = Engine.getInstance()
  .getSubtitlesManager()
  .convertSRTToSubtitles(srtContent);

const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);

await layer.addClip(new SubtitlesClip({ subtitlesId }));

Engine.getInstance().getSubtitlesManager().setPosition(960, 540);
Engine.getInstance().getSubtitlesManager().setMainTextStyle({
  fontSize: 120,
  color: "#FFFFFF",
  fontWeight: "900",
  strokeColor: "#000000",
  strokeThickness: 4,
});
```

</LiveRun>

### Fetch an SRT File

When your `.srt` is served over HTTP (for example, from a backend that generated it from a transcript), fetch the text first and pass it to the converter:

```typescript
const srtText = await fetch("/api/transcripts/episode-12.srt").then((r) =>
  r.text(),
);

const subtitles = Engine.getInstance()
  .getSubtitlesManager()
  .convertSRTToSubtitles(srtText);

const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);
await layer.addClip(new SubtitlesClip({ subtitlesId }));
```

## Connecting Subtitles with Clips

You may want the subtitles to be directly attached to a specific clip so that they move or trim in sync with that clip. Here's how to do it:

```typescript
// Store subtitles in the library
const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);
const offset = 0;

// Attach subtitles to a clip
clip.setSubtitles(subtitlesId, offset);
```

To delay the appearance of subtitles, use the [`setSubtitlesOffset`](https://docs.rendleysdk.com/api-reference/classes/SubtitlesClip.html#setSubtitlesOffset) method, passing the offset value in seconds.

```typescript
clip.setSubtitlesOffset(value);
```

## Precise Word Timings

When the transcription service reports exact timestamps for each word, you can provide them through the `wordTimings` field on the text block. The SDK will only honor the timings if the array length matches the number of words; otherwise, it falls back to interpolating based on word length.

```typescript
const subtitles = new Subtitles({
  textBlocks: [
    {
      text: "Hello World",
      time: 0,
      duration: 2,
      wordTimings: [
        { time: 0, duration: 0.6 },
        { time: 1.1, duration: 0.9 },
      ],
    },
  ],
});
```

## Styling

You have full control over the styling of subtitles, including both the main text and highlighted words. Here's how to customize the styles:

### Main Text Styling

To set the style for the underlying subtitle text, use the [`setMainTextStyle`](https://docs.rendleysdk.com/api-reference/classes/SubtitlesManager.html#setMainTextStyle) method:

```typescript
Engine.getInstance().getSubtitlesManager().setMainTextStyle({
  fontSize: 20,
  color: "#FFFFFF",
  fontFamily: "Roboto",
  fontWeight: "bold",
  letterSpacing: 1,
  lineHeight: 1.3,
  strokeColor: "#000000",
  strokeThickness: 2,
  backgroundColor: "#000000",
  backgroundPadding: 8,
  backgroundCornerRadius: 6,
});
```

### Highlighted Word Styling

To customize the appearance of highlighted words, such as making them bold or changing their color, use the [`setHighlightedTextStyle`](https://docs.rendleysdk.com/api-reference/classes/SubtitlesManager.html#setHighlightedTextStyle) method:

```typescript
Engine.getInstance().getSubtitlesManager().setHighlightedTextStyle({
  fontWeight: "bold",
  color: "#FFFF00",
  strokeColor: "#000000",
});
```

### Drop Shadow

Subtitles support drop shadow on both the main and highlighted text:

```typescript
Engine.getInstance()
  .getSubtitlesManager()
  .setMainTextStyle({
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowAlpha: 0.6,
    dropShadowBlur: 4,
    dropShadowDistance: 4,
    dropShadowAngle: Math.PI / 4,
  });
```

### Subtitle Display Modes

You can control how subtitles are displayed, such as showing the entire text and highlighting the active word, or revealing words as they are spoken. To set the subtitle display mode, use:

```typescript
Engine.getInstance().getSubtitlesManager().setTextMode("partial");
```

Available modes include `"full"` (to show the complete text) and `"partial"` (to reveal words progressively).

## Position and Scale

Subtitles are global to the composition and can be moved and resized independently from the clips:

```typescript
Engine.getInstance().getSubtitlesManager().setPosition(540, 1600);
Engine.getInstance().getSubtitlesManager().setScale(1.2);
```

If you want subtitles to adapt to display resolution changes, enable [`setSubtitlesScaleOnResize`](/getting-started/settings.md#change-subtitles-scale-on-resize) and [`setSubtitlesAutoWrapOnResize`](/getting-started/settings.md#change-subtitles-wrap-width-on-resize) in the [Settings](/getting-started/settings.md).

## Animations

You can also use animations to control the appearance of subtitles. For example, you can use the [`setHighlightAnimation`](https://docs.rendleysdk.com/api-reference/classes/SubtitlesManager.html#setHighlightAnimation) method to make the highlighted word wiggle:

```typescript
const speed = 0.6;

Engine.getInstance()
  .getSubtitlesManager()
  .setHighlightAnimation("wiggle", speed);
```

Some of the supported animations are: `"pop"`, `"pop_rotate"`, `"wiggle"`. The full list can be found [here](https://docs.rendleysdk.com/api-reference/enums/HighlightAnimationEnum.html).

The `speed` property controls the animation playback speed.

### Disable Word Highlight Animation

If you want the highlighted word to remain static instead of animating, turn the highlight off:

```typescript
Engine.getInstance().getSubtitlesManager().setHighlightEnabled(false);
```
