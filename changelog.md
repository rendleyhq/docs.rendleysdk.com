# Changelog

## [1.15.5] - 2026-04-18

## Changed

- Migrated to sample based mixing (for better syncing, versus time based). Should be fine... 🤞

## Added

- Added audio range mix backround rendering (with support for clip mask \[include/exclude\], see `Engine:: exportAudioRange`)

- Added optimization for PropertyAnimator set (because 'reactivity' is slow but is extensively used everywhere, emiting too many property updates might cause slow down in some hosts, now the value is cached if it's not changed)

- Added multiple audio output formats for `Engine::exportAudioRange` and `Engine::export` `audio_only` (ogg, mp3, wav, aac, m4a), defaults to aac for backwards compatiblity
  !Important: aac, m4a (aac under the hood) have frame padding as part of their encoding, if you plan to join the exported chunks use other formats to avoid gaps or remove the padding manually.

## Fixed

- Fixed editor state reset after rendering audio only

- Fixed rendering canceling issue

- Fixed `audio_only` rendering range

- Fixed partial audio fading split (might still sound weird for extreme curves)

- Fixed transition not getting removed when clip was moved to another layer

- Fixed freeze framed video getting it's audio rendered

## [1.15.4] - 2026-04-13

## Added

- Added optional dynamic video load/unload for projects with many video chunks (browser has available a limited amount of video decoders). See `Settings::clipVideoDynamicLoad` (enable/disable) and `Settings::clipVideoDynamicLoadTime` (preloading range in seconds). Enable only if you need it (~128+ videos in the timeline at once) because it might introduce flicker on seeking (dynamic loading), doesn't affect rendering.

- Added intial value for Keyframed property animation (to perserve original property when keyframes are added/removed)

## Fixed

- Fixed media replacement crop warning issue

## [1.15.3] - 2026-04-08

## Added

- Added drop shadow options for `Subtitles`

- Added option to disable highlighted word animation for `Subtitles`

- Added letter spacing for `Subtitles`

## Fixed

- Fixed `Subtitles` background not getting fit to the text

- Fixed `Subtitles` edge cut artifacts

- Changed the rendering approach for highlighted line and highlighted word

## [1.15.2] - 2026-04-03

## Fixed

- Fixed clip moving to another layer will not update it's mute state/volume based on the layer setting

- Fixed shape size changing incorrectly also now the initial width/height are dominant (if set) even if the points are out of bounds

- Better Adjustment filter, added Temperature and Tint with creative temp at -0.7 to -1

## [1.15.1] - 2026-03-31

## Added

- Added latest lottie improvements from 5.13.0

## Fixed

- Fixed lottie cache issues causing shapes to not render correctly

- Fixed CustomClip deserialization loosing properties

- Fixed CustomClip not calling super update

## [1.15.0] - 2026-03-31

## Added

- Added new animation system for keyframed property animation
  - Local time based keyframed destructive animation
  - Track based (per property)
  - See `PropertyAnimator` class (lives on `Clip::propertyAnimator`)
  - Override or write `registerAnimatableProperties` to add your own animatable properties in custom clips, or add your own register point
  - Get/Set custom properties
  - Compounts or Component based (ex: scale vs scaleX, scaleY) with linking between them, also join (lossy) and split ability
  - Lives along the old layered animation (`Clip::animationController`)
  - AEF/Lottie like interpolation handles (normalized [0-1] time/value bezier handles)
  - Number/RGB/RGBA/Vector2/3/4 + hold interpolation. Also supports text property
  - Time based query for keyframes
  - Custom data per track
  - Defaults (handles/hold) for track keyframes
  - Supports filter/effects keyframes (uses `prefix:id:property` format, ex: `filter:12345:opacity`)

- Added `UndoManager` pause stack clearing methods `getPauseStack`, `clearPauseStack`

## Changed

- Layered crop, cropOffset and zoom are now shader based (non destructive, behaves differently as it doesn't affect the handles (size) now)

## [1.14.4] - 2026-03-25

## Fixed

- Fixed build obfuscation causing issues with Lottie expressions

- Fixed Lottie incorrect output when using time in expressions (causes a double update for this cases, 2nd update is faster, needs a 2 pass because of the way time references work)

- Improved rendering performance on Lottie by using offline canvas if supported

- Improved Lottie CPU usage (if you use some unsupported features other than setProperty, make sure to invalidate the cache by setting clip.lastUpdatedFrame to Number.Min to reflect the changes, unconventional features need unconventional approaches ))

## [1.14.3] - 2026-03-23

## Fixed

- Improved audio sample extraction speed also moved the post processing in separated thread

## [1.14.2] - 2026-03-06

## Fixed

- Fix for videoclip playback getting stuck in some cases

- Made auth non blocking, faster loading on deserialization

- Isolated audio sample extraction in it's own thread

## [1.14.1] - 2026-03-06

## Added

- Added support for big files on audio samples extaction

- Added safety measures for worker parallel requests

## Fixed

- Transcode various fixes

- Fixed audio extraction paths

## [1.14.0] - 2026-03-05

## Changed

- **BREAKING-CHANGE:** Migrated the `MediaData` and `StorageProvider` workflow to blobs! Update your code to use blobs in case you have a custom provider or access MediaData data directly. Simplest migration would be data = new Uint8Array(await mediaData.mediaSource.arrayBuffer()). But this will not work on big files (>2GB+). Also if you're using `Settings::clipAudioStoreSamples` generation it will fail on big files (will be improved in the future).

- Upgraded `OutputChunkHelper::readMergedChunksAsBlob` to directly construct the blob from the worker chunks (theoretically should support big files as url downloads, still OPFS flow is preferred)

## Added

- Added support for big files on input (doesn't work with old sha256 hash, migrate to xxhash128 or xxhash64 if needed, also some flows are not supported like internal transcoding. Everything non supported is only for big files, smaller files should work as before)

- Improved memory usage

- Improved SVG detection for unnamed files

## Fixed

- Multiple fixes for errors including during transcoding, VideoClip, AudioClip and other annoying error throws, that might disrupt your workflow

- Fixed audio desync on long projects

- Fixed `AdjustmentClip` issues, including rendering first frame as non processed

- Fixed clip/subtitles visibility and hitTest issues when layers are hidden

- Added VideoClip recover in case of crash

- Fixed media probing while the browser is in the background crashing, also added a failsafe timeout

- Made wasm worker getting destroyed too on Engine full destroy

- Fixed layer visibility on deserialization

## [1.13.0] - 2026-02-13

## Changed

- **BREAKING-CHANGE:** `ExportResult.blob` is now optional as in the case of multi chunk output the results might be in `ExportResult.outputChunkHelper`

- `Settings::setRenderVideoUseDirectFrames` is now set to true by default (faster rendering)
  _In case of render issues set it to false in your Engine.init `forcedSettings`_

## Added

- Added support for >2GB output files (chunked rendering)
  _If you turn on this option export result will return `outputChunkHelper` that can be used to extract chunks or even save it as a whole to the disk_
  _Avoid using the merge methods of `outputChunkHelper` as they're bounded to browser's max allocation size (ex: Chrome: 2GB) stream the chunks to the desired destination (to disk, network or any other storage)_

- Added `Settings::setRenderUseChunkedOutput` and `Settings::setRenderChunkedOutputMaxSize`

## Fixes

- Fixed render errors sometimes not signaling the failure for the host to react

## [1.12.26] - 2025-01-26

## Added

- Added `polygon` shape to ShapeClip (use null to separate multiple shapes)

- Added `bezier` shape to ShapeClip (use null to separate multiple shapes)

- Added customData to `Engine`, `Library`, `Timeline`

## Fixed

- Fixed AnimationClass exposure (now autocomplete should work)

## [1.12.25] - 2025-12-29

## Fixed

- Fixed initial background color not being set

## [1.12.24] - 2025-12-29

## Fixed

- Fixed `Engine::getFrameAsBase64Image` rendering, skipping some clip updates.

## [1.12.23] - 2025-12-12

## Added

- Added crop offset animation parameter: `cropOffsetX`, `cropOffsetY`

## Fixed

- Fixed rare case where first frame becoming black on render

- Improved error reporting and fixed some concurrency issues that might appear for the video decoder

- Fix for zoom cache

- Added pixi filter properties to effectdata: `autoFit`, `noTransform`, `blendMode`, `padding`

## [1.12.22] - 2025-12-05

## Added

- Added zoom property for animation inside crop

## Fixed

- Added a fix for hvc1.1.6.L120.90 codec on Firefox on Mac

- Fixed crop rounding errors

- Fixed spawn clip from media library inherits previous crop

- ShapeClip Circle and Star only having proportional scaling

## [1.12.21] - 2025-12-02

## Fixed

- Fixed clone referencing the same Texture object (affecting crop)

## [1.12.20] - 2025-11-28

## Added

- Added read animation properties uncropRawWidth and uncropRawHeight

## [1.12.19] - 2025-11-28

## Added

- Added xxHash128 support (opt in through Settings::setMediaHashAlgorithm)

- Added crop and local position animation support

- Added ADDITIVE_MULTIPLICATIVE_TO_RELATIVE animation keyframe space (yes confusing name but basically it does PropertyValue + RelativeValue \* KeyframeValue, as it wasn't possible before and it's useful for crop animations to compensate position)

- Added the next properties
  to read: localPositionX, localPositionY, cropLeft, cropTop, cropRight, cropBottom, width, height, rawWidth, rawHeight, uncropWidth, uncropHeight
  to write: localPositionX, localPositionY, cropLeft, cropTop, cropRight, cropBottom

## Fixed

- Fixed license validation error for local network

- Fixed overlapped Transitions and other issues related to Transitions

- Fixed interlaced video to render with videoDecoder (also improved wasm interlaced detection)

## Changed

- Made name property of AnimationData optional...

## [1.12.18] - 2025-11-22

## Added

- Added `getFrameNumberFromTimeValues` (useful when you want to convert multiple time values to frames)

- Added wrap mode empty for `LottieClip`

- Added lineHeight to `TextClip` style

- Added letterSpacing to `TextClip` style

- Added status property to both `LIBRARY_MEDIA_FILMSTRIP_UPDATED` and `LIBRARY_MEDIA_SAMPLES_UPDATED` events

## Fixed

- Fixed adjustment layer when layer is hidden

- Converted some time comparison to frames to avoid any floating errors

- Made fit duration take into account layer visibility

- Fixed missing Sample extraction update

## Changed

- Changed FilmstripStatusEnum to MediaProcessStatusEnum

## [1.12.17] - 2025-11-17

## Added

- Added Audio and Video seek threshold settings

## Fixed

- Fixed Audio seek error

- Reverted/updated unknown formats rejection. Now it's accepted again but with an unknown type + thumbnail

- Fixed timeline stopping being deserialized if an Effect/Filter is missing

## [1.12.16] - 2025-11-15

## Added

- Added `LottieClip` `GRADIENT_STROKE_COLOR` property

- Added `LottieClip::getAnimationData` and `LottieClip::replaceAnimationData` to update the data manually (doesn't get serialized, use customData if needed)

- Added drop shadow support for `TextClip`

## Fixed

- Fixed setPlaybackSpeed left bound drifting at some settings

## [1.12.15] - 2025-11-12

## Added

- Added no simd support

- Added new event LIBRARY_MEDIA_READY, after Media loaded successful

- Added new resize method on replace (FitStyle.MATCH_SIZE), useful for downresing and replacing media

## [1.12.14] - 2025-11-09

## Added

- Added transition id to clips

- Added undo support for Transition duration

- Added layerId to Clip

- Interlaced video support

## Fixed

- Fixed subtitles manager still displaying text after undo adding

- Added error handling for missing transition textures

- Fixed effects + rounded corners

- Fixed storage controller storing media in all providers if one of them is missing it

- Fixed thumbnail and rendering of video with rotation at -180deg

- Better transition error handling

- Better error handling on media load

- Fixed crop on rendering when the input video had metadata rotation

## Changed

- Transitions in/out duration are automatically trimmed to clip trimmed duration

## [1.12.13] - 2025-11-03

## Fixed

- Fixed media replace on audio calling sprite methods

## [1.12.12] - 2025-11-03

## Added

- Added support for export resolution scaling (see `Engine.export` options)

- Added fit options on media replace

## Fixed

- Improved subtitles masking

- Added empty padding for audio stream to match the video stream duration

- Fixed empty frame sometimes being added on video stream

- Fixed StorageIndexedDB error

- Fixed animation initial state

- Fixed undo/redo on media replacement

- Fixed crop calculations on media replacement

## [1.12.11] - 2025-10-27

## Fixed

- Fixed `AudioClip` not clamping time to the boundings

## [1.12.10] - 2025-10-25

## Added

- Added probeMedia method to Library

- Updated `LottieClip` to support Gradient Fill colors and image properties

- Added setPlaybackSpeed to `LottieClip`

- Added ping-pong wrap mode for `LottieClip`

## Fixed

- Fixed texture not getting updated on lottie image replace

- Fixed incorrect audio silence in some cases on audio mix

- Fixed `VideoClip` and `AudioClip` setPlaybackSpeed preserve trimmed duration

- Fixed `AudioClip` pushing the clip on setPlaybackSpeed adjustLayout

## Changed

- Updated audio mix to sync better and avoid popping or gaps

## [1.12.9] - 2025-10-18

## Added

- Added noise effect (**Important**: Who uses self hosted cdn, update the `sdk/assets/effects_v2` folder!)

## Fixed

- Fixed adjustLayout stopping too early

## [1.12.8] - 2025-10-17

## Added

- Added UndoManager serialize/deserialize methods

## Fixed

- Fixed audio split getting an error when generating a new id

- Fixed adjustment clip causing setVisible events and making host react to it, like pausing etc...

## [1.12.7] - 2025-10-11

## Added

- Added name to Layer

- Added Layer property update event

- Improved chroma key, added luminosity influence

- Added undo/redo to effects properties

- Added support for subtitles precise timings (see: `TextBlock::wordTimings`, only taken into consideration if words length matches timings length, otherwise the old word size interpolation method is used)

- Added VideoClip freeze time (see: `VideoClip::setFreezeTime`)

- Added `VideoClip::extractFrameAsBase64Image`

## Fixed

- Fixed adjustClipsLayout undo/redo

- Removed init undo records

- Fixed clip id not getting changed in the dependencies

- Fixed syncAllMedia to check the difference per controller but not as an union

- Fixed layer removal undo index

- Fixed missing events for Layer Update

- Fixed createLayer initialization

- Fixed SubtitlesManager convertSrt not working on other float locales

- Improved indexed DB error handling

- Improved storage controller error handling

- Fixed warning on deserialization

- Fixed filmstrip not getting generated on undo/redo

- Fixed error when replacing media before filmstrip finished

- Added missing events from Clip, AudioClip and VideoClip setters

- Exported Engine schema

- Fixed LottieClip undo order

- Added cloned return values to Effect to avoid mutation

- Made recorded data in UndoManager cloned to avoid mutation

## Changed

- Changed Undo/Redo performed events to send the actual undo group not just the name

## [1.12.6] - 2025-09-29

## Added

- Added unsafe bypass for pixi

## [1.12.5] - 2025-09-29

## Added

- Added `SvgClip`, svg images automatically spawn now svg clips, make sure to parse them in your editor (type: SvgClip) or integrate the latest Rendley UI changes. Can be resized without loosing details up to 4096x4096.

- Added zip support (check ZipArchive class)

- Added fileExists/dirExists ffmpeg methods

- Updated extractAudio to support creating a new audio media data

## Fixed

- Fixed `TextClip` constructor/init order causing styles to be cached to early

- Fixed crop on media replacement

- Fixed Engine.reset

- Added Firefox fix for rotated videos

- Updated media data to not overwrite type with none on missing media

## Changed

- Migrated endpoints to rendleysdk.com

## [1.12.4] - 2025-09-16

## Added

- Added Timeline volume
- Added custom data to fonts in `FontRegistry` (internal)

- Added missing font information to the `Engine::onSetupLibrary` callback (currently supports Text and HtmlText missing fonts)

- Added media internal `metadata` to `MediaData::metadata`, (metaception: We need to go deeper!)

## Changed

- Changed `Library::extractAudioFromMedia` to support track number

## [1.12.3] - 2025-09-12

## Fixed

- Fixed some audio channel formats fail to mix

## [1.12.2] - 2025-09-09

## Added

- Added new settings for rendering control:
- `RenderVideoUseDirectFrames` - A different frame grab method that might decrease the rendering time a lot (on most devices except Mac, probably only M series are affected). Test it well before pushing to production, in our tests it could gain almost x2 speed in some cases! The backpressure can be controlled with `Settings::renderThrottleFactor`. `Settings::renderMaxQueueSize` is not used here atm
- `DecoderUseSeparateWorke`r` - Decode videos with individual workers (might help when the compositions have a lot of videos on multiple layers, but doesn't usually speed a lot, might actually make the rendering slower most common cases because of worker's creation/destruction friction). Don't use it if you don't see any improvements
- `DecoderUseSubImage` - While video frames likes more new textures, this is an option that can be set to just fill the old texture instead of creating a new one, benchmark your own case scenario and see if it might improve the rendering. Don't use it if you don't see any improvelements

## Fixed

- Fixed crop during rendering

## [1.12.1] - 2025-09-08

## Fixed

- Fixed audio fade in/out if audio stream had a different duration than the video

- Fixed audio mixing on different audio stream lengths

- Fixed incorrect duration when replacing the AudioVideo clips

- Fixed audio fade out duration on preview

## [1.12.0] - 2025-09-06

## Added

- Added alternative hash function for MediaData (see: `Engine::init` -> dataHashFunction)

- Added missing animation events

- Added optional id to animations

- Added Adjustment Clip (see: `ClipTypeEnum.ADJUSTMENT`). Transforms (Position, Scale, Rotation) are supported, but their behaviour might be a subject of change

- Added `Timeline::getFrameNumberFromTime` to get the frame from specific timestamp

- Added a clip postrender callback that can be used to do cleanups or state changes after rendering

- Added volume fade and fade curve to `VideoClip` and `AudioClip` (see: `setVolumeFadeInDuration`, `setVolumeFadeInCurve`)`setVolumeFadeOutDuration`, `setVolumeFadeOutCurve`.

- Added subtitles text block events

- Added crop functionality (only video, image and gif)

- Added `extractAudioClip` method to VideoClip

- Added clip speed and pitch adjustments (for video and audio) (see: `setPlaybackSpeed`, `setPerservePitch`)
  Keep in mind that setPlaybackSpeed will mutate the clip duration and startTime! Use the property flags to adjust the behaviour and call `Timeline::adjustClipsLayout` after the value is confirmed.
  Limited to [0.25, 4] range, [0.25, 2] on Safari for now. (Safari has a buggy implementation > 2)

- Added undos to volume and mute

- Added volume events

## Fixed

- Fixed video/audio ending incorrect detection, now should be better and most of rare loops issues should disappear

- Fixed Transition removal not resetting the clips visibility

- Fixed filters and other clip attachements not being applied after replacing a video clip

- Improved filename detection from urls

- Improved transcoding log
- Small fix to the background timer

- Fixed video replacement when resolution doesn't match

- Fixed a rare case of WebM videos getting errors when decoding in preview (global fix), might affect some old scenarios with a lot of small clips!

- Made videos not block the playback if they're in decode error state

- Improved start sync on play

## Changed

- Better time test alignment with frame precision

- Switched to semi-manual rendering pipeline

## [1.11.18] - 2025-08-20

## Added

- Added optional antialias on `Engine::init`, supported types: NONE, MSAA (default, as before), FXAA

- Added `clipAudioMonoMixType` to the `Settings`, this sets the mono mix type to average, max, min...

- Added `clipAudioMonoChannelsWeight` to the `Settings`, this sets the channels mask on mono mix (defaults to maximum stereo: [1, 1])

## [1.11.17] - 2025-08-18

## Added

- Added optional filmstrip extraction from video files (see: `Settings::setClipVideoStoreFilmstrip`, `Settings::setClipVideoFilmstrip***`, `MediaData::getFilmstripState`, `MediaData::getFilmstripData`, `MediaData::getFilmstripDataRange`, also proxies on VideoClip::getFilmstrip\*\*\*)

- Added `name` field to MediaData and Clip for non related to file, standalone name (see: `Clip/MediaData::setName`, `Clip/MediaData::getName`, `Clip::hasName`)
  MediaData name defaults to filename on load

- Added new events: `LIBRARY_MEDIA_SAMPLES_UPDATED` and `LIBRARY_MEDIA_FILMSTRIP_UPDATE`

- Added `name` to `StorageMediaData` interface

- Added `Library::extractAudioFromMedia` to fully extract audio track from a video as an independent media data

## Fixed

- Added guard on Engine destroy to wait for init to finish to avoid resources using post callbacks internals after destruction

- Fixed Engine cases where projectId is ""

- Fixed serialization error when animation sets the clip style to scale (0, 0)

- Fixed rendering audio mix was failing if one of the media was not loaded also added multiple new guards for fail prevention

## Changed

- `getAudioSamples` now has an optional duration, if not set will get all the samples till the end

## [1.11.16] - 2025-08-12

## Fixed

- Audio mix now checks for missing or incorrectly loaded media files and skips them instead of failing

## [1.11.15] - 2025-08-08

## Added

- Added forced settings to the Engine init, this will overwrite any settings on deserialization

- Added ability to store and sample audio data (see: `MediaData::getAudioSamples`, proxy `AudioClip::getAudioSamples` and `VideoClip::getAudioSamples`, `Settings::clipAudioStoreSamples`, `Settings::clipAudioSampleRate`, `Settings::clipAudioSampleForceMono`, `Settings::clipVideoStoreSamples`)

## Fixed

- Fixed 0 animation scale serialization NaN bug

## Changed

- Made `Layer::addTransition` to return the new transition id

## [1.11.14] - 2025-08-05

## Added

- Added `Library::isProcessing` to check if the Library does any internal processing that might change it's state, like loading media, transcoding, ...

- Added `Engine::isSafeToSerialize` that return true if serializing the project would not cause any issues because of some internal process (checks for `Engine::isReady` and `Library::isProcessing`)

- Added setting for encoding keyframe interval `Settings::setEncoderKeyframeInterval`

## Fixed

- Added more failure checks to `MediaData`

- Added missing event for Filter update: `CLIP_FILTER_UPDATED`

- Added missing event for Lottie property update: `CLIP_LOTTIE_PROPERTY_UPDATED`

## Changed

## [1.11.13] - 2025-07-29

## Added

- Added ready state to the engine to avoid using it while it's loading/deserializing

- Added basic GL blending modes to clip (see: `BlendModeEnum`)

- Added `PlaceholderClip` that will be replaced with a media file after it was loaded to the library (see: `MediaData::addPlaceholderClip`)

- Added `getMediaHashList` to the `StorageController`

- Added `Library::syncAllMedia` that will remove or add any media that's missing from the storage providers (as a whole)
  For example:
  Two storage providers: StoreA and StoreB, StoreA has media A and B, and StoreB has media C.
  If the Library has medias A, C, D, it will request media B to be removed and D to be added

## Fixed

- Fixed deserialization was adding new storage controllers

## Changed

- Deprecated `Library::storeAllMedia` in favor of `Library::syncAllMedia`

## [1.11.12] - 2025-07-19

## Added

- Added renderCancelFailTimeout settings to set the timeout for the failsafe of the cancelExport method

## [1.11.11] - 2025-07-19

## Added

- Ability to cancel render with `Engine::cancelExport()`

- Improved adjustment filter to include vibrance and hue

## [1.11.10] - 2025-07-14

## Fixed

- Fixed loadSerializedData in Timeline to proper init the layers/clips and inform the UI of the changes

### Added

- Exposed createMediaHash function

## [1.11.9] - 2025-06-19

## Fixed

- Fixed Media removal not removing all dependent clips

## [1.11.8] - 2025-06-19

## Fixed

- Fixed removal of audio/video clips not stopping the playback (usually during timeline play)

## [1.11.7] - 2025-06-18

## Fixed

- Fixed never resolving seek issue for audio and video clips

## [1.11.6] - 2025-06-18

### Added

- Added optimized Glow and Chroma Key effect

## Fixed

- Fixed audio and video sometimes not getting reset to the correct position when seeking
- Fixed animation incorrect loop time when a in/out animation was applied and removed
- Fixed bulge default radius
- Fixed Filter antialiasing
- Multiple fixes for processing lock flag on Audio and Video clip that sometimes was causing a lock to happen making playback and rendering impossible
- The remote validation is enabled by default now!

## [1.11.5] - 2025-06-08

### Added

- Added the following built-in effects:
- Adjustment
- Advanced Bloom
- Ascii
- Bevel
- Bloom
- Blur
- Bulge Pinch
- Color Overlay
- Color Replacement
- Cross Hatch
- Crt
- Dot
- Drop Shadow
- Emboss
- Godray
- HSL Adjustment
- Motion Blur
- Old Film
- Outline
- Pixelate
- Radial Blur
- Reflection
- RGB Split
- Shockwave
- Tilt Shift
- Twist
- Zoom Blur

### Fixed

- Fixed rendering rotated filters

## [1.11.4] - 2025-05-19

### Added

- Support for undo/redo functionality in animations

### Fixed

- Fixed hvc1.1.6.L120.b0 on Safari
- Fixed issue where flushing was not being properly awaited
- Minor fix related to render closure handling
- Improved compatibility with certain HEVC codecs on Chrome (macOS)

## [1.11.3] - 2025-05-13

## Fixed

- Fixed some codecs not being able to seek on render

## [1.11.2] - 2025-05-01

### Added

- Added settings to disable WebCodecs based rendering

### Fixed

- Fixed animation properties not getting reset on removal
- Added forced update to animation when setting/removing animation properties
- Fixed transition end clip flipping on rendering
- Fixed clip selection during transition

## [1.11.1] - 2025-04-23

### Fixed

- Removed test code that was disabling the transparency rendering
- Reverted seek fix that was causing the newly added media to not render a preview

## [1.11.0] - 2025-04-21

### Added

- Added integration with native filters _(only Blur is available for now, more to come soon)_
- Added procedural properties and texture inputs to effects _(undos/redos are not handled at the moment)_
- Added procedural properties and texture inputs to transitions _(undos/redos are not handled at the moment)_
- Added built in effects
- Added support for changing Lottie's shape/text stroke color
- Added support for changing Lottie's shape/text stroke width
- Added check for incorrect duration added in the project json for videos causing weird behaviour, like looping...
- Added new events: LIBRARY_FILTER_ADDED, LIBRARY_FILTER_REMOVED, LIBRARY_EFFECT_ADDED, LIBRARY_EFFECT_REMOVED, LIBRARY_TRANSITION_ADDED, LIBRARY_TRANSITION_REMOVED, EFFECT_PROPERTY_CHANGED, TRANSITION_PROPERTY_CHANGED
- Added ability to provide your own PIXI.Filter effect, in case you need special passes _(can't be serialized!)_
- Added optional serialization flag for Effects, Transitions and Filters in the library _(in case the host always provides them, to avoid shipping them with the project JSON)_
- Added undo/redo for Filter intensity
- Added helpers for builtin effects
- Added project upgrader module that will remap old project JSONs to the new structure
- Added Timeline reset
- Added Timeline getFrameDuration
- Added Timeline loadSerializedData for partial loading of the timeline content
- Added support for transparent WebM rendering
- Added to ClipStyle: setWidth, setHeight, setSize, getSize(), getRawSize() _(keep in mind that all setters only affect scale and will trigger a scale event, the weight and height is dictated by the media)_
- Added library methods to deal with unused assets
- Added onSetupLibrary callback to deal with missing assets (filters, effects, transitions) that were not serialized during project deserialization

### Changed

- **BREAKING-CHANGE:** Rewrote the effect to be part of library now + improvements _(compatibility with old serialized projects are handled internally by an upgrader)_
- **BREAKING-CHANGE:** Rewrote the filter to be part of library now + improvements _(compatibility with old serialized projects are handled internally by an upgrader)_
- **BREAKING-CHANGE:** Rewrote the transition to be part of library now + improvements _(compatibility with old serialized projects are handled internally by an upgrader)_
- Removed processUpdate call from Clip class as it was duplicating the update functionality
- Removed transition shader fixes that transformed uniforms into const, now they're properly used as properties when configured at library addition

### Fixed

- Fixed lottie leaking properties from text to other components (like stroke color/width)
- Added missing FFmpeg exports
- Improved text padding
- The video now doesn't loop in preview as we don't support yet video looping, so in was misleading before, as on rendering it was not looping
- Fixed multiple big videos being added to the timeline crashing on MacOS
- Fixed uTime uniform on effects not getting updated + made it relative to the clip startTime
- Fixed transition flickering when seeking
- Fixed a bug (at least on Windows/Opera) where adding multiple files at once caused an asyncify error when transcoding
- Added a new way to detect unsupported videos
- Fixed progress reporting
- Fixed a decoder error for some media files that required initial packets for metadata in preview
- Fixed background rendering on return throwing an error
- Fixed deserialization not using the initial Engine init options

## [1.10.3] - 2025-04-08

### Added

- Added support for setting and getting the intensity of filters
- Added support for text padding

### Fixed

- Fixed alpha issues for filters
- Fixed Lottie internal state being propagated from text

## [1.10.2] - 2025-03-26

### Added

- Added automatic duration for animation in case it is not set
- Added missing Lottie getGroups()

### Changed

- Reverted default wrap mode for lottie to clamp

### Fixed

- Fixed lottie clip scale/size being overwritten on init
- Fixed lottie clip not identifying layers correctly after obfuscation
- Fixed animation extending when only `in` is set

## [1.10.1] - 2025-03-24

### Added

- **BREAKING-CHANGE:** Improved Lottie clip properties
- Added fill color property for LottieClip SetProperty.
- Added background rendering
- Added reset functionality for Engine
- Added setter/getter for wrap mode (not available for all clips)
- Added loop wrap mode for Lottie clips
- Added automigration for existing lottie properties to the new v3 property format
- Worker based audio mixing is now default and doesn't use additional memory for each clip

### Fixed

- Fixed lottie font loader to work in Safari
- Fixed lottie color replacement not using the full path for nested compositions
- Fixed TextClip returning only the first character for getFontFamily()

## [1.9.8] - 2025-03-14

### Added

- Added new shapes to `ShapeClip` (star, rounded rect)
- Added new parameters to the `ShapeClip` (strokeAlignment, rectRadius, nrPoints, innerRadius, outerRadius)

### Fixed

- Fixed shape clip
- Fixed audio delay on Safari

## [1.9.5] - 2025-02-22

### Added

- Added parallel audio mixing, improves rendering time

> By default it's disabled to maintain compatibility
>
> Use engine.getSettings().setRenderAudioUseWorker(true) to turn it on
>
> It might double the tab memory usage during the rendering. Use at own discretio. Please test it with your worst case scenario.
>
> Not recommended for projects with big videos (>1GB+), good for relatively small projects with complex layering or multiple chunks
>
> The memory requirements for this might disappear in the future updates so stay tuned...

### Fixed

- Fixed audio error on seeking
- Optimized seeking on projects with multiple chunks of video/audio clips

## [1.9.4] - 2025-02-20

### Added

- Transcode interface to add your own transcoder (local or server based)
- Added SetProjectId method to Engine
- Added guard for multiple deserialize calls + warnings
- Added font rendering support for lottie

### Changed

- Improved compatibility detection on VideoEncoder, now it also swaps the bitrateMode on top of hardware acceleration
- Added VideoEncoder failed configuration detection and now the export exists earlier
- Improved LottieClip loader
- Increased keyframe interval (gop) on encoder
- Improved subtitles rendering

### Fixed

- Fixed IndexedDB storage provider
- Added new wasm frame interface for better output
- Fixed Subtitle manager highlight late response on setPosition/setScale
- Added subtitles reset on deserialization

## [1.9.3] - 2025-02-19

### Fixed

- Fixed fast deserialization without await, now it queues the request

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

- **BREAKING-CHANGE:** Made engine export return null in case of nothing rendered
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
