# Concepts

A high-level map of how the SDK fits together. If you've worked with non-linear video editors before (Final Cut, Premiere, DaVinci Resolve), most of the model will feel familiar.

## Engine

The [Engine](/getting-started/engine.md) is the entry point. It's a singleton, you call `Engine.getInstance().init(...)` once at startup with a license and a canvas, and every other SDK call flows through it. The Engine owns the timeline, the library, the display, the renderer, and the settings.

## Display

The [Display](/getting-started/display.md) is the WebGL canvas the SDK renders into. It defines the composition's resolution (1920×1080, 1080×1920 for portrait, or whatever you configure) and the background color. The display's DOM size can differ from the composition resolution, scaling is automatic.

## Library

The [Library](/getting-started/library.md) is the asset store. Every image, video, audio file, font, effect, filter, transition, and subtitle source goes in here before a clip can reference it. Media is content-hashed, so duplicates are deduplicated automatically.

### MediaData

Each entry in the Library is a [MediaData](https://docs.rendleysdk.com/api-reference/classes/MediaData.html), metadata (dimensions, duration, file type), the underlying blob, lifecycle status, and helpers for sample extraction and persistence.

## Timeline

The [Timeline](/getting-started/timeline.md) is the composition. It owns the playback clock, the layers, and the playback controls (`play`, `pause`, `seek`, `stop`). All edits happen through it.

### Layer

A [Layer](/getting-started/layer.md) is a horizontal track of non-overlapping clips. Layers stack vertically: the first layer is the bottom, each new layer renders on top. Use multiple layers when you want clips to overlap visually or when you need independent audio tracks.

### Clip

A [Clip](/getting-started/clips.md) is the smallest unit on a layer. It can be a piece of media (video, image, audio, GIF, SVG), a drawn element (text, shape, Lottie), or a special clip like a subtitles track, an adjustment layer, or a custom clip you authored yourself.

## Animation

Two animation systems run side by side:

- [Keyframe Animation](/getting-started/property-animator.md): one track per property, bezier handles, compound tracks, and support for animating effect and filter parameters.
- [Animation Controller](/getting-started/animation-layered.md): In / Out / Loop phases driven by `clip.animationController`.

## Effects, Filters, Transitions

- [Effects](/getting-started/effects.md) are GLSL shader passes applied per clip. The SDK ships with 30+ built-ins; you can add your own.
- [Filters](/getting-started/filters.md) are LUT-based color grades. Ship `.png` LUTs (the format exported by tools like Photoshop and 3D LUT Creator) and attach them to clips.
- [Transitions](/getting-started/transitions.md) are GLSL shaders applied between two adjacent clips on the same layer.

## Subtitles

[Subtitles](/getting-started/subtitles.md) are a first-class asset type. Import from SRT or build programmatically. Style globally through the [SubtitlesManager](https://docs.rendleysdk.com/api-reference/classes/SubtitlesManager.html), every subtitles clip in the project picks up the current style.

## Storage

By default, media is only in browser memory and disappears on refresh. Plug in a [Storage](/getting-started/storage.md) provider (IndexedDB for local, AWS S3 with presigned URLs for cloud) to persist.

## Events

The SDK emits [events](/user-interface/listening-to-events.md) on every state change, media added, clip moved, effect updated, animation changed, render completed. Use them to drive your UI without polling.

## Undo / Redo

An opt-in [UndoManager](/getting-started/undo-redo.md) records every state change (provided you initialize the Engine with `enableUndoRedo: true`) and lets you group multiple operations into a single undoable step.

## Rendering

Rendering runs through the Engine's [export](/getting-started/export.md) pipeline. By default it uses WebCodecs for hardware-accelerated encoding. Projects larger than the browser's blob allocation limit can opt into [chunked output](/getting-started/export.md#large-files-and-chunked-output). For server-side rendering, the [rendering server](/rendering/render-on-server.md) runs the same SDK inside headless Chromium.

## UI

The SDK doesn't impose a user interface, you get a rendering engine and events, everything else is up to you. For a full editor experience out of the box, the [Video Editor UI](/video-editor-ui/overview.md) is a web component that wraps the SDK with a complete timeline, canvas handles, sidebar, and export dialog.
