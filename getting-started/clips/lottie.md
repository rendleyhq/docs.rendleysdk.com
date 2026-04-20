# Lottie Clip

The [LottieClip](https://docs.rendleysdk.com/api-reference/classes/LottieClip.html) loads an Adobe After Effects composition (via Lottie/Bodymovin JSON) and renders it on the canvas. Besides playback, it exposes the composition's layers, text, colors, and images so you can customize them at runtime.

## Create a Lottie Clip

```typescript
import { LottieClip } from "@rendley/sdk";

const lottieClip = new LottieClip({
  dataUrl: "/path/to/data.json",
  assetsUrl: "/path/to/assets", // optional, inferred from `dataUrl` if omitted
  startTime: 0,
});

await layer.addClip(lottieClip);
```

## Composition Properties

To expose specific fields of the composition to your UI (for template-based editors, for example), pair the JSON with a `properties.json` file that maps friendly labels to the Lottie path of each element.

::: details Example `properties.json` file {open}

```json
[
  {
    "type": "text",
    "label": "Title",
    "name": "Title 01/Title Animation 01/Text 01/Text 01"
  },
  {
    "type": "text",
    "label": "Subtitle",
    "name": "Title 01/Title Animation 01/Text 02/Text 02"
  }
]
```

:::

```typescript
const lottieClip = new LottieClip({
  dataUrl: "/path/to/data.json",
  propertiesUrl: "/path/to/properties.json",
  startTime: 0,
});

lottieClip.setProperty("propertyName", "propertyValue");
const properties = lottieClip.getProperties();
const value = lottieClip.getProperty("propertyName");
```

## Replace Colors, Text, and Images

Lottie clips expose helpers for replacing specific elements in the composition using a path that matches the layer structure:

```typescript
lottieClip.replaceText("Title 01/Text 01", "New Title");
lottieClip.replaceFillColor("Title 01/Text 01", [255, 0, 0, 255]);
lottieClip.replaceStrokeColor("Title 01/Text 01", [0, 0, 0, 255]);
lottieClip.replaceStrokeWidth("Title 01/Text 01", 4);
lottieClip.replaceImage("Title 01/Image 01", "https://example.com/image.png");
lottieClip.replaceGradientFillColor("Shape Layer/Gradient", gradientData);
lottieClip.replaceGradientStrokeColor("Shape Layer/Gradient", gradientData);
```

## Playback Speed and Wrap Mode

```typescript
import { WrapModeEnum } from "@rendley/sdk";

lottieClip.setPlaybackSpeed(2);
lottieClip.setWrapMode(WrapModeEnum.REPEAT); // CLAMP | REPEAT | PING_PONG | EMPTY
```

## Hot-Swap the Animation Data

If you need to replace the Lottie JSON without recreating the clip:

```typescript
lottieClip.replaceAnimationData(newJson);
```

::: info
`replaceAnimationData` does not serialize. If you need to persist a reference to the source JSON, use [`setCustomData`](/getting-started/library.md#set-custom-metadata-for-assets) on the clip.
:::

## See Also

- [Custom Clips](/getting-started/clips/custom.md): for bespoke animations not authored in After Effects.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`LottieClip`](https://docs.rendleysdk.com/api-reference/classes/LottieClip.html)
