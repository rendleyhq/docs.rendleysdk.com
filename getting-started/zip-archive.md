# Zip Archive

The [ZipArchive](https://docs.rendleysdk.com/api-reference/classes/ZipArchive.html) utility builds and reads `.zip` files inside the SDK's FFmpeg virtual filesystem. Useful when you need to package multiple assets into a single download (for example: exporting a project with its thumbnails, or bundling a set of Lottie compositions with their images).

::: info
Operations happen inside the FFmpeg virtual filesystem, not directly on `File` objects or `Blob`s. Use [FFmpeg.writeFile / readFile](/getting-started/ffmpeg.md) to move data in and out.
:::

## Create an Archive

```typescript
import { ZipArchive } from "@rendley/sdk";

const archive = new ZipArchive();
await archive.create("/tmp/my-project.zip");
```

`create(path)` initializes an empty archive at the given path in the FFmpeg filesystem.

## Open an Existing Archive

```typescript
const archive = new ZipArchive();
await archive.open("/tmp/existing.zip");
```

## Add Files

Two ways to add content:

- **`addFile(path, targetDirectory?)`**: add a file that already exists in the FFmpeg filesystem.
- **`addData(path, data, takeOwnership?)`**: add a `Uint8Array` directly. Set `takeOwnership` to `true` to skip copying the buffer (the archive will reuse it).
- **`addFiles(paths[], targetDirectory?)`**: add multiple files in one call.

```typescript
const ffmpeg = Engine.getInstance().getFFmpeg().getFFmpeg();
await ffmpeg.writeFile("/tmp/thumbnail.png", pngBytes);

await archive.addFile("/tmp/thumbnail.png");
await archive.addData(
  "/project.json",
  new TextEncoder().encode(JSON.stringify(state)),
);
```

## Extract

- **`extractAll(path)`**: extract every entry into the given directory.
- **`extractFile(fromPath, toPath)`**: extract a single entry.
- **`readFile(path)`**: read an entry's contents as a `Uint8Array` without writing it to disk.

```typescript
await archive.extractAll("/tmp/output");
const json = await archive.readFile("/project.json");
```

## List Contents

```typescript
const paths = await archive.listFiles();
```

## Save and Close

Call `save()` to flush pending writes. Use `destroy()` to release resources when you're done.

```typescript
await archive.save();
await archive.destroy();
```

## Downloading the Result

After `save()`, read the archive back from the FFmpeg filesystem and hand it to the browser:

```typescript
const ffmpeg = Engine.getInstance().getFFmpeg().getFFmpeg();
const zipBytes = await ffmpeg.readFile("/tmp/my-project.zip");

const blob = new Blob([zipBytes], { type: "application/zip" });
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "my-project.zip";
a.click();
URL.revokeObjectURL(url);
```

## See Also

- [FFmpeg](/getting-started/ffmpeg.md): the virtual filesystem the archive operates on.
- API reference: [`ZipArchive`](https://docs.rendleysdk.com/api-reference/classes/ZipArchive.html)
