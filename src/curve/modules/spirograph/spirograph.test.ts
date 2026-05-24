import { describe, expect, it } from 'vitest';
import { MAX_SAMPLE_POINTS } from '../../constants';
import { spirographModule } from './index';

describe('spirographModule.sample', () => {
  it('caps point count for coprime large r', () => {
    const points = spirographModule.sample({ R: 250, r: 149, d: 70 }, { step: 0.02 });
    expect(points.length).toBeLessThanOrEqual(MAX_SAMPLE_POINTS + 2);
    expect(points.length).toBeGreaterThan(100);
  });

  it('returns empty for invalid r', () => {
    expect(spirographModule.sample({ R: 150, r: 0, d: 70 }, { step: 0.02 })).toEqual([]);
  });

  it('default params produce closed path with arcLength', () => {
    const points = spirographModule.sample(spirographModule.defaultParams, {
      step: spirographModule.sampleStep ?? 0.02,
    });
    const last = points.at(-1);
    expect(last?.arcLength).toBeGreaterThan(0);
    expect(last?.theta).toBeGreaterThan(0);
  });
});
