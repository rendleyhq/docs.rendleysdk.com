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
| `pexelsapikey`           | `string`                            |             | Pexels key for the Stock tab. **Both** `pexelsapikey` and `giphyapikey` must be set for the Stock tab to work. |
| `giphyapikey`            | `string`                            |             | Giphy key for the Stock tab. **Both** `pexelsapikey` and `giphyapikey` must be set for the Stock tab to work.  |
| `theme`                  | `"dark"` \| `"light"` \| `"system"` | `"system"`  | UI theme. `"system"` (the default) follows the OS preference.              |
| `highcontrast`           | `boolean`                           | `false`     | Higher-contrast palette for accessibility.                                 |
| `filters-path`           | `string`                            | CDN default | Base URL for the LUT filter pack. Override if self-hosted.                 |
| `effects-path`           | `string`                            | CDN default | Base URL for the effect shader pack.                                       |
| `transitions-path`       | `string`                            | CDN default | Base URL for the transition shader pack.                                   |
| `titles-path`            | `string`                            | CDN default | Base URL for the Lottie titles pack.                                       |
| `subtitles-styles-path`  | `string`                            | CDN default | Base URL for the subtitles style presets.                                  |
| `animations-path`        | `string`                            | CDN default | Base URL for the keyframe animation presets.                               |

::: warning Attribute names are kebab-case
These are HTML attributes, so the asset-pack paths must be written in kebab-case (`filters-path`, `subtitles-styles-path`, …). Writing them camelCase (`filtersPath`) does **not** work in plain HTML — the browser lowercases the attribute and the component never sees it. In JSX/TSX the camelCase prop names are fine.
:::

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
| `sidebar`         | `{ order, defaultActiveModule }`                 | Pick which sidebar tab is active on boot (see note below on `order`).                   |
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

### Sidebar Default Active Tab

```json
{
  "sidebar": {
    "order": ["media", "text", "transitions", "subtitles"],
    "defaultActiveModule": "text"
  }
}
```

`defaultActiveModule` decides which tab is open when the editor boots. It must name a visible module; if the named module is hidden (or you omit/`null` it), the editor opens the first visible tab from `order` instead.

::: warning `order` does not visually reorder the tabs
The on-screen tab order is fixed (`media`, `text`, `stock`, `transitions`, `subtitles`). `order` is only used as the lookup list for choosing the fallback default-active tab when `defaultActiveModule` is unset or hidden. Setting `defaultActiveModule` to `null` does **not** collapse the sidebar on desktop — it falls back to the first visible tab. (The sidebar only starts collapsed on mobile.)
:::

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

The editor loads its filters, effects, transitions, titles, subtitles styles, and animation presets from Rendley's CDN by default. To self-host, override the `*-path` attributes with your own URLs (remember: kebab-case in HTML):

```html
<rendley-video-editor
  licensename="..."
  licensekey="..."
  effects-path="https://cdn.yourdomain.com/rendley/effects"
  filters-path="https://cdn.yourdomain.com/rendley/filters"
  transitions-path="https://cdn.yourdomain.com/rendley/transitions"
/>
```

Each pack has a specific file layout, mirror the files from Rendley's CDN when self-hosting.

