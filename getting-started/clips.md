# Clips

A clip represents the smallest unit of a composition. It can be a text, image, video, audio, or even a custom HTML element.

## Create a Clip

Clips are part of layers. To create a clip, you can use the following code:

```typescript
const layer = Engine.getInstance().getTimeline().createLayer();

await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 5,
  style: {
    fontSize: 24,
  },
});
```

There are various types of clips, and depending on their type, they may have a different set of properties and constructors. For instance, clips created with a resource from the library will need to include the `mediaDataId` property, while clips that do not will only need to specify the type of the clip. Check below for how to create each type of clip.

> [!NOTE]
> Two clips cannot overlap on the same layer. If you want a clip to go on top of another, you need to create a new layer and add the clip to it.

## Image

Responsible for loading and displaying images.

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
```

::: details List of Supported Formats
| Format | Support |
| ------ | :-----: |
| JPEG | ✅ |
| PNG | ✅ |
| GIF | ✅ |
| WEBP | ✅ |
| BMP | ✅ |
| HEIC | ✅ |
:::

## Video

Responsible for loading and displaying videos.

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

::: warning
The duration of the video clip is inferred from the media data. If you want to modify it, you can use trimming.
:::

::: details List of Supported Formats
| Format | Support |
| ------ | :-----: |
| MP4 | ✅ |
| MOV | ✅ |
| AVI | ✅ |
| WEBM | ✅ |
| MKV | ✅ |
| M3U8 | ✅ |
:::

## Audio

Responsible for loading and playing audio.

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

::: warning
The duration of the audio clip is inferred from the media data. If you want to modify it, you can use trimming.
:::

::: details List of Supported Formats
| Format | Support |
| ------ | :-----: |
| MP3 | ✅ |
| M4A | ✅ |
| OGG | ✅ |
| WAV | ✅ |
| AAC | ✅ |
:::

## GIF

Responsible for rendering GIFs. It can also be used for rendering stickers, as it supports transparency.

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

## Shape

Responsible for rendering various shapes such as rectangles, circles, triangles, and ellipses. If you need a shape in your composition, it is better to use this clip instead of using an image.

```typescript
await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: {
    fillColor: "#FF0000",
    strokeColor: "#00FF00",
    strokeWidth: 2,
    width: 100,
    height: 100,
  },
});
```

::: details List of Supported Shapes
| Shape | Support |
| ------ | :-----: |
| Rectangle | ✅ |
| Circle | ✅ |
| Triangle | ✅ |
| Ellipse | ✅ |
:::

## Text

Create and display text elements.

```typescript
const textClip = await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 5,
  style: {
    fontSize: 24,
  },
});
```

The text clip also supports setting a background color that goes behind the text. You can set it like this:

```typescript
textClip.style.setBackgroundColor("#0000FF");
```

### Changing the Text

To change the text, simply run:

```typescript
textClip.setText("New Text");
```

If you want to retrieve the text, you can use:

```typescript
const myText = textClip.getText();
```

## HTML Text

If you have a custom HTML text element, you can use this clip. Everything will be rendered inside a span element, allowing for additional styling.

```typescript
await layer.addClip({
  type: "html_text",
  htmlText: `
    <span style="background-color: green; color: white">
        Hello World
    </span>
  `,
  fonts: [],
  startTime: 0,
  duration: 5,
});
```

::: warning
If you use any fonts inside the HTML element, it is important to add the font names inside the `fonts` array.
:::

::: info
You can also include divs and other HTML elements.
:::

## Lottie

A Lottie clip is a special type that allows loading Adobe After Effects compositions. Besides loading the composition, it includes a system for modifying its elements. The assets URL can be inferred from the data of the composition or provided manually via the `assetsUrl` property.

```typescript
import { LottieClip } from "@rendley/sdk";

const lottieClip = new LottieClip({
  dataUrl: "/path/to/data.json",
  assetsUrl: "/path/to/assets",
  startTime: 0,
});

await layer.addClip(lottieClip);
```

### Changing Properties of the Composition

If you want to configure the composition, you can use the built-in system for working with properties. It requires a JSON file storing the properties of the composition.

::: details Example `properties.json` file

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
import { LottieClip } from "@rendley/sdk";

const lottieClip = new LottieClip({
  dataUrl: "/path/to/data.json",
  propertiesUrl: "/path/to/properties.json",
  startTime: 0,
});

await layer.addClip(lottieClip);
```

To change the value of a property, use:

```typescript
lottieClip.setProperty("propertyName", "propertyValue");
```

To get the list of all properties, use:

```typescript
const propertiesList = lottieClip.getProperties();
```

To get the value of a specific property, use:

```typescript
const propertyValue = lottieClip.getProperty("propertyName");
```

::: info
If you want to learn how to export an After Effects composition, check out this [guide](/in-progress.md).
:::

## Custom

Each of the clips above is an extension of a base clip class. We have exposed it for you to create your own implementations. A good example of a custom clip could be a Waveform clip that animates based on audio.

::: info
If you want to learn how to create a custom clip, check out this [guide](/in-progress.md).
:::
