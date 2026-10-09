import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { coverDataUrl, renderEnOgCard, renderEnWorkOgPng } from '../src/lib/enOgImage';
import { examSourceLabel } from '../src/lib/examSource';

type Frontmatter = Record<string, string>;

/** 只讀需要的單行欄位（title、category、coverImage、year…），字串可帶 "…" 或 '…' 引號 */
function readFrontmatter(file: string): Frontmatter {
  const body = readFileSync(file, 'utf8');
  const block = body.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const data: Frontmatter = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!m || !m[2]) continue;
    let value = m[2].trim();
    if (value.startsWith('"')) value = JSON.parse(value);
    else if (value.startsWith("'")) value = value.slice(1, -1).replace(/''/g, "'");
    data[m[1]] = value;
  }
  return data;
}

function readEnEntries(root: string, kind: string): Array<{ slug: string; data: Frontmatter }> {
  const dir = join(root, 'src/content/en', kind);
  return readdirSync(dir)
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => ({ slug: name.replace(/\.mdx?$/, ''), data: readFrontmatter(join(dir, name)) }))
    .filter(({ data }) => data.draft !== 'true')
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

describe('generate English OG PNGs into public/og/en/', () => {
  it(
    'writes a PNG for every published English work, exam and explore page',
    { timeout: 300_000 },
    async () => {
      const outRoot = process.env.EN_OG_OUT_DIR;
      expect(outRoot, 'EN_OG_OUT_DIR must be set by generate-work-og.mjs').toBeTruthy();
      const root = process.cwd();
      const counts: Record<string, number> = {};

      for (const kind of ['works', 'exam', 'explore'] as const) {
        const outDir = join(outRoot!, kind);
        mkdirSync(outDir, { recursive: true });
        const entries = readEnEntries(root, kind);
        expect(entries.length, `${kind} should have English entries`).toBeGreaterThan(0);

        for (const { slug, data } of entries) {
          expect(data.title, `${kind}/${slug} needs an English title`).toBeTruthy();
          let png: Buffer;
          if (kind === 'works') {
            png = await renderEnWorkOgPng(slug, data.title);
          } else {
            expect(data.coverImage, `${kind}/${slug} needs coverImage`).toBeTruthy();
            const kicker =
              kind === 'exam'
                ? examSourceLabel(
                    {
                      year: Number(data.year),
                      subject: data.subject,
                      questionType: data.questionType,
                      questionNo: data.questionNo,
                    },
                    'en',
                  )
                : `Math topics · ${data.category}`;
            const imageDataUrl = await coverDataUrl(join(root, 'public', data.coverImage));
            png = await renderEnOgCard({ title: data.title, kicker, imageDataUrl }, `${kind}/${slug}`);
          }
          expect(png.byteLength, `${kind}/${slug} should have PNG bytes`).toBeGreaterThan(100);
          writeFileSync(join(outDir, `${slug}.png`), png);
        }
        counts[kind] = entries.length;
      }

      writeFileSync(join(outRoot!, '.generated'), `${JSON.stringify(counts)}\n`);
      console.log(`og:en generated ${JSON.stringify(counts)} → ${outRoot}`);
    },
  );
});
