# Layer

The Layer is where all the clips and transitions are being placed. Each layer has an incremental zIndex which enables you to create compositions that overlap each other.

There is no restriction regarding what kind of clips you can add to the layer. You can add text, images, videos, audio, custom HTML elements, etc, all on the same layer.

## Creating a layer

To create a layer, you can use the following:

```typescript
const layer = Engine.getInstance().getTimeline().createLayer();
```

If you want to insert a layer at a specific position, you can provide an index parameter:

```typescript
const layer = Engine.getInstance().getTimeline().createLayer({ index: 2 });
```

This is useful when you need to create a new layer in between existing ones.

## Removing a layer

Removing a layer, will remove all the associated resources associated with it, like clips and transitions. To remove a layer, you can use the following:

```typescript
Engine.getInstance().getTimeline().removeLayer(layer.id);
```
