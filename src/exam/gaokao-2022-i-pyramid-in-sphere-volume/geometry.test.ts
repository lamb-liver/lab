import { describe, expect, it } from 'vitest';
import { L_MAX, L_MIN, L_PEAK, R, V_AT_L_MAX, V_MAX, V_MIN, readPyramid, volumeAt } from './geometry';

describe('2022 高考數學新課標 I 卷第 8 題的球內正四棱錐', () => {
  it('每個 l 的頂點都在半徑 3 的球面上', () => {
    for (const l of [3, 4, 4.9, 5.1]) {
      const r = readPyramid(l);
      // 球心在軸上距頂點 R：底面頂點到球心距離也要是 R
      expect(Math.hypot(r.halfDiagonal, r.height - R)).toBeCloseTo(R, 10);
      expect(Math.hypot(r.halfDiagonal, r.height)).toBeCloseTo(l, 10);
    }
  });

  it('端點與頂點的體積：27/4、81/4、64/3', () => {
    expect(volumeAt(L_MIN)).toBeCloseTo(V_MIN, 10);
    expect(volumeAt(L_MAX)).toBeCloseTo(V_AT_L_MAX, 10);
    expect(volumeAt(L_PEAK)).toBeCloseTo(V_MAX, 10);
    expect(readPyramid(L_PEAK).height).toBeCloseTo(4, 10);
  });

  it('範圍是 [27/4, 64/3]，最大不在端點', () => {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i <= 2000; i += 1) {
      const v = volumeAt(L_MIN + ((L_MAX - L_MIN) * i) / 2000);
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    expect(lo).toBeCloseTo(V_MIN, 6);
    expect(hi).toBeCloseTo(V_MAX, 4);
    expect(V_MAX).toBeGreaterThan(V_AT_L_MAX);
  });
});
