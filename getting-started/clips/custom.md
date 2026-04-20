# Custom Clip

[CustomClip](https://docs.rendleysdk.com/api-reference/classes/CustomClip.html) is the base class you extend to add your own clip types. Custom clips inherit everything the built-in clips get: timing, trimming, transforms, animations, undo/redo, serialization, effects, filters, and masking.

Typical use cases:

- A waveform or spectrum visualizer driven by an audio clip.
- An on-canvas UI element (countdown, progress bar, chart).
- A composite clip that draws several assets together.

## The Hooks You Override

`CustomClip` extends the base [Clip](https://docs.rendleysdk.com/api-reference/classes/Clip.html) class. The hooks you typically override:

| Method                        | When it runs                                         | Do                                                                                  |
| ----------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `constructor(options)`        | When the clip is created.                            | Allocate buffers, create the Pixi sprite and graphics.                              |
| `async init(layerId)`         | After the clip is added to a layer.                  | Kick off async work (e.g. extracting audio from another clip).                      |
| `update(currentTime)`         | On every rendered frame.                             | Redraw based on `currentTime` relative to the clip's time range.                    |
| `serialize()`                 | Whenever the project is saved.                       | Return a plain object that round-trips through your custom data.                    |
| `static deserialize(payload)` | When loading a saved project.                        | Return a new instance of your class from the payload.                               |
| `clone()`                     | When a clip is duplicated.                           | Return a deep copy. `YourClip.deserialize(this.serialize())` is usually enough.     |
| `destroy()`                   | When the clip is removed or the Engine is torn down. | Free any buffers and Pixi objects that garbage collection won't reach.              |

Call `super.<method>(...)` at the top of each override so the base class can do its bookkeeping.

## Sprite and Graphics

The base `Clip` exposes `this.sprite` (a `Pixi.Sprite`). Add your own `Pixi.Graphics`, `Pixi.Text`, or other display objects as children of the sprite so they move, scale, and rotate with the clip's transform.

```typescript
this.sprite = new Pixi.Sprite();
this.graphics = new Pixi.Graphics();
this.sprite.addChild(this.graphics);
```

## Minimal Example

A custom clip that draws a pulsing circle. The circle's radius follows the elapsed time inside the clip.

<LiveRun standalone>

```typescript
import { Engine, CustomClip, Pixi } from "@rendley/sdk";

class PulseClip extends CustomClip {
  static TYPE = "pulse";

  constructor(options) {
    super(options);
    this.sprite = new Pixi.Sprite();
    this.graphics = new Pixi.Graphics();
    this.sprite.addChild(this.graphics);
  }

  update(currentTime) {
    super.update(currentTime);

    const local = currentTime - this.getLeftBound();
    const radius = 180 + Math.sin(local * Math.PI * 2) * 60;

    this.graphics.clear();
    this.graphics.beginFill(0xff4d6d);
    this.graphics.drawCircle(0, 0, radius);
    this.graphics.endFill();
  }

  destroy() {
    super.destroy();
    this.graphics.destroy(true);
  }
}

// Register BEFORE Engine.init so saved projects can restore instances.
Engine.getInstance().registerCustomClip(PulseClip, PulseClip.TYPE);

await Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
    view: document.getElementById("rendley-canvas"),
  },
});

const layer = Engine.getInstance().getTimeline().createLayer();

const clip = Engine.getInstance().createCustomClipInstance(
  PulseClip.TYPE,
  { startTime: 0, duration: 6 },
);
await layer.addClip(clip);
clip.style.setPosition(960, 540);

await Engine.getInstance().getTimeline().play();
```

</LiveRun>

## Serialization

Persist extra state by extending the base `ClipSchema` with Zod and overriding `serialize` / `deserialize`. This also gets you runtime validation when a saved project loads.

```typescript
import { ClipSchema, Zod } from "@rendley/sdk";

const PulseClipSchema = ClipSchema.extend({
  color: Zod.number().optional(),
});

class PulseClip extends CustomClip {
  static TYPE = "pulse";

  constructor(options) {
    super(options);
    this.color = options.color ?? 0xff4d6d;
    // ...sprite / graphics setup
  }

  serialize() {
    return PulseClipSchema.parse({
      ...super.serialize(),
      color: this.color,
    });
  }

  static deserialize(payload) {
    const data = PulseClipSchema.parse(payload);
    return new PulseClip(data);
  }

  clone() {
    return PulseClip.deserialize(this.serialize());
  }
}
```

## Async Setup in `init`

Extracting audio, loading remote assets, or any work that needs the clip's layer id goes in `init`. It runs after the clip is attached to a layer and is awaited by the Engine.

```typescript
class WaveformClip extends CustomClip {
  static TYPE = "waveform";

  constructor(options) {
    super(options);
    this.audioClipId = options.audioClipId;
    this.audioBuffer = null;
    this.sprite = new Pixi.Sprite();
    this.graphics = new Pixi.Graphics();
    this.sprite.addChild(this.graphics);
  }

  async init(layerId) {
    await super.init(layerId);

    const audioClip = Engine.getInstance().getClipById(this.audioClipId);
    if (!audioClip) return;

    // extractMonoAudioData returns a single Float32Array mixed down to mono.
    this.audioBuffer = await audioClip.extractMonoAudioData(
      0,
      audioClip.getDuration(),
    );
  }

  update(currentTime) {
    super.update(currentTime);
    if (!this.audioBuffer) return;

    // Map currentTime to a sample index (44100 Hz) and draw accordingly.
  }
}
```

## Driving Custom Properties with Keyframes

Register your own animatable properties by overriding `registerAnimatableProperties` on the clip. See [Property Animator → Registering Custom Properties](/getting-started/property-animator.md#registering-custom-properties) for the full API.

```typescript
import { PropertyDescriptionTypeEnum } from "@rendley/sdk";

class PulseClip extends CustomClip {
  // ...

  registerAnimatableProperties() {
    super.registerAnimatableProperties();

    this.propertyAnimator.registerProperty({
      key: "amplitude",
      type: PropertyDescriptionTypeEnum.NUMBER,
      get: () => this.amplitude,
      set: (value) => {
        this.amplitude = value;
      },
    });
  }
}
```

Once registered, keyframe `amplitude` the same way as any built-in property:

```typescript
clip.propertyAnimator.addKeyframe("amplitude", 0, 0);
clip.propertyAnimator.addKeyframe("amplitude", 2, 1);
```

## Performance Tips

- **Cache `lineStyle` calls.** `Pixi.Graphics.lineStyle(...)` is expensive. Call it once outside tight loops and mutate `this.graphics.line.color` per segment.
- **Compute colors yourself.** `new Pixi.Color(...)` does validations and conversions. For per-frame inner loops, pack RGB into a `0xRRGGBB` integer manually.
- **Reuse typed arrays.** Allocate FFT, sample, and output buffers once in the constructor. Don't allocate per frame.
- **Invalidate intentionally.** The base `Clip` caches `lastUpdatedFrame` and skips redundant work. If your clip depends on something outside time (external data, user input), set `this.lastUpdatedFrame = Number.MIN_VALUE` to force a redraw.

## See Also

- [Property Animator → Custom Properties](/getting-started/property-animator.md#registering-custom-properties): expose custom properties to keyframe animation.
- [Filmstrip & Waveforms](/getting-started/filmstrip.md): higher-level audio sample access for simpler cases.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`CustomClip`](https://docs.rendleysdk.com/api-reference/classes/CustomClip.html), [`Clip`](https://docs.rendleysdk.com/api-reference/classes/Clip.html)
