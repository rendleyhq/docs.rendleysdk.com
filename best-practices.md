# Best Practices

Here are some best practices to achieve optimal performance with the SDK.

## Do not add the same asset multiple times

Instead of loading the same asset multiple times, reference it from [the Library](/getting-started/library.md).

## Do not upload images for simple shapes

If you need a rectangle, circle, or any other basic shape, it is better to use the [Shape](/getting-started/clips.md#shape) clip instead.

## Avoid calling `deserialize` to apply updates

Calling `deserialize` multiple times can initialize many internal resources unnecessarily. If you frequently apply updates using JSON, it is more efficient to identify the changes and apply them manually.
