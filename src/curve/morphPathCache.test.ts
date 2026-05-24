import { describe, expect, it } from 'vitest';
import { harmonographModule } from './modules/harmonograph';
import { createMorphPathCache } from './morphPathCache';

const BASE = { a: 3, b: 2, delta: Math.PI / 2 };
const SAMPLE_STEP = 0.01;

describe('createMorphPathCache', () => {
  it('reuses points when params key is unchanged', () => {
    const cache = createMorphPathCache(harmonographModule);
    const params = harmonographModule.defaultParams;
    const first = cache.getPoints(params, SAMPLE_STEP);
    const second = cache.getPoints(params, SAMPLE_STEP);
    expect(second).toBe(first);
  });

  it('collides on toFixed(4) buckets — documents why none modules bypass cache', () => {
    const cache = createMorphPathCache(harmonographModule);
    const dA = 0.04950197947821465;
    const dB = 0.04954182111995748;
    expect(dA.toFixed(4)).toBe(dB.toFixed(4));

    const first = cache.getPoints({ ...BASE, d: dA }, SAMPLE_STEP);
    const second = cache.getPoints({ ...BASE, d: dB }, SAMPLE_STEP);
    expect(second).toBe(first);
  });
});
