# Effects

With WebGL, we can utilize GLSL shaders to create advanced effects that are computed directly on the GPU, ensuring high performance. An effect can range from making the clip move in waves to applying a blur. You can apply these effects to any clips added to the composition.

## Example: Glow Effect

Here’s an example of a GLSL shader for a glow effect:

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

## Adding Effects

To create an effect, provide an ID and several parameters:

- **sourceId**: A unique identifier for the effect.
- **fragmentSrc**: The GLSL code for the effect (similar to the example above).
- **textureWidth** and **textureHeight**: The width and height of the clip's underlying texture.
- **frameWidth** and **frameHeight**: The dimensions of the clip's frame, specifically the element drawn on the canvas.
- **uniforms**: A dictionary of uniforms that can be used in the fragment shader.

Here’s how to add an effect:

```typescript
import { Effect } from "@rendley/sdk";

clip.addEffect(
  new Effect({
    sourceId: "randomId", // Unique identifier for the effect
    fragmentSrc: fragmentSrc, // GLSL code for the effect
    textureWidth: clip.sprite.texture.width, // Width of the underlying texture
    textureHeight: clip.sprite.texture.height, // Height of the underlying texture
    frameWidth: clip.sprite.width / clip.sprite.scale.x, // Width of the clip's frame
    frameHeight: clip.sprite.height / clip.sprite.scale.y, // Height of the clip's frame
    uniforms: {}, // Dictionary of uniforms
  })
);
```

## Removing Effects

To remove an effect, call the `removeEffect` method with the ID of the effect you wish to remove:

```typescript
clip.removeEffect("randomId");
```

## Built-in Uniforms

You can leverage several built-in uniforms in your effects, including:

```glsl
uniform float uTime; // Current time in seconds
uniform vec2 uDimensions; // Clip's frame width and height
```
