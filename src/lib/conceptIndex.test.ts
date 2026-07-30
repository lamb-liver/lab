import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
  buildConceptIndex,
  conceptHasPage,
  pagedConceptSlugs,
} from './conceptIndex';

const work = (id: string, concepts: string[]) =>
  ({ id, data: { concepts } }) as unknown as CollectionEntry<'works'>;
const explore = (id: string, concepts: string[]) =>
  ({ id, data: { concepts } }) as unknown as CollectionEntry<'explore'>;
const exam = (id: string, concepts: string[]) =>
  ({ id, data: { concepts } }) as unknown as CollectionEntry<'exam'>;

describe('buildConceptIndex', () => {
  it('groups entries by concept slug across collections', () => {
    const index = buildConceptIndex(
      [work('w1', ['matrix', 'vectors']), work('w2', ['matrix'])],
      [explore('e1', ['matrix'])],
      [exam('x1', ['vectors'])],
    );
    expect(index.get('matrix')?.works.map((w) => w.id)).toEqual(['w1', 'w2']);
    expect(index.get('matrix')?.explore.map((e) => e.id)).toEqual(['e1']);
    expect(index.get('vectors')?.exams.map((x) => x.id)).toEqual(['x1']);
  });

  it('computes total and collectionCount', () => {
    const index = buildConceptIndex(
      [work('w1', ['matrix']), work('w2', ['matrix'])],
      [explore('e1', ['matrix'])],
      [],
    );
    const g = index.get('matrix')!;
    expect(g.total).toBe(3);
    expect(g.collectionCount).toBe(2);
  });

  it('preserves caller ordering (no re-sort)', () => {
    const index = buildConceptIndex(
      [work('later', ['matrix']), work('earlier', ['matrix'])],
      [],
      [],
    );
    expect(index.get('matrix')?.works.map((w) => w.id)).toEqual(['later', 'earlier']);
  });
});

describe('conceptHasPage threshold', () => {
  it('requires content from >=2 collections', () => {
    // 3 works, 1 collection → no page
    const single = buildConceptIndex(
      [work('a', ['fractal']), work('b', ['fractal']), work('c', ['fractal'])],
      [],
      [],
    );
    expect(conceptHasPage(single.get('fractal')!)).toBe(false);

    // 1 work + 1 explore → 2 items, 2 collections → page
    const cross = buildConceptIndex([work('a', ['matrix'])], [explore('e', ['matrix'])], []);
    expect(conceptHasPage(cross.get('matrix')!)).toBe(true);

    // 1 work + 1 exam but same... 1 item per: 2 items 2 collections → page
    const twoCol = buildConceptIndex([work('a', ['vectors'])], [], [exam('x', ['vectors'])]);
    expect(conceptHasPage(twoCol.get('vectors')!)).toBe(true);
  });

  it('pagedConceptSlugs returns only threshold-passing concepts', () => {
    const index = buildConceptIndex(
      [work('a', ['matrix', 'fractal']), work('b', ['fractal'])],
      [explore('e', ['matrix'])],
      [],
    );
    expect([...pagedConceptSlugs(index)]).toEqual(['matrix']);
  });
});
