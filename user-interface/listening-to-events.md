# Listening to events

To create an interactive user interface around the SDK, you need a way to interact with it's state. The way we do it is we emit events as a result of SDK actions. For instance, when a layer is created, we emit an event about that, or when you changed something about the clip, we emit an event about that as well. Once you receive the event, you can store it in your state management library of choice and react accordingly to the changes. The complete list of events we support can be found here [SDK Events](https://docs.rendley.com/api-reference/enums/EventsEnum.html).

## Setting up listeners

Here is how to listen to an event

```typescript
Engine.getInstance().events.on("layer:added", ({ layerId }) => {
  console.log(`Layer ${layerId} was added`);
});
```

When using typescript, you will get automatic validation of the received payload so that you always know what you are receiving.

## Removing listeners

It is a good practice to remove listeners when you are done with them.

```typescript
Engine.getInstance().events.off("layer:added", handleLayerAdded);
```

You can also remove all listeners by using the

```typescript
Engine.getInstance().events.removeAllListeners();
```
