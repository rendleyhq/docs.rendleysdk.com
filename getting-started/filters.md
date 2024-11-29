# Filters

Our filters work based on LUTs (Lookup Tables), which enables you to have a high level of control over the color grading process. LUTs are widely used in the cinematic industry and can also be exported from tools like Adobe Photoshop.

If you are wondering how does a LUT look like, here is an example

In Progress 🚧

## Adding Filters

To create a filter, you have to give it an id and the path to the LUT file. The id is used to identify the filter later on.

```typescript
import { Filter } from "@rendley/sdk";

clip.addFilter(
  new Filter({
    sourceId: "randomId",
    lutUrl: "/path/to/lut.jpeg",
  })
);
```

## Removing Filters

To remove a filter, you have to call the `removeFilter` method with the id of the filter you want to remove

```typescript
clip.removeFilter("randomId");
```

## Create a LUT

In Progress 🚧
