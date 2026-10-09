import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { coverDataUrl } from '../src/lib/enOgImage';
import { examSourceLabel } from '../src/lib/examSource';
import { renderZhOgCard } from '../src/lib/zhOgImage';
import { zhExploreKicker } from '../src/lib/zhOgPaths';

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

function readZhEntries(root: string, kind: string): Array<{ slug: string; data: Frontmatter }> {
  const dir = join(root, 'src/content', kind);
  return readdirSync(dir)
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => ({ slug: name.replace(/\.mdx?$/, ''), data: readFrontmatter(join(dir, name)) }))
    .filter(({ data }) => data.draft !== 'true' && data.coverImage)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

describe('generate Chinese exam/explore OG PNGs into public/og/zh/', () => {
  it('writes a titled card for every published Chinese exam and explore page', { timeout: 300_000 }, async () => {
    const outRoot = process.env.ZH_OG_OUT_DIR;
    expect(outRoot, 'ZH_OG_OUT_DIR must be set by generate-work-og.mjs').toBeTruthy();
    const root = process.cwd();
    const counts: Record<string, number> = {};

    for (const kind of ['exam', 'explore'] as const) {
      const outDir = join(outRoot!, kind);
      mkdirSync(outDir, { recursive: true });
      const entries = readZhEntries(root, kind);
      expect(entries.length, `${kind} should have entries`).toBeGreaterThan(0);

      for (const { slug, data } of entries) {
        expect(data.title, `${kind}/${slug} needs a title`).toBeTruthy();
        const kicker =
          kind === 'exam'
            ? examSourceLabel({
                year: Number(data.year),
                subject: data.subject,
                questionType: data.questionType,
                questionNo: data.questionNo,
              })
            : zhExploreKicker(data.category);
        const imageDataUrl = await coverDataUrl(join(root, 'public', data.coverImage));
        const png = await renderZhOgCard({ title: data.title, kicker, imageDataUrl }, `${kind}/${slug}`);
        expect(png.byteLength, `${kind}/${slug} should have PNG bytes`).toBeGreaterThan(100);
        writeFileSync(join(outDir, `${slug}.png`), png);
      }
      counts[kind] = entries.length;
    }

    writeFileSync(join(outRoot!, '.generated'), `${JSON.stringify(counts)}\n`);
    console.log(`og:zh generated ${JSON.stringify(counts)} → ${outRoot}`);
  });
});
