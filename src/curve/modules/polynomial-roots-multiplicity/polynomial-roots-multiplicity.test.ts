import { describe, expect, it } from 'vitest';
import { getCurveThumbnailSvg } from '../../../lib/curveThumbnail';
import { PRESETS } from './constants';
import {
  buildPolynomialCurve,
  buildPolynomialRootsMultiplicityThumbnail,
  buildPolynomialSceneCache,
  buildSignedSegments,
  DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS,
  isPresetActive,
  mergedBreaks,
  polynomialMeta,
  polynomialValue,
  sanitizeA,
  targetViewHalfYFromCurve,
  THUMBNAIL_POLYNOMIAL_PARAMS,
} from './geometry';

describe('polynomial-roots-multiplicity geometry', () => {
  it('polynomialMeta computes degree from multiplicities', () => {
    const meta = polynomialMeta(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS);
    expect(meta.degree).toBe(4);
    expect(meta.roots).toEqual(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS.roots);
  });

  it('polynomialValue respects multiplicity at a root', () => {
    const params = DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS;
    expect(Math.abs(polynomialValue(params, params.roots[1]))).toBeLessThan(1e-6);
  });

  it('sanitizeA enforces minimum absolute value', () => {
    expect(sanitizeA(0)).toBe(0.12);
    expect(sanitizeA(-0.01)).toBe(-0.12);
  });

  it('buildPolynomialSceneCache bundles curve and target view', () => {
    const scene = buildPolynomialSceneCache(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS);
    expect(scene.curve.length).toBeGreaterThan(5);
    expect(scene.targetViewHalfY).toBeGreaterThanOrEqual(3.8);
    expect(scene.targetViewHalfY).toBeLessThanOrEqual(24);
  });

  it('mergedBreaks merges close roots', () => {
    expect(mergedBreaks([-2, -1.9995, 1])).toEqual([-2, 1]);
  });

  it('buildSignedSegments assigns signs across intervals', () => {
    const meta = polynomialMeta(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS);
    const segments = buildSignedSegments(
      DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS,
      meta.breaks,
    );
    expect(segments.length).toBeGreaterThan(0);
    expect(segments.every((seg) => seg.sign === 1 || seg.sign === -1)).toBe(true);
  });

  it('isPresetActive detects matching presets', () => {
    expect(isPresetActive(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS, PRESETS[1])).toBe(true);
    expect(isPresetActive(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS, PRESETS[0])).toBe(false);
  });

  it('targetViewHalfYFromCurve stays within bounds', () => {
    const curve = buildPolynomialCurve(DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS);
    const half = targetViewHalfYFromCurve(curve);
    expect(half).toBeGreaterThanOrEqual(3.8);
    expect(half).toBeLessThanOrEqual(24);
  });

  it('thumbnail scene highlights double root with visible markers', () => {
    const spec = buildPolynomialRootsMultiplicityThumbnail();
    expect(spec.circles?.length).toBe(3);
    expect(THUMBNAIL_POLYNOMIAL_PARAMS.mult[1]).toBe(2);

    const svg = getCurveThumbnailSvg('polynomial-roots-multiplicity') ?? '';
    const radii = [...svg.matchAll(/<circle[^>]*r="([^"]+)"/g)].map((m) => Number(m[1]));
    expect(radii.length).toBe(3);
    expect(Math.min(...radii)).toBeGreaterThan(1.8);
  });
});
