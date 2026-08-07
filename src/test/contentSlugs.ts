import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type ContentCollection = 'works' | 'explore' | 'exam';

type ContentSlugFile = {
  slug: string;
  path: string;
};

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

function readContentSlugFiles(
  collection: ContentCollection,
  root = process.cwd(),
): ContentSlugFile[] {
  const dir = join(root, 'src/content', collection);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => ({
      slug: name.replace(/\.mdx?$/, ''),
      path: join(dir, name),
    }))
    .sort(
      (a, b) => a.slug.localeCompare(b.slug) || a.path.localeCompare(b.path),
    );
}

/** 讀取 content 目錄下已存在的 slug（檔名去掉 .md / .mdx） */
export function readContentSlugs(
  collection: ContentCollection,
  root = process.cwd(),
): string[] {
  return readContentSlugFiles(collection, root).map((file) => file.slug);
}

/** 排除 draft: true 的 content slug */
export function readPublishedContentSlugs(
  collection: ContentCollection,
  root = process.cwd(),
): string[] {
  return readContentSlugFiles(collection, root)
    .filter((file) => {
      const body = readFileSync(file.path, 'utf8');
      return readFrontmatterValue(body, 'draft') !== 'true';
    })
    .map((file) => file.slug);
}
