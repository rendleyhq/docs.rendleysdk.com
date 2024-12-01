# Display

The Display represents the WebGL canvas where the SDK renders its changes. Here you can set the video's resolution, the background color and you can also access methods for getting sprite elements positioned at specific coordinates.

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

When setting the display's width and height, you have to make sure it follows the same ratio as the encoder requires it to be. For instance, by default we encode to h264, meaning that the width and height should be 2<sup>x</sup>.

## Changing background color

The display color can be set as RGB, HEX or plain color. You can do it as following

```typescript
Engine.getInstance().getDisplay().setBackgroundColor("#FF0000");
```

You can also use gradients

```typescript
Engine.getInstance()
  .getDisplay()
  .setBackgroundColor("linear-gradient(to right, #FF0000, #00FF00)");
```

## Get clips by position

For use cases where you want to get all the clips that are under a specific coordinate you can use the `getClipIdByCursorPosition` method. This could be useful when you want to identify on which clip did the user click. The x and y coordinates should be relative to the canvas element.

```typescript
Engine.getInstance().getDisplay().getClipIdByCursorPosition(100, 250);
```
