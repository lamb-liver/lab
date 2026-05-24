import { describe, expect, it } from 'vitest';
import { stepInterferenceFringesAnimation } from './animation';
import {
  buildInterferenceGeometry,
  hyperbolaParameters,
  pathDifference,
} from './geometry';
import { interferenceFringesModule } from './index';

describe('hyperbolaParameters', () => {
  it('order 0 yields center line', () => {
    const params = hyperbolaParameters(pathDifference(0, 30), 80);
    expect(params?.isCenterLine).toBe(true);
  });

  it('returns null when |a| >= c', () => {
    expect(hyperbolaParameters(80, 80)).toBeNull();
  });

  it('computes b for valid order', () => {
    const params = hyperbolaParameters(pathDifference(1, 30), 80);
    expect(params).not.toBeNull();
    if (params && !params.isCenterLine) {
      expect(params.b).toBeGreaterThan(0);
    }
  });
});

describe('buildInterferenceGeometry', () => {
  it('produces fringes and envelopes', () => {
    const geometry = buildInterferenceGeometry({
      canvasWidth: 600,
      canvasHeight: 600,
      currentSourceDistance: 80,
      wavelength: 30,
      time: 0,
      revealProgress: 1,
    });
    expect(geometry.fringes.length).toBeGreaterThan(0);
    expect(geometry.envelopes.length).toBe(geometry.fringes.length);
  });
});

describe('stepInterferenceFringesAnimation', () => {
  it('wavelength change resets reveal progress start', () => {
    const defaults = interferenceFringesModule.defaultParams;
    const state = stepInterferenceFringesAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentSourceDistance: defaults.sourceDistance,
        previousWavelength: defaults.wavelength,
        previousSourceDistance: defaults.sourceDistance,
      },
      { ...defaults, wavelength: 40 },
      0.0024,
    );
    expect(state.revealProgress).toBeCloseTo(0.0024);
    expect(state.isComplete).toBe(false);
    expect(state.previousWavelength).toBe(40);
  });

  it('timeSpeed change does not reset reveal', () => {
    const defaults = interferenceFringesModule.defaultParams;
    const state = stepInterferenceFringesAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentSourceDistance: defaults.sourceDistance,
        previousWavelength: defaults.wavelength,
        previousSourceDistance: defaults.sourceDistance,
      },
      { ...defaults, timeSpeed: 0.05 },
      0.0024,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('interferenceFringesModule.sample', () => {
  it('returns thumbnail points', () => {
    const points = interferenceFringesModule.sample(
      interferenceFringesModule.defaultParams,
      { step: 4 },
    );
    expect(points.length).toBeGreaterThan(5);
  });
});
