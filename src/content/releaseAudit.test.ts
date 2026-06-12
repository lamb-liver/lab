import { describe, expect, it } from 'vitest';
import { auditContent } from '../../scripts/audit-content.mjs';

const validWork = {
  collection: 'works',
  slug: 'valid-work',
  path: 'src/content/works/valid-work.md',
  body: [
    '---',
    'title: Valid Work',
    'description: Valid work draft.',
    'tags:',
    '  - 代數',
    'date: 2026-06-12',
    'featured: false',
    'draft: false',
    '---',
    '',
    '## 互動說明',
    '',
    '- 調整參數觀察圖形變化。',
  ].join('\n'),
} as const;

const validExplore = {
  collection: 'explore',
  slug: 'valid-explore',
  path: 'src/content/explore/valid-explore.md',
  body: [
    '---',
    'title: Valid Explore',
    'description: Valid explore page.',
    'category: 代數',
    'date: 2026-06-12',
    'coverImage: /images/explore-covers/valid-explore.png',
    'featured: false',
    'draft: false',
    '---',
    '',
    '## 互動說明',
    '',
    '- 調整參數觀察圖形變化。',
    '',
    '## 相關作品',
    '',
    '- [Valid Work](/works/valid-work)',
  ].join('\n'),
} as const;

describe('release content audit', () => {
  it('passes valid published works and explore content', () => {
    const result = auditContent([validWork, validExplore], {
      fileExists: (path: string) => path.endsWith('/public/images/explore-covers/valid-explore.png'),
    });

    expect(result.issues).toEqual([]);
  });

  it('rejects missing schema fields, invalid categories, and long descriptions', () => {
    const result = auditContent([
      {
        collection: 'explore',
        slug: 'bad-frontmatter',
        path: 'src/content/explore/bad-frontmatter.md',
        body: [
          '---',
          'title: Bad Frontmatter',
          'description: This description is intentionally longer than eighty characters so the release audit catches overlong card copy.',
          'category: 物理',
          'date: 2026-99-99',
          'draft: maybe',
          '---',
        ].join('\n'),
      },
    ]);

    expect(result.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        'draft must be true or false',
        'date must use a valid YYYY-MM-DD value',
        'category must be one of: 幾何, 代數, 統計, 拓樸, 分析',
        'description must be 80 characters or fewer',
      ]),
    );
  });

  it('requires cover assets and non-draft linked works for published explore pages', () => {
    const draftWork = {
      ...validWork,
      slug: 'draft-work',
      path: 'src/content/works/draft-work.md',
      body: validWork.body.replace('draft: false', 'draft: true'),
    };
    const result = auditContent([
      draftWork,
      {
        ...validExplore,
        body: validExplore.body
          .replace('coverImage: /images/explore-covers/valid-explore.png\n', '')
          .replace('/works/valid-work', '/works/draft-work'),
      },
    ]);

    expect(result.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        'published explore content must define coverImage',
        'published explore links to draft work: draft-work',
      ]),
    );
  });

  it('flags placeholder text only after content is published', () => {
    const draftExplore = {
      ...validExplore,
      slug: 'draft-explore',
      path: 'src/content/explore/draft-explore.md',
      body: validExplore.body
        .replace('draft: false', 'draft: true')
        .replace('Valid Explore', 'Draft Explore')
        .replace('調整參數觀察圖形變化。', '待補：調整參數觀察圖形變化。'),
    };
    const publishedExplore = {
      ...draftExplore,
      slug: 'published-explore',
      path: 'src/content/explore/published-explore.md',
      body: draftExplore.body.replace('draft: true', 'draft: false'),
    };

    expect(auditContent([validWork, draftExplore]).issues).toEqual([]);
    expect(auditContent([validWork, publishedExplore]).issues.map((issue) => issue.message)).toContain(
      'published content contains placeholder/debug text',
    );
  });
});
