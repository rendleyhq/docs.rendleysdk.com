# Installation

The Video Editor UI is created using web components, making it embeddable into any website created with any library, whether it be React, Angular, Vue, PHP, or HTML.

## Setup

:::tabs
== CDN

```html
<script type="module">
  import { defineCustomElements } from "https://cdn.rendley.com/sdk/video-editor/1.0.0/loader/index.js";

  defineCustomElements();
</script>

<rendley-video-editor
  id="rendley"
  licensename="YOUR_LICENSE_NAME"
  licensekey="YOUR_LICENSE_KEY"
  pexelsapikey="YOUR_PEXELS_API_KEY"
  giphyapikey="YOUR_GIPHY_API_KEY"
  theme="dark"
/>
```

:::

### Get a free license

You can get a license by visiting [our website](https://app.rendley.com/). Replace `YOUR_LICENSE_NAME` and `YOUR_LICENSE_KEY` with your actual license.

### Get a Pexels API key

Follow the instructions [here](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key) to get a Pexels API key. Replace `YOUR_PEXELS_API_KEY` with your actual Pexels API key.

### Get a Giphy API key

Follow the instructions [here](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key) to get a Giphy API key. Replace `YOUR_GIPHY_API_KEY` with your actual Giphy API key.

## Interacting with the SDK

The Video Editor UI is using Rendley SDK under the hood and it is being exposed as a custom method. You can get access to the `Engine` class as soon as the UI is ready.

Once you have access to the `Engine` class, you can use it to interact with the SDK, including adding listeners, deserializing or serializing projects, etc.

```javascript{10}
// Get the video editor element
let rendleyTemplateElement = document.getElementById("rendley");

// Listen to render success and error events
rendleyTemplateElement.addEventListener("onRenderSuccess", (blobUrl) => {});
rendleyTemplateElement.addEventListener("onRenderError", (message) => {});

// Listen to other events and interact with the engine
rendleyTemplateElement.addEventListener("onReady", async () => {
  const Engine = await rendleyTemplateElement.getEngine();

  // Example event handling
  Engine.getInstance().events.on("gallery:added", (gallery) => {});
});
```

> [!WARNING]
> It is important that you get the Engine class and use it only when the `onReady` event has confirmed that the video editor is loaded.

## Limitations

The free version of the Video Editor UI is not very customizable and you will most probably not be able to change a lot of things about how elements are being displayed.

> [!TIP]
> You can get over the limitations of the free version by purchasing the source code of the Video Editor UI, which you can find [here](https://google.com).
