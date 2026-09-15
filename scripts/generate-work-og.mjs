#!/usr/bin/env node
/**
 * Pre-build: write per-work OG PNGs into public/og/works/ so they deploy like
 * other static public assets (explore/exam covers pattern). Astro copies them
 * into dist/ during build.
 *
 * Runs via Vitest so TypeScript path resolution matches the rest of the repo.
 */
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(repoRoot, 'public/og/works');
const vitestBin = resolve(repoRoot, 'node_modules/vitest/vitest.mjs');
const runnerTest = resolve(repoRoot, 'scripts/generate-work-og.vitest.ts');

mkdirSync(outDir, { recursive: true });

for (const name of readdirSync(outDir)) {
  if (name.endsWith('.png')) rmSync(resolve(outDir, name));
}

const result = spawnSync(
  process.execPath,
  [
    vitestBin,
    'run',
    '--reporter=verbose',
    '--config',
    resolve(repoRoot, 'vitest.work-og.config.ts'),
    runnerTest,
  ],
  {
    cwd: repoRoot,
    env: { ...process.env, WORK_OG_OUT_DIR: outDir },
    stdio: 'inherit',
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
