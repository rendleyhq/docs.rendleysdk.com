# Library

The [Library](https://docs.rendley.com/api-reference/classes/Library.html) is where all uploaded assets (clips, filters, effects, transitions) are stored. When you upload an image, a video or a filter, you add it to the Library and then reference it when creating a clip. The Library also stores SRT files in case you upload any.

Before using any asset in a composition, you must upload it to the Library first.

## Add Assets to the Library

Adding an asset to the Library will not save it to storage, it will only load it into memory. Additionally, when serializing the project, you will not find the video included.

You can add an asset to the Library using the following formats: <u>String</u>, <u>File</u>, and <u>UInt8Array</u> buffer.

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=500"
  );
```

Additionally, you can pass a second argument to the `addMedia` method to help identify the MIME type correctly for use cases where it cannot be inferred from the source.

> [!NOTE]
> Without storing the asset, it will not be included in the serialized state. Check the [Storage](/getting-started/storage.md) section to learn how to store the assets.

## Remove Assets from the Library

Deleting an asset from the Library will also remove any associated clips. This is done to avoid playback issues. To remove an asset from the Library, you can use the following:

```typescript
await Engine.getInstance().getLibrary().removeMedia(mediaId);
```

## Replace an Asset with Another

If you want the user to replace an asset with another while keeping the whole composition, you can use the following:

```typescript
await Engine.getInstance().getLibrary().replaceMedia(mediaId, MY_FILE);
```

You can use the same data types as in the `addMedia` method, which are String, File, and UInt8Array buffer. The function also accepts a third parameter, which is the MIME type.

## Add and Remove Subtitles

The Library is also where subtitles are stored. You can learn more about how to manage subtitles [here](/getting-started/subtitles.md).

## Add and Remove Filters

The Library is also where filters are stored. You can learn more about how to manage filters [here](/getting-started/filters.md).

## Add and Remove Transitions

The Library is also where transitions are stored. You can learn more about how to manage transitions [here](/getting-started/transitions.md).

## Add and Remove Effects

The Library is also where effects are stored. You can learn more about how to manage effects [here](/getting-started/effects.md).

## Set custom metadata to assets

You can add extra information to an asset included in the serialized state by using the following method:

```typescript{3}
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);

mediaData.setCustomData("MY_KEY", "MY_VALUE");
```

The `setCustomData` method accepts an optional third parameter, which determines whether the existing data should be overwritten if the key already exists.

## Get custom metadata from assets

The extra information can be retrieved using the following method:

```typescript{3}
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);

const myValue = mediaData.getCustomData("MY_KEY");
```

## Handling missing assets

In certain cases, you may choose not to include assets such as filters, effects, or transitions in the serialized state. This is common when:

- You want to avoid duplicating shader code across multiple assets.
- You are using custom or dynamically generated assets that cannot be serialized.

To handle this, you can add assets to the Library with the `serializable: false` flag (see the [Filters](/getting-started/filters.md) section for an example).

When deserializing the project, the engine needs to know how to load these missing assets. You can achieve this using the [`onSetupLibrary`](https://docs.rendley.com/api-reference/interfaces/EngineOptions.html#onsetuplibrary) callback during engine initialization. This callback provides the list of missing assets so you can programmatically load them back into the Library.

Here is how to do it:

```typescript{5-19}
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
        serializable: true,
        properties: effect.properties,
      });
    }
  }
});
```

Each missing asset object may also include a `provider` field, which can be used to help determine where to retrieve the asset from (e.g., your own storage solution or an external CDN).
