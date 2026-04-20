# Configuration

The editor accepts two kinds of configuration:

1. **HTML attributes**, for license, theme, API keys, and CDN paths.
2. **Inline JSON config**, for structural options (sidebar layout, aspect ratio presets, composition defaults, per-module visibility). Passed through a nested `<script type="application/json">` inside the tag.

Both are optional. If you skip them, the editor boots with sensible defaults.

## Attributes Reference

| Attribute                | Type                                | Default     | Description                                                                |
| ------------------------ | ----------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `licensename`            | `string`                            |             | Your Rendley license name. Required.                                       |
| `licensekey`             | `string`                            |             | Your Rendley license key. Required unless `enableremotevalidation="true"`. |
| `issublicense`           | `"true"` \| `"false"`               | `"false"`   | Use a sublicense for multi-subdomain setups.                               |
| `enableremotevalidation` | `"true"` \| `"false"`               | `"false"`   | Fetch the license key from Rendley's servers at init time.                 |
| `pexelsapikey`           | `string`                            |             | Enables the Pexels stock-images tab.                                       |
| `giphyapikey`            | `string`                            |             | Enables the Giphy tab.                                                     |
| `theme`                  | `"dark"` \| `"light"` \| `"system"` | `"dark"`    | UI theme. `"system"` follows the OS preference.                            |
| `highcontrast`           | `boolean`                           | `false`     | Higher-contrast palette for accessibility.                                 |
| `filtersPath`            | `string`                            | CDN default | Base URL for the LUT filter pack. Override if self-hosted.                 |
| `effectsPath`            | `string`                            | CDN default | Base URL for the effect shader pack.                                       |
| `transitionsPath`        | `string`                            | CDN default | Base URL for the transition shader pack.                                   |
| `titlesPath`             | `string`                            | CDN default | Base URL for the Lottie titles pack.                                       |
| `subtitlesStylesPath`    | `string`                            | CDN default | Base URL for the subtitles style presets.                                  |
| `animationsPath`         | `string`                            | CDN default | Base URL for the keyframe animation presets.                               |

## JSON Config

For everything that isn't a simple attribute, embed a JSON block inside the tag. The component reads it before initialization.

```html
<rendley-video-editor
  licensename="YOUR_LICENSE_NAME"
  licensekey="YOUR_LICENSE_KEY"
>
  <script type="application/json">
    {
      "theme": { "variant": "light" },
      "composition": {
        "width": 1080,
        "height": 1920,
        "backgroundColor": "#000000"
      },
      "aspectRatios": [
        { "label": "TikTok", "width": 1080, "height": 1920 },
        { "label": "YouTube", "width": 1920, "height": 1080 }
      ],
      "sidebar": {
        "order": ["media", "text", "transitions"],
        "defaultActiveModule": "media"
      },
      "modules": {
        "subtitles": { "isVisible": false }
      }
    }
  </script>
</rendley-video-editor>
```

### Top-Level Fields

| Field             | Type                                             | Description                                                                             |
| ----------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `theme`           | `{ variant: "dark" \| "light" \| "system" }`     | Overrides the `theme` attribute.                                                        |
| `highContrast`    | `boolean`                                        | Overrides the `highcontrast` attribute.                                                 |
| `aspectRatios`    | `AspectRatio[]`                                  | Replaces the default preset list shown in the composition resolution picker.            |
| `composition`     | `{ width, height, backgroundColor }`             | Initial composition dimensions and background.                                          |
| `modules`         | `{ media, text, stock, transitions, subtitles }` | Toggle visibility of sidebar modules.                                                   |
| `navbar`          | `{ aspectRatios, export }`                       | Control the top navbar. Hide the Export button with `{ export: { isVisible: false } }`. |
| `sidebar`         | `{ order, defaultActiveModule }`                 | Reorder the sidebar tabs and pick which one is active on boot.                          |
| `controlsSidebar` | `Record<ClipType, ControlSteps>`                 | Toggle visibility of per-clip control panels (text editor, filters, animations, etc.).  |

### Aspect Ratio Preset

```typescript
type AspectRatio = {
  label: string; // shown in the picker
  width: number; // pixels
  height: number; // pixels
};
```

When omitted, the defaults are:

| Label     | Dimensions |
| --------- | ---------- |
| YouTube   | 1920×1080  |
| Instagram | 1080×1080  |
| Twitter   | 1200×600   |
| TikTok    | 1080×1920  |

### Module Visibility

Hide a sidebar tab entirely:

```json
{
  "modules": {
    "subtitles": { "isVisible": false },
    "stock": { "isVisible": false }
  }
}
```

Valid keys: `media`, `text`, `stock`, `transitions`, `subtitles`.

### Sidebar Order and Default

```json
{
  "sidebar": {
    "order": ["media", "text", "transitions", "subtitles"],
    "defaultActiveModule": "text"
  }
}
```

`defaultActiveModule` can be `null` to leave the sidebar collapsed on boot.

### Per-Clip Control Panels

The **controls sidebar** is the right-hand panel that appears when a clip is selected. Different clip types show different steps (edit text, filters, effects, animations, etc.). Hide individual steps per clip type:

```json
{
  "controlsSidebar": {
    "text": {
      "edit_text": { "isVisible": true },
      "filters": { "isVisible": false },
      "effects": { "isVisible": false },
      "animations": { "isVisible": true }
    },
    "video": {
      "filters": { "isVisible": true },
      "effects": { "isVisible": true }
    }
  }
}
```

Valid clip types: `video`, `audio`, `image`, `text`, `gif`, `shape`, `lottie`, `subtitles`.

Valid steps: `edit_text`, `edit_lottie`, `edit_audio`, `filters`, `effects`, `subtitles_style`, `subtitles_presets`, `animations`.

## Self-Hosting Asset Packs

The editor loads its filters, effects, transitions, titles, subtitles styles, and animation presets from Rendley's CDN by default. To self-host, override the `*Path` attributes with your own URLs:

```html
<rendley-video-editor
  licensename="..."
  licensekey="..."
  effectsPath="https://cdn.yourdomain.com/rendley/effects"
  filtersPath="https://cdn.yourdomain.com/rendley/filters"
  transitionsPath="https://cdn.yourdomain.com/rendley/transitions"
/>
```

Each pack has a specific file layout, mirror the files from Rendley's CDN when self-hosting.

## See Also

- [Installation](/video-editor-ui/installation.md)
- [Events & Methods](/video-editor-ui/events-and-methods.md)
- [Common Tasks](/video-editor-ui/common-tasks.md)
