import { describe, expect, it } from 'vitest';
import { buildFourierPath, tAtArcLength } from './path';

describe('buildFourierPath', () => {
  it('builds monotonic arcLength for 1D mode', () => {
    const path = buildFourierPath('1D', 3);
    expect(path.points.length).toBeGreaterThan(10);
    for (let i = 1; i < path.points.length; i++) {
      expect(path.points[i]!.arcLength).toBeGreaterThanOrEqual(path.points[i - 1]!.arcLength);
    }
    expect(path.totalLength).toBe(path.points.at(-1)!.arcLength);
    expect(path.epicycles).toHaveLength(3);
  });

  it('rebuilds when N changes', () => {
    const a = buildFourierPath('2D', 2);
    const b = buildFourierPath('2D', 5);
    expect(a.N).toBe(2);
    expect(b.N).toBe(5);
    expect(a.epicycles).toHaveLength(2);
    expect(b.epicycles).toHaveLength(5);
  });
});

describe('tAtArcLength', () => {
  it('returns 0 for empty or zero length', () => {
    expect(tAtArcLength([], 0)).toBe(0);
    expect(tAtArcLength([], 10)).toBe(0);
  });

  it('maps start and end arc lengths to theta range', () => {
    const path = buildFourierPath('1D', 4);
    expect(tAtArcLength(path.points, 0)).toBe(0);
    const endT = tAtArcLength(path.points, path.totalLength);
    expect(endT).toBeCloseTo(path.points.at(-1)!.theta, 3);
  });
});
