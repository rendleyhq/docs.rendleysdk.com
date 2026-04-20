<style>
 @media (max-width: 600px) {
 .icon-column {
 display: none;
 }
 }

 table {
 width: 100%;
 border-collapse: collapse;
 }

 th, td {
 padding: 15px;
 text-align: left;
 border-bottom: 1px solid #ddd;
 }

 th {
 background-color: #f2f2f2;
 }

 .feature {
 background-color: #6d6ff2;
 padding: 4px;
 border-radius: 8px;
 }

 .feature img {
 width: 64px;
 }
</style>

# Introduction

Rendley SDK is a framework for building video editing applications in the browser. It provides tools for compositions, trimming, effects, filters, transitions, animated captions, and final video rendering, on the client or on the server.

The SDK uses [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL) for rendering and [WebCodecs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) for hardware-accelerated encoding and decoding, with a WASM fallback for environments that lack WebCodecs. The same pipeline runs in the browser and on headless servers, so the preview and the exported file match bit-for-bit.

Rendley SDK is UI-agnostic: use it to build custom editors, automation tools, video players, or any creative web app. When you want a full editor out of the box, the [Video Editor UI](/video-editor-ui/overview.md) is a drop-in web component built on the SDK.

## Try It

Every code sample on this site is runnable, click the Run button and the Rendley SDK will execute the snippet in an isolated iframe, including the live canvas.

<LiveRun>

```typescript
const title = await layer.addClip({
  type: "text",
  text: "Welcome",
  startTime: 0,
  duration: 4,
  style: { fontSize: 200, color: "#FFFFFF", fontWeight: "900" },
});
title.style.setPosition(960, 540);

title.propertyAnimator.addKeyframe("alpha", 0, 0);
title.propertyAnimator.addKeyframe("alpha", 0.6, 1);
title.propertyAnimator.addKeyframe("scaleX", 0, 0.7);
title.propertyAnimator.addKeyframe("scaleX", 0.6, 1);
title.propertyAnimator.addKeyframe("scaleY", 0, 0.7);
title.propertyAnimator.addKeyframe("scaleY", 0.6, 1);
```

</LiveRun>

Ready to build? Head to [Quick Start](/quick-start/installation.md) for setup, or [Concepts](/concepts.md) for a high-level tour of the SDK.

<table>
 <tbody>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/cloud-arrow-up.svg" alt="Cloud Arrow Up" /></div></td>
 <td><strong>Core video editing capabilities</strong></td>
 <td>The SDK supports essential video editing functions, including splitting, trimming, cropping, and creating multi-track compositions with effects, filters, and transitions.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/arrow-path.svg" alt="Arrow Path" /></div></td>
 <td><strong>After Effects integration</strong></td>
 <td>Import compositions directly from After Effects and make them editable within the SDK, allowing users to tweak and modify parts with ease.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/no-server.svg" alt="No Server" /></div></td>
 <td><strong>No servers required</strong></td>
 <td>By default, the SDK doesn’t rely on any servers, everything runs directly on the device. It works even offline.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/subtitles.svg" alt="Subtitles" /></div></td>
 <td><strong>Captions & subtitles</strong></td>
 <td>Easily display captions and subtitles with automatic syncing. Customize the styles and effects to match your project’s style.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/sparkles.svg" alt="Sparkles" /></div></td>
 <td><strong>Advanced keyframe animations</strong></td>
 <td>Use our keyframe animation system to create advanced animations. Animate any video element to create stunning, dynamic compositions.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/ajustable.svg" alt="Adjustable" /></div></td>
 <td><strong>Customizable extensions</strong></td>
 <td>Need something more? Extend the SDK with your own custom implementation to match your project’s unique requirements.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/storage.svg" alt="Storage" /></div></td>
 <td><strong>Flexible storage options</strong></td>
 <td>Connect the SDK to any storage solution, and combine local and server storage to optimize bandwidth and performance.</td>
 </tr>
 <tr>
 <td class="icon-column"><div class="feature"><img src="/icons/document-text.svg" alt="Document Text" /></div></td>
 <td><strong>Serialized state management</strong></td>
 <td>Store and load projects using JSON. This enables smooth collaboration, AI-powered video generation, and more complex workflows.</td>
 </tr>
 </tbody>
</table>
