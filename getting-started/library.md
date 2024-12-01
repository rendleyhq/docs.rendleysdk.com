# Library

The library is where all the uploaded assets are being stored. Whenever uploading an image, or a video, you add it to the library and then reference it when creating a clip. Inside the library we also store the SRT files in case you upload any.

Before using any asset in the composition, you have to upload it to the library first.

## Add assets to the library

Adding to the library will not save the asset to the storage. It will just load it in the memory. Also, when serializing the project, you will not find the video in there.

You can add the asset to the library using the following formats: String, File and UInt8Array buffer.

```typescript
const mediaId = await Engine.getInstance()
  .getLibrary()
  .addMedia(
    "https://images.pexels.com/photos/24253539/pexels-photo-24253539/free-photo-of-a-bridge-over-a-river-with-a-city-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=500"
  );
```

Adititionally, you can pass a second argument to the `addMedia` to help identifying the mime type correctly for use cases where it cannot be inferred from the source.

> [!NOTE]
> Without storing the asset, it will not be included in the serialized state. Check the [Storage](/getting-started/storage.md) to learn how to store the assets.

## Remove assets from the library

Deleting an asset from the library will also remove any associtated clip with it. This is done in order to avoid playback issues. To remove an asset from the library, you can use the following:

```typescript
await Engine.getInstance().getLibrary().removeMedia(mediaId);
```

## Replace asset with another one

For use cases where you want the user to replace the asset with another one, while keeping the whole composition. You can use the following:

```typescript
await Engine.getInstance().getLibrary().replaceMedia(mediaId, MY_FILE);
```

Instead of my file, you can use the same data types as in the `addMedia` method, which are String, File and UInt8Array buffer. The function also accepts a third parameter, which is the mime type.

## Add and remove subtitles

The library is also the place where the subtitles are being stored. You can learn more about how to do it [here](/getting-started/subtitles.md).

## Set custom metadata to assets

To add extra information to an asset that is being included in the serialized state, you can use the following:

```typescript{3}
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);

mediaData.setCustomData("MY_KEY", "MY_VALUE");
```

The function accepts a third parameter which tells if the data should be overwritten or not in case it exists.
