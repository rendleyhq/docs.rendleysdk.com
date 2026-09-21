# Render on Server

The server approach uses the same SDK that is used on the client side; however, it operates in a controlled environment where you have greater control over the rendering process and resources. This method launches a headless Chromium browser to handle the rendering.

You can find the full implementation on [GitHub](https://github.com/rendleyhq/video-rendering-server).

## Requirements

- GPU hardware for the WebGL context
- A minimum of 4 CPU cores

## Chunking

Compared to the client rendering approach, the server rendering method can chunk a large video into smaller parts and render them in parallel. These parts are then combined into a single video file.

The number of chunks can equal the number of CPU cores available, as each chunk is processed in a separate process. Currently, the server performs chunking by default and is configured to use all available cores.

<hr />

::: tip
When rendering more videos in parallel than the number of GPU cores available, switching the rendering configuration to software encoding and decoding can improve performance, as it allows for more efficient data processing.
:::

## Project Settings on the Server

A project carries the [settings](/getting-started/settings.md#settings-and-projects) it was saved with, and they are applied when the server loads it. That is useful when the editor decides how a project is exported (codec, bitrate, alpha, chunked output): the server needs no per-request configuration.

It also means editor-only settings arrive on the server. A project saved by an editor that builds filmstrips and waveforms asks the server to build them too, for nobody to look at. Force these off, along with anything else your deployment depends on:

```typescript
await Engine.getInstance().init({
  forcedSettings: {
    clipVideoStoreFilmstrip: false,
    clipVideoStoreSamples: false,
    clipAudioStoreSamples: false,
    renderVideoUseDirectFrames: true,
  },
  // ...license, display
});
```

## Untrusted Projects

If the server renders projects submitted by third parties, treat the project JSON as untrusted input. It drives real work on your machine:

- **Settings.** A payload can change timeouts, worker counts, encoder limits and the render path. Initialize the engine with [`ignoreProjectSettings: true`](/getting-started/settings.md#ignoring-project-settings) and put the server's configuration in `forcedSettings`. Pass the export choices you do accept (codec, bitrate) as validated request parameters and apply them with the setters.
- **Size of the job.** The display resolution, the frame rate, the duration and the number of clips decide how much GPU memory and time a render takes. Validate them against your own limits before loading the project, and keep a hard timeout around the render process.
- **URLs.** Media, font and LUT URLs in the project are fetched by the server. Restrict outbound traffic from the render workers (no access to internal networks or metadata endpoints) or allow only the hosts you expect.
- **Custom shaders.** Custom effects and transitions carry GLSL source that runs on the server's GPU. Accept only the effects and transitions you ship yourself, or reject projects that define their own.

## Infrastructure

At present, we provide the rendering server as a Docker container. We do not manage the overall infrastructure or scaling.
