# Changelog

## [1.5.2] - 2024-11-26

### Fixed

- Added await on library destroy
- Added a fix for instant init after destroy

## [1.5.1] - 2024-11-04

### Added

- [!] Made engine export return null in case of nothing rendered
- Added bitrate and crf settings to encoder
- Made clips trims be clamped

### Fixed

- Fixed lottie multiline text
- Fixed Subtitles styles not getting deserialized correctly

## [1.5.0] - 2024-10-25

### Added

- Clip dimensions (width and height) are now included in the serialized object
- New properties in the settings class to control canvas preview visibility during rendering
- Added support for VP8 and VP9 output formats
- Additional settings in the settings class for configuring rendering output options
- Added support for FFmpeg based rendering
- Enabled support for rendering videos with an alpha channel (through FFmpeg rendering)
- Added corner radius option for subtitles
- Added `lineJoin` style property for subtitles

### Fixed

- Migrated from `blob` to `ArrayBuffer` to prevent browser issues with partially unsupported file types
- Added a fallback from `window.crypto` to `CryptoJS` for SHA-256 hashing in browsers without native support
- Ensured clip dimensions (width and height) are included in the serialized object
- Resolved issues with audio tracks in WebM format
- Fixed highlight inconsistencies in subtitles
- Corrected subtitle positioning when resolution changes
- Fixed subtitle highlighting issues when text spans multiple lines

## [1.4.4] - 2024-10-18

### Added

- Fallback for window.crypto so that hashing can be used in all browsers

## [1.4.3] - 2024-10-17

### Added

- Updated m3u8 hook to select the best resolution and have a max resolution in the settings

### Removed

- Removed the need for `SharedArrayBuffer`

### Fixed

- Style deserialization for video clips
- Load the correct filename when deserializing media data with permanent url
- Fixed corner mask not reacting to position
- Normalize audio during export

## [1.4.1] - 2024-10-14

### Added

- Mute/unmute functionality for both clips and layers
- Volume controls for clips and layers
- Visibility for layers
- Option to do complete destroy via `destroy(true)`

### Fixed

- Fixed the animation opacity for text clips
- Fixed corner radius order on set
- Fixed corner mask not reacting to position

## [1.4.0] - 2024-10-10

### Added

- Export frame at a specific time as base64 image
- Added export options, including range control, stream selection (audio/video/both)
- Added global settings for configuring the preferred acceleration method
- Multiple rendering optimizations
- Added custom data properties for clips and media data
- Added mediaId to StorageData

### Fixed

- Fixed SubtitleManager warp highlight
- Fixed deserialized warp width for subtitles
- Fixed output format for iOS

## [1.3.0] - 2024-09-24

### Added

- Added support for custom storage solutions.
- Added Indexed DB as a storage provider.
- Added [AWS S3 with Presigned URLs](https://github.com/rendleyhq/rendley-sdk-examples/tree/main/storages/s3-with-presigned-urls) as a storage provider.
- Added support for customizing captions.
- Added support for animating the active word in captions.

### Fixed

- Fixed the mechanism for identifying the correct media type.
- Fixed subtitle and clip synchronization.

## [1.2.2] - 2024-09-07

### Fixed

- Fixed animation for subtitles

## [1.2.1] - 2024-09-04

### Added

- Added smoothing for animation loop

### Changed

- Improved rendering speed

### Fixed

- Fixed the dissapearing text element
- Fixed rendering bug for mov files
- Text templates scale for Lottie

## [1.2.0] - 2024-09-02

### Added

- Custom Clips for coding and rendering custom elements on the canvas
- Lottie Clip support for loading and editing After Effects files in the SDK
- Keyframe-based animation system with easing functions

### Changed

- Made engine methods accessible through getters instead of directly using properties

## [1.1.0] - 2024-08-10

### Added

- Support for custom clips
- Expose LottieClip to public

### Fixed

- Serialization of audio files
- Double rendering in the timeline

## [1.0.7] - 2024-08-10

### Added

- Relative and absolute corner radius

### Changed

- `moveClipToLayer` is no longer removing the sprite from the stage

### Fixed

- Deserialize display with the correct settings

## [1.0.6] - 2024-08-05

### Added

- Support for individual corner radius

### Fixed

- Removed the `patch-package` dependency for production build

## [1.0.4] - 2024-08-02

### Added

- Support for corner radius
- Experimental support for lottie files
- Experimental replace functionality for lottie assets

### Fixed

- Fixed avi, mp4, mkv support

## [1.0.3] - 2024-07-26

### Added

- Added support additional parsing methods for m3u8 format

### Changed

- Reinitialize canvas when deserializing the display state
- Initialization of the engine should happen in `Engine.getInstance().init()` instead of `Engine.getInstance({})`

### Fixed

- Fixed stretched content when deserializing with different resolution
- Fixed crashes when deserializing GIFs

### Removed

- Removed the `name` property from Clip, ClipStyle, Effect and Filter classes

## [1.0.2] - 2024-07-19

### Added

- Support for m3u8 format.

### Changed

- Improved speed of getting the audio stream when rendering.
- Switched from Media Gallery to Library.

### Fixed

- Fixed audio quality issues for longer videos.

### Removed

- Removed unnecessary dependencies.
