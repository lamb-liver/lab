import { describe, expect, it } from 'vitest';
import { asCurvePoints } from '../../curvePoints';
import { stepStandingWaveAnimation } from './animation';
import {
  buildStandingWavePoints,
  envelopeY,
  standingWaveY,
} from './geometry';
import { standingWaveModule } from './index';

describe('standingWaveY', () => {
  it('at t=0 equals envelope', () => {
    const kx = 1.2;
    const a = 45;
    expect(standingWaveY(kx, a, 0)).toBeCloseTo(envelopeY(kx, a));
  });
});

describe('buildStandingWavePoints', () => {
  it('reveal 0 yields a single point', () => {
    const pts = buildStandingWavePoints({
      canvasWidth: 600,
      currentAmplitude: 45,
      spatialFrequency: 4,
      time: 0,
      revealProgress: 0,
    });
    expect(pts).toHaveLength(1);
  });

  it('reveal 1 spans curve width', () => {
    const pts = buildStandingWavePoints({
      canvasWidth: 600,
      currentAmplitude: 45,
      spatialFrequency: 4,
      time: 0,
      revealProgress: 1,
    });
    expect(pts.length).toBeGreaterThan(10);
    const span = pts.at(-1)!.x - pts[0]!.x;
    expect(span).toBeCloseTo(600 * 0.8, 0);
  });
});

describe('stepStandingWaveAnimation', () => {
  it('spatial frequency change resets reveal', () => {
    const defaults = standingWaveModule.defaultParams;
    let state = stepStandingWaveAnimation(
      {
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentAmplitude: defaults.amplitude,
        previousFrequency: 4,
      },
      { ...defaults, spatialFrequency: 6 },
      0.0024,
    );
    expect(state.revealProgress).toBeCloseTo(0.0024);
    expect(state.isComplete).toBe(false);
    expect(state.previousFrequency).toBe(6);
  });

  it('amplitude change does not reset reveal', () => {
    const defaults = standingWaveModule.defaultParams;
    const state = stepStandingWaveAnimation(
      {
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentAmplitude: defaults.amplitude,
        previousFrequency: 4,
      },
      { ...defaults, amplitude: 60 },
      0.0024,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('standingWaveModule.sample', () => {
  it('returns points for thumbnail', () => {
    const points = asCurvePoints(
      standingWaveModule.sample(standingWaveModule.defaultParams, { step: 2 }),
    );
    expect(points.length).toBeGreaterThan(5);
    expect(points.at(-1)!.arcLength).toBeGreaterThan(0);
  });
});
