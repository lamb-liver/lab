import { mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { preloadWorkOgFonts, renderWorkOgPng } from '../src/lib/workOgImage';

function readPublishedWorkSlugs(root: string): string[] {
  const dir = join(root, 'src/content/works');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => {
      const slug = basename(name).replace(/\.mdx?$/, '');
      const body = readFileSync(join(dir, name), 'utf8');
      const draft = /^draft:\s*true\s*$/m.test(body);
      return draft ? null : slug;
    })
    .filter((slug): slug is string => Boolean(slug))
    .sort();
}

describe('generate work OG PNGs into public/', () => {
  it(
    'writes a PNG for every published work',
    { timeout: 180_000 },
    async () => {
      const outDir = process.env.WORK_OG_OUT_DIR;
      expect(outDir, 'WORK_OG_OUT_DIR must be set by generate-work-og.mjs').toBeTruthy();

      mkdirSync(outDir!, { recursive: true });
      preloadWorkOgFonts();

      const slugs = readPublishedWorkSlugs(process.cwd());
      expect(slugs.length).toBeGreaterThan(0);

      for (const slug of slugs) {
        const png = await renderWorkOgPng(slug);
        expect(png.byteLength, `${slug} should have PNG bytes`).toBeGreaterThan(100);
        writeFileSync(join(outDir!, `${slug}.png`), png);
      }

      // Marker for the shell wrapper / humans reading the log.
      writeFileSync(join(outDir!, '.generated'), `${slugs.length}\n`);
      console.log(`og: generated ${slugs.length} PNGs → ${outDir}`);
    },
  );
});
