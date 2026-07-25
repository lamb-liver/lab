import { describe, expect, it } from 'vitest';
import {
  CUBIC_SYMMETRY_CENTER,
  cubicValue,
  DIVISOR_ROOT,
  quotientValue,
  QUOTIENT_MAXIMUM,
  REMAINDER,
  symmetrySample,
} from './geometry';

describe('114 學測數A選填 13 的三次函數對稱中心', () => {
  it('由除式根與餘式得到官方答案 (-6, 3)', () => {
    expect(CUBIC_SYMMETRY_CENTER).toEqual({ x: -6, y: 3 });
    expect(cubicValue(DIVISOR_ROOT)).toBe(REMAINDER);
  });

  it('商式在 x=-6 取得最大值 8', () => {
    expect(quotientValue(DIVISOR_ROOT)).toBe(QUOTIENT_MAXIMUM);
    for (const x of [-12, -9, -3, 0]) {
      expect(quotientValue(x)).toBeLessThan(QUOTIENT_MAXIMUM);
    }
  });

  it.each([0, 1, 2.5, 4])('距中心 h=%s 的兩點中點固定', (distance) => {
    const sample = symmetrySample(distance);

    expect(quotientValue(sample.left.x)).toBeCloseTo(
      quotientValue(sample.right.x),
      12,
    );
    expect(sample.left.y + sample.right.y).toBeCloseTo(2 * REMAINDER, 12);
    expect(sample.midpoint).toEqual(CUBIC_SYMMETRY_CENTER);
  });
});
