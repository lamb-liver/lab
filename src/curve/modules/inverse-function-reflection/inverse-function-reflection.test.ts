import { describe, expect, it } from 'vitest';
import { MODE_CONFIG } from './constants';
import {
  asInverseFunctionReflectionParams,
  buildInverseFunctionReflectionThumbnail,
  buildInverseSceneCache,
  clampInputForMode,
  DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  geometryParamsEqual,
  inverseMeta,
  paramsForModeSwitch,
  quadraticHorizontalHits,
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

  it('buildInverseSceneCache bundles original and reflected curves', () => {
    const scene = buildInverseSceneCache(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS);
    expect(scene.original.length).toBeGreaterThan(5);
    expect(scene.reflected.length).toBe(scene.original.length);
    expect(scene.reflected[0]).toEqual({
      x: scene.original[0]!.y,
      y: scene.original[0]!.x,
    });
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

  it('inverseMeta describes linear mode formulas', () => {
    const meta = inverseMeta(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS);
    expect(meta.formula).toContain('0.8x+1');
    expect(meta.inverseFormula).toContain('f⁻¹');
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

  it('scene cache target view stays within bounds', () => {
    const scene = buildInverseSceneCache(DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS);
    expect(scene.targetViewHalfY).toBeGreaterThanOrEqual(4.2);
    expect(scene.targetViewHalfY).toBeLessThanOrEqual(12);
  });
});
