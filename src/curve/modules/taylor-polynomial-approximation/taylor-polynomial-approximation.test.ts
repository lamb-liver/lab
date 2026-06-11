import { describe, expect, it } from 'vitest';
import {
  clampN,
  maxErrorInView,
  presetById,
  taylorTerm,
  taylorValue,
} from './geometry';

describe('taylor polynomial approximation geometry', () => {
  it('matches sin Maclaurin terms', () => {
    const sin = presetById('sin');
    expect(taylorTerm(sin, 2, 0, 0)).toBeCloseTo(0);
    expect(taylorTerm(sin, 2, 0, 1)).toBeCloseTo(2);
    expect(taylorTerm(sin, 2, 0, 3)).toBeCloseTo(-8 / 6);
  });

  it('agrees with f at the expansion center', () => {
    for (const id of ['sin', 'cos', 'exp']) {
      const preset = presetById(id);
      const a = id === 'exp' ? 0.5 : 0.8;
      expect(taylorValue(preset, a, a, 8)).toBeCloseTo(preset.f(a));
    }
  });

  it('reduces visible error when increasing n near center for exp', () => {
    const exp = presetById('exp');
    expect(maxErrorInView(exp, 0, 5)).toBeLessThan(maxErrorInView(exp, 0, 1));
  });

  it('clamps polynomial degree to supported range', () => {
    expect(clampN(-2)).toBe(0);
    expect(clampN(99)).toBe(12);
    expect(clampN(3.4)).toBe(3);
  });
});
