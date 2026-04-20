# Filters

Our [filters](https://docs.rendleysdk.com/api-reference/classes/Filter.html) use **Lookup Tables (LUTs)**, offering precise control over the color grading process. LUTs are widely used in the cinematic industry and can be exported from tools like Adobe Photoshop.

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

<LiveRun>

```typescript
// Load a photo and apply the first filter from Rendley's public filter pack.
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1600",
  );

const clip = await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
clip.style.setPosition(960, 540);
clip.style.setScale(0.6, 0.6);

// Fetch the filter manifest and use the first entry.
const filtersRoot = "https://cdn.rendleysdk.com/sdk/assets/filters/";
const manifest = await fetch(filtersRoot + "filters.json").then((r) =>
  r.json(),
);
const first = manifest.filters[0];

const filterId = await Engine.getInstance()
  .getLibrary()
  .addFilter({
    id: first.id,
    name: first.name,
    lutUrl: filtersRoot + first.path + "lut.png",
    serializable: true,
  });

clip.addFilter(filterId);
```

</LiveRun>

## Removing Filters

`removeFilter` takes the filter instance id (returned by `addFilter` on the clip or via `getFilters()[index].getId()`):

```typescript
const instanceId = clip.getFilters()[0].getId();
clip.removeFilter(instanceId);
```

## Adjust Filter Intensity

To adjust the strength of the applied filter, use the [`setIntensity`](https://docs.rendleysdk.com/api-reference/classes/Filter.html#setintensity) method:

```typescript
const filter = clip.getFilters()[0];
filter.setIntensity(0.5);
```

Filter intensity is animatable through the [Property Animator](/getting-started/property-animator.md#animating-effects-and-filters) using the `filter:{instanceId}:intensity` track key.

## Built-in Native Filters

The SDK exposes a small set of native filters backed by built-in Pixi filters. They do not require a LUT. The first one available is [BuiltInBlurEffect](https://docs.rendleysdk.com/api-reference/classes/BuiltInBlurEffect.html), a Gaussian blur:

```typescript
clip.addEffect("builtin-blur", { blur: 8 });
```

More native filters are available in the [built-in effects list](/getting-started/effects.md#built-in-effects).
