import { describe, expect, it } from 'vitest';
import {
  collectExploreCategories,
  collectWorkTags,
  excludeEntryIds,
  getFeaturedInteractive,
  getPublished,
  getCollectionPagerNeighbors,
  getPublishedAsc,
  getPublishedInteractive,
  getStaticPathsFromCollection,
} from './utils';

const entry = (
  id: string,
  order: number,
  featured = false,
  draft = false,
  tags: string[] = [],
  date = '2026-06-21',
) => ({
  id,
  data: { date: new Date(date), order, featured, draft, tags },
});

describe('getPublishedInteractive', () => {
  it('returns only listed slugs, newest first, capped at limit', () => {
    const pool = [
      entry('placeholder', 3),
      entry('rose-curve', 1),
      entry('vector-field-streamlines', 2),
      entry('draft', 4, false, true),
    ];
    const result = getPublishedInteractive(pool, ['rose-curve', 'vector-field-streamlines'], 3);
    expect(result.map((e) => e.id)).toEqual(['vector-field-streamlines', 'rose-curve']);
  });
});

describe('getFeaturedInteractive', () => {
  it('returns only featured interactive slugs, newest first, capped', () => {
    const pool = [
      entry('placeholder', 3, true),
      entry('julia-set', 2, true),
      entry('spirograph-curve', 1, true),
      entry('rose-curve', 4, false),
    ];
    const result = getFeaturedInteractive(
      pool,
      ['julia-set', 'spirograph-curve', 'rose-curve'],
      2,
    );
    expect(result.map((e) => e.id)).toEqual(['julia-set', 'spirograph-curve']);
  });
});

describe('excludeEntryIds', () => {
  it('removes entries whose id is in the exclude set', () => {
    const pool = [entry('a', 1), entry('b', 2)];
    expect(excludeEntryIds(pool, new Set(['a'])).map((e) => e.id)).toEqual(['b']);
  });
});

describe('getCollectionPagerNeighbors', () => {
  it('returns null neighbors when slug is missing from the published list', () => {
    const pool = [entry('a', 1), entry('b', 2)];
    expect(getCollectionPagerNeighbors(pool, 'missing')).toEqual({
      previous: null,
      next: null,
    });
  });

  it('returns previous and next entries in ascending order', () => {
    const pool = [
      entry('first', 1),
      entry('middle', 2),
      entry('last', 3),
    ];
    expect(getCollectionPagerNeighbors(pool, 'middle')).toEqual({
      previous: pool[0],
      next: pool[2],
    });
  });
});

describe('published sorting', () => {
  it('uses id as a stable tie-breaker for same-order newest-first lists', () => {
    const result = getPublished([
      entry('z-topic', 1),
      entry('a-topic', 1),
      entry('newer', 2),
    ]);

    expect(result.map((e) => e.id)).toEqual(['newer', 'a-topic', 'z-topic']);
  });

  it('uses id as a stable tie-breaker for same-order oldest-first lists', () => {
    const result = getPublishedAsc([
      entry('z-topic', 1),
      entry('a-topic', 1),
      entry('newer', 2),
    ]);

    expect(result.map((e) => e.id)).toEqual(['a-topic', 'z-topic', 'newer']);
  });
});

describe('getStaticPathsFromCollection', () => {
  it('does not require sorting; only filters published', () => {
    const paths = getStaticPathsFromCollection([
      entry('z', 1),
      entry('draft', 2, false, true),
    ]);
    expect(paths).toHaveLength(1);
    expect(paths[0]?.params.slug).toBe('z');
  });

  it('can include drafts for local detail previews', () => {
    const paths = getStaticPathsFromCollection(
      [
        entry('z', 1),
        entry('draft', 2, false, true),
      ],
      { includeDraft: true },
    );
    expect(paths.map((path) => path.params.slug)).toEqual(['z', 'draft']);
  });
});

describe('collectWorkTags', () => {
  it('returns unique sorted tags', () => {
    const tags = collectWorkTags([
      entry('a', 1, false, false, ['幾何', '參數方程']),
      entry('b', 2, false, false, ['三角函數', '幾何']),
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
          order: 1,
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
