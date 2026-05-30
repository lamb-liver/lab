import { describe, expect, it } from 'vitest';
import {
  MODE_DECAY,
  MODE_GROWTH,
  deriveExponentialState,
} from './geometry';

describe('deriveExponentialState', () => {
  it('uses positive k for growth', () => {
    const data = deriveExponentialState({
      mode: MODE_GROWTH,
      c: 2,
      kAbs: 0.5,
      tNorm: 0.5,
      logScale: 0,
      tangentMode: 0,
    });
    expect(data.k).toBe(0.5);
    expect(data.y0).toBeCloseTo(2 * Math.exp(0.5 * data.t0));
  });

  it('uses negative k for decay', () => {
    const data = deriveExponentialState({
      mode: MODE_DECAY,
      c: 1,
      kAbs: 0.4,
      tNorm: 0.25,
      logScale: 0,
      tangentMode: 0,
    });
    expect(data.k).toBe(-0.4);
    expect(data.halfLife).toBeCloseTo(Math.log(2) / 0.4);
  });
});
