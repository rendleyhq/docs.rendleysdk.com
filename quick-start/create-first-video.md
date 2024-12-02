# Create Your First Video

## Get a License

To use the SDK, you need a license. You can obtain one by visiting [our website](https://app.rendley.com/).

## Initialize the Engine

```typescript
import { Engine } from "@rendley/sdk";

const engine = Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1080,
    height: 1920,
    backgroundColor: "#000000",
    view: document.getElementById("myCanvas"),
  },
});
```

First, replace `YOUR_LICENSE_NAME` and `YOUR_LICENSE_KEY` with your actual license details. Also, ensure that you set the correct canvas element in the `view` property.

If the Engine is initialized correctly, the canvas should turn black and have dimensions of 1080x1920. If not, verify that the canvas element is referenced correctly.

## Upload an Asset

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=500"
  );
```

We have uploaded an image directly from Pexels into our Library. The Library returns a unique identifier for the file, which we can use later to display the image on the canvas.

## Create a Layer

You may not see the image displayed on the canvas yet, which is expected because we haven't attached it to anything. A clip is part of a layer, so let's create one first.

```typescript
const layer = Engine.getInstance().getTimeline().createLayer();
```

## Add a Clip

Now that we have a layer, let's create a clip containing the image we just uploaded and add it to the layer. We will also make the clip last for 5 seconds.

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
```

## Play the Composition

To play the composition, simply call the `play()` function.

```typescript
Engine.getInstance().getTimeline().play();
```

## Export the Final Video

To export the final video, call the `export()` function, which will return a blob URL for the final video.

```typescript
const finalVideo = await Engine.getInstance().export();
```
