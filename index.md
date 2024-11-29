# Introduction

Rendley SDK is a video editing SDK that handles the complexities of the video editing apps, including the necessary logic to create a composition, to do the trimming, apply effects,filters and transitions, to create and animate captions and much more. Besides the composition, we also handle the rendering of the final video and we can do it either on the client or on the server.

To achieve maximum performance, we leverage WebGL for rendering and WebCodecs API for hardware-accelerated encoding and decoding. For browsers that don't support WebCodecs API, we fallback to a FFmpeg WASM based approach which is widely supported everywhere. You can as well render the final video on the server and handle the editing on the client. Because server rendering is using the same SDK, you can be sure that final video will visually match.
