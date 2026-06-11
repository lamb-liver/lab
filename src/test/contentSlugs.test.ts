import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readContentSlugs, readPublishedContentSlugs } from './contentSlugs';

describe('content slug test helpers', () => {
  it('reads md and mdx slugs and filters drafts from their actual files', () => {
    const root = mkdtempSync(join(tmpdir(), 'content-slugs-'));
    const worksDir = join(root, 'src/content/works');
    mkdirSync(worksDir, { recursive: true });

    writeContent(worksDir, 'alpha.md', false);
    writeContent(worksDir, 'beta.mdx', true);
    writeContent(worksDir, 'gamma.mdx');

    expect(readContentSlugs('works', root)).toEqual([
      'alpha',
      'beta',
      'gamma',
    ]);
    expect(readPublishedContentSlugs('works', root)).toEqual([
      'alpha',
      'gamma',
    ]);
  });
});

function writeContent(dir: string, filename: string, draft?: boolean): void {
  const frontmatter = [
    '---',
    `title: ${filename}`,
    'description: fixture',
    ...(draft === undefined ? [] : [`draft: ${draft}`]),
    '---',
    '',
    '## 互動說明',
    '',
    '- 調整參數，觀察畫面變化。',
  ].join('\n');

  writeFileSync(join(dir, filename), frontmatter);
}
