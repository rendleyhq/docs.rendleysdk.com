# Best Practices

A list of best practices for getting the best performance of the SDK

## Do not add the same asset multiple times

Instead of loading the same asset multiple times, you should reference it from [the library](/getting-started/library.md).

## Do not upload images for simple shapes

If you need a rectangle, a circle or some other primary shape, it is better to use the [Shape](/getting-started/clips.md#shape) clip instead.

## Avoid calling `deserialize` multiple times

When calling deserialize multiple times, a lot of internal resources are being initialized. If you are frequently applying updates using a JSON, it is better to identify the changes and apply them manually.
