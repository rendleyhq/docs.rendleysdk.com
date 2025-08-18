# Video Editor UI Pro

The Pro version of the Video Editor provides access to the source code that powers the video editor.

After purchasing the Pro version, you will gain access to a GitHub repository where the source code is hosted.

## Installation

### Install Dependencies

To get started, clone the repository and install the necessary dependencies.

:::tabs
== NPM

```bash
npm install
```

:::

### Edit the Configuration

After installing the dependencies, open the `index.html` file in your IDE and configure the following fields:

```html
<rendley-video-editor
  id="rendley"
  licensename="YOUR_LICENSE_NAME"
  licensekey="YOUR_LICENSE_KEY"
  pexelsapikey="YOUR_PEXELS_API_KEY"
  giphyapikey="YOUR_GIPHY_API_KEY"
  theme="dark"
/>
```

### Get a Free License

You can obtain a license by visiting [our website](https://app.rendleysdk.com/). Replace `YOUR_LICENSE_NAME` and `YOUR_LICENSE_KEY` with your actual license information.

### Get a Pexels API Key

Follow the instructions [here](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key) to obtain a Pexels API key. Replace `YOUR_PEXELS_API_KEY` with your actual Pexels API key.

### Get a Giphy API Key

Follow the instructions [here](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key) to obtain a Giphy API key. Replace `YOUR_GIPHY_API_KEY` with your actual Giphy API key.

### Start the Development Server

To start the development server, run the following command:

```bash
npm start
```

## Build

To build the project, execute the following command:

```bash
npm run build
```

This will create the relevant folders: `dist` and `loader`.

## Integration

You have two options for integrating the project into your website:

### 1. Publish as a Private NPM Package

The recommended method for using the Video Editor UI is to publish it as a private NPM package. For instructions, follow [this guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

### 2. Upload to CDN

Alternatively, you can build the project and upload both the `dist` and `loader` folders to a CDN. To embed the Video Editor UI into your website, use the CDN URL:

```html
<script type="module">
  import { defineCustomElements } from "https://cdn.mywebsite.com/loader/index.js";

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

## Framework Integration

Stencil.js can generate wrappers for different frameworks, providing a more familiar way to work with the component. These wrappers use the same web component at their core, while offering type definitions and features specific to each framework:

- [React.js](https://stenciljs.com/docs/react)
- [Angular](https://stenciljs.com/docs/angular)
- [Vue](https://stenciljs.com/docs/vue)
