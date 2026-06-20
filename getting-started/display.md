# Display

The [Display](https://docs.rendleysdk.com/api-reference/classes/Display.html) represents the WebGL canvas where the SDK renders every frame. Configure it through `Engine.init`'s `display` option, then access it at runtime via `Engine.getInstance().getDisplay()`.

```typescript{9-11}
import { Engine } from "@rendley/sdk";

const engine = Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
  },
});
```

## Resolution

When setting the display's width and height, ensure that it follows the same ratio required by the encoder. For instance, if we are encoding to H.264 by default, the width and height should be divisible by 2.

## Changing Background Color

The display color can be set using RGB, HEX, or plain color values.

<LiveRun>

```typescript
// Change the background to a warm orange and drop a centered text clip on top.
Engine.getInstance().getDisplay().setBackgroundColor("#FF6A00");

const title = await layer.addClip({
  type: "text",
  text: "Orange",
  startTime: 0,
  duration: 5,
  style: { fontSize: 240, color: "#FFFFFF", fontWeight: "900" },
});
title.style.setPosition(960, 540);
```

</LiveRun>

You can also use gradients:

```typescript
Engine.getInstance()
  .getDisplay()
  .setBackgroundColor("linear-gradient(to right, #FF0000, #00FF00)");
```

## Hit Testing

[`getClipIdByCursorPosition(x, y)`](https://docs.rendleysdk.com/api-reference/classes/Display.html#getClipIdByCursorPosition) returns the id of the top-most visible clip under a coordinate, or `null` if no clip is there. Coordinates are in **composition space** (the same space as clip positions), not DOM pixels.

```typescript
const clipId = Engine.getInstance()
  .getDisplay()
  .getClipIdByCursorPosition(960, 540);
```

The method already accounts for layer stacking order and the current state of any transitions running between clips, so you get the clip that the reader would actually perceive as on top.

### Map a Mouse Event to a Clip

A typical wiring for a click-to-select interaction. The canvas DOM size and the composition resolution usually differ, so scale the pointer coordinates before calling the hit test.

```typescript
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

canvas.addEventListener("pointerdown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const [width, height] = Engine.getInstance().getDisplay().getResolution();

  const x = ((event.clientX - rect.left) / rect.width) * width;
  const y = ((event.clientY - rect.top) / rect.height) * height;

  const clipId = Engine.getInstance().getDisplay().getClipIdByCursorPosition(x, y);
  if (!clipId) return;

  const clip = Engine.getInstance().getClipById(clipId);
  // Select the clip in your UI, open a properties panel, etc.
  onClipSelected(clip);
});
```

Selection itself isn't a first-class concept in the SDK. Hold the selected clip id in your own state (React state, MobX, Redux, whatever), and use the id with `Engine.getInstance().getClipById(id)` whenever you need to apply an edit.
