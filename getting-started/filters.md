# Filters

Our [filters](/api-reference/classes/Filter.html) utilize LUTs, giving you high control over the color grading process. LUTs are widely used in the cinematic industry and can be exported from tools like Adobe Photoshop.

## Adding Filters

To create a filter, provide an ID and the path to the LUT file. The ID is used to identify the filter later on.

```typescript
import { Filter } from "@rendley/sdk";

clip.addFilter(
  new Filter({
    sourceId: "randomId", // Unique identifier for the filter
    lutUrl: "/path/to/lut.jpeg", // Path to the LUT file
  })
);
```

## Removing Filters

To remove a filter, call the `removeFilter` method with the ID of the filter you want to remove:

```typescript
clip.removeFilter("randomId"); // Remove the filter with the specified ID
```

<!-- ## Create a LUT

_In Progress 🚧_ -->
