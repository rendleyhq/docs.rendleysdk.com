# Engine

The Engine is the main entry point for our SDK. It is a singleton instance, ensuring that there can only be one instance of the engine available at any given time.

It is responsible for initializing the SDK, serializing the project's output, for loading a new project, and has getters for other parts of the system for easy access.

## Initialization

To initialize the Engine, you need to provide a license and a display configuration. You can obtain one by visiting [our website](https://app.rendley.com/).

```typescript{5-6}
import { Engine } from "@rendley/sdk";

const engine = Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
  }
});
```

::: warning
Initializing the Engine is a mandatory step before using the SDK. However, initializing it multiple times without having destroyed it previously will given you an error.
:::

## Destroying

Because the Engine is a singlethon, there will always a single instance available in the memory. For use cases where you want to reset the state of the SDK, you can use the destroy method.

```typescript
Engine.getInstance().destroy();
```

If you want to destroy all the underlying modules, reset the WebGL context, unload the fonts, and destroy the storage providers, you can do it like this:

```typescript
Engine.getInstance().destroy(true);
```
