# Effects

With WebGL, we can use GLSL shaders to create advanced [effects](https://docs.rendleysdk.com/api-reference/classes/Effect.html) that are computed directly on the GPU, ensuring high performance. An effect can range from making the clip move in waves to applying a blur. You can apply these effects to any clips added to the composition.

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

## Built-in Effects

The SDK ships with a large collection of built-in effects. They are registered automatically on the Library when the Engine starts and are ready to be attached to any clip.

| **Effect**        | **ID**                      | **Description**                                                            |
| ----------------- | --------------------------- | -------------------------------------------------------------------------- |
| Adjustment        | `builtin-adjustment`        | Brightness, contrast, saturation, hue, vibrance, gamma, temperature, tint. |
| Advanced Bloom    | `builtin-advanced-bloom`    | Bloom with threshold, scale, and brightness.                               |
| ASCII             | `builtin-ascii`             | ASCII art stylization.                                                     |
| Bevel             | `builtin-bevel`             | 3D bevel effect.                                                           |
| Bloom             | `builtin-bloom`             | Simple bloom.                                                              |
| Blur              | `builtin-blur`              | Gaussian blur.                                                             |
| Bulge Pinch       | `builtin-bulge-pinch`       | Bulge or pinch distortion.                                                 |
| Chroma Key        | `builtin-chroma-key`        | Green / blue screen removal with luminosity influence.                     |
| Color Overlay     | `builtin-color-overlay`     | Solid color overlay.                                                       |
| Color Replacement | `builtin-color-replacement` | Replace one color with another.                                            |
| Cross Hatch       | `builtin-cross-hatch`       | Hand-drawn cross-hatch pattern.                                            |
| CRT               | `builtin-crt`               | CRT monitor scanlines and curvature.                                       |
| Dot               | `builtin-dot`               | Dot screen pattern.                                                        |
| Drop Shadow       | `builtin-drop-shadow`       | Drop shadow with color, blur, distance, angle, and alpha.                  |
| Emboss            | `builtin-emboss`            | Emboss effect.                                                             |
| Glow              | `builtin-glow`              | Glow effect with strength and radius.                                      |
| Godray            | `builtin-godray`            | Volumetric light shafts.                                                   |
| HSL Adjustment    | `builtin-hsl-adjustment`    | HSL color controls.                                                        |
| Motion Blur       | `builtin-motion-blur`       | Directional motion blur.                                                   |
| Noise             | `builtin-noise`             | Film grain / noise overlay.                                                |
| Old Film          | `builtin-old-film`          | Vintage film look.                                                         |
| Outline           | `builtin-outline`           | Edge detection outline.                                                    |
| Pixelate          | `builtin-pixelate`          | Pixelation with configurable block size.                                   |
| Radial Blur       | `builtin-radial-blur`       | Radial blur from a center point.                                           |
| Reflection        | `builtin-reflection`        | Reflection / mirror effect.                                                |
| RGB Split         | `builtin-rgb-split`         | Chromatic aberration.                                                      |
| Shockwave         | `builtin-shockwave`         | Animated shockwave distortion.                                             |
| Tilt Shift        | `builtin-tilt-shift`        | Tilt-shift simulated miniature effect.                                     |
| Twist             | `builtin-twist`             | Twist / swirl distortion.                                                  |
| Zoom Blur         | `builtin-zoom-blur`         | Radial zoom blur.                                                          |

### Try a Few Effects

#### Blur

The blur radius is controlled by `strength`.

<LiveRun>

```typescript
const shape = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 600, height: 300 },
});
shape.style.setPosition(960, 540);

shape.addEffect("builtin-blur", { strength: 16 });
```

</LiveRun>

#### Pixelate

Low values produce chunky pixels; high values flatten the image.

<LiveRun>

```typescript
const shape = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 600, height: 300 },
});
shape.style.setPosition(960, 540);

shape.addEffect("builtin-pixelate", { size: [24, 24] });
```

</LiveRun>

#### Drop Shadow

A drop shadow underneath the clip, offset by a `[x, y]` vector in pixels.

<LiveRun>

```typescript
const shape = await layer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 500, height: 300 },
});
shape.style.setPosition(960, 540);

shape.addEffect("builtin-drop-shadow", {
  color: [0, 0, 0],
  alpha: 0.6,
  blur: 8,
  offset: [10, 10],
});
```

</LiveRun>

#### Adjustment

Color-correct on the fly: brightness, contrast, saturation, vibrance, temperature, tint. Every field defaults to its neutral value (`1` for multipliers, `0` for additive controls), so only override what you care about.

<LiveRun setup='const mediaId = await Engine.getInstance().getLibrary().addMedia("https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1600");'>

```typescript
const clip = await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
clip.style.setPosition(960, 540);
clip.style.setScale(0.6, 0.6);

clip.addEffect("builtin-adjustment", {
  brightness: 1.05, // default 1
  contrast: 1.3, // default 1
  saturation: 1.4, // default 1
  temperature: -0.4, // default 0; negative = cooler
  vibrance: 0.8, // default 0
});
```

</LiveRun>

#### RGB Split

A chromatic-aberration look. Separates the red/green/blue channels.

<LiveRun>

```typescript
const clip = await layer.addClip({
  type: "text",
  text: "Glitch",
  startTime: 0,
  duration: 5,
  style: { fontSize: 200, color: "#FFFFFF" },
});
clip.style.setPosition(960, 540);

clip.addEffect("builtin-rgb-split", {
  red: [-10, 0],
  green: [0, 0],
  blue: [10, 0],
});
```

</LiveRun>

### Applying by ID

Any built-in effect can be applied by its id:

```typescript
clip.addEffect("builtin-blur", { strength: 8 });
```

You can also retrieve the full list of built-in IDs at runtime:

```typescript
const ids = Engine.getInstance().getLibrary().getBuiltInEffectIds();
```

::: info
If you self-host the SDK assets, make sure the `sdk/assets/effects_v2` folder is in sync with your version. New effects like `noise` require updated assets.
:::

## Adding Custom Effects

Before applying a custom effect to a clip, you must first add it to the Library:

```typescript
import { Engine } from "@rendley/sdk";

const libraryEffectId = await Engine.getInstance().getLibrary().addEffect({
  id: "randomId",
  name: "Random Effect",
  fragmentSrc, // GLSL shader code
  serializable: true,
  properties: {}, // A dictionary of uniforms that can be used in the fragment shader.
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

## Updating Effect Properties

Each effect on a clip is an instance that can be updated independently:

```typescript
const effect = clip.getEffects()[0];

effect.setProperty("uAngle", 2.0);
const value = effect.getProperty("uAngle");
```

Property changes are undoable (see [Undo / Redo](/getting-started/undo-redo.md)) and can also be animated with the [Property Animator](/getting-started/property-animator.md) using the `effect:{effectInstanceId}:{propertyName}` track key.

## Removing Effects

To remove an effect, call the `removeEffect` method with the ID of the effect instance on the clip:

```typescript
clip.removeEffect(effectInstanceId);
```

## Advanced Configuration

When adding an effect to the Library, you can pass additional Pixi filter properties that control how the shader is applied:

| **Property**  | **Description**                                    |
| ------------- | -------------------------------------------------- |
| `autoFit`     | Automatically fit the output texture to the input. |
| `noTransform` | Skip the transform when applying the filter.       |
| `blendMode`   | Pixi blend mode for the filter pass.               |
| `padding`     | Extra padding around the input texture in pixels.  |

```typescript
await Engine.getInstance().getLibrary().addEffect({
  id: "shadow-effect",
  name: "Shadow",
  fragmentSrc,
  autoFit: false,
  padding: 32,
});
```

## Built-in Uniforms

You can use several built-in uniforms in your effects, including:

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

## Procedural Properties and Texture Inputs

Effects can declare procedural properties (computed on the fly) and additional texture inputs on top of the fragment shader. Texture inputs are declared as regular `sampler2D` uniforms and can be populated from the Library or a custom `HTMLImageElement`/`HTMLVideoElement`.

::: info
Undo/redo of procedural properties and texture inputs is not currently handled. If you need to undo these changes, record them manually through the [`UndoManager`](/getting-started/undo-redo.md).
:::

## Passing Your Own PIXI.Filter

For cases where the GLSL-only format is not enough (for example, multi-pass filters), you can pass your own `PIXI.Filter` instance when adding the effect:

```typescript
import { Pixi } from "@rendley/sdk";

const myFilter = new Pixi.Filter(vertexSrc, fragmentSrc, uniforms);

await Engine.getInstance().getLibrary().addEffect({
  id: "my-custom-effect",
  name: "My Custom Effect",
  filter: myFilter,
});
```

::: warning
Custom filters provided via the `filter` option cannot be serialized. Re-register them through [`onSetupLibrary`](/getting-started/library.md#handling-missing-assets) on deserialization.
:::
