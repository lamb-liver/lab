import { describe, expect, it } from 'vitest';
import {
  MAX_A,
  MIN_A,
  exactVolume,
  midpointDiskVolume,
  profileY,
} from './geometry';

describe('114 分科數甲第 17 題的旋轉體', () => {
  it('題設範圍內的函數都在 x 軸上方', () => {
    for (const a of [MIN_A, 0, MAX_A]) {
      for (const x of [-1, -0.5, 0, 0.5, 1]) {
        expect(profileY(x, a)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('體積在 a=1 時達到題設最大值 18π/5', () => {
    expect(exactVolume(0)).toBeCloseTo(2 * Math.PI);
    expect(exactVolume(MIN_A)).toBeCloseTo((12 * Math.PI) / 5);
    expect(exactVolume(MAX_A)).toBeCloseTo((18 * Math.PI) / 5);
  });

  it('中點圓盤和會收斂到精確體積', () => {
    expect(Math.abs(midpointDiskVolume(1, 200) - exactVolume(1))).toBeLessThan(0.001);
  });
});
