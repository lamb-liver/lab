// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const SITE = 'https://lab.lambliver.dev';

/**
 * 試題視覺化（/exam）尚未公開。頁面檔放在 src/pages-preview/ 而非 src/pages/，
 * 因此不會被 Astro 自動路由；只有 dev 或 EXAM_PREVIEW=1 時才注入路由。
 * 正式 build 完全不會產出 /exam 的任何 HTML，sitemap 自然也不會收錄。
 */
/** @returns {import('astro').AstroIntegration} */
function examPreview() {
  return {
    name: 'exam-preview',
    hooks: {
      'astro:config:setup': ({ command, injectRoute, logger }) => {
        if (command !== 'dev' && process.env.EXAM_PREVIEW !== '1') return;
        injectRoute({ pattern: '/exam', entrypoint: './src/pages-preview/exam/index.astro' });
        injectRoute({
          pattern: '/exam/[slug]',
          entrypoint: './src/pages-preview/exam/[slug].astro',
        });
        logger.warn('exam preview routes enabled (/exam is not public)');
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/',
  integrations: [react(), sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/exam') }), examPreview()],
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
