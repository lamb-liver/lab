import { describe, expect, it } from 'vitest';
import { roseModule } from '.';

function lastDefaultTheta(k: number): number {
  const result = roseModule.sample({ k }, { step: Math.PI, purpose: 'default' });
  if (!Array.isArray(result)) throw new Error('rose default sample must return points');
  return result[result.length - 1]?.theta ?? Number.NaN;
}

describe('rose module', () => {
  it('uses π period for odd k', () => {
    expect(lastDefaultTheta(3)).toBeCloseTo(Math.PI, 5);
    expect(lastDefaultTheta(5)).toBeCloseTo(Math.PI, 5);
  });

  it('uses 2π period for even k', () => {
    expect(lastDefaultTheta(4)).toBeCloseTo(Math.PI * 2, 5);
    expect(lastDefaultTheta(6)).toBeCloseTo(Math.PI * 2, 5);
  });
});
