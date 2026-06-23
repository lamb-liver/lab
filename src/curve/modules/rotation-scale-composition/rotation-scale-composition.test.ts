import { describe, expect, it } from 'vitest';
import { stepRotationScaleCompositionAnimation } from './animation';
import {
  STACK_LAYERS,
  buildBaseSquare,
  buildRotationScaleMatrix,
  buildStackedSegments,
} from './geometry';
import { rotationScaleCompositionModule } from './index';

describe('buildStackedSegments', () => {
  it('layer count 0 yields no segments', () => {
    const base = buildBaseSquare(600);
    const matrix = buildRotationScaleMatrix(12, 0.94, 0);
    expect(buildStackedSegments(base, matrix, 0)).toHaveLength(0);
  });

  it('full layers produce many segments', () => {
    const base = buildBaseSquare(600);
    const matrix = buildRotationScaleMatrix(12, 0.94, 0);
    const segments = buildStackedSegments(base, matrix, STACK_LAYERS);
    expect(segments.length).toBeGreaterThan(100);
  });
});

describe('stepRotationScaleCompositionAnimation', () => {
  it('rotation or scale change waits for pending reset before replaying reveal', () => {
    const defaults = rotationScaleCompositionModule.defaultParams;
    const pending = stepRotationScaleCompositionAnimation(
      {
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentRotationStepDeg: defaults.rotationStepDeg,
        currentScaleFactor: defaults.scaleFactor,
        previousRotationStepDeg: defaults.rotationStepDeg,
        previousScaleFactor: defaults.scaleFactor,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, rotationStepDeg: 20 },
      0.004,
      1000 / 60,
      100,
    );
    expect(pending.revealProgress).toBe(1);
    expect(pending.pendingRevealReset).toBe(true);

    const state = stepRotationScaleCompositionAnimation(
      pending,
      { ...defaults, rotationStepDeg: 20 },
      0.004,
      1000 / 60,
      1400,
    );
    expect(state.revealProgress).toBeCloseTo(0.004);
    expect(state.isComplete).toBe(false);
  });
});

describe('rotationScaleCompositionModule.sample', () => {
  it('returns points for thumbnail', () => {
    const points = rotationScaleCompositionModule.sample(
      rotationScaleCompositionModule.defaultParams,
      { step: 1 },
    );
    expect(points.length).toBeGreaterThan(3);
  });
});
