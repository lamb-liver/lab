import { describe, expect, it } from 'vitest';
import { ILL_ABOVE_105, WELL_BELOW_95, falseAlarmRate, missRate, totalError, totalErrorFormula } from './geometry';

describe('2023 高考數學新課標 II 卷第 19 題的臨界值', () => {
  it('視窗外的比例讓兩組都加總為 1', () => {
    expect(WELL_BELOW_95).toBeCloseTo(0.94, 12);
    expect(ILL_ABOVE_105).toBeCloseTo(0.93, 12);
  });

  it('漏診率 0.5% 時 c = 97.5，誤診率 3.5%', () => {
    expect(missRate(97.5)).toBeCloseTo(0.005, 12);
    expect(falseAlarmRate(97.5)).toBeCloseTo(0.035, 12);
  });

  it('f(c) 與分段式一致，最小值 f(100) = 0.02', () => {
    let best = { c: 0, f: Infinity };
    for (let i = 0; i <= 1000; i += 1) {
      const c = 95 + i / 100;
      expect(totalError(c)).toBeCloseTo(totalErrorFormula(c), 10);
      if (totalError(c) < best.f) best = { c, f: totalError(c) };
    }
    expect(best.c).toBeCloseTo(100, 6);
    expect(best.f).toBeCloseTo(0.02, 10);
  });
});
