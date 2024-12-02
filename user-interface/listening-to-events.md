# Listening to Events

To create an interactive user interface around the SDK, you need a way to interact with its state. We achieve this by emitting events in response to SDK actions. For example, when a layer is created, or when a clip is modified, we emit corresponding events. Once you receive an event, you can store it in your preferred state management library and react accordingly to the changes. A complete list of supported events can be found here: [SDK Events](https://docs.rendley.com/api-reference/enums/EventsEnum.html).

## Setting Up Listeners

To listen for an event, use the following code:

```typescript
Engine.getInstance().events.on("layer:added", ({ layerId }) => {
  console.log(`Layer ${layerId} was added`);
});
```

When using TypeScript, you will benefit from automatic validation of the received payload, ensuring you always know what data you are receiving.

## Removing Listeners

It is a good practice to remove listeners when you are done with them. You can do this as follows:

```typescript
Engine.getInstance().events.off("layer:added", handleLayerAdded);
```

To remove all listeners, you can use:

```typescript
Engine.getInstance().events.removeAllListeners();
```
