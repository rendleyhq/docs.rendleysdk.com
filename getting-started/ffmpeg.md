# FFmpeg

The SDK bundles an FFmpeg WASM build for probing, transcoding, and audio mixing during export. Most users never touch it directly, the Engine calls it behind the scenes. Advanced workflows (custom transcoding, direct file operations, building a [ZipArchive](/getting-started/zip-archive.md)) can access it through [`Engine.getInstance().getFFmpeg()`](https://docs.rendleysdk.com/api-reference/classes/Engine.html).

## Accessing FFmpeg

```typescript
const ffmpegModule = Engine.getInstance().getFFmpeg();

// The underlying @ffmpeg/ffmpeg-style instance for low-level calls:
const ffmpeg = ffmpegModule.getFFmpeg();
```

The outer `ffmpegModule` handles initialization and lifecycle. The inner `ffmpeg` is where you call the virtual filesystem and command execution APIs.

## Custom WASM Paths

If you self-host the FFmpeg WASM bundle (for example, to avoid CDN cold starts), pass your URLs when initializing the Engine:

```typescript
await Engine.getInstance().init({
    ffmpeg: {
      coreURL: "https://cdn.yourdomain.com/ffmpeg/ffmpeg-core.js",
      wasmURL: "https://cdn.yourdomain.com/ffmpeg/ffmpeg-core.wasm",
    },
    ...
  });
```

Retrieve the currently loaded URLs with `ffmpegModule.getCoreURL()` and `ffmpegModule.getWasmURL()`.

## Virtual Filesystem

FFmpeg runs in a sandbox with its own in-memory filesystem. Your browser cannot pass native `File` objects directly; you write bytes in, run commands, and read bytes out.

```typescript
// Write a file into the sandbox
await ffmpeg.writeFile(
  "/tmp/input.mp4",
  new Uint8Array(await file.arrayBuffer()),
);

// Check existence
const exists = await ffmpeg.fileExists("/tmp/input.mp4");
const dirExists = await ffmpeg.dirExists("/tmp");

// Read back
const bytes = await ffmpeg.readFile("/tmp/output.mp4");

// Rename and delete
await ffmpeg.rename("/tmp/input.mp4", "/tmp/source.mp4");
```

## Running a Command

`exec(args[])` runs an FFmpeg command with the usual CLI argument list:

```typescript
await ffmpeg.exec([
  "-i",
  "/tmp/input.mp4",
  "-t",
  "5",
  "-c:v",
  "copy",
  "/tmp/first-5-seconds.mp4",
]);

const result = await ffmpeg.readFile("/tmp/first-5-seconds.mp4");
```

## Lifecycle

```typescript
// Reload after a crash or to flush state
await ffmpegModule.reload();

// Create a separate FFmpeg instance (e.g., for concurrent jobs)
const isolated = await ffmpegModule.createCustomInstance();

// Tear down when the whole Engine is being destroyed
ffmpegModule.destroy();
```

The Engine's own [`destroy(true)`](/getting-started/engine.md#destroying) takes care of FFmpeg teardown for you, you only need to call `destroy()` manually if you created a custom instance.

## When to Use This Directly

Most SDK features handle FFmpeg internally. Reach for direct FFmpeg access when you:

- Need a file operation the SDK doesn't expose (e.g., probing with a specific ffprobe flag).
- Want to run a one-off transcode or demux outside the Engine's render pipeline.
- Are building a [ZipArchive](/getting-started/zip-archive.md) and need to move files in and out of the sandbox.
- Are implementing a [custom transcoder](https://docs.rendleysdk.com/api-reference/interfaces/ITranscodeProvider.html) and want to delegate to FFmpeg.

## See Also

- [Zip Archive](/getting-started/zip-archive.md): builds on the FFmpeg virtual filesystem.
- [Storage](/getting-started/storage.md): for persisting media beyond the sandbox.
- API reference: [`Engine.getFFmpeg`](https://docs.rendleysdk.com/api-reference/classes/Engine.html)
