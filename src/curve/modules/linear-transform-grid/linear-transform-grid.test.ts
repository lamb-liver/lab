import { describe, expect, it } from 'vitest';
import { stepLinearTransformGridAnimation } from './animation';
import {
  buildGridLines,
  calculateMatrix,
  calculateTransformBounds,
  sampleLinearTransformGridCurve,
  transformPoint,
} from './geometry';
import {
  GRID_SEGMENT_COUNT,
  linearTransformGridModule,
} from './index';

describe('transformPoint', () => {
  it('applies 2×2 matrix', () => {
    const matrix = { m11: 1, m12: 0.5, m21: 0, m22: 1 };
    const p = transformPoint(1, 2, matrix);
    expect(p.x).toBeCloseTo(2);
    expect(p.y).toBeCloseTo(2);
  });
});

describe('calculateTransformBounds', () => {
  it('returns positive scale factor', () => {
    const matrix = calculateMatrix(0.5, 1, 0);
    const { scaleFactor } = calculateTransformBounds(600, 600, matrix);
    expect(scaleFactor).toBeGreaterThan(0);
    expect(scaleFactor).toBeLessThanOrEqual(1);
  });
});

describe('buildGridLines', () => {
  it('reveal 0 yields degenerate lines at origin extent', () => {
    const matrix = calculateMatrix(0.5, 1, 0);
    const lines = buildGridLines(600, matrix, 0);
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line.x1).toBeCloseTo(line.x2, 5);
      expect(line.y1).toBeCloseTo(line.y2, 5);
    }
  });

  it('reveal 1 yields non-degenerate segments', () => {
    const matrix = calculateMatrix(0.5, 1, 0);
    const lines = buildGridLines(600, matrix, 1);
    const hasSpan = lines.some(
      (l) => Math.hypot(l.x2 - l.x1, l.y2 - l.y1) > 10,
    );
    expect(hasSpan).toBe(true);
  });
});

describe('stepLinearTransformGridAnimation', () => {
  it('shear or scale change resets reveal', () => {
    const defaults = linearTransformGridModule.defaultParams;
    const state = stepLinearTransformGridAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentShearX: defaults.shearX,
        currentScaleY: defaults.scaleY,
        previousShearX: defaults.shearX,
        previousScaleY: defaults.scaleY,
      },
      { ...defaults, shearX: -0.5 },
      0.005,
    );
    expect(state.revealProgress).toBeCloseTo(0.005);
    expect(state.isComplete).toBe(false);
  });

  it('transform speed change does not reset reveal', () => {
    const defaults = linearTransformGridModule.defaultParams;
    const state = stepLinearTransformGridAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentShearX: defaults.shearX,
        currentScaleY: defaults.scaleY,
        previousShearX: defaults.shearX,
        previousScaleY: defaults.scaleY,
      },
      { ...defaults, transformSpeed: 0.04 },
      0.005,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('linearTransformGridModule.sample', () => {
  it('returns points for default sample', () => {
    const result = linearTransformGridModule.sample(
      linearTransformGridModule.defaultParams,
      { step: 8 },
    );
    expect(Array.isArray(result)).toBe(true);
    if (!Array.isArray(result)) return;
    expect(result.length).toBeGreaterThan(5);
    expect(result.at(-1)!.arcLength).toBeGreaterThan(0);
  });

  it('returns full grid segments for thumbnail sample', () => {
    const result = linearTransformGridModule.sample(
      linearTransformGridModule.defaultParams,
      { step: 8, purpose: 'thumbnail', revealProgress: 1 },
    );
    expect(Array.isArray(result)).toBe(false);
    if (Array.isArray(result)) return;
    expect(result.paths.length).toBe(GRID_SEGMENT_COUNT);
    const allSegmentsArePairs = result.paths.every((path) => path.points.length === 2);
    expect(allSegmentsArePairs).toBe(true);
  });
});

describe('sampleLinearTransformGridCurve', () => {
  it('shear skews vertical line in x', () => {
    const points = sampleLinearTransformGridCurve(0.8, 1, 600, 0, 20, 1);
    const mid = points[Math.floor(points.length / 2)]!;
    expect(mid.x).not.toBeCloseTo(0, 0);
  });
});
