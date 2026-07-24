import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SINUSOID_COEFFICIENTS,
  shiftedSineValue,
  sinusoidForm,
  sinusoidValue,
  symmetryAxes,
} from './geometry';

describe('112 學測數A多選 12 的三角疊合', () => {
  it('把 sin x + √3 cos x 化成振幅 2、相位 π/3 的正弦波', () => {
    const form = sinusoidForm(DEFAULT_SINUSOID_COEFFICIENTS);

    expect(form.amplitude).toBeCloseTo(2);
    expect(form.phase).toBeCloseTo(Math.PI / 3);
    for (const x of [0, Math.PI / 6, Math.PI / 3, Math.PI]) {
      expect(shiftedSineValue(x, DEFAULT_SINUSOID_COEFFICIENTS, 1)).toBeCloseTo(
        sinusoidValue(x, DEFAULT_SINUSOID_COEFFICIENTS),
      );
    }
  });

  it('找出 [0, 2π] 內交錯的極大與極小對稱軸', () => {
    expect(symmetryAxes(DEFAULT_SINUSOID_COEFFICIENTS)).toEqual([
      expect.closeTo(Math.PI / 6),
      expect.closeTo((7 * Math.PI) / 6),
    ]);
    expect(sinusoidValue(0, DEFAULT_SINUSOID_COEFFICIENTS)).toBeCloseTo(Math.sqrt(3));
    expect(sinusoidValue(Math.PI / 3, DEFAULT_SINUSOID_COEFFICIENTS)).toBeCloseTo(Math.sqrt(3));
  });
});
