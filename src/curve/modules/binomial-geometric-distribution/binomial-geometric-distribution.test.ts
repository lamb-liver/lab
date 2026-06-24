import { describe, expect, it } from 'vitest';
import {
  MODE_BINOMIAL,
  MODE_GEOMETRIC,
  deriveDistributionData,
} from './geometry';

function probabilitySum(data: ReturnType<typeof deriveDistributionData>): number {
  return data.rows.reduce((sum, row) => sum + row.prob, 0);
}

describe('binomial geometric distribution geometry', () => {
  it('normalizes binomial probabilities', () => {
    const data = deriveDistributionData({ mode: MODE_BINOMIAL, n: 12, p: 35 });

    expect(data.rows).toHaveLength(13);
    expect(probabilitySum(data)).toBeCloseTo(1);
    expect(data.mean).toBeCloseTo(4.2);
    expect(data.variance).toBeCloseTo(2.73);
  });

  it('uses failures-before-success geometric convention', () => {
    const data = deriveDistributionData({ mode: MODE_GEOMETRIC, p: 35 });

    expect(data.rows[0]).toMatchObject({ k: 0, prob: 0.35, bucket: false });
    expect(data.mean).toBeCloseTo((1 - 0.35) / 0.35);
    expect(data.variance).toBeCloseTo((1 - 0.35) / (0.35 * 0.35));
    expect(probabilitySum(data)).toBeCloseTo(1);
    expect(data.rows[data.rows.length - 1].bucket).toBe(true);
  });

  it('clamps parameters to the supported teaching range', () => {
    const low = deriveDistributionData({ mode: MODE_BINOMIAL, n: -10, p: 0 });
    const high = deriveDistributionData({ mode: MODE_BINOMIAL, n: 99, p: 100 });

    expect(low.n).toBe(2);
    expect(low.p).toBe(0.05);
    expect(high.n).toBe(30);
    expect(high.p).toBe(0.95);
  });
});
