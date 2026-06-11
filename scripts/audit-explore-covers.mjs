#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const exploreContentDir = resolve(repoRoot, 'src/content/explore');
const coverSourceDir = resolve(repoRoot, 'scripts/explore-covers');
const coverPublicDir = resolve(repoRoot, 'public/images/explore-covers');
const legacyCovers = new Map([
  ['fourier-series', '/explore/fourier-series-epicycles-cover.png'],
]);

function usage() {
  return [
    'Usage:',
    '  npm run audit:explore-covers',
    '  npm run audit:explore-covers -- --json',
    '',
    'Checks published src/content/explore coverImage, public/images/explore-covers PNGs,',
    'and scripts/explore-covers SVG sources. Draft entries are not required.',
    'fourier-series keeps its legacy cover.',
  ].join('\n');
}

function readExploreEntries() {
  return readdirSync(exploreContentDir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .sort()
    .map((name) => {
      const slug = basename(name).replace(/\.mdx?$/, '');
      const path = join(exploreContentDir, name);
      const body = readFileSync(path, 'utf8');
      return {
        slug,
        path,
        coverImage: readFrontmatterValue(body, 'coverImage'),
        draft: readFrontmatterValue(body, 'draft') === 'true',
      };
    });
}

function readFrontmatterValue(body, key) {
  const lines = body.split('\n');
  if (lines[0] !== '---') return null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') return null;
    const match = line.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`));
    if (match) return stripQuotes(match[1]);
  }
  return null;
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function toPublicPath(assetPath) {
  if (!assetPath || !assetPath.startsWith('/')) return null;
  return resolve(repoRoot, 'public', assetPath.slice(1));
}

function listSlugs(dir, extension) {
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((name) => name.endsWith(extension))
      .map((name) => basename(name, extension)),
  );
}

export function auditExploreCovers() {
  const issues = [];
  const entries = readExploreEntries();
  const publishedEntries = entries.filter((entry) => !entry.draft);
  const contentSlugs = new Set(entries.map((entry) => entry.slug));
  const svgSlugs = listSlugs(coverSourceDir, '.svg');
  const pngSlugs = listSlugs(coverPublicDir, '.png');

  for (const entry of publishedEntries) {
    const legacyCover = legacyCovers.get(entry.slug);
    const expectedCover = legacyCover ?? `/images/explore-covers/${entry.slug}.png`;

    if (entry.coverImage !== expectedCover) {
      issues.push({
        slug: entry.slug,
        file: entry.path,
        message: `coverImage must be ${expectedCover}`,
      });
      continue;
    }

    const publicPath = toPublicPath(entry.coverImage);
    if (!publicPath || !existsSync(publicPath)) {
      issues.push({
        slug: entry.slug,
        file: entry.path,
        message: `cover asset is missing: ${entry.coverImage}`,
      });
    }

    if (legacyCover) continue;

    if (!svgSlugs.has(entry.slug)) {
      issues.push({
        slug: entry.slug,
        file: join(coverSourceDir, `${entry.slug}.svg`),
        message: 'cover source SVG is missing',
      });
    }
    if (!pngSlugs.has(entry.slug)) {
      issues.push({
        slug: entry.slug,
        file: join(coverPublicDir, `${entry.slug}.png`),
        message: 'generated cover PNG is missing',
      });
    }
  }

  for (const slug of svgSlugs) {
    if (!contentSlugs.has(slug)) {
      issues.push({
        slug,
        file: join(coverSourceDir, `${slug}.svg`),
        message: 'cover source SVG has no matching explore content entry',
      });
    }
    if (legacyCovers.has(slug)) {
      issues.push({
        slug,
        file: join(coverSourceDir, `${slug}.svg`),
        message: 'legacy cover slug should not use scripts/explore-covers source',
      });
    }
  }

  for (const slug of pngSlugs) {
    if (!contentSlugs.has(slug)) {
      issues.push({
        slug,
        file: join(coverPublicDir, `${slug}.png`),
        message: 'cover PNG has no matching explore content entry',
      });
    }
    if (legacyCovers.has(slug)) {
      issues.push({
        slug,
        file: join(coverPublicDir, `${slug}.png`),
        message: 'legacy cover slug should not use public/images/explore-covers',
      });
    }
  }

  return {
    checked: publishedEntries.length,
    issues,
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  const result = auditExploreCovers();
  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.issues.length === 0) {
    console.log(`Explore cover audit passed (${result.checked} entries).`);
  } else {
    console.error(`Explore cover audit failed (${result.issues.length} issues):`);
    for (const issue of result.issues) {
      console.error(`- ${issue.slug}: ${issue.message} (${issue.file})`);
    }
  }

  if (result.issues.length > 0) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
