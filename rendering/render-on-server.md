# Render on Server

The server approach utilizes the same SDK that is used on the client side; however, it operates in a controlled environment where you have greater control over the rendering process and resources. This method launches a headless Chromium browser to handle the rendering.

You can find the repository for the server rendering [here](https://github.com/rendleyhq/video-rendering-server).

## Requirements

- GPU hardware for the WebGL context
- A minimum of 4 CPU cores

## Chunking

Compared to the client rendering approach, the server rendering method can chunk a large video into smaller parts and render them in parallel. These parts are then combined into a single video file.

The number of chunks can equal the number of CPU cores available, as each chunk is processed in a separate process. Currently, the server performs chunking by default and is configured to utilize all available cores.

<hr />

::: tip
When rendering more videos in parallel than the number of GPU cores available, switching the rendering configuration to software encoding and decoding can improve performance, as it allows for more efficient data processing.
:::

## Infrastructure

At present, we provide the rendering server as a Docker container. We do not manage the overall infrastructure or scaling.
