# Installation

The Video Editor UI is published as a web component, which means you can drop it into any page regardless of framework.

## Credentials

Before you install, gather these keys:

- **Rendley license**: required. Get one free at [app.rendleysdk.com](https://app.rendleysdk.com/).
- **Pexels API key**: optional, enables the stock images tab. [Get a key](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key).
- **Giphy API key**: optional, enables the GIF tab. [Get a key](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key).

If you skip the Pexels or Giphy keys, the relevant tabs are simply hidden.

## Setup

:::tabs
== CDN

```html
<script type="module">
  import { defineCustomElements } from "https://cdn.rendleysdk.com/sdk/video-editor/1.8.20/loader/index.js";
  defineCustomElements();
</script>

<rendley-video-editor
  id="rendley"
  licensename="YOUR_LICENSE_NAME"
  licensekey="YOUR_LICENSE_KEY"
  pexelsapikey="YOUR_PEXELS_API_KEY"
  giphyapikey="YOUR_GIPHY_API_KEY"
  theme="dark"
></rendley-video-editor>
```

Pin the version in the URL so your editor doesn't silently update to a breaking release.

== npm

```bash
npm install @rendley/video-editor-ui
```

Then register the custom element once per page:

```typescript
import { defineCustomElements } from "@rendley/video-editor-ui/loader";

defineCustomElements();
```

Use the tag in your template the same way as with the CDN setup:

```html
<rendley-video-editor
  id="rendley"
  licensename="YOUR_LICENSE_NAME"
  licensekey="YOUR_LICENSE_KEY"
  theme="dark"
></rendley-video-editor>
```

:::

### Sizing

The editor fills 100% of its parent container. Give the parent an explicit height, a common choice is `100vh`:

```html
<div style="height: 100vh; width: 100%">
  <rendley-video-editor
    licensename="..."
    licensekey="..."
  ></rendley-video-editor>
</div>
```

## Framework Integrations

Because the editor is a standards-compliant custom element, it works natively in every framework that supports custom elements. A few host-specific notes:

### React

React treats unknown JSX tags as HTML and forwards kebab-case props as attributes, so the tag works in-place:

```tsx
import { useEffect } from "react";
import { defineCustomElements } from "@rendley/video-editor-ui/loader";

export function Editor() {
  useEffect(() => {
    defineCustomElements();
  }, []);

  return (
    <rendley-video-editor
      licensename="YOUR_LICENSE_NAME"
      licensekey="YOUR_LICENSE_KEY"
      theme="dark"
    />
  );
}
```

If you use TypeScript and want typed props, StencilJS can generate a React-specific package (`@rendley/video-editor-ui/react-output-target`). See [Stencil's framework integration docs](https://stenciljs.com/docs/overview) for the wrapper setup.

### Vue

Vue 3 supports custom elements out of the box. Tell Vue to leave the tag alone in your app config:

```typescript
// main.ts
import { createApp } from "vue";
import { defineCustomElements } from "@rendley/video-editor-ui/loader";
import App from "./App.vue";

defineCustomElements();

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) =>
  tag.startsWith("rendley-");
app.mount("#app");
```

Then use the tag:

```vue
<template>
  <rendley-video-editor
    licensename="YOUR_LICENSE_NAME"
    licensekey="YOUR_LICENSE_KEY"
    theme="dark"
  />
</template>
```

### Angular

Add `CUSTOM_ELEMENTS_SCHEMA` to your module and call `defineCustomElements` once during app init:

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defineCustomElements } from "@rendley/video-editor-ui/loader";

defineCustomElements();

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}
```

## Verifying the Setup

Once the page loads, the editor shows a loading screen while the SDK initializes. When it's done, you'll see the composition canvas, timeline, and sidebar. If nothing appears:

- Check the browser console for license errors.
- Make sure the parent element has a non-zero height.
- Confirm the CDN URL is reachable (for CDN installs) or that `defineCustomElements()` ran (for npm installs).

## Next Steps

- [Configuration](/video-editor-ui/configuration.md): props, theme, sidebar modules, aspect ratios.
- [Events & Methods](/video-editor-ui/events-and-methods.md): wait for `onReady`, listen for renders, access the Engine.
- [Common Tasks](/video-editor-ui/common-tasks.md): save/load a project, trigger an export, react to media uploads.
