# Concepts

The SDK is split into several systems

## Engine

The Engine serves as the entry point for the SDK, providing access to all its functionalities. It's a singleton instance, ensuring that there can only be one instance of the engine available at any given time.

It is responsibile for initializing the SDK, serializing the project's output, for loading a new project, and has getters for other parts of the system for easy access.

## Display

The Display represents the WebGL canvas where the SDK renders its changes. Here you can set the video's resolution, the background color and you can also access methods for getting sprite elements positioned at specific coordinates.

## Storage

By default the SDK does not upload your assets anywhere. The storage system is where you configure how would you like to upload them, be it on a AWS S3, your server or even IndexedDB.

## Library

The library is where all the uploaded assets are being stored. Whenever uploading an image, or a video, you add it to the library and then reference it when creating a clip. Inside the library we also store the SRT files in case you upload any.

### MediaData

Each asset in the Library is being stored as a MediaData class, which stores metadata about the clip and provides multiple helper functions for adding custom data to it, for triggering the upload to storage and more.

## Timeline

The timeline is where the composition itself happens. Here is where you start, pause or seek the video, where you add layers and where you interact with the clips.
