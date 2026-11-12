import { describe, expect, it } from 'vitest';
import { readLogSign } from './geometry';

function valueAt(x: number, a: number, b: number): number {
  return (x + a) * Math.log(x + b);
}

describe('2024 高考數學新課標 II 卷第 8 題的變號點', () => {
  it('垂足上兩個變號點重合，距離平方是 1/2', () => {
    const reading = readLogSign(0);
    expect(reading.atMinimum).toBe(true);
    expect(reading.onLine).toBe(true);
    expect(reading.a).toBeCloseTo(-0.5, 10);
    expect(reading.b).toBeCloseTo(0.5, 10);
    expect(reading.b - reading.a).toBeCloseTo(1, 10);
    expect(reading.squared).toBeCloseTo(0.5, 10);
    expect(reading.zeroGap).toBeCloseTo(0, 10);
    expect(reading.linearZero).toBeCloseTo(0.5, 10);
    expect(reading.logZero).toBeCloseTo(0.5, 10);
  });

  it('沿垂線移動時，距離平方是 (1/√2 + 偏移)²', () => {
    for (const offset of [-0.55, -0.2, 0, 0.4, 1.05]) {
      const reading = readLogSign(offset);
      expect(reading.a).toBeCloseTo(-reading.b, 10);
      expect(reading.squared).toBeCloseTo((Math.SQRT1_2 + offset) ** 2, 10);
      expect(reading.zeroGap).toBeCloseTo(-offset * Math.SQRT2, 10);
      expect(reading.linearZero).toBeGreaterThan(reading.domainLeft);
      expect(reading.logZero).toBeGreaterThan(reading.domainLeft);
    }
  });

  it('離開直線以後，兩個變號點之間的函數值是負的', () => {
    for (const offset of [-0.55, -0.2, 0.4, 1.05]) {
      const reading = readLogSign(offset);
      expect(reading.onLine).toBe(false);
      const mid = (reading.linearZero + reading.logZero) / 2;
      expect(mid).toBeGreaterThan(reading.domainLeft);
      expect(valueAt(mid, reading.a, reading.b)).toBeLessThan(0);
    }
  });

  it('重合時，定義域上的取樣都不為負', () => {
    const reading = readLogSign(0);
    for (const t of [0.15, 0.5, 1, 2, 4]) {
      const x = t - reading.b;
      expect(x).toBeGreaterThan(reading.domainLeft);
      expect(valueAt(x, reading.a, reading.b)).toBeGreaterThanOrEqual(-1e-12);
    }
  });

  it('往原點走，距離平方小於 1/2', () => {
    const reading = readLogSign(-0.4);
    expect(reading.squared).toBeLessThan(0.5);
    expect(reading.atMinimum).toBe(false);
  });

  it('偏移夾在範圍內，非數值回到 0', () => {
    expect(readLogSign(-4).offset).toBe(-0.55);
    expect(readLogSign(4).offset).toBe(1.05);
    expect(readLogSign(Number.NaN).offset).toBe(0);
    expect(readLogSign(Number.POSITIVE_INFINITY).atMinimum).toBe(true);
  });
});
