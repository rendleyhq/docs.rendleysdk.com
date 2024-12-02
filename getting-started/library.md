# Library

The Library is where all uploaded assets are stored. When you upload an image or a video, you add it to the Library and then reference it when creating a clip. The Library also stores SRT files in case you upload any.

Before using any asset in a composition, you must upload it to the Library first.

## Add Assets to the Library

Adding an asset to the Library will not save it to storage; it will only load it into memory. Additionally, when serializing the project, you will not find the video included.

You can add an asset to the Library using the following formats: String, File, and UInt8Array buffer.

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

## Set Custom Metadata for Assets

To add extra information to an asset that will be included in the serialized state, you c
