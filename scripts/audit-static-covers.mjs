#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const COVER_SIZE = { width: 1600, height: 1000 };
const configs = {
  explore: {
    legacyCovers: new Map([
      ['fourier-series', '/explore/fourier-series-epicycles-cover.png'],
    ]),
  },
  exam: {
    legacyCovers: new Map(),
  },
};

function usage() {
  return [
    'Usage:',
    '  node scripts/audit-static-covers.mjs <explore|exam> [--json]',
    '',
    'Checks published content coverImage, generated PNGs, and reproducible SVG sources.',
    'Draft entries are not required. Fourier Explore keeps its legacy cover.',
  ].join('\n');
}

function readEntries(contentDir) {
  return readdirSync(contentDir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .sort()
    .map((name) => {
      const slug = basename(name).replace(/\.mdx?$/, '');
      const path = join(contentDir, name);
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

function toPublicPath(root, assetPath) {
  if (!assetPath || !assetPath.startsWith('/')) return null;
  return resolve(root, 'public', assetPath.slice(1));
}

function listSlugs(dir, extension) {
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((name) => name.endsWith(extension))
      .map((name) => basename(name, extension)),
  );
}

function readPngSize(path) {
  const png = readFileSync(path);
  if (
    png.length < 24 ||
    !png.subarray(0, 8).equals(PNG_SIGNATURE) ||
    png.toString('ascii', 12, 16) !== 'IHDR'
  ) {
    return null;
  }
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

export function auditStaticCovers(collection, options = {}) {
  const config = configs[collection];
  if (!config) throw new Error(`Unknown cover collection: ${collection}`);

  const root = options.root ?? repoRoot;
  const contentDir = resolve(root, 'src/content', collection);
  const coverSourceDir = resolve(root, 'scripts', `${collection}-covers`);
  const coverPublicDir = resolve(root, 'public/images', `${collection}-covers`);
  const publicPrefix = `/images/${collection}-covers`;
  const { legacyCovers } = config;
  const issues = [];
  const entries = readEntries(contentDir);
  const publishedEntries = entries.filter((entry) => !entry.draft);
  const contentSlugs = new Set(entries.map((entry) => entry.slug));
  const svgSlugs = listSlugs(coverSourceDir, '.svg');
  const pngSlugs = listSlugs(coverPublicDir, '.png');

  for (const entry of publishedEntries) {
    const legacyCover = legacyCovers.get(entry.slug);
    const expectedCover = legacyCover ?? `${publicPrefix}/${entry.slug}.png`;

    if (entry.coverImage !== expectedCover) {
      issues.push({
        slug: entry.slug,
        file: entry.path,
        message: `coverImage must be ${expectedCover}`,
      });
      continue;
    }

    const publicPath = toPublicPath(root, entry.coverImage);
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
        message: `cover source SVG has no matching ${collection} content entry`,
      });
    }
    if (legacyCovers.has(slug)) {
      issues.push({
        slug,
        file: join(coverSourceDir, `${slug}.svg`),
        message: `legacy cover slug should not use scripts/${collection}-covers source`,
      });
    }
  }

  for (const slug of pngSlugs) {
    const pngPath = join(coverPublicDir, `${slug}.png`);
    if (!contentSlugs.has(slug)) {
      issues.push({
        slug,
        file: pngPath,
        message: `cover PNG has no matching ${collection} content entry`,
      });
    }
    if (legacyCovers.has(slug)) {
      issues.push({
        slug,
        file: pngPath,
        message: `legacy cover slug should not use public/images/${collection}-covers`,
      });
    }

    const size = readPngSize(pngPath);
    if (!size) {
      issues.push({ slug, file: pngPath, message: 'cover PNG header is invalid' });
    } else if (size.width !== COVER_SIZE.width || size.height !== COVER_SIZE.height) {
      issues.push({
        slug,
        file: pngPath,
        message: `cover PNG must be 1600x1000, got ${size.width}x${size.height}`,
      });
    }
  }

  return {
    checked: publishedEntries.length,
    issues,
  };
}

export function auditExploreCovers(options) {
  return auditStaticCovers('explore', options);
}

export function auditExamCovers(options) {
  return auditStaticCovers('exam', options);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  const collection = args.find((arg) => !arg.startsWith('-'));
  if (!configs[collection]) {
    console.error(usage());
    process.exitCode = 1;
    return;
  }

  const result = auditStaticCovers(collection);
  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.issues.length === 0) {
    console.log(`${collection} cover audit passed (${result.checked} entries).`);
  } else {
    console.error(`${collection} cover audit failed (${result.issues.length} issues):`);
    for (const issue of result.issues) {
      console.error(`- ${issue.slug}: ${issue.message} (${issue.file})`);
    }
  }

  if (result.issues.length > 0) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
