# HTML Text Clip

The [HtmlTextClip](https://docs.rendleysdk.com/api-reference/classes/HtmlTextClip.html) renders a snippet of HTML as a visual element on the canvas. Useful when you need mixed styles, nested elements, or inline formatting that plain [TextClip](/getting-started/clips/text.md) does not support.

Everything is rendered inside a `<span>` element, so any HTML and CSS that a span can contain is valid.

## Create an HTML Text Clip

<LiveRun>

```typescript
const clip = await layer.addClip({
    type: "html_text",
    htmlText: `
    <span style="
    background: linear-gradient(90deg, #ff4d6d, #6d6ff2);
    -webkit-background-clip: text;
    color: transparent;
    font-size: 160px;
    font-weight: 900;
    ">
    Gradient text
    </span>
    `,
    fonts: [],
    startTime: 0,
    duration: 5,
  });
clip.style.setPosition(960, 540);
```

</LiveRun>

## Fonts

If your HTML uses custom fonts, list them in the `fonts` array. Each entry must also be registered through the [FontRegistry](/getting-started/fonts.md):

```typescript
await layer.addClip({
  type: "html_text",
  htmlText: `<span style="font-family: Inter, sans-serif">Hello</span>`,
  fonts: ["Inter"],
  startTime: 0,
  duration: 5,
});
```

::: warning
Any font referenced in the HTML without being listed in `fonts` will fall back to the browser default. Subtle bugs come from missing a font name in the array.
:::

## Update the Content

```typescript
htmlTextClip.setHtmlText(`<span>Updated</span>`);
```

## See Also

- [Text](/getting-started/clips/text.md)
- [Fonts](/getting-started/fonts.md)
- API reference: [`HtmlTextClip`](https://docs.rendleysdk.com/api-reference/classes/HtmlTextClip.html)
