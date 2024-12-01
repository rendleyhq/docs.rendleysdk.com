# Introduction

Rendley SDK is a video editing SDK that handles the complexities of the video editing apps, including the necessary logic to create a composition, to do the trimming, apply effects,filters and transitions, to create and animate captions and much more. Besides the composition, we also handle the rendering of the final video and we can do it either on the client or on the server.

Rendley SDK is like a framework for creating video editing apps. It helps you handle each aspect of the video editing process, from creating a composition to uploading assets to a server to saving and loading projects from a database to rendering the final video.

To achieve maximum performance, we leverage WebGL for rendering and WebCodecs API for hardware-accelerated encoding and decoding. For browsers that don't support WebCodecs API, we fallback to a FFmpeg WASM based approach which is widely supported everywhere. You can as well render the final video on the server and handle the editing on the client. Because server rendering is using the same SDK, you can be sure that final video will visually match.

By default, Rendley SDK does not come up with a UI, giving you the power to create everything you want with it, be it a video editor, a video automation tool or something else.

As for rendering, our biggest goal is to make it as efficient as possible on the client so that you don't have to manage complex infrastructure. However, you always can render on the server as well using our open source example.
