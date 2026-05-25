import { describe, expect, it } from 'vitest';
import {
  collectExploreCategories,
  collectWorkTags,
  getFeaturedOrLatest,
  getStaticPathsFromCollection,
} from './utils';

const entry = (
  id: string,
  date: string,
  featured = false,
  draft = false,
  tags: string[] = [],
) => ({
  id,
  data: { date: new Date(date), featured, draft, tags },
});

describe('getFeaturedOrLatest', () => {
  const pool = [
    entry('a', '2026-01-01', true),
    entry('b', '2026-02-01', false),
    entry('c', '2026-03-01', true),
    entry('d', '2026-04-01', false),
  ];

  it('backfills with non-featured when featured pool smaller than limit', () => {
    const result = getFeaturedOrLatest(pool, 3);
    expect(result.map((e) => e.id)).toEqual(['c', 'a', 'd']);
  });

  it('falls back to all published when no featured', () => {
    const noFeatured = pool.map((e) => ({ ...e, data: { ...e.data, featured: false } }));
    expect(getFeaturedOrLatest(noFeatured, 2).map((e) => e.id)).toEqual(['d', 'c']);
  });

  it('excludes draft entries', () => {
    const withDraft = [...pool, entry('draft', '2026-05-01', true, true)];
    expect(getFeaturedOrLatest(withDraft, 5).some((e) => e.id === 'draft')).toBe(false);
  });
});

describe('getStaticPathsFromCollection', () => {
  it('does not require sorting; only filters published', () => {
    const paths = getStaticPathsFromCollection([
      entry('z', '2026-01-01'),
      entry('draft', '2026-02-01', false, true),
    ]);
    expect(paths).toHaveLength(1);
    expect(paths[0]?.params.slug).toBe('z');
  });
});

describe('collectWorkTags', () => {
  it('returns unique sorted tags', () => {
    const tags = collectWorkTags([
      entry('a', '2026-01-01', false, false, ['幾何', '參數方程']),
      entry('b', '2026-02-01', false, false, ['三角函數', '幾何']),
    ] as Parameters<typeof collectWorkTags>[0]);
    expect(tags).toEqual(['三角函數', '參數方程', '幾何']);
  });
});

describe('collectExploreCategories', () => {
  it('returns only categories present in entries', () => {
    const exploreEntry = (id: string, category: string) =>
      ({
        id,
        data: {
          date: new Date('2026-01-01'),
          featured: false,
          draft: false,
          category,
        },
      }) as Parameters<typeof collectExploreCategories>[0][number];

    const categories = collectExploreCategories([
      exploreEntry('a', '分析'),
      exploreEntry('b', '幾何'),
      exploreEntry('c', '分析'),
    ]);
    expect(categories).toEqual(['分析', '幾何']);
    expect(categories).not.toContain('統計');
    expect(categories).not.toContain('拓樸');
  });
});
