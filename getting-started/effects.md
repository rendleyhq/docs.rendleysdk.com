# Effects

Because we are using WebGL, we can use the GLSL shaders to create advanced effects that will be computed directly in the GPU leading to high performance. An effect can be something like making the clip move in waves or even be blured. You can also apply the effects on any of the clips added to the composition.

## Example: Glow Effect

```glsl
precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
const float uAngle = 5.0;
const float uScale = 1.0;
const bool uGrayScale = false;

uniform vec4 inputSize;

float pattern()
{
    float s = sin(uAngle), c = cos(uAngle);
    vec2 tex = vTextureCoord * inputSize.xy;
    vec2 point = vec2(
        c * tex.x - s * tex.y,
        s * tex.x + c * tex.y
    ) * uScale;
    return (sin(point.x) * sin(point.y)) * 4.0;
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec3 colorRGB = vec3(color);

    if (uGrayScale)
    {
        colorRGB = vec3(color.r + color.g + color.b) / 3.0;
    }

    gl_FragColor = vec4(colorRGB * 10.0 - 5.0 + pattern(), color.a);
}
```

## Adding Effects

To create an effect, you have to give it an id and several other parameters.

- The sourceId is used to identify the filter later on.
- The fragmentSrc represents the GLSL code for the effect, similar to the one shown in the example above.
- textureWidth and textureHeight are the width and height of the clip's underlying texture.
- frameWidth and frameHeight are the width and height of the clip's frame, more specifically, of the element you see drawn in the canvas.
- uniforms is a dictionary of uniforms that can be used in the fragment shader.

```typescript
import { Effect } from "@rendley/sdk";

clip.addEffect(
  new Effect({
    sourceId: "randomId",
    fragmentSrc: fragmentSrc,
    textureWidth: clip.sprite.texture.width,
    textureHeight: clip.sprite.texture.height,
    frameWidth: clip.sprite.width / clip.sprite.scale.x,
    frameHeight: clip.sprite.height / clip.sprite.scale.y,
    uniforms: {},
  })
);
```

## Removing Effects

To remove an effect, you have to call the `removeEffect` method with the id of the effect you want to remove

```typescript
clip.removeEffect("randomId");
```

## Built-in Uniforms

We expose several built-in uniforms that you can leverage in your effects, including:

```glsl
uniform float uTime; // current time in seconds
uniform vec2 uDimensions; // clip's frame width and height
```
