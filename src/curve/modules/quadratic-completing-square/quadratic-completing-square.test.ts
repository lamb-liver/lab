import { describe, expect, it } from 'vitest';
import { PRESETS } from './constants';
import {
  buildQuadraticCompletingSquareThumbnail,
  buildQuadraticSceneCache,
  DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  isPresetActive,
  quadraticMeta,
  sanitizeA,
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
    expect(scene.curve.every((pt) => Number.isFinite(pt.y))).toBe(true);
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
    // 座標軸與配方前的基本拋物線是輔助層，不該把縮圖的邊界框撐大
    expect(spec.paths.filter((path) => path.excludeFromBbox === true).length).toBeGreaterThanOrEqual(2);
  });

  it('配方前後兩條拋物線都看得見，且前者較淡', () => {
    /**
     * 擋一種真的發生過的退化：配方前的基本拋物線用 stroke alpha 0.28
     * 搭 opacity 0.55，相乘只有 0.15，縮到卡片大小整條消失，縮圖只剩一條
     * 拋物線，看不出配方前後的對照。
     *
     * 原本這裡釘的是 `opacity === 0.55` 這個字面值——它只在改樣式時報錯，
     * 不會在圖變得看不見時報錯，方向剛好相反。
     *
     * 門檻只套用在這兩條「內容」曲線上。座標軸與對稱軸是輔助線，本來就該退到背景，
     * 對它們設同一個下限會逼著把不該搶眼的東西調亮。
     */
    const spec = buildQuadraticCompletingSquareThumbnail();
    const alphaOf = (stroke?: string, opacity?: number) =>
      Number(/rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(stroke ?? '')?.[1] ?? 1) * (opacity ?? 1);

    const curves = spec.paths.filter((path) => (path.stroke ?? '').includes('212, 184, 122'));
    expect(curves).toHaveLength(2);

    const [ghost, active] = curves;
    expect(alphaOf(ghost.stroke, ghost.opacity), '配方前的對照曲線太淡').toBeGreaterThan(0.4);
    expect(alphaOf(active.stroke, active.opacity)).toBeGreaterThan(0.8);
    // 對照組要比主角淡，否則讀者分不出哪條是配方後的結果
    expect(alphaOf(ghost.stroke, ghost.opacity)).toBeLessThan(
      alphaOf(active.stroke, active.opacity),
    );
  });
});
