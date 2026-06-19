import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS,
  TAU,
  asSinusoidAmplitudePeriodPhaseParams,
  formatRad,
  peakInfo,
  transformedSin,
  troughInfo,
} from './geometry';

describe('sinusoid amplitude period phase geometry', () => {
  it('evaluates the default transformed sine', () => {
    const params = DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS;

    expect(transformedSin(0, params)).toBeCloseTo(0);
    expect(transformedSin(Math.PI / 2, params)).toBeCloseTo(1.25);
  });

  it('applies period, phase, and vertical shift independently', () => {
    const params = asSinusoidAmplitudePeriodPhaseParams({
      amplitude: 2,
      period: Math.PI,
      phase: Math.PI / 2,
      verticalShift: 1,
    });

    expect(transformedSin(params.phase + params.period / 4, params)).toBeCloseTo(3);
    expect(transformedSin(params.phase + (params.period * 3) / 4, params)).toBeCloseTo(-1);
  });

  it('flips peak and trough positions when amplitude is negative', () => {
    const params = asSinusoidAmplitudePeriodPhaseParams({
      amplitude: -2,
      period: TAU,
      phase: 0,
      verticalShift: 0.5,
    });
    const peak = peakInfo(params);
    const trough = troughInfo(params);

    expect(peak.x).toBeCloseTo(-Math.PI / 2);
    expect(peak.y).toBeCloseTo(2.5);
    expect(trough.x).toBeCloseTo(Math.PI / 2);
    expect(trough.y).toBeCloseTo(-1.5);
  });

  it('accepts prototype aliases and clamps control ranges', () => {
    const params = asSinusoidAmplitudePeriodPhaseParams({
      A: -5,
      T: Math.PI * 8,
      phi: Math.PI * 8,
      k: 5,
      showGhost: 0,
      showGuides: 1,
    });

    expect(params.amplitude).toBe(-2);
    expect(params.period).toBe(Math.PI * 4);
    expect(params.phase).toBe(Math.PI * 2);
    expect(params.verticalShift).toBe(1.5);
    expect(params.showGhost).toBe(false);
    expect(params.showGuides).toBe(true);
  });

  it('formats common radian labels', () => {
    expect(formatRad(Math.PI / 2)).toBe('π/2');
    expect(formatRad(TAU)).toBe('2π');
    expect(formatRad(Math.PI * 0.82)).toBe('2.58');
  });
});
