import { describe, expect, it } from 'vitest';
import { MODE_CONFIG } from './constants';
import {
  asInverseFunctionReflectionParams,
  buildInverseFunctionReflectionThumbnail,
  buildInverseSceneCache,
  clampInputForMode,
  DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  formulaText,
  geometryParamsEqual,
  inverseFormulaText,
  inverseMeta,
  paramsForModeSwitch,
  quadraticHorizontalHits,
  reflectCurve,
  targetViewHalfYFromCurves,
  THUMBNAIL_INVERSE_PARAMS,
} from './geometry';

describe('inverse-function-reflection geometry', () => {
  it('inverseMeta swaps coordinates for mirror point', () => {
    const meta = inverseMeta(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS);
    expect(meta.pMirror.x).toBeCloseTo(meta.p.y, 6);
    expect(meta.pMirror.y).toBeCloseTo(meta.p.x, 6);
    expect(meta.passHlt).toBe(true);
  });

  it('asInverseFunctionReflectionParams clamps input to mode domain', () => {
    const full = asInverseFunctionReflectionParams({
      mode: 'quadraticRestricted',
      input: 0,
      advanced: 1,
      base: 2,
    });
    expect(full.input).toBe(MODE_CONFIG.quadraticRestricted.inputMin);
  });

  it('quadraticFull fails horizontal line test flag', () => {
    const meta = inverseMeta({
      ...DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
      mode: 'quadraticFull',
      input: MODE_CONFIG.quadraticFull.inputDefault,
    });
    expect(meta.passHlt).toBe(false);
  });

  it('reflectCurve swaps x and y', () => {
    const reflected = reflectCurve([{ x: 2, y: 3 }]);
    expect(reflected[0]).toEqual({ x: 3, y: 2 });
  });

  it('buildInverseSceneCache bundles original and reflected curves', () => {
    const scene = buildInverseSceneCache(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS);
    expect(scene.original.length).toBeGreaterThan(5);
    expect(scene.reflected.length).toBe(scene.original.length);
    expect(scene.targetViewHalfY).toBeGreaterThanOrEqual(4.2);
    expect(scene.targetViewHalfY).toBeLessThanOrEqual(12);
  });

  it('geometryParamsEqual ignores advanced flag', () => {
    const base = DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS;
    expect(
      geometryParamsEqual(base, { ...base, advanced: !base.advanced }),
    ).toBe(true);
    expect(
      geometryParamsEqual(base, { ...base, input: base.input + 0.05 }),
    ).toBe(false);
  });

  it('formulaText and inverseFormulaText describe linear mode', () => {
    expect(formulaText(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS)).toContain('0.8x+1');
    expect(inverseFormulaText(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS)).toContain('f⁻¹');
  });

  it('paramsForModeSwitch resets input default', () => {
    expect(paramsForModeSwitch('exponential')).toEqual({
      mode: 'exponential',
      input: MODE_CONFIG.exponential.inputDefault,
    });
  });

  it('thumbnail scene includes mirror line and two curves', () => {
    const spec = buildInverseFunctionReflectionThumbnail();
    expect(spec.paths.length).toBeGreaterThanOrEqual(3);
    expect(spec.circles?.length).toBe(2);
    expect(THUMBNAIL_INVERSE_PARAMS.mode).toBe('exponential');
  });

  it('quadraticHorizontalHits returns two intersections for mid parabola height', () => {
    const hits = quadraticHorizontalHits(-1);
    expect(hits.length).toBe(2);
  });

  it('clampInputForMode respects mode domain', () => {
    expect(clampInputForMode('quadraticRestricted', 0)).toBe(
      MODE_CONFIG.quadraticRestricted.inputMin,
    );
    expect(clampInputForMode('linear', 10)).toBe(MODE_CONFIG.linear.inputMax);
  });

  it('targetViewHalfYFromCurves stays within bounds', () => {
    const scene = buildInverseSceneCache(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS);
    const half = targetViewHalfYFromCurves([scene.original, scene.reflected], scene.meta);
    expect(half).toBeGreaterThanOrEqual(4.2);
    expect(half).toBeLessThanOrEqual(12);
  });
});
