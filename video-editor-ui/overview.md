# Video Editor UI

A complete video editor interface built on top of the [Rendley SDK](/), shipped as a single web component. Drop `<rendley-video-editor>` into any page and you get a working editor with a timeline, preview canvas, media library, text / shape / lottie clips, transitions, effects, filters, subtitles, and export.

## What's Included

The interface is organized around a sidebar, a canvas, a timeline, and a top bar:

- **Media sidebar** for uploading files via drag-and-drop and browsing stock content — Pexels images and videos, Giphy GIFs and stickers — then dropping them straight onto the canvas or timeline.
- **Timeline** with multiple layers, drag-to-reorder, trim, split, zoom, and transitions between clips.
- **Canvas editing** with on-screen move / resize / rotate handles and snap guides for positioning clips.
- **Selection panel** that adapts to the selected clip — edit text, adjust audio, apply filters and effects, add in/out/loop animations, and style subtitles.
- **Subtitles tab** for importing SRT files and applying style presets and highlight animations.
- **Text, shapes, and Lottie** added as their own clips and styled directly in the editor.
- **Top bar** with the resolution / aspect-ratio picker, background color, theme toggle, and the Export button.
- **Built-in UX**: undo / redo keyboard shortcuts, light / dark / system themes, a high-contrast mode, and localization.

The sidebar tabs and per-clip panels can be reordered or hidden through [configuration](/video-editor-ui/configuration.md), so you can tailor the UI to your use case.

Beyond what the interface exposes, the editor is a thin layer over the Rendley SDK. Anything the SDK can do — custom GLSL effects and filters, advanced export options, keyframe animation, and much more — can be wired in from your own code through the [Engine](/video-editor-ui/events-and-methods.md), even when there's no built-in button for it yet.

## How It's Built

The editor is a [StencilJS](https://stenciljs.com/) web component, so it works in any host framework (React, Vue, Angular, Svelte, or plain HTML). It uses [MobX](https://mobx.js.org/) for internal state and [Moveable.js](https://github.com/daybrush/moveable) for the canvas transform handles. Under the hood every operation calls into the Rendley SDK, that's also how your code interacts with the editor (see [Events & Methods](/video-editor-ui/events-and-methods.md)).

## Licensing

The editor requires a valid Rendley license to render. A free license is available at [app.rendleysdk.com](https://app.rendleysdk.com/) and lets you use the editor loaded from the Rendley CDN with all features.

The license does **not** include the editor's source code. If you want to modify the editor — change the source, remove the Rendley logo, integrate third-party services, or self-host on your own CDN — you can [purchase access to the source code](https://rendleysdk.com/javascript-video-editor) (GitHub repository) separately. See the [Source Code page](/video-editor-ui/source-code.md) for setup once you have access.
