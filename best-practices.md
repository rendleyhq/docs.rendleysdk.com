# Best Practices

Here are some best practices to achieve optimal performance with the SDK.

## Do not add the same asset multiple times

Instead of loading the same asset multiple times, reference it from [the Library](/getting-started/library.md). Every media entry is content-hashed, so the SDK automatically deduplicates identical files.

## Do not upload images for simple shapes

If you need a rectangle, circle, or any other basic shape, it is better to use the [Shape](/getting-started/clips/shape.md) clip instead.

## Avoid calling `deserialize` to apply updates

Calling `deserialize` multiple times can initialize many internal resources unnecessarily. If you frequently apply updates using JSON, it is more efficient to identify the changes and apply them manually, or use [`Timeline.loadSerializedData`](/getting-started/timeline.md#partial-deserialization) for partial updates.

## Check `isSafeToSerialize` before saving

The Library processes media asynchronously (transcoding, hashing, filmstrip, samples). Saving in the middle of this work produces incomplete JSON. Always gate saves on [`Engine.isSafeToSerialize()`](/getting-started/engine.md#checking-readiness).

## Stream large exports, do not merge them in memory

For projects larger than 2GB enable [chunked output](/getting-started/export.md#large-files-and-chunked-output) and stream the chunks straight to disk or network. Merging chunks in the browser hits the single-blob allocation limit.

## Reuse a Storage Provider across projects

Change the project id with [`setProjectId`](/getting-started/engine.md#project-id) instead of destroying and recreating the Engine. Internally this destroys the current `StorageController`, re-creates it with the providers passed to `Engine.init`, and calls `init(newProjectId)` on each, so every provider rebinds to the new namespace without a full Engine teardown.

## Layer composition carefully when using masks

Masks use the clip's alpha channel. Hide the mask clip itself with `setVisible(false)` so it does not render on its own. Masked clips pay an extra render pass, so avoid nesting too many.

## Prefer xxHash for large files

SHA-256 is slow on large inputs. For files larger than a few hundred MB, [switch to xxHash](/getting-started/settings.md#media-hash-algorithm). xxHash is non-cryptographic but sufficient for content addressing.

## Recompute layout after programmatic changes

Methods like [`setPlaybackSpeed`](/getting-started/playback-speed.md) mutate the clip duration. Call [`Timeline.adjustClipsLayout()`](/getting-started/timeline.md#adjust-layout) afterwards so overlapping clips get reflowed.

## Scope Undo/Redo groups

When performing a compound change (for example, transform + style + text), wrap the operations in a single undo group so the user can undo them atomically. See [Undo / Redo](/getting-started/undo-redo.md#grouping-changes).
