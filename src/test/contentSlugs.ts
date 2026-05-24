import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/** 讀取 content 目錄下已存在的 slug（檔名去掉 .md / .mdx） */
export function readContentSlugs(collection: 'works' | 'explore'): string[] {
  const dir = join(process.cwd(), 'src/content', collection);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx?$/, ''))
    .sort();
}
