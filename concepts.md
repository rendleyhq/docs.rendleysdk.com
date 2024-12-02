# Concepts

## Engine

The Engine serves as the entry point for the SDK, providing access to all its functionalities. It is implemented as a singleton instance, ensuring that only one instance of the engine exists at any given time.

The Engine is responsible for initializing the SDK, serializing the project's output, loading new projects, and providing access to other parts of the system through convenient getters.

## Display

The Display represents the WebGL canvas where the SDK renders its output. It allows you to set the video's resolution, configure the background color, and access methods to retrieve sprite elements positioned at specific coordinates.

## Storage

By default, the SDK does not upload your assets anywhere. The Storage system enables you to configure your preferred storage solution, such as AWS S3, your own server, or even IndexedDB.

## Events

The SDK emits events whenever something changes, such as when a layer is created or a clip is moved. These events allow you to build a user interface using any framework, providing complete flexibility over the workflow.

## Library

The Library is where all uploaded assets are stored. When you upload an image, video, or any other asset, you add it to the Library, which then references these assets during clip creation. The Library also stores SRT files if they are uploaded.

### MediaData

Each asset in the Library is represented by a `MediaData` class. This class contains metadata about the asset and provides helper functions for adding custom data, triggering uploads to storage, and more.

## Timeline

The Timeline is where the composition takes shape. This is where you control playback (start, pause, or seek), add layers, and interact with clips.

### Clip

A clip is the smallest unit in a composition. It can represent various elements, such as text, images, videos, audio, or even custom HTML elements.

### Layer

A layer is a collection of clips and transitions. Each layer has an incremental `zIndex`, which enables you to create overlapping compositions.

## UI

By default, the SDK does not include a predefined user interface. The SDK requires only a WebGL canvas for rendering, leaving the rest of the implementation to you. You can use the Events system mentioned earlier to build a custom UI.

We also offer a ready-made UI as an optional add-on product, which can help accelerate your development process.
