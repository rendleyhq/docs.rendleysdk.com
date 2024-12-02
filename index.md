# Introduction

Rendley SDK is a framework for building video editing applications. It simplifies the complexities of video editing by providing tools for creating compositions, trimming, applying effects, filters, and transitions, animating captions, and more. It also supports final video rendering, either on the client or server.

To maximize performance, Rendley SDK leverages [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL) for rendering and the [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) for hardware-accelerated encoding and decoding. For environments without WebCodecs support, it uses a fallback WASM-based approach. The same SDK supports both **client-side and server-side rendering**, ensuring consistent results.

Rendley SDK is UI-agnostic, allowing you to build custom solutions such as video editors, automation tools, video players, or other creative applications. It prioritizes efficient client-side rendering to minimize infrastructure needs while offering server-side rendering as an option.
