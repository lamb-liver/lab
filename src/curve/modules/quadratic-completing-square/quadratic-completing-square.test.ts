import { describe, expect, it } from 'vitest';
import { PRESETS } from './constants';
import {
  buildBaseParabolaCurve,
  buildQuadraticCompletingSquareThumbnail,
  buildQuadraticCurve,
  buildQuadraticSceneCache,
  cleanQuadraticParams,
  DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  isPresetActive,
  quadraticMeta,
  sanitizeA,
  targetViewHalfYFromCurves,
  THUMBNAIL_QUADRATIC_PARAMS,
  vertexFromDrag,
} from './geometry';

describe('quadratic-completing-square geometry', () => {
  it('quadraticMeta computes vertex and two real roots for default params', () => {
    const meta = quadraticMeta(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS);
    expect(meta.h).toBeCloseTo(0.5, 6);
    expect(meta.k).toBeCloseTo(-2.25, 6);
    expect(meta.rootState).toBe('兩實根');
    expect(meta.roots).toHaveLength(2);
  });

  it('sanitizeA enforces minimum absolute value', () => {
    expect(sanitizeA(0)).toBe(0.12);
    expect(sanitizeA(-0.01)).toBe(-0.12);
    expect(sanitizeA(1.5)).toBe(1.5);
  });

  it('buildQuadraticCurve returns finite samples', () => {
    const curve = buildQuadraticCurve(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS, 0.5);
    expect(curve.length).toBeGreaterThan(5);
    expect(curve.every((pt) => Number.isFinite(pt.y))).toBe(true);
  });

  it('targetViewHalfYFromCurves stays within bounds', () => {
    const curve = buildQuadraticCurve(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS);
    const base = buildBaseParabolaCurve(cleanQuadraticParams(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS).a);
    const meta = quadraticMeta(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS);
    const half = targetViewHalfYFromCurves([curve, base], meta);
    expect(half).toBeGreaterThanOrEqual(3.8);
    expect(half).toBeLessThanOrEqual(20);
  });

  it('vertexFromDrag updates b and c from vertex position', () => {
    const next = vertexFromDrag(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS, 1, -3);
    expect(next.b).toBeCloseTo(-2, 6);
    expect(next.c).toBeCloseTo(-2, 6);
    const meta = quadraticMeta({ ...DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS, ...next });
    expect(meta.h).toBeCloseTo(1, 6);
    expect(meta.k).toBeCloseTo(-3, 6);
  });

  it('buildQuadraticSceneCache bundles curve samples and target view', () => {
    const scene = buildQuadraticSceneCache(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS);
    expect(scene.curve.length).toBeGreaterThan(5);
    expect(scene.baseCurve.length).toBe(scene.curve.length);
    expect(scene.meta.rootState).toBe('兩實根');
    expect(scene.targetViewHalfY).toBeGreaterThanOrEqual(3.8);
    expect(scene.targetViewHalfY).toBeLessThanOrEqual(20);
  });

  it('isPresetActive detects matching presets', () => {
    expect(isPresetActive(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS, PRESETS[0])).toBe(true);
    expect(isPresetActive(DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS, PRESETS[2])).toBe(false);
  });

  it('thumbnail scene shows parabola, vertex and roots', () => {
    const spec = buildQuadraticCompletingSquareThumbnail();
    expect(spec.paths.length).toBeGreaterThanOrEqual(4);
    expect(spec.circles?.length).toBeGreaterThanOrEqual(3);
    expect(THUMBNAIL_QUADRATIC_PARAMS.b).toBe(-1);
    expect(spec.paths.some((path) => path.excludeFromBbox === true && path.opacity === 0.55)).toBe(
      true,
    );
  });
});
