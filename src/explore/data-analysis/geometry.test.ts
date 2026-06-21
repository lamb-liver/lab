import { describe, expect, it } from 'vitest';
import {
  createBoxplotValues,
  createScatterPoints,
  quartileSummary,
  regression,
} from './geometry';

describe('data analysis geometry', () => {
  it('reuses the shared regression fields', () => {
    const fit = regression([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]);

    expect(fit).toMatchObject({
      xbar: 2,
      ybar: 4,
      r: 1,
      a: 0,
      b: 2,
    });
  });

  it('uses the shared percentile boxplot quartile rule', () => {
    const q = quartileSummary([1, 2, 3, 4, 5]);

    expect(q.q1).toBe(2);
    expect(q.q2).toBe(3);
    expect(q.q3).toBe(4);
  });

  it('builds deterministic starter datasets', () => {
    expect(createScatterPoints(12, 0.75, 1)).toHaveLength(12);
    expect(createBoxplotValues(13)).toHaveLength(13);
  });
});
