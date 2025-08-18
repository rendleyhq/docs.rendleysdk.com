# Layer

The [Layer](https://docs.rendleysdk.com/api-reference/classes/Layer.html) is where all clips and transitions are placed. Each layer is stacked on top of each other, which enables you to create overlapping compositions.

There are no restrictions regarding what kind of clips you can add to a layer. You can add text, images, videos, audio, custom HTML elements, etc., all on the same layer.

## Creating a Layer

To create a layer, you can use the following:

```typescript
const layer = Engine.getInstance().getTimeline().createLayer();
```

If you want to insert a layer at a specific position, you can provide an index parameter:

```typescript
const layer = Engine.getInstance().getTimeline().createLayer({ index: 2 });
```

This is useful when you need to create a new layer between existing ones.

## Removing a Layer

Removing a layer will also remove all associated resources, such as clips and transitions. To remove a layer, you can use the following:

```typescript
Engine.getInstance().getTimeline().removeLayer(layer.id);
```
