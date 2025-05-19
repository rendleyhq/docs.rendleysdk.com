# Effects

With WebGL, we can utilize GLSL shaders to create advanced [effects](https://docs.rendley.com/api-reference/classes/Effect.html) that are computed directly on the GPU, ensuring high performance. An effect can range from making the clip move in waves to applying a blur. You can apply these effects to any clips added to the composition.

::: details Example: Glow Effect {open}

```glsl
precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
const float uAngle = 5.0;
const float uScale = 1.0;
const bool uGrayScale = false;

uniform vec4 inputSize;

float pattern() {
    float s = sin(uAngle), c = cos(uAngle);
    vec2 tex = vTextureCoord * inputSize.xy;
    vec2 point = vec2(
        c * tex.x - s * tex.y,
        s * tex.x + c * tex.y
    ) * uScale;
    return (sin(point.x) * sin(point.y)) * 4.0;
}

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec3 colorRGB = vec3(color);

    if (uGrayScale) {
        colorRGB = vec3(color.r + color.g + color.b) / 3.0;
    }

    gl_FragColor = vec4(colorRGB * 10.0 - 5.0 + pattern(), color.a);
}
```

:::

## Adding Effects

Before applying an effect to a clip, you must first add it to the Library:

```typescript
import { Engine } from "@rendley/sdk";

const libraryEffectId = await Engine.getInstance().getLibrary().addEffect({
  id: "randomId",
  name: "Random Effect",
  fragmentSrc, // // GLSL shader code
  serializable: true,
  properties: {}, //  A dictionary of uniforms that can be used in the fragment shader.
});
```

::: info
The `serializable` property determines whether the effect will be included in the serialized state of the project. If set to false, you'll need to re-load the effect using the [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) callback during project initialization.
:::

Once added to the Library, you can apply the effect to a clip:

```typescript
clip.addEffect(libraryEffectId);
```

You can also pass initial values for uniforms when applying the effect:

```typescript
clip.addEffect(libraryEffectId, {
  uAngle: 5.0,
});
```

## Removing Effects

To remove an effect, call the `removeEffect` method with the ID of the effect you wish to remove:

```typescript
clip.removeEffect("randomId");
```

## Built-in Uniforms

You can leverage several built-in uniforms in your effects, including:

| **Uniform**   | **Type**    | **Description**                                                               |
| ------------- | ----------- | ----------------------------------------------------------------------------- |
| `uTime`       | `float`     | Time in seconds since the clip's startTime                                    |
| `uSampler`    | `sampler2D` | The source texture to which the effect is being applied.                      |
| `outputFrame` | `vec4`      | The output frame's x, y, width, and height in pixels.                         |
| `inputSize`   | `vec4`      | Dimensions of the input texture: `(width, height, 1/width, 1/height)`.        |
| `resolution`  | `vec2`      | The resolution is the ratio of screen (CSS) pixels to real pixels.            |
| `inputPixel`  | `vec4`      | Pixel size of the input: `(1/width, 1/height, width, height)`.                |
| `inputClamp`  | `vec4`      | Clamping boundaries for the input texture to prevent sampling outside bounds. |

You can learn more about these uniforms [here](https://pixijs.download/v6.0.1/docs/PIXI.Filter.html).
