# Display

The [Display](/api-reference/classes/Display.html) represents the WebGL canvas where the SDK renders its changes. Here, you can set the video's resolution and background color, and access methods to retrieve sprite elements positioned at specific coordinates.

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
  }
});
```

## Resolution

When setting the display's width and height, ensure that it follows the same ratio required by the encoder. For instance, if we are encoding to H.264 by default, the width and height should be divisible by 2.

## Changing Background Color

The display color can be set using RGB, HEX, or plain color values. You can do this as follows:

```typescript
Engine.getInstance().getDisplay().setBackgroundColor("#FF0000");
```

You can also use gradients:

```typescript
Engine.getInstance()
  .getDisplay()
  .setBackgroundColor("linear-gradient(to right, #FF0000, #00FF00)");
```

## Get Clips by Position

If you want to retrieve all clips that are under a specific coordinate, you can use the [getClipIdByCursorPosition](/api-reference/classes/Display.html#getClipIdByCursorPosition) method. This can be useful for identifying which clip the user clicked on. The x and y coordinates should be relative to the canvas element.

```typescript
Engine.getInstance().getDisplay().getClipIdByCursorPosition(100, 250);
```
