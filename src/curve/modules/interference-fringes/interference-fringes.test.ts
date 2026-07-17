import { describe, expect, it } from 'vitest';
import { asCurvePoints } from '../../curvePoints';
import { stepInterferenceFringesAnimation } from './animation';
import { buildInterferenceGeometry } from './geometry';
import { interferenceFringesModule } from './index';

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

  it('keeps the zero-order fringe as a center line', () => {
    const geometry = buildInterferenceGeometry({
      canvasWidth: 600,
      canvasHeight: 600,
      currentSourceDistance: 80,
      wavelength: 80,
      time: 0,
      revealProgress: 1,
    });
    expect(geometry.envelopes).toHaveLength(1);
    expect(geometry.envelopes[0]!.every((point) => Math.abs(point.x) < 0.001)).toBe(true);
  });
});

describe('stepInterferenceFringesAnimation', () => {
  it('wavelength change waits for pending reset before replaying reveal', () => {
    const defaults = interferenceFringesModule.defaultParams;
    const pending = stepInterferenceFringesAnimation(
      {
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentSourceDistance: defaults.sourceDistance,
        previousWavelength: defaults.wavelength,
        previousSourceDistance: defaults.sourceDistance,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, wavelength: 40 },
      0.0024,
      1000 / 60,
      100,
    );
    expect(pending.revealProgress).toBe(1);
    expect(pending.pendingRevealReset).toBe(true);

    const state = stepInterferenceFringesAnimation(
      pending,
      { ...defaults, wavelength: 40 },
      0.0024,
      1000 / 60,
      1400,
    );
    expect(state.revealProgress).toBeCloseTo(0.0024);
    expect(state.isComplete).toBe(false);
    expect(state.previousWavelength).toBe(40);
  });

  it('timeSpeed change does not reset reveal', () => {
    const defaults = interferenceFringesModule.defaultParams;
    const state = stepInterferenceFringesAnimation(
      {
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentSourceDistance: defaults.sourceDistance,
        previousWavelength: defaults.wavelength,
        previousSourceDistance: defaults.sourceDistance,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, timeSpeed: 0.05 },
      0.0024,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('interferenceFringesModule.sample', () => {
  it('returns thumbnail points', () => {
    const points = asCurvePoints(
      interferenceFringesModule.sample(interferenceFringesModule.defaultParams, {
        step: 4,
      }),
    );
    expect(points.length).toBeGreaterThan(5);
  });
});
