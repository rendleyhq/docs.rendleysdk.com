# Storage

By default the SDK does not upload your assets anywhere. The files live in-memory and after refreshing the page they disappear. The storage system is where you configure how would you like to upload them, be it on a AWS S3, your server or even IndexedDB.

There are two ways in which you can store your assets:

`Permanent URLs` - Suitable for use cases where you have a static URL to your assets, such as a CDN.

`Storage Provider` - Recommended for use cases when you want to upload and retreive the assets to your server, also, if you have a custom implementation of how the uploading and retreival should happen as in the case for pre signed URLs.

## Permanent URLs

The permanent URL is a static URL that points to the location of your asset. To set it, you have to get the assets uploaded to the library and then access its `MediaData` object.

```typescript{7}
import { Engine } from "@rendley/sdk";

const mediaId = await Engine.getInstance().getLibrary().addMedia(myFile);

const mediaData = Engine.getLibrary().getMediaById(mediaId);

mediaData.setPermanentUrl('https://example.com/image.jpg');
```

## Storage Provider

A storage provider represents a custom implementation of how the assets should be uploaded and retreived. You can have the logic of uploading to your own server, to AWS S3 or any other service.

The SDK laverages methods from the Storage Provider when uploading assets and loading the project, making sure the assets are being retreived from the correct source.

The SDK computes unique hashes based on the content of each file making sure you don't have duplicated resources in your project.

### Create a Storage Provider

To implement your own custom storage solution, you should extend the `StorageProviderBase` class. Below is an example showing how to create a custom solution:

```typescript{7,11,15,22,26,30,34,38,42,46}
import { StorageProviderBase } from "@rendley/sdk";

// Extend the StorageProviderBase with your custom storage implementation.
export class MyCustomStorageSolution extends StorageProviderBase {
  constructor() {
    // Define if this storage is remote or local
    super(StorageProviderTypeEnum.REMOTE);
  }

  async init(projectId: string): Promise<void> {
    // Initialize the connection to your storage (if needed)
  }

  async destroy(): Promise<void> {
    // Clean up any resources or connections
  }

  async storeMedia(storageData: StorageMediaData): Promise<StorageStoreResults> {
    const { hash, data } = storageData;

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

> [!TIP]
> Group the assets based on the project they are being used in and use the media hash as the unique identifier (the filename).

You can see an example of how we've implemented AWS S3 storage using presigned URLs in our [AWS S3 Example Repository](https://github.com/rendleyhq/rendley-sdk-examples/tree/main/storages/s3-with-presigned-urls).

### Connect a Storage Provider

To connect your storage solution to the SDK, you simply need to initialize the Engine with your storage providers. You can also combine multiple storage providers together, getting to flows in which you first load to IndexedDB and then to other storage providers, making the the uploading look instant.

```typescript{4}
import { Engine, StorageIndexedDB } from "@rendley/sdk";

Engine.init({
  storages: [new StorageIndexedDB(), new MyCustomStorageSolution()],
});
```

The order of the storage providers is very important since it dictates the order in which the assets will be uploaded and loaded, for instance, in the example above, the file will first be uploaded into IndexedDB and then uploaded to MyCustomStorageSolution. When loading the assets into the project, the SDK will try to resolve from each of the sources until it manages it do so, for instance, try and load the file from StorageIndexedDB, if it fails, try and load it from MyCustomStorageSolution.

### Uploading assets

To upload an asset to the library, use the `mediaData.store()` function. This will trigger the upload workflow, handling the storage process according to the storage solution(s) you've configured. Additionally, you can use the `mediaData.restore()` method to reload or recover assets when needed.

```typescript{7}
import { Engine } from "@rendley/sdk";

const mediaId = await Engine.getInstance().getLibrary().addMedia(myFile);

const mediaData = Engine.getLibrary().getMediaById(mediaId);

await mediaData.store();
```

### Handling failures

In progress 🚧

### Available Storage Providers

Here’s a list of the pre-built storage providers:

| Format                     |                                                Support                                                |
| -------------------------- | :---------------------------------------------------------------------------------------------------: |
| IndexedDB                  |                                               Built-in                                                |
| AWS S3 with Presigned URLs | [GitHub](https://github.com/rendleyhq/rendley-sdk-examples/tree/main/storages/s3-with-presigned-urls) |
