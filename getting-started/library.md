# Library

The [Library](https://docs.rendleysdk.com/api-reference/classes/Library.html) is where all uploaded assets, such as: media, filters, effects, transitions, and subtitles are stored and managed. All assets must be uploaded to the Library before they can be referenced in compositions.

::: info
Uploading assets to the Library only loads them into memory. They are not saved to persistent storage or included in the serialized project unless explicitly stored.
:::

## Manage Media

### Add Media to the Library

You can add media from a `string` URL, a `File`, or a `Uint8Array` buffer. `addMedia` returns an id you'll pass to `addClip` when placing the asset on the timeline.

<LiveRun>

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1600",
  );

const clip = await layer.addClip({
  mediaDataId: mediaId,
  startTime: 0,
  duration: 5,
});
clip.style.setPosition(960, 540);
clip.style.setScale(0.6, 0.6);
```

</LiveRun>

You can also specify the MIME type and filename explicitly when the source URL doesn't make them clear:

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(MY_FILE, "image/jpeg", "my-image.jpg");
```

::: info
Without storing the asset, it will not be included in the serialized state. Refer to the [Storage](/getting-started/storage.md) section to learn how to store assets.
:::

### Probe Media

If you want to inspect a media file before adding it to the Library, you can use [`probeMediaData`](https://docs.rendleysdk.com/api-reference/classes/Library.html#probemediadata). It returns metadata such as resolution, codec, duration, and stream information without keeping the file loaded:

```typescript
const info = await Engine.getInstance().getLibrary().probeMediaData(file);
```

### Remove Media from the Library

This method deletes a media asset and also removes all associated clips from the timeline:

```typescript
await Engine.getInstance().getLibrary().deleteMedia(mediaId);
```

### Replace Existing Media

To replace a media asset while preserving its references in the timeline:

```typescript
await Engine.getInstance().getLibrary().replaceMedia(mediaId, MY_FILE);
```

You can use the same data types as with the `addMedia` method: `string`, `File`, and `Uint8Array`. The method also accepts an optional third parameter with replacement options:

```typescript
import { FitStyleEnum } from "@rendley/sdk";

await Engine.getInstance().getLibrary().replaceMedia(mediaId, MY_FILE, {
  mimeType: "video/mp4",
  fit: FitStyleEnum.MATCH_SIZE,
});
```

The [`fit`](https://docs.rendleysdk.com/api-reference/enums/FitStyleEnum.html) option controls how the new media should adapt to the previous size:

- `ORIGINAL`: Do not inherit the previous source size.
- `MATCH_SCALE`: Keep the scale of the clip.
- `OUTSIDE`: Cover the previous frame, cropping if needed.
- `INSIDE`: Fit inside the previous frame, leaving empty space if needed.
- `MATCH_SIZE`: Inherit the previous size by adjusting scale. Useful when downsizing media.

#### From a File Input

A typical UI wiring, the user picks a file, the clip's media is swapped, and the timeline keeps the clip's position and duration:

```typescript
import { FitStyleEnum } from "@rendley/sdk";

async function onFileChosen(mediaId: string, file: File) {
  const ok = await Engine.getInstance()
    .getLibrary()
    .replaceMedia(mediaId, file, {
      fit: FitStyleEnum.MATCH_SIZE,
    });

  if (!ok) {
    console.warn(
      "Replace failed, the new file's type may differ from the original",
    );
  }
}
```

The media id stays the same, so every clip that referenced the old asset now shows the new one. Trim, transforms, effects, filters, and animations all carry over.

### Extract Audio from a Video

You can extract the audio stream from a video file as an independent media data entry. This is useful when you want to edit the audio separately, generate a waveform, or reuse the audio without re-downloading it:

```typescript
const audioMediaId = await Engine.getInstance()
  .getLibrary()
  .extractAudioFromMedia(videoMediaId);
```

If the video has multiple audio tracks, you can pass the track index as a second parameter.

### Sync All Media to Persistent Storage

If one or more Storage Providers are configured, you can use [`syncAllMedia`](https://docs.rendleysdk.com/api-reference/classes/Library.html#syncallmedia) to ensure all providers contain the assets currently referenced by the Library, and to remove orphan assets that the Library no longer uses:

```typescript
await Engine.getInstance().getLibrary().syncAllMedia();
```

::: info
`syncAllMedia` replaces the older [`storeAllMedia`](https://docs.rendleysdk.com/api-reference/classes/Library.html#storeallmedia) method. The old method still exists for backward compatibility.
:::

### Check if the Library is Processing

Some operations, like loading, transcoding, or generating filmstrips, happen asynchronously. Before serializing the project you might want to verify the Library is idle:

```typescript
const isProcessing = Engine.getInstance().getLibrary().isProcessing();
```

For a stronger check that also takes the Engine state into account, use [`Engine.isSafeToSerialize()`](https://docs.rendleysdk.com/api-reference/classes/Engine.html#issafetoserialize).

## Set Custom Metadata for Assets

To attach additional metadata to an asset, which will be included in the serialized state:

```typescript
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);
mediaData.setCustomData("MY_KEY", "MY_VALUE");
```

The [`setCustomData`](https://docs.rendleysdk.com/api-reference/classes/MediaData.html#setcustomdata) method accepts an optional third parameter to determine whether to overwrite the existing data if the key already exists.

## Get Custom Metadata from Assets

To retrieve previously stored custom metadata:

```typescript
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);
const myValue = mediaData.getCustomData("MY_KEY");
```

Custom data is also available on [Engine](https://docs.rendleysdk.com/api-reference/classes/Engine.html), [Library](https://docs.rendleysdk.com/api-reference/classes/Library.html), [Timeline](https://docs.rendleysdk.com/api-reference/classes/Timeline.html), [Layer](https://docs.rendleysdk.com/api-reference/classes/Layer.html), and every [Clip](https://docs.rendleysdk.com/api-reference/classes/Clip.html) through the same `setCustomData`, `getCustomData`, `hasCustomData`, `getAllCustomData`, `clearAllCustomData`, and `setAllCustomData` methods.

## Manage Effects

### Add Effects

```typescript
const effectId = await Engine.getInstance()
  .getLibrary()
  .addEffect({
    id: "my-effect",
    name: "Custom Blur",
    fragmentSrc: "...",
    properties: {
      uRadius: 5.0,
    },
  });
```

### Remove Effects

```typescript
Engine.getInstance().getLibrary().removeEffect(effectId);
```

### Retrieve Built-in Effect IDs

```typescript
const builtInEffectIds = Engine.getInstance()
  .getLibrary()
  .getBuiltInEffectIds();
```

### Retrieve Registered Effect IDs

```typescript
const registeredEffectIds = Engine.getInstance()
  .getLibrary()
  .getRegisteredEffectIds();
```

### Retrieve All Effect IDs

```typescript
const allEffectIds = Engine.getInstance().getLibrary().getAllEffectIds();
```

For the complete list of effects that ship with the SDK, see [Built-in Effects](/getting-started/effects.md#built-in-effects).

## Manage Filters

### Add Filters

```typescript
const filterId = await Engine.getInstance().getLibrary().addFilter({
  id: "my-filter",
  name: "Custom Filter",
  lutUrl: "...",
});
```

### Remove Filters

```typescript
Engine.getInstance().getLibrary().removeFilter(filterId);
```

## Manage Transitions

### Add Transitions

```typescript
const transitionId = await Engine.getInstance()
  .getLibrary()
  .addTransition({
    id: "my-transition",
    name: "Custom Transition",
    transitionSrc: "...",
    properties: {
      uRadius: 5.0,
    },
  });
```

### Remove Transitions

```typescript
Engine.getInstance().getLibrary().removeTransition(transitionId);
```

## Manage Subtitles

### Add Subtitles

```typescript
const srtContent = `
1
00:01:17,757 --> 00:01:18,757
Hello World!
`;

// Convert the SRT content to a Subtitles object
const subtitles = Engine.getInstance()
  .getSubtitlesManager()
  .convertSRTToSubtitles(srtContent);

const subtitlesId = Engine.getInstance().getLibrary().addSubtitles(subtitles);
```

### Remove Subtitles

```typescript
Engine.getInstance().getLibrary().removeSubtitles(subtitlesId);
```

## Serialization

In certain cases, you may choose not to include assets, such as: filters, effects, or transitions in the serialized state. This is common when:

- You want to avoid duplicating shader code across multiple assets.
- You are using custom or dynamically generated assets that cannot be serialized.

To handle this, add assets to the Library with the `serializable: false` flag.

```typescript{7}
const transitionId = await Engine.getInstance()
.getLibrary()
.addTransition({
    id: "my-transition",
    name: "Custom Transition",
    transitionSrc: "...",
    serializable: false,
  });
```

### Handling Missing Assets

When deserializing the project, use the [`onSetupLibrary`](https://docs.rendleysdk.com/api-reference/interfaces/EngineOptions.html#onsetuplibrary) callback during engine initialization. This callback provides the list of missing assets so they can be programmatically reloaded into the Library:

```typescript
import { Engine } from "@rendley/sdk";


await Engine.getInstance().init({
    ...
    onSetupLibrary: async (data) => {
      const { missingEffects, missingFilters, missingTransitions, missingFonts } = data;


      for (const missingEffect of missingEffects) {
        const effect = await getEffectByIdFromMyStorage(missingEffect.id, missingEffect.provider);


        await Engine.getInstance().getLibrary().addEffect({
            id: effect.id,
            name: effect.name,
            fragmentSrc: effect.fragmentSrc,
            properties: effect.properties,
          });
      }
    }
  });
```

Each missing asset object may include a `provider` field to help determine where to retrieve the asset from (e.g., your own storage solution or an external CDN).

```typescript{5}
const filterId = await Engine.getInstance().getLibrary().addFilter({
    id: "my-filter",
    name: "Custom Filter",
    lutUrl: "...",
    provider: "custom-provider",
  });
```

The `missingFonts` array reports fonts referenced by [Text](/getting-started/clips/text.md) and [HTML Text](/getting-started/clips/html-text.md) clips that are not currently registered in the [FontRegistry](/getting-started/fonts.md). You can load them back the same way before the timeline starts rendering.
