import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BEAT,
  DEFAULT_SUPERPOSITION,
} from './constants';
import {
  describeBeat,
  describeSuperposition,
  getGuideState,
  waveSum,
} from './geometry';

describe('getGuideState', () => {
  it('labels in-phase guide state as enhanced', () => {
    const state = getGuideState({ phase: 0 });

    expect(state.zone).toBe('inPhase');
    expect(state.displacementLabel).toContain('增強');
  });

  it('labels quadrature guide state as shifted for standing waves and fringes', () => {
    const state = getGuideState({ phase: 0.5 });

    expect(state.zone).toBe('quadrature');
    expect(state.standingLabel).toContain('平移');
    expect(state.fringeLabel).toContain('平移');
  });

  it('labels anti-phase guide state as cancellation for displacement', () => {
    const state = getGuideState({ phase: 1 });

    expect(state.zone).toBe('antiPhase');
    expect(state.displacementLabel).toContain('抵消');
  });
});

describe('describeSuperposition', () => {
  it('detects constructive interference', () => {
    const text = describeSuperposition({
      ...DEFAULT_SUPERPOSITION,
      fA: 1,
      fB: 1,
      pA: 0,
      pB: 0,
    });
    expect(text).toContain('建設性');
  });

  it('detects destructive interference', () => {
    const text = describeSuperposition({
      ...DEFAULT_SUPERPOSITION,
      fA: 1,
      fB: 1,
      pA: 0,
      pB: 1,
    });
    expect(text).toContain('破壞性');
  });
});

describe('describeBeat', () => {
  it('formats beat frequency', () => {
    expect(describeBeat(DEFAULT_BEAT)).toContain('0.40');
  });
});

describe('waveSum', () => {
  it('is bounded by component amplitudes', () => {
    const y = waveSum(0.5, 0, DEFAULT_SUPERPOSITION);
    expect(Math.abs(y)).toBeLessThanOrEqual(1);
  });
});
