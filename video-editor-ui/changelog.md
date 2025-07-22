# Changelog

## [1.8.8] - 2025-07-22

### Added

- Added the ability to click on clips that overlap selected clips

### Changed

- Closed the rendering modal when rendering is cancelled
- Updated `@rendley/sdk` to version 1.11.12

### Fixed

- Fixed automatic loading of animations

## [1.8.7] - 2025-07-08

### Fixed

- Fixed timeline getting paused on playback when subtitles change text

## [1.8.6] - 2025-06-27

### Fixed

- Fixed animation serialization

## [1.8.5] - 2025-06-19

### Changed

- Updated `@rendley/sdk` to version 1.11.8

## [1.8.4] - 2025-06-18

### Changed

- Updated `@rendley/sdk` to version 1.11.7

## [1.8.3] - 2025-06-18

### Added

- Added labels when hovering over transitions, effects, filters, animations

### Changed

- Render filmstrip in timeline when possible
- Pause playback when there are changes in the SDK
- Updated `@rendley/sdk` to version 1.11.6

### Fixed

- Syncing transitions in timeline after zoom changes
- Do not display transition placeholder between audio clips

## [1.8.2] - 2025-06-12

### Fixed

- Fixed audio panel crashing for non audio clips

## [1.8.1] - 2025-06-08

### Added

- Added support for effects controls
- Displayed all built-in effects

### Changed

- Updated `@rendley/sdk` to version 1.11.5

### Fixed

- Added throttle when changing color in color picker
- Removed the input validation from inside the `onChange` event
- Fixed guidelines breaking when dragging subtitles

## [1.8.0] - 2025-05-19

### Added

- Guidelines for aligning clips on the canvas
- Animation presets for clips
- Controls to change audio volume for video and audio clips
- Display all the buit-in effects

### Changed

- Updated `@rendley/sdk` to version 1.11.4
- Updated `@stencil/core` to version 4.31.0
- Updated `@stencil/sass` to version 3.2.1

### Fixed

- Fixed Hot Module Replacement

## [1.7.3] - 2025-05-05

### Changed

- Updated `@rendley/sdk` to version 1.11.2

### Fixed

- Fixed loading native filters, effects and transitions

## [1.7.2] - 2025-04-21

### Added

- Added a new section for built-in effects

### Changed

- Updated `@rendley/sdk` to version 1.11.0
- Updated the filters,effects,transitions implementation to follow the new SDK approach

### Fixed

- Fixed playback stopping one frame later
- Pause undo when filter intensity changes
- Fix for DragResizeRotateContainer to take in consideration text padding

## [1.7.1] - 2025-04-11

### Fixed

- Fixed issue with transparent colors causing issues

## [1.7.0] - 2025-04-08

### Added

- Duplicate functionality for clips
- Preview when seeking
- Padding settings for text clips
- Controls sidebar on the right side of the video editor
- Property component for displaying properties dynamically
- Intensity settings for filters

### Changed

- When a clip is first added to the timeline, it is selected automatically
- The timeline scrolls vertically by default; users can hold Shift to scroll horizontally
- Improved clip snapping

### Fixed

## [1.6.4] - 2025-03-24

### Changed

- Updated `@rendley/sdk` to version 1.10.1
- Migrated titles to v3

### Fixed

- Added try catch to font loading, to avoid filters not getting loaded

## [1.6.3] - 2025-02-21

### Added

- Add properties for setting `isSublicense` and `enableRemoteValidation`

### Changed

- Updated `@rendley/sdk` to version 1.9.6

## [1.6.2] - 2025-02-20

### Added

- Exposed all the methods and interfaces from `@rendley/sdk` through a new method called `getRendleySDK`.

### Changed

- Switch to font based lottie titles
- Updated `@rendley/sdk` to version 1.9.4

## [1.6.1] - 2025-02-10

### Added

- Added pan functionality (control/command + click)
- Added zoom functionality (control/command + scroll)
- Added reset view functionality (control/command + double click)

### Changed

- Updated `@rendley/sdk` to version 1.9.2

## [1.6.0] - 2025-01-20

### Added

- Added controls for customizing subtitles, including the main text and highlighted text.
- Added support for dragging and resizing subtitles.
- Added support for wrapping subtitles.
- Automatically resize clips when the composition resolution changes.

### Changed

- Subtitles clip will now be automatically deleted when the last subtitle section is removed.
- Updated `@rendley/sdk` to version 1.8.4.

### Fixed

- Video resolution changes will now automatically update the resize handlers.

## [1.5.0] - 2024-12-30

### Added

- Added custom clip fallback support

### Changed

- Updated `@rendley/sdk` to 1.8.0
- Updated the transition interface to follow the new `@rendley/sdk` interface

### Fixed

- Fixed text wrap resize

## [1.4.1] - 2024-12-10

### Added

- Added support for editing border color
- Added support for editing border thickness
- Added support for editing border radius

## [1.4.0] - 2024-12-03

### Added

- Added support for undo/redo functionality
- Added shortcuts for undo/redo

### Changed

- Updated `@rendley/sdk` to version 1.6.0

### Fixed

- Fixed file uploader not getting rendered with ref id in some cases

## [1.3.3] - 2024-11-26

### Changed

- Updated `@rendley/sdk` to version 1.5.2

### Fixed

- Reset the video editor state when unmounting the component

## [1.3.2] - 2024-11-07

### Fixed

- Fixed incorrect snapping positions for clips.
- Resolved issues with clip states when dragging clips from one layer to a new layer.

## [1.3.1] - 2024-11-04

### Changed

- Subtitle clips no longer display the resize indicator.
- Lottie clip scaling is now handled by the SDK.
- Updated to @rendley/sdk version 1.5.1.

## [1.3.0] - 2024-10-28

### Added

- Added the ability to apply subtitle effects and styles.
- Updated `@rendley/sdk` to v1.5.0.

### Fixed

- Ensured font initialization completes when loading the editor.
- Added dynamic extension selection based on render output.
- Removed the dependency on `SharedArrayBuffer`.

## [1.2.2] - 2024-10-18

### Fixed

- Clip adjacency not being displayed correctly

### Changed

- Updated @rendley/sdk to v1.4.3
- Updated the file picker to include wav files
- Added support for firefox

## [1.2.1] - 2024-09-24

### Fixed

- Fixed the loading modal, which was not being displayed correctly.

### Changed

- The sidebar will now be closed by default when the video editor is opened on mobile.
- Hid the background label on mobile to make the navbar responsive.

## [1.2.0] - 2024-09-23

### Added

- Add a placeholder function for internationalization. Check `utils/translation.ts`.
- Add a placeholder component for when there is no Pexels/Giphy configuration.
- Display a modal indicating that rendering is not possible in the browser when using Firefox.
- Updated the thumbnails for all the filters, effects and transitions.

## [1.1.0] - 2024-09-09

### Added

- Snap clips in the timeline.
- Replace media by right-clicking on the media card.
- Follow playhead when the page changes.
- Added a stop button to jump to the beginning of the timeline.
- Stop video when the end of the timeline is reached.
- Added empty states for when stock media apis are not configured or did not return any results.

### Fixed

- Transitions not being applied.
