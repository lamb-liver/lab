#!/usr/bin/env node
// Fatal-subset typecheck gate.
//
// The repo carries ~200 pre-existing tsc errors (canvas context unions,
// p5 drawingContext typing) that don't break pages, so a full `tsc --noEmit`
// gate isn't viable yet. This gate fails only on the classes that crash a
// page at runtime — undefined identifiers and syntax errors — the exact
// class behind the 2026-06-23 truncated-const incident (six broken works).
//
//   TS1xxx        syntax errors
//   TS2304/TS2552 cannot find name
//   TS2448/TS2454 used before declaration / before assigned
//
// Run the full report with: npx tsc --noEmit
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FATAL_PATTERN = /error TS(1\d{3}|2304|2552|2448|2454):/;

const tsc = spawnSync(
  process.execPath,
  [resolve(repoRoot, 'node_modules/typescript/bin/tsc'), '--noEmit', '--pretty', 'false'],
  { cwd: repoRoot, encoding: 'utf8' },
);

if (tsc.error) {
  console.error(tsc.error.message);
  process.exit(1);
}

const lines = `${tsc.stdout}\n${tsc.stderr}`.split('\n');
const fatal = lines.filter((line) => FATAL_PATTERN.test(line));
const total = lines.filter((line) => / error TS\d+:/.test(line) || /^([^\s].*)error TS\d+:/.test(line)).length;

if (fatal.length > 0) {
  console.error(`Fatal type errors (${fatal.length}):`);
  for (const line of fatal) console.error(`- ${line}`);
  process.exit(1);
}

console.log(`Typecheck fatal gate passed (0 fatal; ${total} known non-fatal errors, see npx tsc --noEmit).`);
