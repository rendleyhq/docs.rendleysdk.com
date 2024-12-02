# Engine

The [Engine](/api-reference/classes/Engine.html) is the main entry point for our SDK. It is a singleton instance, ensuring that only one instance of the Engine exists at any given time.

It is responsible for initializing the SDK, serializing the project's output, loading new projects, and providing getters for easy access to other parts of the system.

## Initialization

To initialize the Engine, you need to provide a license and a display configuration. You can obtain a license by visiting [our website](https://app.rendley.com/).

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
Initializing the Engine is a mandatory step before using the SDK. However, initializing it multiple times without destroying the previous instance will result in an error.
:::

## Destroying

Because the Engine is a singleton, there will always be a single instance available in memory. For use cases where you want to reset the state of the SDK, you can use the `destroy` method.

```typescript
Engine.getInstance().destroy();
```

If you want to destroy all underlying modules, reset the WebGL context, unload fonts, and destroy storage providers, you can do it like this:

```typescript
Engine.getInstance().destroy(true);
```
