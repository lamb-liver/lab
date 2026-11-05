import { describe, expect, it } from 'vitest';
import { EQUAL_LINES, K_AT_MAX, MAX_SUM, SUM3_LINES, chordSum, chords, sumThroughOrigin } from './geometry';

describe('2026 高考數學新課標 I 卷第 11 題的三個單位圓', () => {
  it('選項 A：k = ±√3/3 時直線無法同時和三圓有兩個交點', () => {
    for (const k of [Math.sqrt(3) / 3, -Math.sqrt(3) / 3]) {
      for (let b = -3; b <= 3; b += 0.001) expect(chordSum(k, b)).toBeNull();
    }
    expect(chordSum(0.15, 0.8)).not.toBeNull();
  });

  it('選項 B：三條直線讓三弦等長', () => {
    for (const { k, b } of EQUAL_LINES) {
      const [a, c, e] = chords(k, b) as number[];
      expect(a).toBeCloseTo(c, 10);
      expect(c).toBeCloseTo(e, 10);
    }
  });

  it('選項 C：過原點時弦長和為 3 的直線有 4 條', () => {
    for (const { k, b } of SUM3_LINES) expect(chordSum(k, b)).toBeCloseTo(3, 10);
  });

  it('選項 D：過原點時弦長和最大 2√21/3', () => {
    expect(sumThroughOrigin(K_AT_MAX)).toBeCloseTo(MAX_SUM, 10);
    let best = 0;
    for (let k = -20; k <= 20; k += 0.001) best = Math.max(best, sumThroughOrigin(k) ?? 0);
    expect(best).toBeCloseTo(MAX_SUM, 6);
  });
});
