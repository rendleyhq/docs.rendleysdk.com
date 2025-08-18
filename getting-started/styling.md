# Styling

When styling a clip, you can modify various properties such as position, size, rotation, border radius, and more. Most clips share similar [styling](https://docs.rendleysdk.com/api-reference/classes/ClipStyle.html) attributes, however, some clips, like text clips, have additional properties that can be adjusted, including font size, color, alignment, and others.

The clips with more than the default styling properties are the [**Text**](https://docs.rendleysdk.com/api-reference/classes/TextStyle.html) and [**Shape**](https://docs.rendleysdk.com/api-reference/classes/ShapeStyle.html) clips.

## Example

You interact with the styling of a clip using its `style` property. For instance, to change the font size, color, and position of a text clip, you can do the following:

```typescript
const textClip = await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 5,
});

// Modify styling properties
textClip.style.setFontSize(24);
textClip.style.setColor("#FF0000");
textClip.style.setPosition(100, 100);
```

Alternatively, you can initialize a clip with a style object directly:

```typescript
const textClip = await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 5,
  style: {
    fontSize: 24,
    color: "#FF0000",
    position: [100, 100],
  },
});
```
