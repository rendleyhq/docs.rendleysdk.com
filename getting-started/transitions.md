# Transitions

Using WebGL, we can create advanced transitions using GLSL shaders that are computed directly on the GPU, ensuring high performance. [Transitions](https://docs.rendleysdk.com/api-reference/classes/Transition.html) are typically applied at the layer level, as they affect clips that reside on the same layer.

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
    properties: {}, // A dictionary of uniforms that can be used in the fragment shader.
  });
```

::: info
The `serializable` property determines whether the transition will be included in the serialized state of the project. If set to false, you'll need to re-load the transition using the [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) callback during project initialization.
:::

Once the transition is added to the Library, you can apply it to a layer. The `addTransition` call returns the instance ID of the new transition, so you can reference it later:

<LiveRun>

```typescript
// 1. Register a simple fade transition in the Library.
const fadeShader = `
vec4 transition(vec2 uv) {
  return mix(getFromColor(uv), getToColor(uv), progress);
}
`;


const libraryTransitionId = await Engine.getInstance()
.getLibrary()
.addTransition({
    id: "fade",
    name: "Fade",
    transitionSrc: fadeShader,
    serializable: true,
  });


// 2. Put two adjacent clips on the same layer.
const first = await layer.addClip({
    type: "shape",
    shape: "rectangle",
    startTime: 0,
    duration: 3,
    style: { fillColor: "#6d6ff2", width: 1200, height: 700 },
  });
first.style.setPosition(960, 540);


const second = await layer.addClip({
    type: "shape",
    shape: "rectangle",
    startTime: 3,
    duration: 3,
    style: { fillColor: "#FF4D6D", width: 1200, height: 700 },
  });
second.style.setPosition(960, 540);


// 3. Insert a transition between them.
layer.addTransition({
    startClipId: first.getId(),
    endClipId: second.getId(),
    inDuration: 1.0, // how much of the first clip the transition takes
    outDuration: 1.0, // how much of the second clip the transition takes
    transitionId: libraryTransitionId,
  });
```

</LiveRun>

::: info
The `inDuration` and `outDuration` are automatically clamped to the trimmed duration of each clip. Adding a transition between two clips where one is already involved in another transition will remove the conflicting transition.
:::

## Updating Transition Properties

Transitions expose the same property interface as effects:

```typescript
const transition = layer.getTransitionById(transitionInstanceId);

transition.setProperty("uRadius", 8.0);
transition.getProperty("uRadius");
```

Changes emit `transition:property_changed` events and, if undo/redo is enabled, are recorded in the [UndoManager](/getting-started/undo-redo.md).

## Removing a Transition

To remove a transition, call the `removeTransition` method with the instance ID returned by `addTransition`:

```typescript
layer.removeTransition(transitionInstanceId);
```

To remove every transition that uses a specific library entry (for example, when the user deletes a transition from the Library):

```typescript
layer.removeAllTransitionsByTransitionId(libraryTransitionId);
```
