# Fonts

The SDK supports displaying custom fonts and different styles on the canvas, giving you complete control over the typography in your projects.

By default, no fonts are loaded, so you can work with the browser's default fonts. But if you want to bring in your own custom fonts, you can do so.

Once the font is loaded through the registry, it will be available in the DOM for futher use.

## Import from CSS files

You can import a font by specifying the URL to the font face or providing a CSS entry point with all the styles set up. Here's an example:

```typescript{3}
const fontCssUrl = "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@;1,100;1,300;1,400;1,500;1,700;1,900&display=swap";

await Engine.getInstance().getFontRegistry().loadFromCssUrl("Roboto", fontCssUrl);
```

This will parse the css and load all the font faces defined in the file.

## Import from font files

You can also import a font by specifying the URL to the font file. The font should be in a format support by the [FontFace](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) API Here's an example:

```typescript{3}
const fontUrl = "https://myapp.com/fonts/Roboto.woff";

await Engine.getInstance().getFontRegistry().loadFromUrl("Roboto", fontUrl);
```
