import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  assertCreatableFiles as assertCreatableWorkFiles,
  buildNewWorkFiles,
} from '../../scripts/new-work.mjs';
import {
  assertCreatableFiles as assertCreatableExploreFiles,
  buildNewExploreFiles,
} from '../../scripts/new-explore.mjs';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempRoot() {
  const dir = mkdtempSync(join(tmpdir(), 'lab-generator-'));
  tempDirs.push(dir);
  return dir;
}

describe('draft content generators', () => {
  it('plans a new Works draft without registry edits', () => {
    const root = tempRoot();
    const files = buildNewWorkFiles({
      slug: 'matrix-grid',
      title: '矩陣格線',
      description: '矩陣格線的互動視覺化草稿。',
      date: '2026-06-12',
      tags: ['代數'],
    }, root);

    expect(files.map((file) => file.relativePath)).toEqual([
      'src/content/works/matrix-grid.md',
      'src/components/works/MatrixGrid.tsx',
    ]);
    expect(files[0].content).toContain('draft: true');
    expect(files[0].content).toContain('tags:\n  - 代數');
    expect(files[1].content).toContain('export default function MatrixGrid()');
  });

  it('plans a new Explore draft with cover guidance left outside frontmatter', () => {
    const root = tempRoot();
    const files = buildNewExploreFiles({
      slug: 'matrix-eigenvectors',
      title: '矩陣與特徵向量',
      description: '矩陣與特徵向量的互動導覽草稿。',
      category: '代數',
      date: '2026-06-12',
    }, root);

    expect(files.map((file) => file.relativePath)).toEqual([
      'src/content/explore/matrix-eigenvectors.md',
    ]);
    expect(files[0].content).toContain('draft: true');
    expect(files[0].content).toContain('category: 代數');
    expect(files[0].content).not.toContain('coverImage:');
  });

  it('rejects invalid slugs and duplicate target files', () => {
    expect(() =>
      buildNewWorkFiles({
        slug: 'Bad Slug',
        title: 'Bad',
        description: 'Bad draft.',
        date: '2026-06-12',
        tags: ['代數'],
      }),
    ).toThrow('Slug must be kebab-case');

    const root = tempRoot();
    const files = buildNewExploreFiles({
      slug: 'duplicate-topic',
      title: 'Duplicate Topic',
      description: 'Duplicate topic draft.',
      category: '分析',
      date: '2026-06-12',
    }, root);
    mkdirSync(join(root, 'src/content/explore'), { recursive: true });
    writeFileSync(files[0].absolutePath, 'already exists', 'utf8');

    expect(() => assertCreatableExploreFiles(files)).toThrow('Refusing to overwrite existing file');
    expect(() => assertCreatableWorkFiles(files)).toThrow('Refusing to overwrite existing file');
  });
});
