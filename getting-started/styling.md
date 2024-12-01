# Styling

When styling a clip, we enable modifying its position, size, rotation, border radius and many more properties. Most of the clips have similar styling attributes, however, there are some exceptions, such as text clips. Text clips have more properties that you can change, such as font size, color, alignment and more.

The clips that have more than the default styling properties are the `Text` and the `Shape` clips

## Example

The way to interact with the styling is to use the `style` property of the clip. For example, to change the font size of a text clip, its color and position, you can do the following:

```typescript{8-10}
const textClip = await layer.addClip({
  type: "text",
  text: "Hello World",
  startTime: 0,
  duration: 5,
});

textClip.style.setFontSize(24);
textClip.style.setColor("#FF0000");
textClip.style.setPosition(100, 100);
```

You can also initialize a clip with a style object directly:

```typescript{7-9}
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
