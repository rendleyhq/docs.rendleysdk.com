# Editing Text on the Canvas

Users expect to double-click a text clip and type directly on the canvas, with a caret, a selection, IME and the mobile keyboard. The SDK does not create any DOM for this. Instead, a `TextClip` opens a text-editing session and tells you exactly where its glyphs are and how they are typeset, and you place a transparent `<textarea>` over the canvas. The canvas keeps drawing the text, the textarea only supplies the caret, the selection and the keyboard input.

## Who Does What

| SDK (`TextClip`)                                                                   | Host                                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Where the text frame and the glyph block are (`getTextEditOverlay()`)              | A DOM element positioned over the canvas               |
| The clip's typography as CSS (font, measured line height, spacing, wrap, align)    | Focus, caret, selection, IME, mobile keyboard          |
| Live rendering of the edited text (`session.setText`)                              | The gesture that starts editing (double-click, Enter)  |
| Undo bookkeeping: one entry per session (`commit`), rollback (`cancel`)            | When a session ends (blur, Escape, click outside)      |
| Suspending `text` keyframes while editing                                          | Pausing playback                                       |

Because the textarea is transparent and the canvas paints the glyphs, small differences between DOM text layout and canvas text layout are never visible.

## Start a Session

```typescript
const clip = Engine.getInstance().getTimeline().getClipById(clipId);
if (!(clip instanceof TextClip)) return;

Engine.getInstance().getTimeline().pause();

const session = clip.beginTextEdit();
```

`beginTextEdit()` cancels any unfinished session on the same clip. While a session is open, keyframes on the `text` property are ignored so the glyphs under the caret are always the stored text, and `clip.isTextEditing()` returns `true`.

## Place the Editor

