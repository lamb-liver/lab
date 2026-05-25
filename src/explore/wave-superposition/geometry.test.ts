import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BEAT,
  DEFAULT_SUPERPOSITION,
} from './constants';
import {
  describeBeat,
  describeSuperposition,
  waveSum,
} from './geometry';

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
