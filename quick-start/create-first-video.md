# Create Your First Video

This page walks through the minimum code to render something on screen: initialize the Engine, upload an image, add it to the timeline, and play. Run the example below to see it live, then read the breakdown under each step.

<LiveRun standalone>

```typescript
import { Engine } from "@rendley/sdk";

// 1. Initialize the Engine
await Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
    view: document.getElementById("rendley-canvas") as HTMLCanvasElement,
  },
});

// 2. Upload media to the Library
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1600",
  );

// 3. Put it on the timeline
const layer = Engine.getInstance().getTimeline().createLayer();
const clip = await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
clip.style.setPosition(960, 540);

// 4. Play
await Engine.getInstance().getTimeline().play();
```

</LiveRun>

## 1. Get a License

The SDK requires a valid license. Grab one for free at [app.rendleysdk.com](https://app.rendleysdk.com/).

## 2. Initialize the Engine

The [Engine](/getting-started/engine.md) is a singleton. Call `init` once, passing your license and a canvas element to draw into. The canvas dimensions below (1920×1080) set the composition resolution, which can differ from the DOM size of the canvas, scaling is automatic.

```typescript
import { Engine } from "@rendley/sdk";

await Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
    view: document.getElementById("myCanvas") as HTMLCanvasElement,
  },
});
```

::: warning
The Engine throws if you try to initialize it twice without destroying the previous instance. See [Engine destruction](/getting-started/engine.md#destroying) if you need to reset.
:::

## 3. Upload Media

Every asset (video, image, audio, GIF, SVG) lives in the [Library](/getting-started/library.md). `addMedia` returns an id you'll use to reference the asset later.

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/photo.jpg");
```

`addMedia` accepts a URL, a browser `File`, or a `Uint8Array`.

## 4. Create a Layer and Add a Clip

Clips live on [layers](/getting-started/layer.md) that stack top-to-bottom. Each layer keeps its own stream of clips. Two clips can't overlap on the same layer, so use multiple layers for overlapping content.

```typescript
const layer = Engine.getInstance().getTimeline().createLayer();

await layer.addClip({
  mediaDataId,
  startTime: 0,
  duration: 5,
});
```

For video and audio clips you can omit `duration`, the SDK reads it from the media data.

## 5. Play

```typescript
await Engine.getInstance().getTimeline().play();
```

Other transport controls: `pause()`, `stop()`, `seek(time)`.

## 6. Export (Optional)

When you're ready to produce the final video:

```typescript
const result = await Engine.getInstance().export();
if (result?.blob) {
  downloadBlob(result.blob, "video." + result.extension);
}
```

See [Export](/getting-started/export.md) for encoding options, progress tracking, and chunked output for large files.

## Next Steps

- [Clips](/getting-started/clips.md): catalog of every clip type (text, video, shape, lottie, subtitles, and more).
- [Timeline](/getting-started/timeline.md): playback, seeking, and frame alignment.
- [Styling](/getting-started/styling.md): position, scale, rotation, corner radius, alpha.
- [Animation](/getting-started/animation.md): keyframe-based motion.
- [Save & Restore](/getting-started/save-restore.md): serialize and load projects.
