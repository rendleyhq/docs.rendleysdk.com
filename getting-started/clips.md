# Clips

The clip represents the smallest unit of the composition. It can either be a text, an image, a video, an audio or even a custom HTML element.

## Create clip

Clips are part of layers. To create a clip, you can use the following:

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

There are various types of clips and depending on their type, they might have a different set of properties and constructors. For instance, clips that are being created with a resource from library, will need to include the `mediaDataId` property, whereas clips that don't, will just have to specify the type of the clip Check below how to create each type of clip.

> [!NOTE]
> Two clips can't overlap on the same layer. If you want a clip to go on top of another, you need to create a new layer and add the clip to it.

## Image

Responsible for loading and displaying images

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
```

::: details List of the supported formats
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

Responsible for loading and displaying videos

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

::: warning
The duration of the video clip is being inferred from the media data. If you want to modify it, you can use trimming.
:::

::: details List of the supported formats
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

Responsible for loading and playing audio

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

::: warning
The duration of the audio clip is being inferred from the media data. If you want to modify it, you can use trimming.
:::

::: details List of the supported formats
| Format | Support |
| ------ | :-----: |
| MP3 | ✅ |
| M4A | ✅ |
| OGG | ✅ |
| WAV | ✅ |
| ACC | ✅ |
:::

## Gif

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

Responsible for rendering gifs. It can also be used for rendering stickers as it supports transparency

## Shape

Responsible for rendering various shapes such as rectangles, circles, triangles and elipses. If you need a shape in your composition, it is better to use this clip instead of using an image.

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

::: details List of the supported shapes
| Format | Support |
| ------ | :-----: |
| rectangle | ✅ |
| circle | ✅ |
| triangle | ✅ |
| elipse | ✅ |
:::

## Text

Create and display text elements

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

The text clip also supports setting a background color that goes behind the text. You can set it like this

```typescript
textClip.style.setBackgroundColor("#0000FF");
```

- ### Changing the text

  To change the text, simply run

  ```typescript
  textClip.setText("Hello World");
  ```

  If you want to retreieve the text, you can use

  ```typescript
  const myText = textClip.getText();
  ```

## HTML Text

If you have a custom HTML text element, you can use this clip. Everything will be rendered inside a span element, which means that you could also use it for styling.

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
If you use any fonts inside the HTML element, it is important to add the font names inside the `fonts` array
:::

::: info
You can also have divs inside and other HTML elements
:::

## Lottie

A Lottie clip is a special clip that allows loading Adobe After Effects compositions. Besides loading the composition, we implemented a system for modifying its elements. The assets url can be both, inferred from the data of the composition or provided manually via the `assetsUrl` property.

```typescript
import { LottieClip } from "@rendley/sdk";

const lottieClip = new LottieClip({
  dataUrl: "/path/to/data.json",
  assetsUrl: "/path/to/assets",
  //   propertiesUrl: "/path/to/properties.json",
  startTime: 0,
});

await layer.addClip(lottieClip);
```

- ### Changing properties of the composition

  If you want to configure the composition, you can use our built in system for working with properties. It requires a JSON storing the properties of the composition.

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

  To change the value of a property, you should use

  ```typescript
  this.clip.setProperty("propertyName", "propertyValue");
  ```

  If you need to get the list of all the properties, you can use

  ```typescript
  const propertiesList = clip.getProperties();
  ```

  and, if you are interested in getting the value of a specific property, you can use

  ```typescript
  const propertyValue = clip.getProperty("propertyName");
  ```

::: info
If you want to learn about how to export an After Effects composition, check out this [guide](/in-progress.md)
:::

## Custom

Each of the clips above are extensions of a baseclip class. We exposed it for you as well to be able to create your own implements. A good example of a custom clip could be a Waveform clip that gets animated based on the audio.

::: info
If you want to learn about how to create a custom clip, check out this [guide](/in-progress.md)
:::
