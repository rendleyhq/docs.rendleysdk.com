# Roadmap

## High Priority

#### Decrease RAM usage

> Currently, the SDK allocates more memory than necessary to avoid reallocation. After a recent update, we've observed that we do not need as much heap memory preallocated, and that reallocation is fast enough.

#### Transcoding module

> Implement a manager that will handle transcoding automatically for unsupported or unoptimized files. Similar to Storage, users will be able to create a custom implementation or use the built-in one.

#### Improve audio mix speed

> Longer videos get stuck at the beginning of the rendering process until the audio mix is ready. We plan to improve this by making the mix happen in the background.

#### Documentation improvement

> Add JSDoc comments to improve IDE highlighting and documentation clarity. Also, add more examples to the documentation.

## Medium Priority

#### Faster media loading

> Optimize asset loading to improve performance in both the library and the timeline.

#### SVG Clip

> Improve support for SVG clips.

#### More animation presets for subtitles

> Extend the library with additional animations for highlighted words.

#### Project commands

> When generating templates on the backend, video length or size may not be accessible. We plan to introduce commands that can be passed as part of the serialized state, allowing the SDK to handle media (e.g., trimming or cropping) without requiring reference sizes.

## Low Priority

#### Crop

> Add support for cropping media clips.

#### More built-in filters

> Add additional filters, such as blur, grayscale, and color correction.

#### Subtitle styles per clip

> Currently, only one subtitle style can be applied across the entire timeline. We aim to allow each clip to have its own subtitle style.

#### UV Clip

> Convert a video into a green placeholder, useful for mockup presentations where dynamic content replacement is needed.

#### Video speed adjustment

> Allow changing the speed of video or audio clips.

#### Support for dotLottie

> Enable uploading dotLottie files containing all required assets for a composition.

#### HTML Clip

> Improve support for HTML clips.
