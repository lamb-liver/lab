// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
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
