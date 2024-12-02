# Save & Restore the Project

The SDK supports [serialization](/api-reference/classes/Engine.html#serialize) and [deserialization](/api-reference/classes/Engine.html#deserialize), enabling you to store the composition in a database and retrieve it later.

## Serialization

Serialization is the process of transforming the state of the SDK into JSON format. This allows you to save the current configuration and state of your project.

```typescript
import { Engine } from "@rendley/sdk";

const serialized = Engine.getInstance().serialize();
```

::: info
The serialized state includes a schema version, which is used to ensure backward compatibility.
:::

::: details Example: Serialized State

```json
{
  "version": "0.0.1",
  "display": {
    "width": 1920,
    "height": 1080,
    "backgroundColor": "#000000"
  },
  "timeline": {
    "startTime": 124.181,
    "fps": 30,
    "layers": [
      {
        "id": "8e32e0a0-12cb-43d8-ba9d-839600e41389",
        "isEnabled": true,
        "isMuted": false,
        "clips": [
          {
            "id": "0297380c-517f-41ea-b9f6-f40e12fd6ff2",
            "type": "video",
            "mediaDataId": "cd446030-3af4-4ff5-b06d-83c76a45fc98",
            "subtitlesOffset": 0,
            "startTime": 0,
            "duration": 64.5,
            "leftTrim": 0,
            "rightTrim": 57.43333333333333,
            "filters": [],
            "effects": [],
            "warpMode": "empty",
            "style": {
              "clipId": "0297380c-517f-41ea-b9f6-f40e12fd6ff2",
              "mediaDataId": "cd446030-3af4-4ff5-b06d-83c76a45fc98",
              "alpha": 1,
              "rotation": 0,
              "position": [960, 540],
              "scale": [0.6374268785972704, 0.6374266304326051],
              "zIndex": 0,
              "cornerRadius": [0, 0, 0, 0],
              "relativeCornerRadius": false
            }
          }
        ],
        "transitions": []
      },
      {
        "id": "68042949-414e-4698-88de-f2172043e32a",
        "isEnabled": true,
        "isMuted": false,
        "clips": [
          {
            "id": "ea6e97f3-f034-436d-b4f9-2846395d5b9c",
            "type": "gif",
            "mediaDataId": "a87ac429-2f60-4841-a111-f669c1166a06",
            "subtitlesOffset": 0,
            "startTime": 0,
            "duration": 6.61,
            "leftTrim": 0,
            "rightTrim": -0.4666666666666667,
            "filters": [],
            "effects": [],
            "warpMode": "repeat",
            "style": {
              "clipId": "ea6e97f3-f034-436d-b4f9-2846395d5b9c",
              "mediaDataId": "a87ac429-2f60-4841-a111-f669c1166a06",
              "alpha": 1,
              "rotation": 0,
              "position": [211.5484599385956, 181.74729127463604],
              "scale": [1, 1],
              "zIndex": 0,
              "cornerRadius": [0, 0, 0, 0],
              "relativeCornerRadius": false
            }
          }
        ],
        "transitions": []
      },
      {
        "id": "92ad7cb8-d4e5-406f-a0d3-397eb0e185e4",
        "isEnabled": true,
        "isMuted": false,
        "clips": [
          {
            "id": "26199d5c-95c6-4e88-b90e-92a697717a0e",
            "type": "text",
            "subtitlesOffset": 0,
            "startTime": 0,
            "duration": 1,
            "leftTrim": 0,
            "rightTrim": -6.1,
            "filters": [],
            "effects": [],
            "warpMode": "empty",
            "style": {
              "clipId": "26199d5c-95c6-4e88-b90e-92a697717a0e",
              "alpha": 1,
              "rotation": 0,
              "position": [1459.7267089234426, 900.5348143012776],
              "scale": [1, 1],
              "zIndex": 0,
              "cornerRadius": [0, 0, 0, 0],
              "relativeCornerRadius": false,
              "fontSize": 100,
              "color": "#FFFFFF",
              "fontWeight": "400",
              "fontFamily": "Arial",
              "textAlign": "justify",
              "fontStyle": "normal",
              "backgroundColor": null
            },
            "text": "Playground Project"
          }
        ],
        "transitions": []
      },
      {
        "id": "be0e5c1d-f029-4b27-87c1-5ae4af00742b",
        "isEnabled": true,
        "isMuted": false,
        "clips": [
          {
            "id": "13fda042-c1ef-4821-a86c-136bc762e900",
            "type": "image",
            "mediaDataId": "72dbec19-192d-450f-8773-5d0d57d8d87d",
            "subtitlesOffset": 0,
            "startTime": 0,
            "duration": 1,
            "leftTrim": 0,
            "rightTrim": -6.133333333333334,
            "filters": [],
            "effects": [],
            "warpMode": "empty",
            "style": {
              "clipId": "13fda042-c1ef-4821-a86c-136bc762e900",
              "mediaDataId": "72dbec19-192d-450f-8773-5d0d57d8d87d",
              "alpha": 1,
              "rotation": 0.3376361090159211,
              "position": [1555.567833846607, 416.7797325014967],
              "scale": [0.09245987955458913, 0.09245985968828299],
              "zIndex": 0,
              "cornerRadius": [0, 0, 0, 0],
              "relativeCornerRadius": false
            }
          }
        ],
        "transitions": []
      }
    ]
  },
  "library": {
    "media": [
      {
        "id": "cd446030-3af4-4ff5-b06d-83c76a45fc98",
        "type": "video",
        "filename": "5329239-hd_720_1366_25fps.mp4",
        "permanentUrl": "https://videos.pexels.com/video-files/5329239/5329239-hd_720_1366_25fps.mp4"
      },
      {
        "id": "a87ac429-2f60-4841-a111-f669c1166a06",
        "type": "gif",
        "filename": "giphy.gif_cid=3654b759nrxfnmc5g2btr2wymg420ry13uoejtjne94g4snd&ep=v1_gifs_trending&rid=giphy.gif&ct=g",
        "permanentUrl": "https://media3.giphy.com/media/tHIRLHtNwxpjIFqPdV/giphy.gif?cid=3654b759nrxfnmc5g2btr2wymg420ry13uoejtjne94g4snd&ep=v1_gifs_trending&rid=giphy.gif&ct=g"
      },
      {
        "id": "72dbec19-192d-450f-8773-5d0d57d8d87d",
        "type": "image",
        "filename": "pexels-photo-27978911.jpeg",
        "permanentUrl": "https://images.pexels.com/photos/27978911/pexels-photo-27978911.jpeg"
      }
    ],
    "subtitles": []
  }
}
```

:::

## Deserialization

Deserialization initializes the SDK from a JSON object. It is important to ensure that the Engine has been initialized before running the `deserialize` method.

```typescript
import { Engine } from "@rendley/sdk";

await Engine.getInstance().init({
  license: {
    licenseName: "YOUR_LICENSE_NAME",
    licenseKey: "YOUR_LICENSE_KEY",
  },
  display: {
    width: 1080,
    height: 1920,
    backgroundColor: "#000000",
    view: document.getElementById("myCanvas"),
  },
});

await Engine.deserialize(serialized);
```

::: tip
Avoid calling `deserialize` multiple times to reflect changes in the JSON, as this will reinitialize many resources and may negatively impact performance. Instead, apply only the differences when necessary.
:::
