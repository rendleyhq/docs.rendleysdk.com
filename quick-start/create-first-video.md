# Create your first video

## Get a license

In order to be able to use the SDK, you need a license. You can obtain one by visiting [our website](https://app.rendley.com/).

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

First thing first, replace `YOUR_LICENSE_NAME` and `YOUR_LICENSE_KEY` with your actual license. Also, make sure to set the correct canvas element in the `view` property.

If the Engine was initialized correctly, you should see the canvas get black and have the dimension of 1080x1920, if not, make sure the canvas element was correctly referenced.

## Upload an asset

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=500"
  );
```

We have just uploaded an image directly from Pexels into our Library. The Library returned back an unique identifier for the file, which we can use later for displaying the image in the canvas.

## Create a layer

You probably don't see the image being displayed in the canvas yet, and that's expected because we haven't attached it to anything yet. A clip is part of a layer, so let's create one first

```typescript
const layer = Engine.getInstance().getTimeline().createLayer();
```

## Add a clip

Now that we have an available layer, let's create a clip containing the above image and add it to the layer. Also, let's make the clip take 5 seconds.

```typescript
await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
```

## Play the composition

To play the composition, we can simply call the `play()` function.

```typescript
Engine.getInstance().getTimeline().play();
```

## Export the final video

To export the final video, it is sufficient to call the `export()` function wich will return a blob url for the final video.

```typescript
const finalVideo = await Engine.export();
```
