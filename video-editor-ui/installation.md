# Installation

The Video Editor UI is built using web components, making it embeddable into any website created with various libraries, including React, Angular, Vue, PHP, or plain HTML.

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

### Get a Free License

You can obtain a license by visiting [our website](https://app.rendley.com/). Replace `YOUR_LICENSE_NAME` and `YOUR_LICENSE_KEY` with your actual license information.

### Get a Pexels API Key

Follow the instructions [here](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key) to obtain a Pexels API key. Replace `YOUR_PEXELS_API_KEY` with your actual Pexels API key.

### Get a Giphy API Key

Follow the instructions [here](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key) to obtain a Giphy API key. Replace `YOUR_GIPHY_API_KEY` with your actual Giphy API key.

## Interacting with the SDK

The Video Editor UI utilizes the Rendley SDK under the hood, exposing it as a custom method. You can access the [`Engine`](/api-reference/classes/Engine.html) class as soon as the UI is ready.

Once you have access to the [`Engine`](/api-reference/classes/Engine.html) class, you can interact with the SDK, including adding listeners, deserializing or serializing projects, and more.

```javascript{10}
// Get the video editor element
let rendleyTemplateElement = document.getElementById("rendley");

// Listen for render success and error events
rendleyTemplateElement.addEventListener("onRenderSuccess", (blobUrl) => {
  // Handle render success
});
rendleyTemplateElement.addEventListener("onRenderError", (message) => {
  // Handle render error
});

// Listen for other events and interact with the engine
rendleyTemplateElement.addEventListener("onReady", async () => {
  const Engine = await rendleyTemplateElement.getEngine();

  // Example event handling
  Engine.getInstance().events.on("gallery:added", (gallery) => {
    // Handle gallery added event
  });
});
```

::: warning
It is crucial to access the [`Engine`](/api-reference/classes/Engine.html) class only after the `onReady` event has confirmed that the video editor is loaded.

:::

## Limitations

The free version of the Video Editor UI is not highly customizable, and you may find limited options for altering the display of elements.

::: tip
To overcome the limitations of the free version, consider purchasing the source code of the Video Editor UI, which you can find [here](https://checkout.rendley.com/buy/89371a6f-2b45-4a50-86cc-23dae580583c).
:::
