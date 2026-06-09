import { describe, expect, it } from 'vitest';
import { auditContentFiles, readContentFiles } from './contentAudit';

describe('content audit', () => {
  it('keeps frontmatter math and interaction/observation sections aligned', () => {
    expect(auditContentFiles()).toEqual([]);
  });

  it('rejects frontmatter descriptions with raw math or LaTeX commands', () => {
    const validSections = [
      '## 互動說明',
      '',
      '- 調整參數，觀察畫面變化',
      '',
      '## 觀察重點',
      '',
      '- 數值關係會在圖形中呈現。',
    ].join('\n');
    const files = [
      ['$a^x$', 'inline-dollar.md'],
      ['$$a^x$$', 'display-dollar.md'],
      ['\\(a^x\\)', 'paren.md'],
      ['\\[a^x\\]', 'bracket.md'],
      ['\\begin{matrix}', 'env.md'],
      ['\\log_a x', 'command.md'],
    ].map(([description, name]) => ({
      collection: 'explore' as const,
      path: `src/content/explore/${name}`,
      body: ['---', 'title: 測試', `description: ${description}`, 'category: 代數', '---', validSections].join('\n'),
    }));

    expect(auditContentFiles(files)).toHaveLength(files.length);
  });

  it('covers every content file in works and explore', () => {
    const files = readContentFiles();
    expect(files).toHaveLength(60);
    expect(files.filter((file) => file.collection === 'works')).toHaveLength(47);
    expect(files.filter((file) => file.collection === 'explore')).toHaveLength(13);
  });
});
