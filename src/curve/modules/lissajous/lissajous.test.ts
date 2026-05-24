import { describe, expect, it } from 'vitest';
import { lissajousModule } from './index';

describe('lissajousModule.sample', () => {
  it('returns empty for invalid frequencies or step', () => {
    expect(
      lissajousModule.sample({ a: 0, b: 2, delta: 0 }, { step: 0.003 }),
    ).toEqual([]);
    expect(
      lissajousModule.sample(lissajousModule.defaultParams, { step: 0 }),
    ).toEqual([]);
  });

  it('default params produce positive arcLength', () => {
    const points = lissajousModule.sample(lissajousModule.defaultParams, {
      step: lissajousModule.sampleStep ?? 0.003,
    });
    expect(points.at(-1)?.arcLength).toBeGreaterThan(0);
  });
});
