import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Rendley SDK",
  description: "A VitePress Site",

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },

  themeConfig: {
    nav: [{ text: "Home", link: "/#" }],

    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
    },

    sidebar: [
      {
        text: "Overview",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Concepts", link: "/concepts" },
          { text: "Best practices", link: "/best-practices" },
          { text: "Troubleshooting", link: "/troubleshooting" },
          { text: "FAQ", link: "/faq" },
          {
            text: "Changelog",
            link: "/changelog",
          },
        ],
      },
      {
        text: "Quick Start",
        items: [
          { text: "Installation", link: "/quick-start/installation" },
          {
            text: "Create your first video",
            link: "/quick-start/create-first-video",
          },
        ],
      },
      {
        text: "Getting Started",
        items: [
          { text: "Engine", link: "/getting-started/engine" },
          { text: "Display", link: "/getting-started/display" },
          { text: "Library", link: "/getting-started/library" },
          { text: "Fonts", link: "/getting-started/fonts" },
          { text: "Layer", link: "/getting-started/layer" },
          {
            text: "Clips",
            link: "/getting-started/clips",
          },
          { text: "Styling", link: "/getting-started/styling" },
          { text: "Subtitles / Captions", link: "/getting-started/subtitles" },
          { text: "Filters", link: "/getting-started/filters" },
          { text: "Effects", link: "/getting-started/effects" },
          { text: "Transitions", link: "/getting-started/transitions" },
          { text: "Animation", link: "/getting-started/animation" },
          { text: "Storage", link: "/getting-started/storage" },
          {
            text: "Save / Restore Project",
            link: "/getting-started/save-restore",
          },
          { text: "Export video", link: "/getting-started/export" },
        ],
      },
      {
        text: "Advanced",
        items: [
          {
            text: "Create Lottie clip",
            // link: "/in-progress#",
          },
          {
            text: "Create Custom clip",
            // link: "/in-progress#",
          },
        ],
      },
      {
        text: "Rendering",
        items: [
          { text: "Rendering on device", link: "/rendering/render-on-device" },
          { text: "Rendering on server", link: "/rendering/render-on-server" },
        ],
      },
      {
        text: "User Interface",
        items: [
          {
            text: "Listening to events",
            link: "/user-interface/listening-to-events",
          },
          // { text: "Displaying assets", link: "/in-progress#" },
          // { text: "Playback", link: "/in-progress#" },
          // { text: "Drag elements", link: "/in-progress#" },
          // { text: "Resize elements", link: "/in-progress#" },
        ],
      },
      {
        text: "Video Editor UI",
        items: [
          { text: "Overview", link: "/video-editor-ui/overview" },
          { text: "Installation", link: "/video-editor-ui/installation" },
          // { text: "Self-hosting", link: "/in-progress#" },
          // { text: "Integration with Frameworks", link: "/in-progress#" },
          { text: "Pro Version ✨", link: "/video-editor-ui/pro" },
        ],
      },
      {
        text: "Examples",
        items: [{ text: "Slideshow Video", link: "/in-progress#" }],
      },
      {
        text: "More",
        items: [
          { text: "API Reference", link: "/in-progress#" },
          { text: "Playground", link: "/in-progress#" },
          { text: "Blog", link: "/in-progress#" },
          { text: "Discord", link: "/in-progress#" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
