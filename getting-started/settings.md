# Settings

We enable you to configure global settings for the SDK, including the output format, bitrate, decoding acceleration and more.

## Show rendering preview

If you don't want the canvas to display frames as they are being rendered, set the `setShowRenderPreview` property to false, otherwise, it will display the frames;

```typescript
Engine.getInstance().getSettings().setShowRenderPreview(false);
```

## Rendering videos with alpha

If you want to render videos that have an alpha channel, you would have to render to a codec that supports alpha, such as VP8 or VP9. Also, this is not something that WebCodecs supports, which means that you have to switch to our WASM based rendering approached.

```typescript
Engine.getInstance().getSettings().setEncoderUseWebCodecs(false);
Engine.getInstance().getSettings().setEncoderUseAlpha(true);
Engine.getInstance().getSettings().setEncoderCodec("vp8");
```

## Changing the bitrate

To change the encoding bitrate, you can do the following:

```typescript
Engine.getInstance().getSettings().setEncoderBitrate(1000000);
```

## Changing the encoder codec

To change the encoder codec, you can do the following:

```typescript
Engine.getInstance().getSettings().setEncoderCodec("vp8");
```

## Changing the encoding CRF

To change the Constant Rate Factor, you can do the following:

```typescript
Engine.getInstance().getSettings().setEncoderCrf(24);
```

## Changing encoding and decoding acceleration

There are use cases where you would like to have control over the encoding and decoding acceleration. You can do it as follows:

```typescript
Engine.getInstance()
  .getSettings()
  .setDecoderPreferredAcceleration("prefer-hardware");

Engine.getInstance()
  .getSettings()
  .setEncoderPreferredAcceleration("prefer-software");
```
