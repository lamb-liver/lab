#!/usr/bin/env node
/**
 * Fail the build if dist/og/works (or public/og/works) is missing most work OG PNGs.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
// Allow a little slack for drafts/intentional skips; far fewer = broken pipeline.
const MIN_RATIO = 0.9;

function readPublishedWorkSlugs() {
  const dir = join(repoRoot, 'src/content/works');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => {
      const slug = basename(name).replace(/\.mdx?$/, '');
      const body = readFileSync(join(dir, name), 'utf8');
      const draft = /^draft:\s*true\s*$/m.test(body);
      return draft ? null : slug;
    })
    .filter(Boolean)
    .sort();
}

function listValidPngs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.png'))
    .filter((name) => {
      const buf = readFileSync(join(dir, name));
      return buf.length > 100 && buf.subarray(0, 8).equals(PNG_SIGNATURE);
    })
    .map((name) => name.replace(/\.png$/, ''))
    .sort();
}

const works = readPublishedWorkSlugs();
const distDir = join(repoRoot, 'dist/og/works');
const publicDir = join(repoRoot, 'public/og/works');
const distPngs = listValidPngs(distDir);
const publicPngs = listValidPngs(publicDir);

const minRequired = Math.ceil(works.length * MIN_RATIO);
const bestCount = Math.max(distPngs.length, publicPngs.length);
const source = distPngs.length >= publicPngs.length ? 'dist' : 'public';
const present = new Set(distPngs.length >= publicPngs.length ? distPngs : publicPngs);
const missing = works.filter((slug) => !present.has(slug));

console.log(
  `audit:work-og works=${works.length} dist=${distPngs.length} public=${publicPngs.length} min=${minRequired}`,
);

if (bestCount < minRequired) {
  console.error(
    `audit:work-og FAILED: only ${bestCount} valid OG PNGs in ${source}/og/works (need ≥ ${minRequired} of ${works.length} works).`,
  );
  if (missing.length) {
    console.error(`missing (sample): ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '…' : ''}`);
  }
  process.exit(1);
}

const sample = ['spirograph-curve', 'rose-curve'].filter((slug) => works.includes(slug));
for (const slug of sample) {
  if (!present.has(slug)) {
    console.error(`audit:work-og FAILED: expected sample OG missing: ${slug}.png`);
    process.exit(1);
  }
}

console.log('audit:work-og OK');
