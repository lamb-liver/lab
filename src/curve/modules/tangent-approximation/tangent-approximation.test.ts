import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE } from '../../constants';
import { stepTangentApproximationAnimation } from './animation';
import {
  buildSecantSegment,
  evaluateTangentFn,
  tangentPointX,
} from './geometry';
import { tangentApproximationModule } from './index';
import { createTangentApproximationAnimState } from './animation';

describe('buildSecantSegment', () => {
  it('has two endpoints', () => {
    const seg = buildSecantSegment(600, 1.8, 0, 0.5, 0.2);
    expect(seg).toHaveLength(2);
  });
});

describe('stepTangentApproximationAnimation', () => {
  it('dx change resets collapse', () => {
    const defaults = tangentApproximationModule.defaultParams;
    const state = stepTangentApproximationAnimation(
      {
        ...createTangentApproximationAnimState(defaults, BASE_CANVAS_SIZE),
        collapseProgress: 1,
        isComplete: true,
        smoothDx: 0.1,
        previousDx: 0.3,
      },
      { ...defaults, dx: 0.05 },
      BASE_CANVAS_SIZE,
      0.005,
    );
    expect(state.collapseProgress).toBeCloseTo(0.005);
    expect(state.isComplete).toBe(false);
  });

  it('frequency change rebuilds ghost curve', () => {
    const defaults = tangentApproximationModule.defaultParams;
    const initial = createTangentApproximationAnimState(defaults, BASE_CANVAS_SIZE);
    const state = stepTangentApproximationAnimation(
      { ...initial, time: 2 },
      { ...defaults, waveFrequency: 2.5 },
      BASE_CANVAS_SIZE,
      0.005,
    );
    expect(state.ghostCurve.length).toBeGreaterThan(10);
    expect(state.snapshotTime).toBe(2);
  });
});

describe('tangentApproximationModule.sample', () => {
  it('returns points for default sample', () => {
    const result = tangentApproximationModule.sample(
      tangentApproximationModule.defaultParams,
      { step: 1 },
    );
    expect(Array.isArray(result)).toBe(true);
    if (!Array.isArray(result)) return;
    expect(result.length).toBeGreaterThan(10);
  });

  it('returns ghost + secant + extension for thumbnail sample', () => {
    const result = tangentApproximationModule.sample(
      tangentApproximationModule.defaultParams,
      { step: 1, purpose: 'thumbnail', revealProgress: 1 },
    );
    expect(Array.isArray(result)).toBe(false);
    if (Array.isArray(result)) return;
    expect(result.paths.length).toBe(3);
    expect(result.paths[0]?.excludeFromBbox).toBe(true);
    expect(result.paths[1]?.points.length).toBe(2);
  });
});

describe('tangentPointX', () => {
  it('stays near center', () => {
    expect(tangentPointX(0)).toBeCloseTo(0.5, 1);
  });
});

describe('evaluateTangentFn', () => {
  it('is defined on unit interval', () => {
    expect(Number.isFinite(evaluateTangentFn(0.5, 1.8, 0))).toBe(true);
  });
});
