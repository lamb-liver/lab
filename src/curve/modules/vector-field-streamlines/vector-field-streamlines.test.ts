import { describe, expect, it } from 'vitest';
import {
  BOUND_LIMIT,
  buildAllStreamlines,
  evaluateVectorField,
  integrateStreamline,
} from './geometry';
import { vectorFieldStreamlinesModule } from './index';

describe('evaluateVectorField', () => {
  it('is non-zero away from origin', () => {
    const v = evaluateVectorField(1, 0, 0);
    expect(Math.hypot(v.x, v.y)).toBeGreaterThan(0);
  });
});

describe('integrateStreamline', () => {
  it('produces a polyline from seed', () => {
    const path = integrateStreamline({ x: 1, y: 0 }, 50, 0.03, 0);
    expect(path.length).toBeGreaterThan(2);
    expect(path[0]).toEqual({ x: 1, y: 0 });
  });

  it('stops at boundary', () => {
    const path = integrateStreamline({ x: 4.5, y: 0 }, 400, 0.03, 0);
    const last = path[path.length - 1]!;
    expect(Math.abs(last.x)).toBeLessThanOrEqual(BOUND_LIMIT + 0.5);
  });
});

describe('buildAllStreamlines', () => {
  it('returns count matching request', () => {
    const lines = buildAllStreamlines(12, 80, 0.03, 0);
    expect(lines.length).toBe(12);
    for (const line of lines) {
      expect(line.length).toBeGreaterThan(1);
    }
  });
});

describe('vectorFieldStreamlinesModule', () => {
  it('thumbnail returns many paths', () => {
    const result = vectorFieldStreamlinesModule.sample(
      vectorFieldStreamlinesModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThan(4);
  });
});
