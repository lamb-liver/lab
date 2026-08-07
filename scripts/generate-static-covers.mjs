import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const collection = process.argv[2];
const configs = {
  explore: {
    sourceDir: resolve(repoRoot, 'scripts/explore-covers'),
    pngDir: resolve(repoRoot, 'public/images/explore-covers'),
  },
  exam: {
    sourceDir: resolve(repoRoot, 'scripts/exam-covers'),
    pngDir: resolve(repoRoot, 'public/images/exam-covers'),
  },
};
const W = 1600;
const H = 1000;

if (collection === '--help' || collection === '-h') {
  console.log('Usage: node scripts/generate-static-covers.mjs <explore|exam>');
  process.exit(0);
}

const config = configs[collection];
if (!config) {
  throw new Error('Cover collection must be explore or exam');
}

const { sourceDir, pngDir } = config;
mkdirSync(pngDir, { recursive: true });

const slugs = readdirSync(sourceDir)
  .filter((name) => name.endsWith('.svg'))
  .map((name) => basename(name, '.svg'))
  .sort();

if (slugs.length === 0) {
  throw new Error(`No SVG cover sources found in ${sourceDir}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const slug of slugs) {
    const svgPath = resolve(sourceDir, `${slug}.svg`);
    if (!existsSync(svgPath)) continue;
    await page.goto(pathToFileURL(svgPath).href, { waitUntil: 'load' });
    await page.screenshot({ path: resolve(pngDir, `${slug}.png`), type: 'png' });
    console.log(`generated ${slug}`);
  }
} finally {
  await browser.close();
}
