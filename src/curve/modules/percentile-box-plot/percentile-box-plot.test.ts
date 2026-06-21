import { describe, expect, it } from 'vitest';
import { boxSummary, percentile, stretchValues } from '.';

describe('percentile-box-plot', () => {
  it('uses linear percentile positions and IQR fences', () => {
    const summary = boxSummary([1, 2, 3, 4, 100], 1.5);

    expect(percentile([1, 2, 3, 4, 100], 10)).toBeCloseTo(1.4);
    expect(summary.q1).toBe(2);
    expect(summary.q2).toBe(3);
    expect(summary.q3).toBe(4);
    expect(summary.outliers).toEqual([100]);
  });

  it('stretches around the median', () => {
    expect(stretchValues([2, 4, 6], 0.5)).toEqual([3, 4, 5]);
  });
});
