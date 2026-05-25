// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages: /lab/ 子路徑 · Vercel 等根網域部署: base /
const onVercel = process.env.VERCEL === '1';
const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const vercelSite = vercelHost ? `https://${vercelHost}` : undefined;

// https://astro.build/config
export default defineConfig({
  site: onVercel ? vercelSite : 'https://lamb-liver.github.io',
  base: onVercel ? '/' : '/lab/',
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
