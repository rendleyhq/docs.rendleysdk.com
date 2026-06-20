# Listening to Events

To create an interactive user interface around the SDK, you need a way to interact with its state. We achieve this by emitting [events](https://docs.rendleysdk.com/api-reference/classes/EventEmitter.html) in response to SDK actions. For example, when a layer is created, or when a clip is modified, we emit corresponding events. Once you receive an event, you can store it in your preferred state management library and react accordingly to the changes. A complete list of supported events can be found here: [SDK Events](https://docs.rendleysdk.com/api-reference/enums/EventsEnum.html).

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

## Event Catalog

### Core

| **Event** | **Payload**              | **Description**                                |
| --------- | ------------------------ | ---------------------------------------------- |
| `ready`   | `undefined`              | The Engine finished initialization.            |
| `playing` | `{ isPlaying: boolean }` | Playback started or paused.                    |
| `time`    | `number`                 | Current time in seconds. Fires on every frame. |
| `log`     | `{ name, message }`      | Debug log emitted by the SDK.                  |
| `error`   | `{ name, message }`      | Generic error.                                 |

### Rendering

| **Event**          | **Payload**         | **Description**                                                                           |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| `render:completed` | `undefined`         | Export finished successfully.                                                             |
| `render:canceled`  | `undefined`         | Export was canceled via [`cancelExport`](/getting-started/export.md#canceling-an-export). |
| `render:error`     | `{ name, message }` | Export failed.                                                                            |

### Layer

| **Event**                | **Payload**                    | **Description**                                            |
| ------------------------ | ------------------------------ | ---------------------------------------------------------- |
| `layer:added`            | `{ layerId }`                  | A new layer was added.                                     |
| `layer:removed`          | `{ layerId }`                  | A layer was removed.                                       |
| `layer:updated`          | `{ layerId }`                  | A layer was updated (generic).                             |
| `layer:property:updated` | `{ layerId, property, value }` | A layer property changed (name, mute, volume, visibility). |
| `layer:error`            | `{ layerId, name, message }`   | Error on a specific layer.                                 |
| `layers:order:updated`   | `{ layersIds }`                | The layer order changed.                                   |

### Clip

| **Event**                      | **Payload**                       | **Description**                                                                         |
| ------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------- |
| `clip:added`                   | `{ clipId }`                      | A clip was added to a layer.                                                            |
| `clip:removed`                 | `{ clipId, layerId }`             | A clip was removed.                                                                     |
| `clip:updated`                 | `{ clipId }`                      | A clip was updated (generic).                                                           |
| `clip:updated:text`            | `{ clipId, text }`                | A text clip's text was changed.                                                         |
| `clip:error`                   | `{ clipId, name, message }`       | Error on a specific clip.                                                               |
| `clip:style:updated`           | `{ clipId, property, value }`     | A style property changed (position, scale, color, etc.).                                |
| `clip:filter:added`            | `{ clipId, id, filterId }`        | A filter was attached.                                                                  |
| `clip:filter:removed`          | `{ clipId, id, filterId }`        | A filter was detached.                                                                  |
| `clip:filter:updated`          | `{ clipId, id, filterId }`        | A filter was updated.                                                                   |
| `clip:effect:added`            | `{ clipId, id, effectId }`        | An effect was attached.                                                                 |
| `clip:effect:removed`          | `{ clipId, id, effectId }`        | An effect was detached.                                                                 |
| `clip:effect:updated`          | `{ clipId, id, property, value }` | An effect property changed.                                                             |
| `clip:animation:updated`       | `{ clipId }`                      | The `clip.animationController` animation changed.                                                           |
| `clip:keyframe:changed`        | `{ clipId, property? }`           | A keyframe from the [Property Animator](/getting-started/property-animator.md) changed. |
| `clip:lottie-property:updated` | `{ clipId, propertyId }`          | A Lottie property changed.                                                              |

### Transition

| **Event**                     | **Payload**                       | **Description**                       |
| ----------------------------- | --------------------------------- | ------------------------------------- |
| `transition:added`            | `{ layerId, transitionId }`       | A transition was added between clips. |
| `transition:removed`          | `{ layerId, transitionId }`       | A transition was removed.             |
| `transition:updated`          | `{ transitionId }`                | A transition was updated.             |
| `transition:property:changed` | `{ id, property, value }`         | A transition property changed.        |
| `transition:error`            | `{ transitionId, name, message }` | Error on a specific transition.       |

### Library

| **Event**                         | **Payload**                         | **Description**                           |
| --------------------------------- | ----------------------------------- | ----------------------------------------- |
| `library:added`                   | `{ mediaDataId }`                   | Media was added.                          |
| `library:removed`                 | `{ mediaDataId }`                   | Media was removed.                        |
| `library:replaced`                | `{ mediaDataId }`                   | Media file was replaced.                  |
| `library:media:ready`             | `{ mediaDataId }`                   | Media is fully loaded and ready.          |
| `library:media:updated`           | `{ mediaDataId, status }`           | Media metadata or status changed.         |
| `library:media:samples:updated`   | `{ mediaDataId, status }`           | Audio samples have been processed.        |
| `library:media:filmstrip:updated` | `{ mediaDataId, status }`           | Filmstrip thumbnails have been processed. |
| `library:progress`                | `{ mediaDataId, status, progress }` | Load / transcode progress.                |
| `library:error`                   | `{ mediaDataId, error }`            | Library-level error.                      |
| `library:effect:added`            | `{ effectId }`                      | Effect added to library.                  |
| `library:effect:removed`          | `{ effectId }`                      | Effect removed from library.              |
| `library:filter:added`            | `{ filterId }`                      | Filter added to library.                  |
| `library:filter:removed`          | `{ filterId }`                      | Filter removed from library.              |
| `library:transition:added`        | `{ transitionId }`                  | Transition added to library.              |
| `library:transition:removed`      | `{ transitionId }`                  | Transition removed from library.          |

### Subtitles

| **Event**                             | **Payload**                 | **Description**                          |
| ------------------------------------- | --------------------------- | ---------------------------------------- |
| `subtitles:added`                     | `{ subtitlesId }`           | Subtitles were added to the library.     |
| `subtitles:removed`                   | `{ subtitlesId }`           | Subtitles were removed from the library. |
| `subtitles:main-style:updated`        | `undefined`                 | Main text style changed.                 |
| `subtitles:highlighted-style:updated` | `undefined`                 | Highlighted text style changed.          |
| `subtitles:animation:updated`         | `undefined`                 | Highlight animation changed.             |
| `subtitles:text-mode:updated`         | `undefined`                 | Text mode (full/partial) changed.        |
| `subtitles:transform:updated`         | `undefined`                 | Subtitles position or scale changed.     |
| `subtitles:content:updated`           | `{ subtitlesId }`           | Many text blocks were updated at once.   |
| `subtitles:duration:updated`          | `{ subtitlesId, duration }` | Subtitles duration changed.              |
| `subtitles:textblock:added`           | `{ subtitlesId, index }`    | A text block was added.                  |
| `subtitles:textblock:removed`         | `{ subtitlesId, index }`    | A text block was removed.                |
| `subtitles:textblock:updated`         | `{ subtitlesId, index }`    | A text block changed.                    |

### Fonts

| **Event**      | **Payload**                 | **Description**          |
| -------------- | --------------------------- | ------------------------ |
| `font:added`   | `{ fontId }`                | A font was registered.   |
| `font:removed` | `{ fontId }`                | A font was unregistered. |
| `font:error`   | `{ fontId, name, message }` | Font load error.         |

### Display

| **Event**                    | **Payload**           | **Description**                  |
| ---------------------------- | --------------------- | -------------------------------- |
| `display:resolution:updated` | `{ width, height }`   | Canvas resolution changed.       |
| `display:background:updated` | `{ backgroundColor }` | Canvas background color changed. |

### Undo / Redo

| **Event**             | **Payload**                 | **Description**                                                    |
| --------------------- | --------------------------- | ------------------------------------------------------------------ |
| `undo:redo:changed`   | `{ canUndo, canRedo }`      | Use this to drive the enabled state of your Undo and Redo buttons. |
| `undo:performed`      | `{ group }`                 | An undo just ran.                                                  |
| `redo:performed`      | `{ group }`                 | A redo just ran.                                                   |
| `undo:process:custom` | `{ undoRecord, redoGroup }` | A custom undo record is being processed.                           |

### Project

| **Event**            | **Payload**     | **Description**                                                                         |
| -------------------- | --------------- | --------------------------------------------------------------------------------------- |
| `project:id:changed` | `{ projectId }` | The project id was changed via [`setProjectId`](/getting-started/engine.md#project-id). |
