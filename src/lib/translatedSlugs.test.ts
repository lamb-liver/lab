import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const KINDS = ['works', 'explore', 'exam'] as const;
const EN_ROOT = join(process.cwd(), 'src/content/en');

function enFiles(kind: (typeof KINDS)[number]): string[] {
  const dir = join(EN_ROOT, kind);
  return existsSync(dir) ? readdirSync(dir).filter((name) => /\.mdx?$/.test(name)) : [];
}

function slugs(kind: (typeof KINDS)[number]): Set<string> {
  return new Set(enFiles(kind).map((name) => name.replace(/\.mdx?$/, '')));
}

describe('English pages', () => {
  // 英文頁只會為有英文檔的 slug 產生；連到還沒翻譯的頁面會變 404。
  it('only link to /en/ pages that exist', () => {
    const published = Object.fromEntries(KINDS.map((kind) => [kind, slugs(kind)]));
    const broken: string[] = [];
    for (const kind of KINDS) {
      for (const name of enFiles(kind)) {
        const body = readFileSync(join(EN_ROOT, kind, name), 'utf8');
        for (const match of body.matchAll(/\]\(\/en\/(works|explore|exam)\/([^/)#?]+)\/?[^)]*\)/g)) {
          const [, target, slug] = match;
          if (!published[target as (typeof KINDS)[number]].has(slug)) {
            broken.push(`${kind}/${name} -> /en/${target}/${slug}/`);
          }
        }
      }
    }
    expect(broken).toEqual([]);
  });

  // 沒英文版時暫時連回中文頁；英文頁補上後就要改回 /en/，避免讀者被帶離英文站。
  it('link to the /en/ page instead of the Chinese page once it exists', () => {
    const published = Object.fromEntries(KINDS.map((kind) => [kind, slugs(kind)]));
    const stale: string[] = [];
    for (const kind of KINDS) {
      for (const name of enFiles(kind)) {
        const body = readFileSync(join(EN_ROOT, kind, name), 'utf8');
        for (const match of body.matchAll(/\]\(\/(works|explore|exam)\/([^/)#?]+)\/?[^)]*\)/g)) {
          const [, target, slug] = match;
          if (published[target as (typeof KINDS)[number]].has(slug)) {
            stale.push(`${kind}/${name} -> /${target}/${slug}/`);
          }
        }
      }
    }
    expect(stale).toEqual([]);
  });

  it('only translate slugs that exist in Chinese', () => {
    const orphans: string[] = [];
    for (const kind of KINDS) {
      const zh = new Set(
        readdirSync(join(process.cwd(), 'src/content', kind)).map((n) => n.replace(/\.mdx?$/, '')),
      );
      for (const slug of slugs(kind)) if (!zh.has(slug)) orphans.push(`${kind}/${slug}`);
    }
    expect(orphans).toEqual([]);
  });
});
