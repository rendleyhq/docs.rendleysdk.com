---
aside: false
---

<style>
.loader {
 position: absolute;
 top: 50%;
 left: 50%;
 margin-left: -25px;
 margin-top: -25px;
 width: 50px;
 padding: 8px;
 aspect-ratio: 1;
 border-radius: 50%;
 background: #25b09b;
 --_m: 
 conic-gradient(#0000 10%,#000),
 linear-gradient(#000 0 0) content-box;
 -webkit-mask: var(--_m);
 mask: var(--_m);
 -webkit-mask-composite: source-out;
 mask-composite: subtract;
 animation: l3 1s infinite linear;
 z-index: -1;
}

@keyframes l3 {to{transform: rotate(1turn)}}
</style>

# Slideshow Video

This section presents an example of creating a slideshow video from scratch.

<div style="position: relative;">
<iframe src="https://stackblitz.com/edit/vitejs-vite-x5mozr?ctl=1&embed=1&file=src%2FApp.tsx&hideNavigation=1" width="100%" height="auto" style="aspect-ratio: 16 / 9; border: none;"></iframe>

<div class="loader"></div>
</div>
