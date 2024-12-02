# Save & Restore the Project

The SDK supports serialization and deserialization, enabling you to store the composition in a database and retrieve it later.

## Serialization

Serialization is the process of transforming the state of the SDK into JSON format. This allows you to save the current configuration and state of your project.

```typescript
import { Engine } from "@rendley/sdk";

const serialized = Engine.getInstance().serialize();
```

::: info
The serialized state includes a schema version, which is used to ensure backward compatibility.
:::

## Deserialization

Deserialization initializes the SDK from a JSON object. It is important to ensure that the Engine has been initialized before running the `deserialize` method.

```typescript
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
Avoid calling `deserialize` multiple times to reflect changes in the JSON, as this will reinitialize many resources and may negatively impact performance. Instead, apply only the differences when necessary.
:::
