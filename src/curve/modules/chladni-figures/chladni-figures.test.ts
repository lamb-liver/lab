import { describe, expect, it } from 'vitest';
import { stepChladniAnimation } from './animation';
import {
  chladniAmplitude,
  mapToPlatePhase,
  plateSize,
  sampleChladniNodalLines,
} from './geometry';
import { chladniFiguresModule } from './index';

describe('chladniAmplitude', () => {
  it('is zero at plate center for m=3 n=2', () => {
    const size = plateSize(600);
    const { mappedX, mappedY } = mapToPlatePhase(0, 0, size);
    expect(chladniAmplitude(mappedX, mappedY, 3, 2)).toBeCloseTo(0, 5);
  });
});

describe('stepChladniAnimation', () => {
  it('mode change resets reveal and flags particle reset', () => {
    const defaults = chladniFiguresModule.defaultParams;
    const state = stepChladniAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentM: 3,
        currentN: 2,
        previousM: 3,
        previousN: 2,
        resetParticles: false,
      },
      { ...defaults, modeM: 4 },
      0.004,
    );
    expect(state.revealProgress).toBeCloseTo(0.004);
    expect(state.isComplete).toBe(false);
    expect(state.resetParticles).toBe(true);
    expect(state.previousM).toBe(4);
  });

  it('vibration speed change does not reset reveal', () => {
    const defaults = chladniFiguresModule.defaultParams;
    const state = stepChladniAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentM: 3,
        currentN: 2,
        previousM: 3,
        previousN: 2,
        resetParticles: false,
      },
      { ...defaults, vibrationSpeed: 0.08 },
      0.004,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
    expect(state.resetParticles).toBe(false);
  });
});

describe('chladniFiguresModule.sample', () => {
  it('returns nodal line points for default sample', () => {
    const result = chladniFiguresModule.sample(chladniFiguresModule.defaultParams, {
      step: 4,
    });
    expect(Array.isArray(result)).toBe(true);
    if (!Array.isArray(result)) return;
    expect(result.length).toBeGreaterThan(10);
  });

  it('returns deterministic particle cloud for thumbnail', () => {
    const result = chladniFiguresModule.sample(chladniFiguresModule.defaultParams, {
      step: 4,
      purpose: 'thumbnail',
      revealProgress: 1,
    });
    expect(Array.isArray(result)).toBe(false);
    if (Array.isArray(result)) return;
    expect(result.paths.length).toBe(1);
    expect(result.paths[0]?.points.length).toBeGreaterThanOrEqual(6000);
    expect(result.paths[0]?.strokeWidth).toBe(0.9);
  });
});

describe('sampleChladniNodalLines', () => {
  it('finds zero crossings along scan lines', () => {
    const points = sampleChladniNodalLines(3, 2, 4);
    expect(points.length).toBeGreaterThan(0);
  });
});
