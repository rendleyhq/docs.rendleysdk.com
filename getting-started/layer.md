# Layer

The [Layer](https://docs.rendleysdk.com/api-reference/classes/Layer.html) is where all clips and transitions are placed. Each layer is stacked on top of each other, which enables you to create overlapping compositions.

There are no restrictions regarding what kind of clips you can add to a layer. You can add text, images, videos, audio, custom HTML elements, etc., all on the same layer.

## Creating a Layer

`createLayer()` returns the new layer. Stacking two layers with clips produces an overlay, the later layer renders on top.

<LiveRun standalone>

```typescript
import { Engine } from "@rendley/sdk";

await Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1920,
    height: 1080,
    backgroundColor: "#000000",
    view: document.getElementById("rendley-canvas") as HTMLCanvasElement,
  },
});

// Layer 1: blue rectangle background
const backgroundLayer = Engine.getInstance().getTimeline().createLayer();
const background = await backgroundLayer.addClip({
  type: "shape",
  shape: "rectangle",
  startTime: 0,
  duration: 5,
  style: { fillColor: "#6d6ff2", width: 1600, height: 900 },
});
background.style.setPosition(960, 540);

// Layer 2: text on top
const textLayer = Engine.getInstance().getTimeline().createLayer();
const title = await textLayer.addClip({
  type: "text",
  text: "Two layers",
  startTime: 0,
  duration: 5,
  style: { fontSize: 180, color: "#FFFFFF", fontWeight: "900" },
});
title.style.setPosition(960, 540);

await Engine.getInstance().getTimeline().play();
```

</LiveRun>

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

## Naming a Layer

You can attach a friendly name to each layer. The name is preserved in the serialized project:

```typescript
layer.setName("Background music");
const name = layer.getName();
```

## Visibility, Mute, and Volume

Layers can be hidden or muted without being removed. Mute and volume are applied on top of each clip's own audio settings:

```typescript
layer.setVisibility(false);
layer.setMuted(true);
layer.setVolume(0.5);
```

## Managing Clips

```typescript
await layer.addClip({ mediaDataId, startTime: 0 });
layer.removeClip(clipId);
await layer.splitClip(clipId, 2.5); // split at time 2.5s
layer.moveClipToLayer(clipId, otherLayerId);

layer.getClipById(clipId);
layer.getClipIds(); // in order
layer.getClips(); // { id: clip } dictionary
```

### Adjust Layout

`adjustClipsLayout` rearranges the clips to avoid overlaps. It is useful after programmatic changes that might cause conflicts:

```typescript
layer.adjustClipsLayout();
```

### Finding Empty Space

To check whether a range of time is free inside the layer, or to find the next free spot:

```typescript
const free = layer.hasEmptySpace(5, 10);
const nextStart = layer.getNextEmptySpace(5, 10);
```

## Adding a Transition

Transitions belong to the layer. They are placed between two consecutive clips and take their duration from the overlap between the clips:

```typescript
const transitionInstanceId = layer.addTransition({
  startClipId: "clipA",
  endClipId: "clipB",
  inDuration: 1,
  outDuration: 1,
  transitionId: libraryTransitionId,
});
```

See [Transitions](/getting-started/transitions.md) for more details.

## Events

Layers emit events whenever they are updated (renamed, visibility toggled, muted, reordered, etc.):

- `layer:added`
- `layer:removed`
- `layer:updated`
- `layer:property_updated`
- `layers:order_updated`

See [Listening to Events](/user-interface/listening-to-events.md) for the full list.
