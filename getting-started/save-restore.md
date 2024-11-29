# Save & Restore the Project

The SDK supports serialization and deserialization which enables you to store the composition into a database and retreive it later on.

## Serialization

Serialization is the process of transforming the state of the SDK into a JSON.

```typescript
import { Engine } from "@rendley/sdk";

const serialized = Engine.getInstance().serialize();
```

## Deserialization

Deserialization is the process of initializing the SDK from a JSON. It is important that before running the deserialize method, the Engine has been initialized.

```typescript{16}
import { Engine } from "@rendley/sdk";

await Engine.getInstance().init({
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

await Engine.deserialize(serialized);
```

::: tip
Avoid calling the `deserialize` multiple times for reflecting changes in the JSON as this will reinitialize lots of resources and will be a performance hit. Instead, apply just the differences.
:::
