import { describe, expect, it } from 'vitest';
import {
  buildCombinationStats,
  catalanContrast,
  recurrenceFormulaLabel,
  recurrenceParts,
  type CombinationMode,
} from './geometry';

describe('permutations-combinations guide geometry', () => {
  it('labels binomial coefficients with value', () => {
    const label = buildCombinationStats({
      mode: 'pascal',
      pascal: { n: 6, k: 2, prime: 2 },
      path: { m: 5, n: 4 },
      recurrence: { n: 6, k: 2 },
    }).join(' ');

    expect(label).toContain('C(6, 2)');
    expect(label).toContain('15');
  });

  it('labels path combinations with total steps and count', () => {
    const label = buildCombinationStats({
      mode: 'path',
      pascal: { n: 6, k: 2, prime: 2 },
      path: { m: 5, n: 4 },
      recurrence: { n: 6, k: 2 },
    }).join(' ');

    expect(label).toContain('C(9, 5)');
    expect(label).toContain('126');
  });

  it('splits a coefficient into the two recurrence parents', () => {
    const parts = recurrenceParts(6, 2);

    expect(parts.left + parts.right).toBe(parts.total);
    expect(parts.total).toBe(15);
  });

  it('formats recurrence boundaries without invalid parent cells', () => {
    const leftBoundary = recurrenceFormulaLabel(6, 0);
    const rightBoundary = recurrenceFormulaLabel(6, 6);

    expect(leftBoundary).toContain('C(6, 0)');
    expect(leftBoundary).toContain('C(5, 0)');
    expect(leftBoundary).not.toContain('C(5, -1)');

    expect(rightBoundary).toContain('C(6, 6)');
    expect(rightBoundary).toContain('C(5, 5)');
    expect(rightBoundary).not.toContain('C(5, 6)');
  });

  it('handles catalan contrast at n = 0', () => {
    expect(catalanContrast(0)).toEqual({
      totalBalanced: 1,
      legal: 1,
      restrictedOut: 0,
    });
  });

  it('contrasts Catalan numbers as restricted subsets', () => {
    const contrast = catalanContrast(3);

    expect(contrast.legal).toBeLessThan(contrast.totalBalanced);
    expect(contrast.restrictedOut).toBe(
      contrast.totalBalanced - contrast.legal,
    );
  });

  it('builds non-empty stats containing C( for every mode', () => {
    const modes: CombinationMode[] = ['pascal', 'path', 'recurrence'];

    for (const mode of modes) {
      const stats = buildCombinationStats({
        mode,
        pascal: { n: 6, k: 2, prime: 2 },
        path: { m: 5, n: 4 },
        recurrence: { n: 6, k: 2 },
      });

      expect(stats.length).toBeGreaterThan(0);
      expect(stats.join(' ')).toContain('C(');
    }
  });
});
