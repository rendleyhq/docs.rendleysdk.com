# Render on server

The server approach is using the exact same SDK that is being used on the client side, however, it is running in a controlled environment where you have control over the rendering process and resources. It launches a headless chromium browser and does the rendering there.

You can find the repository for the server rendering [here](https://github.com/rendleyhq/video-rendering-server).

## Requirements

- GPU hardware for the WebGL context
- Minimum 4 CPU cores

## Chunking

Compared to the client rendering approach, the server rendering approach is able to chunk a large video into smaller parts and render them in parallel, then combine the parts into a single video file.

You can have as many chunks as CPU cores available as each chunk happens in a different process. Currently, the server does chunking by default and it is configured to use all the cores.

<hr />

::: tip
When rendering more videos in parallel than GPU cores available, switching the rendering configurations to software encoding and decoding will improve the performance since it can process the data more efficiently.
:::

## Infrastructure

Currently, we only provide the rendering server as a Docker container and do not handle the overall infrastructure and the scalling part.
