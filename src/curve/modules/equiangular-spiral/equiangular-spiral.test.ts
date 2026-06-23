import { describe, expect, it } from 'vitest';
import { updateSpiralCamera } from './camera';
import { computeRevealTheta, evaluateEquiangularSpiral } from './geometry';
import { createEquiangularSpiralAnimState, stepEquiangularSpiralAnimation } from './animation';
import { equiangularSpiralModule } from './index';

describe('evaluateEquiangularSpiral', () => {
  it('at theta=0 starts at radius a', () => {
    const pt = evaluateEquiangularSpiral(0, 4, 0.14);
    expect(pt.x).toBeCloseTo(4);
    expect(pt.y).toBeCloseTo(0);
    expect(pt.r).toBeCloseTo(4);
  });

  it('grows with theta', () => {
    const pt = evaluateEquiangularSpiral(2, 4, 0.14);
    expect(pt.r).toBeGreaterThan(4);
  });
});

describe('computeRevealTheta', () => {
  it('stays within maxTheta', () => {
    const theta = computeRevealTheta(18, 5);
    expect(theta).toBeLessThanOrEqual(18);
    expect(theta).toBeGreaterThan(0);
  });
});

describe('updateSpiralCamera', () => {
  it('produces positive zoom', () => {
    const cam = updateSpiralCamera(10, 600, 600);
    expect(cam.zoom).toBeGreaterThan(0);
  });
});

describe('equiangularSpiralModule', () => {
  it('sample returns points for default', () => {
    const result = equiangularSpiralModule.sample(
      equiangularSpiralModule.defaultParams,
      { step: 1 },
    );
    expect(Array.isArray(result)).toBe(true);
    expect((result as []).length).toBeGreaterThan(2);
  });

  it('thumbnail returns multiple paths', () => {
    const result = equiangularSpiralModule.sample(
      equiangularSpiralModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThanOrEqual(2);
  });
});

describe('stepEquiangularSpiralAnimation', () => {
  it('advances time', () => {
    const state = createEquiangularSpiralAnimState(equiangularSpiralModule.defaultParams);
    const next = stepEquiangularSpiralAnimation(state, equiangularSpiralModule.defaultParams);
    expect(next.time).toBeGreaterThan(state.time);
    expect(next.activePath.length).toBeGreaterThan(1);
  });
});
