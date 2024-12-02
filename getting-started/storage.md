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

The SDK leverages methods from the Storage Provider when uploading assets and loading projects, ensuring that assets are retrieved from the correct source. The SDK computes unique hashes based on the content of each file, preventing duplicated resources in your project.

### Creating a Storage Provider

To implement your own custom storage solution, extend the [`StorageProviderBase`](/api-reference/classes/StorageProviderBase.html) class. Below is an example demonstrating how to create a custom storage solution:

::: details Example Implementation

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
    storageData: StorageMediaData
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

The order of the storage providers is crucial, as it dictates the sequence in which assets are uploaded and loaded. In the example above, the file will first be uploaded to IndexedDB, followed by the `MyCustomStorageSolution`. When loading assets into the project, the SDK attempts to resolve each source in order, starting with [`StorageIndexedDB`](/api-reference/classes/StorageIndexedDB.html).

### Uploading Assets

To upload an asset to the library, use the [`mediaData.store()`](/api-reference/classes/MediaData.html#store) function. This triggers the upload workflow, handling the storage process according to your configured storage solution(s). Additionally, you can use the [`mediaData.restore()`](/api-reference/classes/MediaData.html#restore) method to reload or recover assets when needed.

```typescript
import { Engine } from "@rendley/sdk";

const mediaId = await Engine.getInstance().getLibrary().addMedia(myFile);
const mediaData = Engine.getLibrary().getMediaById(mediaId);

await mediaData.store();
```

<!--
### Handling Failures

_In progress... 🚧_ -->

### Available Storage Providers

Here’s a list of the pre-built storage providers:

| Format                     | Support                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| IndexedDB                  | Built-in                                                                                              |
| AWS S3 with Presigned URLs | [GitHub](https://github.com/rendleyhq/rendley-sdk-examples/tree/main/storages/s3-with-presigned-urls) |
