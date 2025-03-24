# Transitions

Utilizing WebGL, we can create advanced transitions using GLSL shaders that are computed directly on the GPU, ensuring high performance. [Transitions](https://docs.rendley.com/api-reference/classes/Transition.html) are typically applied at the layer level, as they affect clips that reside on the same layer.

::: details Example: Cross Fade Transition

```glsl
vec4 transition(vec2 uv) {
  return mix(getFromColor(uv), getToColor(uv), progress);
}
```

:::

## Adding a Transition

To create a transition, you need to provide the following parameters:

- **startClipId**: The ID of the clip on the left side of the transition.
- **endClipId**: The ID of the clip on the right side of the transition.
- **inDuration**: The duration (in seconds) for how long the transition should take when it's inside the `startClip`. For example, a value of `1` means the transition takes 1 second to complete.
- **outDuration**: The duration (in seconds) for how long the transition should take when it's inside the `endClip`.
- **transitionSrc**: The GLSL code that defines the transition effect, which, in this case, will be the cross fade example shown above.

Here’s how to add a transition:

```typescript
import { Transition } from "@rendley/sdk";

const crossFadeTransition = new Transition({
  name: "Cross Fade", // Name of the transition
  startClipId, // ID of the starting clip
  endClipId, // ID of the ending clip
  inDuration: 1, // Duration of the transition in the start clip
  outDuration: 1, // Duration of the transition in the end clip
  transitionSrc: crossFadeShaderSrc, // GLSL code for the transition
});

// Add the transition to the layer
layer.addTransition(crossFadeTransition);
```

## Removing a Transition

To remove a transition, call the `removeTransition` method with the ID of the transition you want to remove:

```typescript
layer.removeTransition(crossFadeTransition.id);
```
