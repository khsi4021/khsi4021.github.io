// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// User site (repo `khsi4021.github.io`) is served from the domain root.
// For a project repo instead, set `base: "/<repo-name>"` (see DECISIONS.md D19).
export default defineConfig({
  site: "https://khsi4021.github.io",
  trailingSlash: "ignore",
  compressHTML: true,
  build: { inlineStylesheets: "always" },
  integrations: [mdx(), sitemap()],
  markdown: {
    // Astro 7 defaults to the Sätteri processor; KaTeX needs the unified pipeline.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: "ignore", output: "html" }]],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
      wrap: false,
    },
  },
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
