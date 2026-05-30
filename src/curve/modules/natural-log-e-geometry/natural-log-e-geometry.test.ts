import { describe, expect, it } from 'vitest';
import { estimateMidpointRiemann } from './geometry';

describe('estimateMidpointRiemann', () => {
  it('returns 0 when t equals 1', () => {
    expect(estimateMidpointRiemann(1, 24)).toBe(0);
  });

  it('approximates ln t for t > 1', () => {
    const est = estimateMidpointRiemann(Math.E, 80);
    expect(est).toBeCloseTo(1, 2);
  });

  it('returns negative estimate for t < 1', () => {
    const est = estimateMidpointRiemann(0.5, 40);
    expect(est).toBeLessThan(0);
    expect(est).toBeCloseTo(Math.log(0.5), 2);
  });
});
