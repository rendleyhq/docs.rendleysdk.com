# Quick Start

Rendley SDK can be installed via npm, yarn, or pnpm.

:::tabs
== npm

```bash
npm install @rendley/sdk
```

== yarn

```bash
yarn add @rendley/sdk
```

== pnpm

```bash
pnpm add @rendley/sdk
```

:::

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
