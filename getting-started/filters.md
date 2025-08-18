# Filters

Our [filters](https://docs.rendleysdk.com/api-reference/classes/Filter.html) utilize **Lookup Tables (LUTs)**, offering precise control over the color grading process. LUTs are widely used in the cinematic industry and can be exported from tools like Adobe Photoshop.

## Adding Filters

Before applying a filter to a clip, you must first add it to the [Library](/getting-started/library.md):

```typescript
import { Engine } from "@rendley/sdk";

const libraryFilterId = await Engine.getInstance().getLibrary().addFilter({
  id: "randomId",
  name: "filterName",
  lutUrl: "/path/to/lut.jpeg",
  serializable: true,
});
```

::: info
The `serializable` property determines whether the filter is included in the serialized state of the project. If set to `false`, you will need to reload the filter during project initialization using the [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) callback.
:::

Once added to the Library, the filter can be applied to any clip by referencing its ID:

```typescript
clip.addFilter(libraryFilterId);
```

## Removing Filters

```typescript
clip.removeFilter(filterId);
```

## Adjust Filter Intensity

To adjust the strength of the applied filter, use the [`setIntensity`](https://docs.rendleysdk.com/api-reference/classes/Filter.html#setintensity) method:

```typescript
const filter = clip.getFilters()[0];
filter.setIntensity(0.5);
```

<!-- ## Create a LUT

_In Progress 🚧_ -->