Call `session.getOverlay()` to get a [`TextEditOverlay`](https://docs.rendleysdk.com/api-reference/interfaces/TextEditOverlay.html):

```typescript
interface TextEditOverlay {
  bounds: ClipBoundingInfo; // the clip box in composition pixels, same as clip.getBoundingInfo()
  frame: { width: number; height: number }; // the same box before the clip scale, in text units
  scale: [number, number]; // the clip scale, signs included (negative = flipped)
  content: { x: number; y: number; width: number; height: number }; // glyph block inside `frame`
  wrapWidth: number | null; // unscaled word-wrap width, null when the text does not wrap
  text: string; // the text currently rendered
  css: TextEditCss; // camelCase CSS declarations to spread on the textarea
}
```

Two coordinate systems are involved:

- `bounds` is in composition pixels. This is the box you already use for selection handles.
- `frame`, `content` and `css` are in unscaled text units, the units `fontSize`, `padding` and `wordWrapWidth` are stored in. `frame.width * scale[0]` equals `bounds.width`.

The recipe is: position a box at `bounds` (scaled to CSS pixels and rotated), inside it an element of `frame` size scaled by the clip scale, and inside that the textarea at `content` with `css` spread on it. Do not scale the font size yourself. Applying the scale as one CSS `transform` keeps non-uniform scale and flips identical to the sprite.

`ratio` below is CSS pixels per composition pixel of the engine canvas, `canvas.clientWidth / canvas.width`.

```typescript
const { bounds, frame, content, scale, css, text } = session.getOverlay();

// 1. The clip box. Most hosts already have this element for the selection handles.
const box = document.createElement("div");
box.style.position = "absolute";
box.style.left = `${bounds.center[0] * ratio}px`;
box.style.top = `${bounds.center[1] * ratio}px`;
box.style.width = `${bounds.width * ratio}px`;
box.style.height = `${bounds.height * ratio}px`;
box.style.transform = `translate(-50%, -50%) rotate(${bounds.rotation}rad)`;

// 2. The text frame, scaled like the sprite. Centering with translate keeps flips in place.
const frameEl = document.createElement("div");
frameEl.style.position = "absolute";
frameEl.style.left = "50%";
frameEl.style.top = "50%";
frameEl.style.width = `${frame.width}px`;
frameEl.style.height = `${frame.height}px`;
frameEl.style.transform = `translate(-50%, -50%) scale(${scale[0] * ratio}, ${scale[1] * ratio})`;
frameEl.style.pointerEvents = "none";

// 3. The textarea, on the glyph block.
const textarea = document.createElement("textarea");
Object.assign(textarea.style, {
  position: "absolute",
  left: `${content.x}px`,
  top: `${content.y}px`,
  width: `${content.width}px`,
  height: `${content.height}px`,
  ...css,
  // Caret-only overlay: the canvas draws the glyphs.
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "0",
  textShadow: "none",
  caretColor: css.color,
  background: "transparent",
  border: "0",
  outline: "none",
  padding: "0",
  margin: "0",
  resize: "none",
  overflow: "hidden",
  pointerEvents: "auto",
});
textarea.value = text;
textarea.spellcheck = false;

frameEl.appendChild(textarea);
box.appendChild(frameEl);
canvasContainer.appendChild(box);

textarea.focus();
textarea.select();
```

In React, spread `css` into the `style` prop and put the transparent-fill overrides after it. The `css` keys are camelCase for that reason.

::: warning Keep the stroke and the shadow off
`css.WebkitTextStroke` and `css.textShadow` reproduce what the renderer paints. With a transparent fill they still paint the glyph outline, so a caret-only overlay must override both, as the snippet does. Also stop pointer events on the textarea from reaching your selection box, otherwise a click in the text starts a drag.
:::

`content` already accounts for padding, wrap width, alignment, stroke, drop shadow and the baseline difference between the renderer and CSS. It is the box of the DOM line boxes whose glyphs coincide with the canvas glyphs, which is why it is not centered in the frame when the clip has a stroke or a shadow.

## Keep It Aligned

Every change of the text or the style moves the glyph block, so re-read the overlay and re-apply the geometry. Listen for the clip's events:

```typescript
const refresh = ({ clipId: id }: { clipId: string }) => {
  if (id !== clipId || session.isFinished()) return;
  applyOverlay(session.getOverlay());
};

const events = Engine.getInstance().events;
events.on("clip:updated:text", refresh);
events.on("clip:style:updated", refresh);
events.on("clip:updated", refresh);
```

- **Typing**: call `session.setText(textarea.value)` on every `input` event. The canvas updates synchronously, `clip:updated:text` fires (so a properties panel mirroring the text stays in sync) and no undo entry is recorded.
- **Typography changes while editing** (font, size, color from a toolbar) go through the normal style setters. They emit `clip:style:updated`, so the same refresh keeps the overlay aligned.
- **Resizing while editing**: horizontal handle drags on a text clip change the word-wrap width through `setWordWrapWidth`, which also emits `clip:style:updated`.
- **Canvas resize**: recompute `ratio` when the canvas container changes size, for example with a `ResizeObserver`.

## End the Session

Exactly one of `commit()` or `cancel()` must be called per session.

```typescript
textarea.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    session.cancel(); // restores the initial text, records nothing
    close();
  } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    session.commit(); // one undo entry for the whole edit
    close();
  }
});

textarea.addEventListener("blur", () => {
  session.commit();
  close();
});
```

- `commit()` records the initial to final text as a single undo entry, exactly like one direct `setText` call would have. A session that ends with the text it started with records nothing.
- `cancel()` restores the initial text and records nothing.
- End the session when the selection moves to another clip or the clip is removed. Destroying the clip cancels the session, but you still have to unmount your textarea.

While the textarea has focus, keep your global keyboard shortcuts (Delete, Backspace, Space, arrow keys) from firing.

## API Summary

| Member                       | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `clip.beginTextEdit()`       | Opens a session and returns it. Cancels an unfinished session on the same clip.     |
| `clip.isTextEditing()`       | `true` while a session is open.                                                      |
| `clip.getTextEditOverlay()`  | The overlay geometry and CSS. Also works without a session.                          |
| `session.getOverlay()`       | Same as above, for the session's clip.                                               |
| `session.setText(text)`      | Live update: renders on the canvas, emits `clip:updated:text`, records no undo.      |
| `session.getText()`          | The current text.                                                                    |
| `session.getInitialText()`   | The text captured when the session began. What `cancel()` restores.                  |
| `session.commit()`           | Ends the session and records one undo entry, or none if the text did not change.     |
| `session.cancel()`           | Ends the session and restores the initial text.                                      |
| `session.isFinished()`       | `true` after `commit()` or `cancel()`.                                               |

## See Also

- [Text Clip](/getting-started/clips/text.md)
- [Undo / Redo](/getting-started/undo-redo.md)
- [Listening to events](/user-interface/listening-to-events.md)
- API reference: [`TextClip`](https://docs.rendleysdk.com/api-reference/classes/TextClip.html), [`TextEditSession`](https://docs.rendleysdk.com/api-reference/classes/TextEditSession.html), [`TextEditOverlay`](https://docs.rendleysdk.com/api-reference/interfaces/TextEditOverlay.html)
