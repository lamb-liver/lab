import { describe, expect, it } from 'vitest';
import { getTotalAngle } from '../rose/index';

describe('rose module', () => {
  it('uses π period for odd k', () => {
    expect(getTotalAngle(3)).toBeCloseTo(Math.PI, 5);
    expect(getTotalAngle(5)).toBeCloseTo(Math.PI, 5);
  });

  it('uses 2π period for even k', () => {
    expect(getTotalAngle(4)).toBeCloseTo(Math.PI * 2, 5);
    expect(getTotalAngle(6)).toBeCloseTo(Math.PI * 2, 5);
  });
});
