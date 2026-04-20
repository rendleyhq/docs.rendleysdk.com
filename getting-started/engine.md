# Engine

The [Engine](https://docs.rendleysdk.com/api-reference/classes/Engine.html) is the main entry point for our SDK. It is a singleton instance, ensuring that only one instance of the Engine exists at any given time.

It is responsible for initializing the SDK, serializing the project's output, loading new projects, and providing getters for easy access to other parts of the system.

## Initialization

To initialize the Engine, you need to provide a license and a display configuration. You can obtain a license by visiting [our website](https://app.rendleysdk.com/).

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

## Init Options

The [`init`](https://docs.rendleysdk.com/api-reference/classes/Engine.html#init) method accepts a number of options beyond the license and display:

| **Option**         | **Description**                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `license`          | License credentials and validation mode. See [License Validation](#license-validation).                                                                                  |
| `display`          | Display configuration. See [Display](/getting-started/display.md).                                                                                                       |
| `storages`         | Array of storage providers. See [Storage](/getting-started/storage.md).                                                                                                  |
| `transcoder`       | Custom transcoder implementation.                                                                                                                                        |
| `ffmpeg`           | Custom FFmpeg WASM path or instance.                                                                                                                                     |
| `enableUndoRedo`   | Enables the [UndoManager](/getting-started/undo-redo.md) at startup. Disabled by default.                                                                                |
| `forcedSettings`   | Settings overrides that take precedence over serialized project settings.                                                                                                |
| `onSetupLibrary`   | Callback invoked during deserialization to resolve missing effects, filters, transitions, and fonts. See [Library](/getting-started/library.md#handling-missing-assets). |
| `dataHashFunction` | Custom hash function for media content.                                                                                                                                  |
| `antialias`        | Canvas antialiasing mode: `NONE`, `MSAA` (default), or `FXAA`.                                                                                                           |

## Checking Readiness

The Engine performs asynchronous setup during initialization and deserialization. Use these helpers to check its state:

```typescript
Engine.getInstance().isInitialized(); // true after init() resolves
Engine.getInstance().isReady(); // true when nothing is loading
Engine.getInstance().isSafeToSerialize(); // true when ready and not processing media
```

Serializing before `isSafeToSerialize()` returns `true` can produce incomplete JSON (for example, media that is still being transcoded or hashed).

## SDK Version

To retrieve the currently installed SDK version:

```typescript
const version = Engine.getSDKVersion();
```

## Project ID

The Engine stores assets in storage providers using the project id as a namespace. The id is generated automatically on init but you can change it afterwards:

```typescript
await Engine.getInstance().setProjectId("my-project-id");
```

Changing the project id causes the storage layer to reinitialize against the new namespace.

## Resetting the Engine

If you want to clear the current composition and reset the Engine state without fully destroying it, use [`reset`](https://docs.rendleysdk.com/api-reference/classes/Engine.html#reset):

```typescript
await Engine.getInstance().reset();
```

This clears all layers, clips, and Library assets, then loads an empty project.

## Capturing a Frame

To extract the current frame, or the frame at a specific time, as a base64 image:

```typescript
const image = await Engine.getInstance().getFrameAsBase64Image(
  2.5, // time in seconds (optional, defaults to current time)
  "image/jpeg", // mime type: "image/jpeg" | "image/webp" | "image/png"
  0.9, // quality between 0 and 1 (only for lossy formats)
);
```

This is useful for generating thumbnails, previews, or social sharing images.

## Destroying

Because the Engine is a singleton, there will always be a single instance available in memory. For use cases where you want to reset the state of the SDK, you can use the `destroy` method.

```typescript
Engine.getInstance().destroy();
```

If you want to destroy all underlying modules, reset the WebGL context, unload fonts, and destroy storage providers, you can do it like this:

```typescript
Engine.getInstance().destroy(true);
```

## License Validation

The SDK performs license validation directly on the device, eliminating concerns about server downtime or latency during the validation process.

### Local Validation

The easiest way to use the license is to specify the `licenseName` and `licenseKey` during license initialization.

::: warning
With local validation **you must update the license key in your code with every payment cycle**. If you forget, the SDK stops validating and every render call throws. Use [Remote Validation](#remote-validation) if you want the key rotated automatically.
:::

```typescript{3-4}
const engine = Engine.getInstance().init({
    license: {
      licenseName: "YOUR_LICENSE_NAME",
      licenseKey: "YOUR_LICENSE_KEY",
    },
    ...
  });
```

### Remote Validation

Remote validation is designed for companies that prefer not to manually update the license key with every payment cycle. In these scenarios, you can enable `enableRemoteValidation` during license initialization, which will use our server to retrieve the current license key. If the endpoint fails to return data, the system will fall back to the license key specified during initialization.

```typescript{3}
const engine = Engine.getInstance().init({
    license: {
      enableRemoteValidation: true,
      licenseName: "YOUR_LICENSE_NAME",
      licenseKey: "YOUR_LICENSE_KEY", // Optional
    },
    ...
  });
```

### Sublicense Validation

Sublicense validation is intended for companies using the SDK across multiple subdomains. In such cases, you can enable `isSublicense` during license initialization, allowing the system to retrieve the corresponding license.

```typescript{3-5}
const engine = Engine.getInstance().init({
    license: {
      enableRemoteValidation: true,
      isSublicense: true,
      licenseName: "YOUR_LICENSE_NAME",
    },
    ...
  });
```

::: info
If you need to support multiple subdomains, please contact us at support@rendleysdk.com for assistance in setting it up.
:::
