#!/usr/bin/env node
// Full typecheck gate.
//
// 2026-07-17: the repo reached 0 `tsc --noEmit` errors, so this gate now
// fails on ANY type error. (It previously only caught the fatal subset —
// syntax errors and undefined identifiers, the class behind the 2026-06-23
// truncated-const incident — because ~200 known non-fatal errors existed.)
//
// `astro sync` runs first: tsconfig includes the generated `.astro/types.d.ts`
// (astro:content types, CSS side-effect import declarations), so a fresh
// checkout would otherwise report spurious errors.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Direct node_modules paths (require.resolve can't reach these files:
// typescript 7's exports map hides them). Walk upward so git worktrees
// that share the main checkout's node_modules also resolve.
function findModuleFile(rel) {
  let dir = repoRoot;
  for (;;) {
    const candidate = resolve(dir, 'node_modules', rel);
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) {
      console.error(`Cannot find node_modules/${rel}; run npm install first.`);
      process.exit(1);
    }
    dir = parent;
  }
}

const astroBin = findModuleFile('astro/bin/astro.mjs');
const tscBin = findModuleFile('typescript/bin/tsc');

const sync = spawnSync(process.execPath, [astroBin, 'sync'], {
  cwd: repoRoot,
  stdio: 'inherit',
});
if (sync.error || sync.status !== 0) {
  if (sync.error) console.error(sync.error.message);
  console.error('astro sync failed; cannot typecheck without .astro/types.d.ts');
  process.exit(sync.status ?? 1);
}

const tsc = spawnSync(process.execPath, [tscBin, '--noEmit', '--pretty', 'false'], {
  cwd: repoRoot,
  encoding: 'utf8',
});

if (tsc.error) {
  console.error(tsc.error.message);
  process.exit(1);
}

const output = `${tsc.stdout}\n${tsc.stderr}`;
const errors = output.split('\n').filter((line) => /error TS\d+:/.test(line));

if (tsc.status !== 0 || errors.length > 0) {
  console.error(`Typecheck gate failed (${errors.length} errors):`);
  process.stderr.write(output);
  process.exit(tsc.status === 0 ? 1 : tsc.status);
}

console.log('Typecheck gate passed (0 errors, full tsc --noEmit).');
