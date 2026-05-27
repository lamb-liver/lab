import { describe, expect, it } from 'vitest';
import { driftPath, iterToColor, juliaSmooth, lerpToward } from './math';

describe('julia-set math', () => {
  it('juliaSmooth escapes quickly outside |z|>2', () => {
    const t = juliaSmooth(3, 0, 0, 0, 64);
    expect(t).toBeLessThan(64);
    expect(t).toBeGreaterThan(0);
  });

  it('juliaSmooth returns maxIter for bounded orbit near origin', () => {
    expect(juliaSmooth(0.1, 0.1, -0.5, 0, 32)).toBe(32);
  });

  it('iterToColor is black at maxIter', () => {
    expect(iterToColor(64, 64)).toEqual([0, 0, 0]);
  });

  it('lerpToward moves toward target', () => {
    expect(lerpToward(0, 1, 0.5)).toBeCloseTo(0.5, 5);
  });

  it('driftPath stays in a small neighborhood', () => {
    const p = driftPath(1.7);
    expect(Math.hypot(p.x + 0.745, p.y - 0.186)).toBeLessThan(0.2);
  });
});
