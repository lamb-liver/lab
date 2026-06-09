import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function readFrontmatterValue(body: string, key: string): string | null {
  const lines = body.split('\n');
  if (lines[0] !== '---') return null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') return null;
    const match = line.match(new RegExp(`^${key}:\\s*(.*)$`));
    if (!match) continue;
    const raw = (match[1] ?? '').trim();
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      return raw.slice(1, -1);
    }
    return raw;
  }

  return null;
}

/** 讀取 content 目錄下已存在的 slug（檔名去掉 .md / .mdx） */
export function readContentSlugs(collection: 'works' | 'explore'): string[] {
  const dir = join(process.cwd(), 'src/content', collection);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx?$/, ''))
    .sort();
}

/** 排除 draft: true 的 content slug */
export function readPublishedContentSlugs(collection: 'works' | 'explore'): string[] {
  const dir = join(process.cwd(), 'src/content', collection);
  return readContentSlugs(collection).filter((slug) => {
    const body = readFileSync(join(dir, `${slug}.md`), 'utf8');
    return readFrontmatterValue(body, 'draft') !== 'true';
  });
}
