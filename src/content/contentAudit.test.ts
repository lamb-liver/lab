import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditContentFiles, readContentFiles } from './contentAudit';

function countContentFiles(collection: 'works' | 'explore') {
  return readdirSync(join(process.cwd(), 'src/content', collection)).filter(
    (name) => name.endsWith('.md') || name.endsWith('.mdx'),
  ).length;
}

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

  it('rejects missing or misplaced interaction and observation wording', () => {
    const files = [
      {
        collection: 'works' as const,
        path: 'src/content/works/missing-interaction.md',
        body: [
          '---',
          'title: 測試作品',
          'description: 幾何關係',
          '---',
          '## 觀察重點',
          '',
          '- 曲線關係會在圖形中呈現。',
        ].join('\n'),
      },
      {
        collection: 'explore' as const,
        path: 'src/content/explore/weak-interaction.md',
        body: [
          '---',
          'title: 測試主題',
          'description: 幾何關係',
          'category: 幾何',
          '---',
          '## 互動說明',
          '',
          '- 圖形具有對稱性。',
          '',
          '## 觀察重點',
          '',
          '- 點擊按鈕切換模式。',
        ].join('\n'),
      },
      {
        collection: 'explore' as const,
        path: 'src/content/explore/missing-observation.md',
        body: [
          '---',
          'title: 測試主題',
          'description: 幾何關係',
          'category: 幾何',
          '---',
          '## 互動說明',
          '',
          '- 調整參數，觀察畫面變化。',
        ].join('\n'),
      },
    ];

    const issuePairs = auditContentFiles(files).map((issue) => [
      issue.file,
      issue.message,
    ]);

    expect(issuePairs).toEqual(
      expect.arrayContaining([
        [
          'src/content/works/missing-interaction.md',
          'missing ## 互動說明 section',
        ],
        [
          'src/content/explore/weak-interaction.md',
          '互動說明 bullet should describe an operation, mode, or visible change',
        ],
        [
          'src/content/explore/weak-interaction.md',
          '觀察重點 should avoid control-operation wording; move it to 互動說明',
        ],
        [
          'src/content/explore/missing-observation.md',
          'explore content must include ## 觀察重點',
        ],
      ]),
    );
  });

  it('covers every content file in works and explore', () => {
    const files = readContentFiles();
    const worksCount = countContentFiles('works');
    const exploreCount = countContentFiles('explore');

    expect(files).toHaveLength(worksCount + exploreCount);
    expect(files.filter((file) => file.collection === 'works')).toHaveLength(worksCount);
    expect(files.filter((file) => file.collection === 'explore')).toHaveLength(exploreCount);
  });
});
