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

Rendley SDK is a framework for building video editing applications. It simplifies the complexities of video editing by providing tools for creating compositions, trimming, applying effects, filters, and transitions, animating captions, and more. It also supports final video rendering, either on the client or server.

To maximize performance, Rendley SDK leverages [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL) for rendering and the [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) for hardware-accelerated encoding and decoding. For environments without WebCodecs support, it uses a fallback WASM-based approach. The same SDK supports both **client-side and server-side rendering**, ensuring consistent results.

Rendley SDK is UI-agnostic, allowing you to build custom solutions such as video editors, automation tools, video players, or other creative applications. It prioritizes efficient client-side rendering to minimize infrastructure needs while offering server-side rendering as an option.

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
            <td>By default, the SDK doesn’t rely on any servers—everything runs directly on the device. It works even offline.</td>
        </tr>
        <tr>
            <td class="icon-column"><div class="feature"><img src="/icons/subtitles.svg" alt="Subtitles" /></div></td>
            <td><strong>Captions & subtitles</strong></td>
            <td>Easily display captions and subtitles with automatic syncing. Customize the styles and effects to match your project’s style.</td>
        </tr>
        <tr>
            <td class="icon-column"><div class="feature"><img src="/icons/sparkles.svg" alt="Sparkles" /></div></td>
            <td><strong>Advanced keyframe animations</strong></td>
            <td>Leverage our keyframe animation system to create advanced animations. Animate any video element to create stunning, dynamic compositions.</td>
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
            <td>Store and load projects using JSON. This enables seamless collaboration, AI-powered video generation, and more complex workflows.</td>
        </tr>
    </tbody>
</table>
