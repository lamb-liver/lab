import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TRIANGLE,
  getAngleKind,
  getCosineStatusLabel,
  preventTriangleCollapse,
  resetTriangle,
  triangleMetrics,
} from './geometry';
import { asLawOfSinesCosinesParams, lawOfSinesCosinesModule } from './index';

describe('law-of-sines-cosines module', () => {
  it('triangleMetrics keeps law of sines ratios equal', () => {
    const g = triangleMetrics(DEFAULT_TRIANGLE);
    expect(g.ratioA).toBeCloseTo(g.ratioB, 3);
    expect(g.ratioB).toBeCloseTo(g.ratioC, 3);
    expect(g.R).toBeCloseTo(g.ratioA / 2, 3);
  });

  it('getMetadata switches by mode', () => {
    const sine = lawOfSinesCosinesModule.getMetadata(
      asLawOfSinesCosinesParams({ mode: 'sine', triangle: DEFAULT_TRIANGLE }),
      { revealPct: 100 },
    );
    const cosine = lawOfSinesCosinesModule.getMetadata(
      asLawOfSinesCosinesParams({ mode: 'cosine', triangle: DEFAULT_TRIANGLE }),
      { revealPct: 100 },
    );

    expect(sine.title).toBe('正弦定理');
    expect(cosine.title).toBe('餘弦定理');
    expect(sine.stats).toHaveLength(4);
    expect(cosine.stats).toHaveLength(4);
  });

  it('thumbnail sample returns triangle paths', () => {
    const spec = lawOfSinesCosinesModule.sample(
      asLawOfSinesCosinesParams({ mode: 'sine', triangle: DEFAULT_TRIANGLE }),
      { step: 1, purpose: 'thumbnail' },
    );
    expect(spec).toHaveProperty('paths');
    if ('paths' in spec) {
      expect(spec.paths.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('resetTriangle and collapse guard keep valid area', () => {
    const collapsed = {
      A: { x: 0, y: 0 },
      B: { x: 0.01, y: 0 },
      C: { x: 0.02, y: 0 },
    };
    const next = preventTriangleCollapse(collapsed, 'C');
    expect(resetTriangle()).toEqual(DEFAULT_TRIANGLE);
    expect(Math.abs(triangleMetrics(next).a)).toBeGreaterThan(0);
  });

  it('angle kind labels cover acute and obtuse', () => {
    expect(getAngleKind(Math.PI / 4)).toBe('銳角');
    expect(getAngleKind((2 * Math.PI) / 3)).toBe('鈍角');
    expect(getCosineStatusLabel(Math.PI / 4)).toContain('銳角');
  });
});
