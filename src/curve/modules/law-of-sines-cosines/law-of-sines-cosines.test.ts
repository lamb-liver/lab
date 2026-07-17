import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TRIANGLE,
  getAngleKind,
  getCosineStatusLabel,
  preventTriangleCollapse,
  resetTriangle,
  triangleMetrics,
} from './geometry';
import { lawOfSinesCosinesModule } from './index';

describe('law-of-sines-cosines module', () => {
  it('triangleMetrics keeps law of sines ratios equal', () => {
    const g = triangleMetrics(DEFAULT_TRIANGLE);
    expect(g.ratioA).toBeCloseTo(g.ratioB, 3);
    expect(g.ratioB).toBeCloseTo(g.ratioC, 3);
    expect(g.R).toBeCloseTo(g.ratioA / 2, 3);
  });

  it('getMetadata switches by mode', () => {
    const sine = lawOfSinesCosinesModule.getMetadata(
      { ...lawOfSinesCosinesModule.defaultParams, mode: 0 },
      { revealPct: 100, smoothParams: { ...lawOfSinesCosinesModule.defaultParams, mode: 0 } },
    );
    const cosine = lawOfSinesCosinesModule.getMetadata(
      { ...lawOfSinesCosinesModule.defaultParams, mode: 1 },
      { revealPct: 100, smoothParams: { ...lawOfSinesCosinesModule.defaultParams, mode: 1 } },
    );

    expect(sine.title).toBe('正弦定理');
    expect(cosine.title).toBe('餘弦定理');
    expect(sine.stats).toHaveLength(4);
    expect(cosine.stats).toHaveLength(4);
  });

  it('thumbnail sample returns circumcircle and triangle paths', () => {
    const spec = lawOfSinesCosinesModule.sample(
      { ...lawOfSinesCosinesModule.defaultParams, mode: 0 },
      { step: 1, purpose: 'thumbnail' },
    );
    expect(spec).toHaveProperty('paths');
    if ('paths' in spec) {
      expect(spec.paths.length).toBeGreaterThanOrEqual(4);
      expect(spec.paths[0]?.points.length).toBeGreaterThan(40);
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
