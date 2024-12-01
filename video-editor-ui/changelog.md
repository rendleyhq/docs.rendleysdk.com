# Changelog

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
