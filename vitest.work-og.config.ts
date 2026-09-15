import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/generate-work-og.vitest.ts'],
    // OG generation is sequential sharp/satori work; avoid parallel file workers.
    fileParallelism: false,
  },
});
