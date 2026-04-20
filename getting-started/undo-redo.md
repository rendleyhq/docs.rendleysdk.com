# Undo / Redo

The SDK ships with an [UndoManager](https://docs.rendleysdk.com/api-reference/classes/UndoManager.html) that records state changes across the Engine, Timeline, Layers, Clips, Library, and Subtitles. It is disabled by default. Enable it when initializing the Engine:

```typescript
await Engine.getInstance().init({
    enableUndoRedo: true,
    ...
  });
```

## Basic Usage

```typescript
const undoManager = Engine.getInstance().getUndoManager();

undoManager.undo();
undoManager.redo();
undoManager.canUndo();
undoManager.canRedo();
undoManager.clear();
```

## Grouping Changes

By default, each recorded action is its own undo step. To group multiple changes into a single undoable operation, wrap them in a group:

```typescript
undoManager.startGroup("Resize and rotate");
clip.style.setScale(0.8, 0.8);
clip.style.setRotation(Math.PI / 6);
undoManager.endGroup();
```

Call `cancelGroup()` to discard a group that is still open.

## Pausing Recording

If you need to apply changes that should not be undoable (for example, temporary previews while a user drags), pause the recorder:

```typescript
undoManager.pause();
// ... non-undoable changes ...
undoManager.resume();
```

For nested pausing (recommended when the same flow can be entered from multiple places), use `pushPause()` and `popPause()`.

```typescript
undoManager.pushPause();
// ... work ...
undoManager.popPause();
```

You can also inspect the pause stack and clear it when needed:

```typescript
const stack = undoManager.getPauseStack();
undoManager.clearPauseStack();
```

## Enabling / Disabling at Runtime

```typescript
undoManager.setEnabled(false);
```

Disabling the manager also clears its internal stacks.

## Serialization

The undo/redo history can be serialized and restored alongside the project. This allows users to continue editing after closing the tab:

```typescript
const undoData = undoManager.serialize();
await undoManager.deserialize(undoData);
```

## Events

Every undo/redo mutation emits an event. Use these events to update your UI state (for example, to enable/disable the Undo and Redo buttons):

```typescript
Engine.getInstance().events.on("undo:changed", ({ canUndo, canRedo }) => {
  undoButton.disabled = !canUndo;
  redoButton.disabled = !canRedo;
});

Engine.getInstance().events.on("undo:performed", ({ group }) => {
  console.log("Undid:", group.name);
});

Engine.getInstance().events.on("redo:performed", ({ group }) => {
  console.log("Redid:", group.name);
});
```

## Custom Undo Actions

If you are building on top of the SDK (for example with a [Custom Clip](/getting-started/clips/custom.md)), you can record your own undo entries through `recordCustomUndo`. The action name must not collide with any value in [`UndoActionEnum`](https://docs.rendleysdk.com/api-reference/enums/UndoActionEnum.html) (those are reserved for the SDK itself).

```typescript
undoManager.recordCustomUndo("my-app:rename", {
  prev: previousName,
  next: nextName,
});
```

The `undo:process:custom` event fires when the custom record is undone or redone, giving you a chance to apply the state change yourself:

```typescript
Engine.getInstance().events.on(
  "undo:process:custom",
  ({ undoRecord, redoGroup }) => {
    if (undoRecord.action === "my-app:rename") {
      applyName(undoRecord.data.prev);
    }
  },
);
```

## Inspecting History

Surface the pending undo/redo groups in your UI (for example, to show "Undo: Move clip" in a menu):

```typescript
undoManager.canUndo(); // boolean
undoManager.canRedo(); // boolean
undoManager.getUndoHistory(); // string[] of group names, newest last
undoManager.getRedoHistory(); // string[]
undoManager.getPerforming(); // true while an undo/redo is in flight
```

`undo:redo:changed` fires on every mutation, so you can drive the UI reactively without polling.

## History Size

The default history holds ~100 groups. Adjust it with `setMaxUndoHistory`:

```typescript
undoManager.setMaxUndoHistory(500);
const cap = undoManager.getMaxUndoHistory();
```

Older entries are dropped once the cap is exceeded.

## Enable / Disable at Runtime

```typescript
undoManager.setEnabled(false);
const isOn = undoManager.getEnabled();
```

Disabling clears both stacks. Useful when importing a project, you don't want the import operations to show up in the user's undo history.

## Pause State

Besides `pause()` / `resume()`, the manager exposes direct controls if you need them:

```typescript
undoManager.setPause(true);
const paused = undoManager.getPause();
```

Prefer the stack-based `pushPause()` / `popPause()` for nested flows, they compose correctly when multiple subsystems want to suppress undo simultaneously.
