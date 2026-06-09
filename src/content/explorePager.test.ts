import { describe, expect, it } from 'vitest';
import { readExploreEntries } from './exploreEntries';
import { getCollectionPagerNeighbors, getPublishedAsc } from './utils';

describe('explore collection pager', () => {
  const explore = readExploreEntries();

  it('matches published ascending order used on explore pages', () => {
    expect(getPublishedAsc(explore).map((entry) => entry.id)).toEqual([
      'fourier-series',
      'trig-wave-interference',
      'conic-dynamic-geometry',
      'matrix-linear-transform',
      'trigonometry-fundamentals',
      'limits-riemann-sum',
      'differential-equations-geometry',
      'complex-euler-formula',
      'sequences-and-series',
      'permutations-combinations',
      'probability-statistics',
      'exponential-logarithm',
      'vectors',
    ]);
  });

  it('resolves neighbors for the newest explore slug', () => {
    const { previous, next } = getCollectionPagerNeighbors(explore, 'vectors');
    expect(previous?.id).toBe('exponential-logarithm');
    expect(next).toBeNull();
  });

  it('resolves neighbors for a middle explore slug', () => {
    const { previous, next } = getCollectionPagerNeighbors(explore, 'limits-riemann-sum');
    expect(previous?.id).toBe('trigonometry-fundamentals');
    expect(next?.id).toBe('differential-equations-geometry');
  });
});
