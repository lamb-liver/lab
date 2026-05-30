import { describe, expect, it } from 'vitest';
import { stepConicFocusLocusAnimation } from './animation';
import {
  buildFocusConnections,
  ellipseParameters,
  focusPoints,
  orbitPoint,
  sampleConicFocusLocusCurve,
} from './geometry';
import { conicFocusLocusModule } from './index';

describe('ellipseParameters', () => {
  it('computes c = ae and b from a, e', () => {
    const { a, b, c } = ellipseParameters(140, 0.6);
    expect(c).toBeCloseTo(84);
    expect(b).toBeCloseTo(Math.sqrt(140 * 140 - 84 * 84));
    expect(a).toBe(140);
  });
});

describe('buildFocusConnections', () => {
  it('lerps from foci toward orbit by reveal', () => {
    const [f1, f2] = focusPoints(84);
    const orbit = { x: 140, y: 0 };
    const [c1] = buildFocusConnections([f1, f2], orbit, 0.5);
    expect(c1!.x2).toBeCloseTo(f1.x + (orbit.x - f1.x) * 0.5);
  });
});

describe('orbitPoint', () => {
  it('lies on ellipse at t=0', () => {
    const { a, b } = ellipseParameters(140, 0.6);
    const pt = orbitPoint(a, b, 0);
    expect(pt.x).toBeCloseTo(a);
    expect(pt.y).toBeCloseTo(0);
  });
});

describe('stepConicFocusLocusAnimation', () => {
  it('eccentricity change waits for pending reset before replaying reveal', () => {
    const defaults = conicFocusLocusModule.defaultParams;
    const pending = stepConicFocusLocusAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentSemiMajorAxis: defaults.semiMajorAxis,
        currentEccentricity: defaults.eccentricity,
        previousSemiMajorAxis: defaults.semiMajorAxis,
        previousEccentricity: defaults.eccentricity,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, eccentricity: 0.8 },
      0.004,
      1000 / 60,
      100,
    );
    expect(pending.revealProgress).toBe(1);
    expect(pending.pendingRevealReset).toBe(true);

    const state = stepConicFocusLocusAnimation(
      pending,
      { ...defaults, eccentricity: 0.8 },
      0.004,
      1000 / 60,
      1400,
    );
    expect(state.revealProgress).toBeCloseTo(0.004);
    expect(state.isComplete).toBe(false);
  });

  it('orbit speed change does not reset reveal', () => {
    const defaults = conicFocusLocusModule.defaultParams;
    const state = stepConicFocusLocusAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentSemiMajorAxis: defaults.semiMajorAxis,
        currentEccentricity: defaults.eccentricity,
        previousSemiMajorAxis: defaults.semiMajorAxis,
        previousEccentricity: defaults.eccentricity,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, orbitSpeed: 0.05 },
      0.004,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('conicFocusLocusModule.sample', () => {
  it('returns ellipse points for thumbnail', () => {
    const points = sampleConicFocusLocusCurve(140, 0.6, 0.02);
    expect(points.length).toBeGreaterThan(10);
  });
});
