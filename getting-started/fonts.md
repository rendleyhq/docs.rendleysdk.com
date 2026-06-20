# Fonts

The SDK supports displaying custom fonts and different styles on the canvas, giving you complete control over the typography in your projects.

By default, no fonts are loaded, so you can work with the browser's default fonts. However, if you want to bring in your own custom fonts, you can do so.

Once the font is loaded through the registry, it will be available in the DOM for further use.

## Import from CSS Files

You can import a font by specifying the URL to the font face or providing a CSS entry point with all the styles set up. Here's an example:

<LiveRun>

```typescript
// Load Bebas Neue from Google Fonts and apply it to a text clip.
const fontCssUrl =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";

await Engine.getInstance()
  .getFontRegistry()
  .loadFromCssUrl("Bebas Neue", fontCssUrl);

const title = await layer.addClip({
  type: "text",
  text: "BEBAS NEUE",
  startTime: 0,
  duration: 5,
  style: {
    fontFamily: "Bebas Neue",
    fontSize: 260,
    color: "#FFFFFF",
  },
});
title.style.setPosition(960, 540);
```

</LiveRun>

This parses the CSS and loads every font face defined in the file. After `loadFromCssUrl` resolves, any clip can reference the font family by name.

## Import from Font Files

You can also import a font by specifying the URL to the font file. The font should be in a format supported by the [FontFace](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) API. Here's an example:

```typescript{3}
const fontUrl = "https://myapp.com/fonts/Roboto.woff";

await Engine.getInstance().getFontRegistry().loadFromUrl("Roboto", fontUrl);
```
