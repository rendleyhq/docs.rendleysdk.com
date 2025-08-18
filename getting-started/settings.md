# Settings

You can configure global [settings](https://docs.rendleysdk.com/api-reference/classes/Settings.html) for the Rendley SDK, including output format, bitrate, decoding acceleration, and more.

## Show Rendering Preview

If you prefer not to display frames as they are being rendered on the canvas, set the `setShowRenderPreview` property to `false`. By default, frames will be displayed.

```typescript
Engine.getInstance().getSettings().setShowRenderPreview(false);
```

## Rendering Videos with Alpha

To render videos that include an alpha channel, you need to use a codec that supports alpha, such as VP8 or VP9. Note that this feature is not supported by WebCodecs, so you'll need to switch to our WASM-based rendering approach.

```typescript
Engine.getInstance().getSettings().setEncoderUseWebCodecs(false);
Engine.getInstance().getSettings().setEncoderUseAlpha(true);
Engine.getInstance().getSettings().setEncoderCodec("vp8");
```

## Changing the Bitrate

To modify the encoding bitrate, use the following code:

```typescript
Engine.getInstance().getSettings().setEncoderBitrate(1000000);
```

## Changing the Encoder Codec

To change the encoder codec, you can do the following:

```typescript
Engine.getInstance().getSettings().setEncoderCodec("vp8");
```

## Changing the Encoding CRF

To adjust the Constant Rate Factor (CRF), use this code:

```typescript
Engine.getInstance().getSettings().setEncoderCrf(24);
```

## Changing Encoding and Decoding Acceleration

If you want to control the encoding and decoding acceleration, you can specify your preferences as follows:

```typescript
Engine.getInstance()
  .getSettings()
  .setDecoderPreferredAcceleration("prefer-hardware");

Engine.getInstance()
  .getSettings()
  .setEncoderPreferredAcceleration("prefer-software");
```

## Audio Mixing in Web Worker

Audio mixing is done inside a Web Worker by default. If you want to disable this and do it on the main thread, you can set the following:

```typescript
Engine.getInstance().getSettings().setRenderAudioUseWorker(false);
```

## Show Preview while Rendering

If you prefer not to display frames as they are being rendered on the canvas, set the `setRenderShowPreview` property to `false`. By default, frames will be displayed.

```typescript
Engine.getInstance().getSettings().setRenderShowPreview(false);
```

## Change Video Layout on Resize

If you want the layout of the video adapt automatically when changing the resolution, you can consider using the `setViewAutoLayoutOnResize` method. It will resize and reposition the elements to fit the new resolution. The list of available modes can be found [here](/api-reference/enums/AutoLayoutMode.html).

```typescript
Engine.getInstance()
  .getSettings()
  .setViewAutoLayoutOnResize(AutoLayoutMode.BOTH);
```

## Change Subtitles Wrap Width on Resize

If you want the subtitles automatically wrap to the width of the video when changing the resolution, you can consider using the `setSubtitlesAutoWrapOnResize` method. It will resize the subtitles to fit the new resolution.

```typescript
Engine.getInstance().getSettings().setSubtitlesAutoWrapOnResize(true);
```

## Change Subtitles Scale on Resize

If you want the subtitles to automatically scale when changing the resolution, you can consider using the `setSubtitlesScaleOnResize` method. It will scale the subtitles to fit the new resolution.

```typescript
Engine.getInstance().getSettings().setSubtitlesScaleOnResize(true);
```
