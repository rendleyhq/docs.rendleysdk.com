# Subtitles / Captions

The Subtitles Clip is responsible for displaying and syncing subtitles or captions with your video content.

## Adding Subtitles Manually

To add subtitles manually, you need to define a `Subtitles` object that contains a list of text blocks. Each text block specifies the text content, the start time, and the duration, all measured in seconds.

```typescript
import { Engine, Subtitles, SubtitlesClip } from "@rendley/sdk";

// Create the subtitles structure
const subtitles = new Subtitles({
  textBlocks: [
    {
      text: "Hello",
      time: 0,
      duration: 1,
    },
    {
      text: "World",
      time: 1,
      duration: 1,
    },
  ],
});

// Store subtitles in the library
const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);

// Create the subtitles clip
const subtitlesClip = new SubtitlesClip({
  subtitlesId: subtitlesId,
});

// Add the subtitles clip to a layer
const layer = Engine.getInstance().getTimeline().createLayer();
await layer.addClip(subtitlesClip);
```

## Importing Subtitles from SRT

To import subtitles from an SRT file, the SDK can automatically parse the SRT string and construct the corresponding `Subtitles` object.

```typescript
import { Engine, Subtitles, SubtitlesClip } from "@rendley/sdk";

const srtContent = `
1
00:01:17,757 --> 00:01:18,757
Hello World!
`;

// Convert the SRT content to a Subtitles object
const subtitles = Engine.getInstance()
  .getSubtitlesManager()
  .convertSRTToSubtitles(srtContent);

// Store subtitles in the library
const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);

// Create the subtitles clip
const subtitlesClip = new SubtitlesClip({
  subtitlesId: subtitlesId,
});

// Add the subtitles clip to a layer
const layer = Engine.getInstance().getTimeline().createLayer();
await layer.addClip(subtitlesClip);
```

## Connecting Subtitles with Clips

You may want the subtitles to be directly attached to a specific clip so that they move or trim in sync with that clip. Here's how to do it:

```typescript
// Store subtitles in the library
const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);

// Attach subtitles to a clip
clip.setSubtitles(subtitlesId);
```

To delay the appearance of subtitles, use the `setSubtitlesOffset` method, passing the offset value in seconds.

```typescript
clip.setSubtitlesOffset(value);
```

## Styling

You have full control over the styling of subtitles, including both the main text and highlighted words. Here's how to customize the styles:

### Main Text Styling

To set the style for the underlying subtitle text, use the `setMainTextStyle` method:

```typescript
Engine.getInstance().getSubtitlesManager().setMainTextStyle({
  fontSize: 20,
  color: "#FFFFFF",
});
```

### Highlighted Word Styling

To customize the appearance of highlighted words, such as making them bold or changing their color:

```typescript
Engine.getInstance().getSubtitlesManager().setHighlightStyle({
  fontWeight: "bold",
  color: "#FFFF00",
  strokeColor: "#000000",
});
```

### Subtitle Display Modes

You can control how subtitles are displayed, such as showing the entire text and highlighting the active word, or revealing words as they are spoken. To set the subtitle display mode, use:

```typescript
Engine.getInstance().getSubtitlesManager().setTextMode("partial");
```

Available modes include `"full"` (to show the complete text) and `"partial"` (to reveal words progressively).

## Animations

Highlight animations for the active word can add visual appeal to your subtitles. The SDK offers a variety of built-in animations to cover most use cases. To apply a highlight animation:

```typescript
const speed = 0.6;

Engine.getInstance()
  .getSubtitlesManager()
  .setHighlightAnimation("wiggle", speed);
```

Here, `speed` controls the animation playback speed.
