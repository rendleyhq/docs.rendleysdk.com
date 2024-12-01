# Video Editor UI Pro

The Pro version of the video editor gives you access to the source code that went behind creating the video editor.

After purchasing the pro version, you will get access to a github repository where the source code can be found.

## Installation

### Install dependencies

It is sufficient to clone the repository and install the dependencies.

:::tabs
== NPM

```bash
npm install
```

:::

### Edit the configuration

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

### Get a free license

You can get a license by visiting [our website](https://app.rendley.com/). Replace `YOUR_LICENSE_NAME` and `YOUR_LICENSE_KEY` with your actual license.

### Get a Pexels API key

Follow the instructions [here](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key) to get a Pexels API key. Replace `YOUR_PEXELS_API_KEY` with your actual Pexels API key.

### Get a Giphy API key

Follow the instructions [here](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key) to get a Giphy API key. Replace `YOUR_GIPHY_API_KEY` with your actual Giphy API key.

### Start development server

To start the development server, run the following command:

```bash
npm start
```

## Build

To build the project, run the following command:

```bash
npm run build
```

The relevant folders that will be created are `dist` and `loader`.

## Integration

To integrate the project into your website, you have two options:

### 1. Publish as a private NPM package

The recommeded way of using the Video Editor UI is to publish the package as a private NPM package. To do so, follow the instructions [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

### 2. Upload to CDN

The alternative way, would be to build the project and upload both, the `dist` and `loader` folders to a CDN. To embed the Video Editor UI into your website, you would have to use the CDN URL

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

Stencil.js is able to output the wrappers for different frameworks as well so you have a more familiar way of working with the component. These wrappers use the same web component at the base, but provide type definitions and other features that are specific to the framework.

- [React.js](https://stenciljs.com/docs/react)
- [Angular](https://stenciljs.com/docs/angular)
- [Vue](https://stenciljs.com/docs/vue)
