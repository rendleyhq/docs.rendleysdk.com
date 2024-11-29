# Transitions

Because we are using WebGL, we can use the GLSL shaders to create advanced transitions that will be computed directly in the GPU leading to high performance. Transitions are usually applied at the layer level because they compute clips that are on the same level.

## Example: Cross Fade Transition

```glsl
vec4 transition(vec2 uv) {
  return mix(getFromColor(uv), getToColor(uv), progress);
}
```

## Adding Transition

To create a transition, you need to provide the following parameters:

- startClipId: The ID of the clip on the left side of the transition.
- endClipId: The ID of the clip on the right side of the transition.
- inDuration and outDuration: These values represent how much time the transition should take when it's inside the startClip or endClip, respectively. A value of 1000, for example, would mean the transition takes 1 second to complete.
- transitionSrc: This is the GLSL code that defines the transition effect, in our case it will be the cross fade example from above

```typescript
import { Transition } from "@rendley/sdk";

const crossFadeTransition = new Transition({
  name: "Cross Fade",
  startClipId,
  endClipId,
  inDuration: 1000,
  outDuration: 1000,
  transitionSrc: crossFadeShaderSrc,
});

layer.addTransition(crossFadeTransition);
```

## Removing Transition

To remove a transition, you have to call the `removeTransition` method with the id of the transition you want to remove

```typescript
layer.removeTransition(crossFadeTransition.id);
```
