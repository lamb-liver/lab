import { describe, expect, it } from 'vitest';
import { stepRiemannSumAnimation } from './animation';
import {
  buildRiemannCurvePoints,
  buildRiemannRectangles,
  evaluateRiemannFn,
} from './geometry';
import { riemannSumModule } from './index';

describe('evaluateRiemannFn', () => {
  it('returns values above 0 for default k', () => {
    expect(evaluateRiemannFn(0, 2, 0)).toBeGreaterThan(0);
  });
});

describe('buildRiemannRectangles', () => {
  it('activeDomain 0 includes rectangle at origin', () => {
    expect(buildRiemannRectangles(600, 12, 2, 0, 0)).toHaveLength(1);
  });

  it('full domain yields n rectangles', () => {
    expect(buildRiemannRectangles(600, 12, 2, 0, 1)).toHaveLength(12);
  });
});

describe('buildRiemannCurvePoints', () => {
  it('grows with active domain', () => {
    const partial = buildRiemannCurvePoints(600, 2, 0, 0.5);
    const full = buildRiemannCurvePoints(600, 2, 0, 1);
    expect(partial.length).toBeLessThan(full.length);
  });
});

describe('stepRiemannSumAnimation', () => {
  it('partition count change resets active domain', () => {
    const defaults = riemannSumModule.defaultParams;
    const state = stepRiemannSumAnimation(
      {
        params: defaults,
        targetParams: defaults,
        activeDomain: 1,
        isComplete: true,
        time: 1,
        currentPartitionCount: 12,
        previousPartitionCount: 12,
      },
      { ...defaults, partitionCount: 24 },
      0.004,
    );
    expect(state.activeDomain).toBeCloseTo(0.004);
    expect(state.isComplete).toBe(false);
  });
});

describe('riemannSumModule.sample', () => {
  it('returns points for default sample', () => {
    const result = riemannSumModule.sample(riemannSumModule.defaultParams, {
      step: 2,
    });
    expect(Array.isArray(result)).toBe(true);
    if (!Array.isArray(result)) return;
    expect(result.length).toBeGreaterThan(5);
  });

  it('returns curve + rectangles for thumbnail sample', () => {
    const result = riemannSumModule.sample(riemannSumModule.defaultParams, {
      step: 2,
      purpose: 'thumbnail',
      revealProgress: 1,
    });
    expect(Array.isArray(result)).toBe(false);
    if (Array.isArray(result)) return;
    const n = Math.floor(riemannSumModule.defaultParams.partitionCount);
    expect(result.paths.length).toBe(1 + n);
    expect(result.paths[0]?.points.length).toBeGreaterThan(10);
  });
});
