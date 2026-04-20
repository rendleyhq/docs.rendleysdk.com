import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import markdownTaskListPlugin from "markdown-it-task-lists";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",

  title: "Rendley SDK",
  description:
    "Rendley provides a powerful SDK that handles all the complexities of video editing. Get the details in our documentation.",

  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true,

  vite: {
    server: {
      host: "0.0.0.0",
    },
  },

  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.svg",
        size: "any",
        type: "image/svg+xml",
      },
    ],

    [
      "link",
      {
        rel: "stylesheet",
        href: "/styles.css",
      },
    ],

    // Open Graph Meta Tags
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://docs.rendleysdk.com" }],
    [
      "meta",
      {
        property: "og:title",
        content:
          "Rendley SDK Documentation - Learn how to create and render videos directly in the browser",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Rendley is a Video Editing SDK that works in any browser and performs rendering client-side, without the need for a server.",
      },
    ],
    [
      "meta",
      { property: "og:image", content: "https://docs.rendleysdk.com/og.jpg" },
    ],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    [
      "meta",
      {
        property: "og:image:alt",
        content:
          "Rendley is a Video Editing SDK that works in any browser and performs rendering client-side, without the need for a server.",
      },
    ],
    [
      "meta",
      { property: "og:site_name", content: "Rendley SDK Documentation" },
    ],

    // Twitter Meta Tags
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@rendleyhq" }],
    ["meta", { name: "twitter:creator", content: "@rendleyhq" }],
    [
      "meta",
      {
        name: "twitter:title",
        content:
          "Rendley SDK Documentation - Learn about our powerful video editing SDK",
      },
    ],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Rendley is a Video Editing SDK that works in any browser and performs rendering client-side, without the need for a server.",
      },
    ],
    [
      "meta",
      { name: "twitter:image", content: "https://docs.rendleysdk.com/og.jpg" },
    ],

    // JSON-LD structured data: Organization + WebSite with SearchAction
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "Rendley",
            url: "https://rendley.com",
            logo: "https://docs.rendleysdk.com/favicon.svg",
            sameAs: [
              "https://github.com/rendleyhq",
              "https://discord.gg/BwdeFFEVXR",
              "https://twitter.com/rendleyhq",
            ],
          },
          {
            "@type": "WebSite",
            name: "Rendley SDK Documentation",
            url: "https://docs.rendleysdk.com",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://docs.rendleysdk.com/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }),
    ],

    // Google Analytics
    [
      "script",
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-QDNE5JN9GG",
        async: "true",
      },
    ],
    [
      "script",
      {},
      `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-QDNE5JN9GG');
      `,
    ],

    // hubspot chat
    [
      "script",
      {
        src: "//js-eu1.hs-scripts.com/144148959.js",
        defer: "true",
        async: "true",
        id: "hs-script-loader",
      },
    ],
  ],

  sitemap: {
    hostname: "https://docs.rendleysdk.com",
    transformItems(items) {
      return items.filter((item) => !item.url.includes("api-reference/"));
    },
  },

  transformPageData(pageData) {
    const canonicalUrl = `https://docs.rendleysdk.com/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");

    const description =
      pageData.frontmatter.description ||
      pageData.frontmatter.head?.find?.(
        (h: any) => h?.[0] === "meta" && h?.[1]?.name === "description",
      )?.[1]?.content;

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: canonicalUrl }],
      ["meta", { property: "og:url", content: canonicalUrl }],
      ["meta", { name: "twitter:url", content: canonicalUrl }],
    );

    if (description) {
      pageData.frontmatter.head.push(
        ["meta", { name: "description", content: description }],
        ["meta", { property: "og:description", content: description }],
        ["meta", { name: "twitter:description", content: description }],
      );
    }
  },

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(markdownTaskListPlugin);
    },
  },

  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/rendleyhq" },
      {
        icon: "discord",
        link: "https://discord.gg/BwdeFFEVXR",
      },
    ],

    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
    },

    nav: [
      {
        text: "API Reference",
        link: "https://docs.rendleysdk.com/api-reference/index.html",
      },
    ],

    sidebar: [
      {
        text: "Overview",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Concepts", link: "/concepts" },
          { text: "Best practices", link: "/best-practices" },
          { text: "Troubleshooting", link: "/troubleshooting" },
          { text: "FAQ", link: "/faq" },
          { text: "Roadmap", link: "/roadmap" },
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
          { text: "Timeline", link: "/getting-started/timeline" },
          { text: "Layer", link: "/getting-started/layer" },
          {
            text: "Clips",
            link: "/getting-started/clips",
            collapsed: true,
            items: [
              { text: "Video", link: "/getting-started/clips/video" },
              { text: "Audio", link: "/getting-started/clips/audio" },
              { text: "Image", link: "/getting-started/clips/image" },
              { text: "GIF", link: "/getting-started/clips/gif" },
              { text: "SVG", link: "/getting-started/clips/svg" },
              { text: "Text", link: "/getting-started/clips/text" },
              { text: "HTML Text", link: "/getting-started/clips/html-text" },
              { text: "Shape", link: "/getting-started/clips/shape" },
              { text: "Lottie", link: "/getting-started/clips/lottie" },
              { text: "Subtitles", link: "/getting-started/clips/subtitles" },
              { text: "Adjustment", link: "/getting-started/clips/adjustment" },
              { text: "Placeholder", link: "/getting-started/clips/placeholder" },
              { text: "Custom", link: "/getting-started/clips/custom" },
            ],
          },
          { text: "Styling", link: "/getting-started/styling" },
          { text: "Crop & Zoom", link: "/getting-started/crop" },
          { text: "Playback Speed & Fades", link: "/getting-started/playback-speed" },
          { text: "Masking", link: "/getting-started/masking" },
          { text: "Subtitles / Captions", link: "/getting-started/subtitles" },
          { text: "Filters", link: "/getting-started/filters" },
          { text: "Effects", link: "/getting-started/effects" },
          { text: "Transitions", link: "/getting-started/transitions" },
          {
            text: "Animation",
            link: "/getting-started/animation",
            collapsed: true,
            items: [
              {
                text: "Keyframe Animation",
                link: "/getting-started/property-animator",
              },
              {
                text: "Animation Controller",
                link: "/getting-started/animation-layered",
              },
            ],
          },
          { text: "Filmstrip & Waveforms", link: "/getting-started/filmstrip" },
          { text: "Undo / Redo", link: "/getting-started/undo-redo" },
          { text: "Storage", link: "/getting-started/storage" },
          {
            text: "Save / Restore Project",
            link: "/getting-started/save-restore",
          },
          { text: "Export video", link: "/getting-started/export" },
          { text: "Settings", link: "/getting-started/settings" },
          {
            text: "Advanced",
            collapsed: true,
            items: [
              { text: "FFmpeg", link: "/getting-started/ffmpeg" },
              { text: "Zip Archive", link: "/getting-started/zip-archive" },
            ],
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
          { text: "Configuration", link: "/video-editor-ui/configuration" },
          {
            text: "Events & Methods",
            link: "/video-editor-ui/events-and-methods",
          },
          { text: "Common Tasks", link: "/video-editor-ui/common-tasks" },
          { text: "Roadmap", link: "/video-editor-ui/roadmap" },
          { text: "Changelog", link: "/video-editor-ui/changelog" },
          { text: "Pro Version ✨", link: "/video-editor-ui/pro" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Slideshow Video", link: "/examples/slideshow-video" },
          {
            text: "Background Removal",
            link: "/examples/background-removal.md",
          },
          // {
          //   text: "Waveform animated by audio",
          //   link: "/waveform-animated-by-audio",
          // },
        ],
      },
      {
        text: "More",
        items: [
          {
            text: "API Reference",
            link: "https://docs.rendleysdk.com/api-reference/index.html",
          },
          { text: "Playground", link: "https://playground.rendleysdk.com" },
          { text: "Blog", link: "https://blog.rendleysdk.com" },
          { text: "Discord", link: "https://discord.gg/BwdeFFEVXR" },
          {
            text: "Report issues",
            link: "https://github.com/rendleyhq/rendley-sdk-issues/issues",
          },
        ],
      },
    ],
  },
});
