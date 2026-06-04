import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ContentEntry } from './utils';

export type ExploreContentEntry = ContentEntry & {
  data: ContentEntry['data'] & { title: string };
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

/** Build explore entries from disk for tests (matches Astro collection sort inputs). */
export function readExploreEntries(root = process.cwd()): ExploreContentEntry[] {
  const dir = join(root, 'src/content/explore');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const body = readFileSync(join(dir, name), 'utf8');
      const id = name.replace(/\.md$/, '');
      const dateRaw = readFrontmatterValue(body, 'date');
      return {
        id,
        data: {
          title: readFrontmatterValue(body, 'title') ?? id,
          date: dateRaw ? new Date(dateRaw) : new Date(0),
          draft: readFrontmatterValue(body, 'draft') === 'true',
          featured: readFrontmatterValue(body, 'featured') === 'true',
        },
      };
    });
}
