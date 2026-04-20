# Placeholder Clip

A **Placeholder** clip occupies a slot on the timeline while its media is still loading. When the media becomes ready, the placeholder is replaced by the real clip in place.

Useful when:

- Media is uploaded asynchronously and the UI needs to render a "filler" tile immediately.
- A batch import processes large files one by one and you want the timeline to reflect intermediate state.
- A project is deserialized with media that still needs to be hashed or transcoded.

## Register a Placeholder

```typescript
const mediaData = Engine.getInstance().getLibrary().getMediaById(mediaId);

await mediaData.addPlaceholderClip(placeholderClipId);
```

The Library holds the list of placeholder clip ids per media entry. Once the media finishes loading (`library:media:ready`), the Engine replaces each placeholder with a clip of the correct type (`ImageClip`, `VideoClip`, and so on) using the media's metadata.

## See Also

- [Library](/getting-started/library.md)
- [Clip API Reference](/getting-started/clips.md#common-api)
- API reference: [`MediaData.addPlaceholderClip`](https://docs.rendleysdk.com/api-reference/classes/MediaData.html)
