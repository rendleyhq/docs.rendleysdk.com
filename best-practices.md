# Best Practices

Here are some best practices to achieve optimal performance with the SDK.

## Do not upload images for simple shapes

If you need a rectangle, circle, or any other basic shape, it is better to use the [Shape](/getting-started/clips/shape.md) clip instead.

## Avoid calling `deserialize` to apply updates

Calling `deserialize` multiple times can initialize many internal resources unnecessarily. If you frequently apply updates using JSON, it is more efficient to identify the changes and apply them manually, or use [`Timeline.loadSerializedData`](/getting-started/timeline.md#partial-deserialization) for partial updates.

## Check `isSafeToSerialize` before saving

The Library processes media asynchronously (transcoding, hashing, filmstrip, samples). Saving in the middle of this work produces incomplete JSON. Always gate saves on [`Engine.isSafeToSerialize()`](/getting-started/engine.md#checking-readiness).

## Stream large exports, do not merge them in memory

For projects larger than 2GB enable [chunked output](/getting-started/export.md#large-files-and-chunked-output) and stream the chunks straight to disk or network. Merging chunks in the browser hits the single-blob allocation limit.

## Prefer xxHash for large files

SHA-256 is slow on large inputs. For files larger than a few hundred MB, [switch to xxHash](/getting-started/settings.md#media-hash-algorithm). xxHash is non-cryptographic but sufficient for content addressing.

## Recompute layout after programmatic changes

Methods like [`setPlaybackSpeed`](/getting-started/playback-speed.md), [`setStartTime`](/api-reference/classes/Clip.html#setstarttime), [`setLeftTrim`](/api-reference/classes/Clip.html#setlefttrim), and [`setRightTrim`](/api-reference/classes/Clip.html#setrighttrim) can change a clip’s position or duration in the timeline. Call [`Timeline.adjustClipsLayout()`](/getting-started/timeline.md#adjust-layout) afterwards so overlapping clips are reflowed.

## Scope Undo/Redo groups

When performing a compound change (for example, transform + style + text), wrap the operations in a single undo group so the user can undo them atomically. See [Undo / Redo](/getting-started/undo-redo.md#grouping-changes).
