# Filters

Our [filters](https://docs.rendley.com/api-reference/classes/Filter.html) utilize LUTs, giving you high control over the color grading process. LUTs are widely used in the cinematic industry and can be exported from tools like Adobe Photoshop.

## Adding Filters

Before applying a filter to a clip, it must first be added to the Library:

```typescript
import { Engine } from "@rendley/sdk";

const libraryFilterId = await Engine.getInstance().getLibrary().addFilter({
  id: "randomId"
  name: "filterName"
  lutUrl: "/path/to/lut.jpeg",
  serializable: true,
});
```

::: info
The `serializable` property determines whether the filter will be included in the serialized state of the project. If set to false, you'll need to re-load the filter using the [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) callback during project initialization.
:::

Once added to the Library, you can reference the filter by its ID and apply it to any clip:

```typescript
clip.addFilter(libraryFilterId);
```

## Adjust Filter Intensity

You can modify the strength of the filter applied to a clip using the `setIntensity` method:

```typescript
const filter = clip.getFilters()[0];
filter.setIntensity(0.5);
```

## Removing Filters

To remove a filter, call the `removeFilter` method with the ID of the filter you want to remove:

```typescript
clip.removeFilter("randomId");
```

<!-- ## Create a LUT

_In Progress 🚧_ -->
