import { describe, expect, it } from 'vitest';
import {
  activeValue,
  basisFromIndex,
  buildCurves,
  buildFunctionGraphTransformThumbnail,
  clampFeaturePoint,
  DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  targetViewHalfYFromCurves,
  transformScaleText,
} from './geometry';

describe('function-graph-transform geometry', () => {
  it('basisFromIndex maps indices to basis kinds', () => {
    expect(basisFromIndex(0)).toBe('linear');
    expect(basisFromIndex(1)).toBe('square');
    expect(basisFromIndex(99)).toBe('abs');
  });

  it('activeValue matches square identity transform', () => {
    expect(activeValue(DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS, 3)).toBeCloseTo(9, 6);
  });

  it('buildCurves returns ghost and active samples', () => {
    const { ghost, active } = buildCurves(DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS, 1);
    expect(ghost.length).toBeGreaterThan(5);
    expect(active.length).toBe(ghost.length);
  });

  it('targetViewHalfYFromCurves stays within bounds', () => {
    const { ghost, active } = buildCurves(DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS);
    const half = targetViewHalfYFromCurves([ghost, active]);
    expect(half).toBeGreaterThanOrEqual(3.6);
    expect(half).toBeLessThanOrEqual(18);
  });

  it('clampFeaturePoint snaps h and k', () => {
    const next = clampFeaturePoint(1.03, -2.07);
    expect(next.h).toBeCloseTo(1.05, 3);
    expect(next.k).toBeCloseTo(-2.05, 3);
  });

  it('transformScaleText describes scale and flip', () => {
    expect(transformScaleText('a', 2, '垂直')).toContain('拉伸');
    expect(transformScaleText('b', -1.5, '水平')).toContain('翻轉');
  });

  it('thumbnail scene separates ghost, active, O and P', () => {
    const spec = buildFunctionGraphTransformThumbnail();
    expect(spec.paths.length).toBeGreaterThanOrEqual(3);
    expect(spec.circles?.length).toBe(2);

    const [o, p] = spec.circles ?? [];
    expect(Math.hypot((o?.x ?? 0) - (p?.x ?? 0), (o?.y ?? 0) - (p?.y ?? 0))).toBeGreaterThan(8);
  });
});
