# Video Editor UI

A complete video editor interface built on top of the [Rendley SDK](/), shipped as a single web component. Drop `<rendley-video-editor>` into any page and you get a working editor with a timeline, preview canvas, media library, text / shape / lottie clips, transitions, effects, filters, subtitles, and export.

![Video Editor Cover](https://docs.rendley.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvideo-editor-cover.a87618bd.webp&w=3840&q=75)

## What's Included

- **Media library** with drag-and-drop uploads, stock images (Pexels), and GIFs (Giphy).
- **Timeline** with multiple layers, trim, split, drag-and-drop reorder, and transitions.
- **Canvas preview** with move / resize / rotate handles and snap lines.
- **Clip types**: video, audio, image, GIF, shape, text, subtitles, Lottie.
- **Effects & filters**: built-in library plus support for custom GLSL shaders through the SDK.
- **Subtitles**. SRT import, automatic word timing, style presets, highlight animations.
- **Export**. MP4 / WebM output with the full SDK render pipeline, including chunked output for large files.
- **Undo / redo**: keyboard shortcuts, theming, and localization.

## How It's Built

The editor is a [StencilJS](https://stenciljs.com/) web component, so it works in any host framework (React, Vue, Angular, Svelte, or plain HTML). It uses [MobX](https://mobx.js.org/) for internal state and [Moveable.js](https://github.com/daybrush/moveable) for the canvas transform handles. Under the hood every operation calls into the Rendley SDK, that's also how your code interacts with the editor (see [Events & Methods](/video-editor-ui/events-and-methods.md)).

## Licensing

The editor requires a valid Rendley license. A free evaluation license is available at [app.rendleysdk.com](https://app.rendleysdk.com/). For production use or to unlock the Pro version (full source code, advanced customization), see the [Pro page](/video-editor-ui/pro.md).

## Next Steps

- [Installation](/video-editor-ui/installation.md). CDN and npm setups.
- [Configuration](/video-editor-ui/configuration.md): props, JSON config, aspect ratios, sidebar modules.
- [Events & Methods](/video-editor-ui/events-and-methods.md): hook into lifecycle and access the SDK.
- [Common Tasks](/video-editor-ui/common-tasks.md): recipes for save/load, export, media upload, theming.
