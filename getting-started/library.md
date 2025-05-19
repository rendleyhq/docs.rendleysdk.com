# Library

The [Library](https://docs.rendley.com/api-reference/classes/Library.html) is where all uploaded assets, such as: media, filters, effects, transitions, and subtitles are stored and managed. All assets must be uploaded to the Library before they can be referenced in compositions.

::: info
Uploading assets to the Library only loads them into memory. They are not saved to persistent storage or included in the serialized project unless explicitly stored.
:::

## Manage Media

### Add Media to the Library

You can add media from a `string` URL, a `File`, or a `Uint8Array` buffer:

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia("https://example.com/image.jpg");
```

You can also specify the MIME type explicitly:

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(MY_FILE, "image/jpeg");
```

::: info
Without storing the asset, it will not be included in the serialized state. Refer to the [Storage](/getting-started/storage.md) section to learn how to store assets.
:::

### Remove Media from the Library

This method deletes a media asset and also removes all associated clips from the timeline:

```typescript
await Engine.getInstance().getLibrary().removeMedia(mediaId);
```

### Replace Existing Media

To replace a media asset while preserving its references in the timeline:

```typescript
await Engine.getInstance().getLibrary().replaceMedia(mediaId, MY_FILE);
```

You can use the same data types as with the `addMedia` method: `string`, `File`, and `Uint8Array`. The method also accepts an optional third parameter for the MIME type.

### Store All Media to Persistent Storage

If a Storage Provider is configured, you can use the `storeAllMedia` method to store all media assets persistently:

```typescript
await Engine.getInstance().getLibrary().storeAllMedia();
```

::: info
[`storeAllMedia`](https://docs.rendley.com/api-reference/classes/Library.html#storeallmedia) stores only those assets that have not already been uploaded. Learn how to configure storage [here](/getting-started/storage.md).
:::

## Set Custom Metadata for Assets

To attach additional metadata to an asset, which will be included in the serialized state:

```typescript
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);
mediaData.setCustomData("MY_KEY", "MY_VALUE");
```

The [`setCustomData`](https://docs.rendley.com/api-reference/classes/MediaData.html#setcustomdata) method accepts an optional third parameter to determine whether to overwrite the existing data if the key already exists.

## Get Custom Metadata from Assets

To retrieve previously stored custom metadata:

```typescript
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);
const myValue = mediaData.getCustomData("MY_KEY");
```

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

When deserializing the project, use the [`onSetupLibrary`](https://docs.rendley.com/api-reference/interfaces/EngineOptions.html#onsetuplibrary) callback during engine initialization. This callback provides the list of missing assets so they can be programmatically reloaded into the Library:

```typescript
import { Engine } from "@rendley/sdk";

await Engine.getInstance().init({
  ...
  onSetupLibrary: async (data) => {
    const { missingEffects, missingFilters, missingTransitions } = data;

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
