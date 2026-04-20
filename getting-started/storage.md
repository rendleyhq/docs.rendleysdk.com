# Storage

By default, the SDK does not upload your assets anywhere, files are kept in memory and will disappear after a page refresh. The storage system allows you to configure how you want to upload your assets, whether to AWS S3, your server, or even IndexedDB.

There are two primary methods for storing your assets:

1. **Permanent URLs**: Suitable for use cases where you have a static URL to your assets, such as a CDN.
2. **Storage Provider**: Recommended for use cases where you want to upload and retrieve assets to/from your server or have a custom implementation for uploading and retrieval, as in the case of presigned URLs.

## Permanent URLs

A permanent URL is a static link that points to the location of your asset. To set it, you need to upload the asset to the library and then access its `MediaData` object.

```typescript
import { Engine } from "@rendley/sdk";

const mediaId = await Engine.getInstance().getLibrary().addMedia(myFile);
const mediaData = Engine.getLibrary().getMediaById(mediaId);

mediaData.setPermanentUrl("https://example.com/image.jpg");
```

## Storage Provider

A storage provider represents a custom implementation for how assets should be uploaded and retrieved. This can include uploading to your own server, AWS S3, or any other service.

The SDK calls the Storage Provider's methods when uploading assets and loading projects, so assets are retrieved from the right source. The SDK computes a unique content hash for every file, which prevents duplicated uploads.

### Creating a Storage Provider

To implement your own custom storage solution, extend the [`StorageProviderBase`](https://docs.rendleysdk.com/api-reference/classes/StorageProviderBase.html) class. Below is an example demonstrating how to create a custom storage solution:

::: details Example Implementation {open}

```typescript
import {
  StorageProviderBase,
  StorageProviderTypeEnum,
  StorageMediaData,
  StorageStoreResults,
} from "@rendley/sdk";

// Extend the StorageProviderBase with your custom storage implementation.
export class MyCustomStorageSolution extends StorageProviderBase {
  constructor() {
    // Define if this storage is remote or local.
    super(StorageProviderTypeEnum.REMOTE);
  }

  async init(projectId: string): Promise<void> {
    // Initialize the connection to your storage (if needed).
  }

  async destroy(): Promise<void> {
    // Clean up any resources or connections.
  }

  async storeMedia(
    storageData: StorageMediaData,
  ): Promise<StorageStoreResults> {
    const { hash, data, mediaId } = storageData;

    // Upload the asset to your server.
    // The 'hash' serves as the asset's unique identifier, and 'data' contains the asset's buffer.
  }

  async hasMedia(mediaHash: string): Promise<boolean> {
    // Return true if the asset exists, false otherwise.
  }

  async getMedia(mediaHash: string): Promise<StorageMediaData | null> {
    // Retrieve the media's buffer data using its hash.
  }

  async removeMedia(mediaHash: string): Promise<boolean> {
    // Remove the media and return true on success.
  }

  async getMediaHashList(): Promise<string[]> {
    // Return a list of all media hashes stored.
  }

  async sync(master: StorageProviderBase): Promise<boolean> {
    // Define how this storage solution synchronizes with others.
  }

  isActive(): boolean {
    // Return true if the storage server is active, false if inactive.
  }
}
```

:::

::: tip
Group the assets based on the project they are used in and use the media hash as the unique identifier (the filename).
:::

For an example of implementing AWS S3 storage using presigned URLs, check out our [AWS S3 Example Repository](https://github.com/rendleyhq/rendley-sdk-examples/tree/main/storages/s3-with-presigned-urls).

### Connecting a Storage Provider

To connect your storage solution to the SDK, initialize the Engine with your storage providers. You can also combine multiple storage providers to create workflows, such as loading to IndexedDB and then to other storage providers, making uploads appear instantaneous.

```typescript{4}
import { Engine, StorageIndexedDB } from "@rendley/sdk";

await Engine.getInstance().init({
 storages: [new StorageIndexedDB(), new MyCustomStorageSolution()],
 license: {
 licenseName: "YOUR_LICENSE_NAME",
 licenseKey: "YOUR_LICENSE_KEY",
 },
 display: {
 width: 1920,
 height: 1080,
 backgroundColor: "#000000",
 },
});
```

The order of the storage providers is crucial, as it dictates the sequence in which assets are uploaded and loaded. In the example above, the file will first be uploaded to IndexedDB, followed by the `MyCustomStorageSolution`. When loading assets into the project, the SDK attempts to resolve each source in order, starting with [`StorageIndexedDB`](https://docs.rendleysdk.com/api-reference/classes/StorageIndexedDB.html).

### Uploading Assets

To upload an asset to the library, use the [`mediaData.store()`](https://docs.rendleysdk.com/api-reference/classes/MediaData.html#store) function. This triggers the upload workflow, handling the storage process according to your configured storage solution(s). Additionally, you can use the [`mediaData.restore()`](https://docs.rendleysdk.com/api-reference/classes/MediaData.html#restore) method to reload or recover assets when needed.

```typescript
import { Engine } from "@rendley/sdk";

const mediaId = await Engine.getInstance().getLibrary().addMedia(myFile);
const mediaData = Engine.getLibrary().getMediaById(mediaId);

await mediaData.store();
```

### Syncing All Assets at Once

To ensure that all storage providers contain exactly the assets referenced by the Library (and remove orphan assets), call [`syncAllMedia`](https://docs.rendleysdk.com/api-reference/classes/Library.html#syncallmedia):

```typescript
await Engine.getInstance().getLibrary().syncAllMedia();
```

Unlike the previous `storeAllMedia` method (still available but deprecated), `syncAllMedia` also removes assets that are no longer needed. For example, if the Library contains media A and C, and a provider stores A, B, and D, `syncAllMedia` will request B and D to be removed and C to be uploaded.

### Big Files

Starting with 1.14.0, the SDK works with files larger than 2GB on input and output. Large files require the newer hash algorithms (`xxhash128` or `xxhash64`). Change the hashing algorithm in the [Settings](/getting-started/settings.md#media-hash-algorithm):

```typescript
import { HashAlgorithmEnum } from "@rendley/sdk";

Engine.getInstance()
  .getSettings()
  .setMediaHashAlgorithm(HashAlgorithmEnum.XX_HASH_128);
```

::: warning
Some flows, such as internal transcoding, do not support big files. Smaller files continue to work as before.
:::

If your `StorageProvider` accesses the buffer directly, migrate it to work with blobs:

```typescript
const data = new Uint8Array(await mediaData.mediaSource.arrayBuffer());
```

For files larger than 2GB, prefer streaming to OPFS or disk instead of reading the full buffer into memory.

### Available Storage Providers

Here’s a list of the pre-built storage providers:

| Format                     | Support                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| IndexedDB                  | Built-in                                                                                              |
| AWS S3 with Presigned URLs | [GitHub](https://github.com/rendleyhq/rendley-sdk-examples/tree/main/storages/s3-with-presigned-urls) |
