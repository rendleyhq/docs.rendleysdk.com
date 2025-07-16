# Transitions

Utilizing WebGL, we can create advanced transitions using GLSL shaders that are computed directly on the GPU, ensuring high performance. [Transitions](https://docs.rendley.com/api-reference/classes/Transition.html) are typically applied at the layer level, as they affect clips that reside on the same layer.

::: details Example: Cross Fade Transition {open}

```glsl
vec4 transition(vec2 uv) {
  return mix(getFromColor(uv), getToColor(uv), progress);
}
```

:::

## Adding a Transition

Before applying a transition to clips, you must first load it into the Library:

```typescript
import { Engine } from "@rendley/sdk";

const libraryTransitionId = await Engine.getInstance()
  .getLibrary()
  .addTransition({
    id: "randomId",
    name: "Random Transition",
    transitionSrc: shaderSrc, // GLSL code for the transition
    serializable: true,
    properties: {}, //  A dictionary of uniforms that can be used in the fragment shader.
  });
```

::: info
The `serializable` property determines whether the transition will be included in the serialized state of the project. If set to false, you'll need to re-load the transition using the [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) callback during project initialization.
:::

Once the transition is added to the Library, you can apply it to a layer:

```typescript
const layer = Engine.getInstance().getTimeline().getLayerById(layerId);

layer.addTransition({
  startClipId: "clipA",
  endClipId: "clipB",
  inDuration: 1.0, // Duration in seconds within the start clip
  outDuration: 1.0, // Duration in seconds within the end clip
  transitionId: libraryTransitionId,
});
```

## Removing a Transition

To remove a transition, call the `removeTransition` method with the ID of the transition you want to remove:

```typescript
layer.removeTransition("randomId");
```
