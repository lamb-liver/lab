import { describe, expect, it } from 'vitest';
import { stepAffineIfsFractalAnimation } from './animation';
import { mulberry32 } from '../../prng';
import { sampleAffineIfsFractalCurve, stepIfsPoint } from './geometry';
import { affineIfsFractalModule } from './index';

describe('stepIfsPoint', () => {
  it('stem reset branch maps to origin x', () => {
    const next = stepIfsPoint({ x: 1, y: 2 }, 0.04, 0.85, 0, () => 0.01);
    expect(next.x).toBe(0);
  });
});

describe('stepAffineIfsFractalAnimation', () => {
  it('bend or height change waits for pending reset before clearing grains', () => {
    const defaults = affineIfsFractalModule.defaultParams;
    const pending = stepAffineIfsFractalAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 1,
        isComplete: true,
        time: 0,
        currentLeafBend: defaults.leafBend,
        currentBranchHeight: defaults.branchHeight,
        previousLeafBend: defaults.leafBend,
        previousBranchHeight: defaults.branchHeight,
        currentPoint: { x: 0, y: 0 },
        grains: [{ x: 1, y: 2 }],
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, leafBend: -0.1 },
      mulberry32(99),
      undefined,
      1000 / 60,
      100,
    );
    expect(pending.revealProgress).toBe(1);
    expect(pending.pendingRevealReset).toBe(true);
    expect(pending.grains.length).toBeGreaterThan(1);

    const state = stepAffineIfsFractalAnimation(
      pending,
      { ...defaults, leafBend: -0.1 },
      mulberry32(99),
      undefined,
      1000 / 60,
      1400,
    );
    expect(state.grains.length).toBeGreaterThan(0);
    expect(state.revealProgress).toBeCloseTo(0.003);
    expect(state.grains.length).toBeLessThanOrEqual(600);
  });
});

describe('affineIfsFractalModule.sample', () => {
  it('returns points for default sample', () => {
    const result = affineIfsFractalModule.sample(
      affineIfsFractalModule.defaultParams,
      { step: 2 },
    );
    expect(Array.isArray(result)).toBe(true);
    if (!Array.isArray(result)) return;
    expect(result.length).toBeGreaterThan(10);
  });

  it('returns dense deterministic cloud for thumbnail', () => {
    const result = affineIfsFractalModule.sample(
      affineIfsFractalModule.defaultParams,
      { step: 2, purpose: 'thumbnail', revealProgress: 1 },
    );
    expect(Array.isArray(result)).toBe(false);
    if (Array.isArray(result)) return;
    expect(result.paths.length).toBe(1);
    expect(result.paths[0]?.points.length).toBeGreaterThanOrEqual(15000);
    expect(result.paths[0]?.strokeWidth).toBe(0.9);
  });
});

describe('sampleAffineIfsFractalCurve', () => {
  it('is deterministic for fixed seed path', () => {
    const a = sampleAffineIfsFractalCurve(0.04, 0.85, 500, 5);
    const b = sampleAffineIfsFractalCurve(0.04, 0.85, 500, 5);
    expect(a[0]!.x).toBeCloseTo(b[0]!.x);
  });
});
