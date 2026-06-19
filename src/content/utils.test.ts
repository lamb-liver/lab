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
  date: string,
  featured = false,
  draft = false,
  tags: string[] = [],
) => ({
  id,
  data: { date: new Date(date), featured, draft, tags },
});

describe('getPublishedInteractive', () => {
  it('returns only listed slugs, newest first, capped at limit', () => {
    const pool = [
      entry('placeholder', '2026-08-01'),
      entry('rose-curve', '2026-01-15'),
      entry('vector-field-streamlines', '2026-07-06'),
      entry('draft', '2026-09-01', false, true),
    ];
    const result = getPublishedInteractive(pool, ['rose-curve', 'vector-field-streamlines'], 3);
    expect(result.map((e) => e.id)).toEqual(['vector-field-streamlines', 'rose-curve']);
  });
});

describe('getFeaturedInteractive', () => {
  it('returns only featured interactive slugs, newest first, capped', () => {
    const pool = [
      entry('placeholder', '2026-08-01', true),
      entry('julia-set', '2026-06-01', true),
      entry('spirograph-curve', '2026-05-01', true),
      entry('rose-curve', '2026-01-15', false),
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
    const pool = [entry('a', '2026-01-01'), entry('b', '2026-02-01')];
    expect(excludeEntryIds(pool, new Set(['a'])).map((e) => e.id)).toEqual(['b']);
  });
});

describe('getCollectionPagerNeighbors', () => {
  it('returns null neighbors when slug is missing from the published list', () => {
    const pool = [entry('a', '2026-01-01'), entry('b', '2026-02-01')];
    expect(getCollectionPagerNeighbors(pool, 'missing')).toEqual({
      previous: null,
      next: null,
    });
  });

  it('returns previous and next entries in ascending date order', () => {
    const pool = [
      entry('first', '2026-01-01'),
      entry('middle', '2026-02-01'),
      entry('last', '2026-03-01'),
    ];
    expect(getCollectionPagerNeighbors(pool, 'middle')).toEqual({
      previous: pool[0],
      next: pool[2],
    });
  });
});

describe('published sorting', () => {
  it('uses id as a stable tie-breaker for same-date newest-first lists', () => {
    const result = getPublished([
      entry('z-topic', '2026-01-01'),
      entry('a-topic', '2026-01-01'),
      entry('newer', '2026-02-01'),
    ]);

    expect(result.map((e) => e.id)).toEqual(['newer', 'a-topic', 'z-topic']);
  });

  it('uses id as a stable tie-breaker for same-date oldest-first lists', () => {
    const result = getPublishedAsc([
      entry('z-topic', '2026-01-01'),
      entry('a-topic', '2026-01-01'),
      entry('newer', '2026-02-01'),
    ]);

    expect(result.map((e) => e.id)).toEqual(['a-topic', 'z-topic', 'newer']);
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
