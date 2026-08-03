#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const playwrightBin = resolve(repoRoot, 'node_modules/@playwright/test/cli.js');

if (!existsSync(playwrightBin)) throw new Error('Missing local Playwright binary. Run npm install first.');

const requested = process.argv[2];
const env = { ...process.env };
if (requested && !requested.startsWith('-')) env.CONTEST_CONTROLS_SLUGS = requested;

const result = spawnSync(
  process.execPath,
  [playwrightBin, 'test', 'tests/contest-controls.spec.ts', ...process.argv.slice(requested ? 3 : 2)],
  { cwd: repoRoot, env, stdio: 'inherit' },
);
if (result.status === null) throw new Error(result.error?.message ?? 'Failed to run contest controls test');
process.exitCode = result.status;
