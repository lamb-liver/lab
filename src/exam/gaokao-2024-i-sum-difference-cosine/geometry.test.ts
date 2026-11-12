import { describe, expect, it } from 'vitest';
import { readSumDifference } from './geometry';

const SQRT10 = Math.sqrt(10);

describe('2024 高考數學新課標 I 卷第 4 題的和角與差角', () => {
  it('k = 2 時差的餘弦是和的餘弦的 −3 倍', () => {
    const reading = readSumDifference(2);
    expect(reading.atGiven).toBe(true);
    expect(reading.sumVanishes).toBe(false);
    expect(reading.sumCos).toBeCloseTo(-SQRT10 / 10, 10);
    expect(reading.diffCos).toBeCloseTo((3 * SQRT10) / 10, 10);
    expect(reading.diffCos).toBeCloseTo(-3 * reading.sumCos, 10);
    expect(reading.factor).toBeCloseTo(-3, 10);
    expect(Math.abs(reading.sumCos) * 3).toBeLessThanOrEqual(1);
    expect(Math.cos(reading.alpha)).not.toBeCloseTo(0, 6);
    expect(Math.cos(reading.beta)).not.toBeCloseTo(0, 6);
  });

  it('k = 4 時倍數是 −5/3', () => {
    const reading = readSumDifference(4);
    expect(reading.atGiven).toBe(false);
    expect(reading.factor).toBeCloseTo(-5 / 3, 10);
    expect(reading.diffCos).toBeCloseTo((reading.factor ?? 0) * reading.sumCos, 10);
  });

  it('k = 0.5 時倍數是 3', () => {
    const reading = readSumDifference(0.5);
    expect(reading.factor).toBeCloseTo(3, 10);
    expect(reading.diffCos).toBeCloseTo(3 * reading.sumCos, 10);
  });

  it('乘積離開 2 以後，差的餘弦仍等於那個倍數乘上和的餘弦', () => {
    for (const product of [0.4, 0.5, 1.5, 2, 3, 4]) {
      const reading = readSumDifference(product);
      expect(reading.factor).not.toBeNull();
      expect(reading.diffCos).toBeCloseTo((reading.factor ?? 0) * reading.sumCos, 10);
    }
  });

  it('k = 1 時和的餘弦是 0，倍數沒有定義', () => {
    const reading = readSumDifference(1);
    expect(reading.sumVanishes).toBe(true);
    expect(reading.atGiven).toBe(false);
    expect(reading.sumCos).toBeCloseTo(0, 10);
    expect(reading.diffCos).toBeCloseTo(1, 10);
    expect(reading.factor).toBeNull();
  });

  it('乘積夾在 0.4 與 4，非數值回到 2', () => {
    expect(readSumDifference(0).product).toBe(0.4);
    expect(readSumDifference(9).product).toBe(4);
    expect(readSumDifference(Number.NaN).product).toBe(2);
    expect(readSumDifference(Number.POSITIVE_INFINITY).atGiven).toBe(true);
  });
});
