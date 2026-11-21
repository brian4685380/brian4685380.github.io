import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import stripPostTitle from './src/lib/strip-post-title.mjs';

// Pages supplies the canonical origin at deploy time. Local previews work without it.
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath, stripPostTitle],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    mdx(),
    sitemap({ filter: (url) => !/\/404(?:\.html|\/)?$/.test(new URL(url).pathname) }),
  ],
});
