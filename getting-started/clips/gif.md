# GIF Clip

The [GifClip](https://docs.rendleysdk.com/api-reference/classes/GifClip.html) renders animated GIFs and is the go-to choice for stickers and other animated visual elements that need transparency.

## Create a GIF Clip

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/sticker.gif");

await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
});
```

## Playback Speed

GIFs support speed changes the same way videos do:

```typescript
gifClip.setPlaybackSpeed(2); // twice as fast
gifClip.setPlaybackSpeed(0.5); // half speed
```

See [Playback Speed & Fades](/getting-started/playback-speed.md) for the full range and caveats.

## Wrap Mode

Control what happens after the animation reaches its end:

```typescript
import { WrapModeEnum } from "@rendley/sdk";

gifClip.setWrapMode(WrapModeEnum.REPEAT); // loop
gifClip.setWrapMode(WrapModeEnum.PING_PONG); // reverse and replay
gifClip.setWrapMode(WrapModeEnum.CLAMP); // freeze on the last frame
gifClip.setWrapMode(WrapModeEnum.EMPTY); // disappear
```

## See Also

- [Image](/getting-started/clips/image.md)
- [Lottie](/getting-started/clips/lottie.md): richer animation authored in After Effects.
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`GifClip`](https://docs.rendleysdk.com/api-reference/classes/GifClip.html)
