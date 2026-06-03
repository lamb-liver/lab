// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const SITE = 'https://lab.lambliver.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/',
  integrations: [react(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: 'html' }]],
  },
  devToolbar: { enabled: false },
  vite: {
    ssr: {
      external: ['p5'],
    },
    build: {
      chunkSizeWarningLimit: 1100,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/p5')) return 'p5';
          },
        },
      },
    },
  },
});
