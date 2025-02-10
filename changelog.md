# Changelog

## [1.9.2] - 2025-02-10

### Added

- Added VideoEncoder failed configuration detection and now the export exists earlier
- Added `setProjectId` method to Engine that handles project id changes

### Changed

- Improved compatibility detection on VideoEncoder, now it also swaps the bitrateMode on top of hardware acceleration
- Improved LottieClip loader + preparation for next update Font rendering

### Fixed

- Fixed text color animation
- Fixed `StorageIndexDB` storage provider

## [1.9.1] - 2025-01-28

### Fixed

- Fixed rendering offset issue

## [1.9.0] - 2025-01-27

### Added

- Improved rendering speed by processing multiple frames
- Added settings for max queue of frames when rendering and throttle factor to avoid memory increase

### Fixed

- Changed `showRenderPreview` to `renderShowPreview` for consistency also updated getters and setters

## [1.8.4] - 2025-01-20

### Added

- Added support for changing subtitle's position and scale.
- Added new events for subtitles (transform, style update, animation update, and more).
- Added an option in settings to adjust the composition's clips when the resolution changes (`setViewAutoLayoutOnResize`).
- Added an option to automatically wrap subtitles when the resolution changes (`setSubtitlesAutoWrapOnResize`).
- Added an option to automatically scale subtitles down/up when the resolution changes (`setSubtitlesScaleOnResize`).
- Added a new property to the serialized schema for storing the creation date (`createdAt`).

### Fixed

- Fixed subtitles mask for full mode.
- Fixed subtitle scaling on view resize.

## [1.8.3] - 2025-01-10

### Added

- Added support for retreiving the license key remotely

### Fixed

- Fixed issue with VideoFrame missing format on some video formats
- Fixed the decoding for videos with start times different than 0
- Fixed error reporting in `VideoClip` class

### Changed

## [1.8.2] - 2025-01-02

### Fixed

- Fixed the dying WebGL context on iOS Safari

## [1.8.1] - 2024-12-30

### Fixed

- Fixed the packet decoding for videos that have start times different than 0
- Fixed subtitles text stroke color
- Fixed audio mix, now ignores failed audios
- Fixed timeline render call during export not waiting for processing
- Fixed playback for video/audio when media is missing
- Fixed double decoder init issue when the timeline was at a different than 0 time (prerender seek was causing first update on that time, then on time 0 then when it was getting to the same time back to reinit)
- Fixed Promise.all issues, now it uses Promise.allSettle for independent promises
- Fixed transitions rendering and playback

## [1.8.0] - 2024-12-30

### Added

- Introduced the `adjustLayout` option for adding clips to layouts, allowing the disabling of the `alignTime` functionality
- Added support for overwriting the encoder RFC codec string

### Changed

- Enhanced error messages to provide more detailed information when an error occurs
- Improved handling of missing video or image media by failing silently to prevent crashes

### Fixed

- Resolved an issue with the stroke color of subtitles text
- Fixed transition issues for both the player and rendering processes

## [1.7.2] - 2024-12-26

### Fixed

- Fixed `HTMLTextClip` initial render

## [1.7.1] - 2024-12-26

### Fixed

- Fixed `HTMLTextClip` serialization schema

## [1.7.0] - 2024-12-23

### Added

- Improved log reporting
- Improved resource usage during rendering
- Added handling for missing audio and video streams
- Introduced animation property for text color
- Added support for masking (supported: videos, images, GIFs, HTML text, Lottie)
- Added rounding direction for `Timeline.alignTime`
- Added text padding
- Added `setVisible` property for clips

### Changed

- Updated the filter and effects deserialization mechanism

### Fixed

- Resolved an issue where the texture was updated while the frame was closed
- Fixed time alignment for durations in the timeline
- Prevented `0` from being set as a duration
- Fixed an issue where word wrapping was not applied
- Corrected a typo from `warp` to `wrap`

## [1.6.0] - 2024-12-05

### Added

- Added support for undo/redo (disabled by default)
- Added support for stroke color and stroke thickness
- Store lottie property values in the serialized JSON
- Added the option to specify custom WASM path for FFmpeg

## [1.5.3] - 2024-12-04

### Added

- Exposed ShapeStyle class

### Fixed

- Fixed issue with deserializing subtitles

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
