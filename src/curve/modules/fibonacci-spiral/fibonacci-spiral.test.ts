import { describe, expect, it } from 'vitest';
import { PHI, buildFibonacci, buildSpiralGeometry, fibonacciRatio } from './geometry';

describe('fibonacci-spiral 幾何', () => {
  it('產生正確的 Fibonacci 數列', () => {
    expect(buildFibonacci(8)).toEqual([1, 1, 2, 3, 5, 8, 13, 21]);
  });

  it('相鄰比值收斂到黃金比例 φ', () => {
    expect(PHI).toBeCloseTo((1 + Math.sqrt(5)) / 2, 12);
    expect(fibonacciRatio(buildFibonacci(20))).toBeCloseTo(PHI, 6);
  });

  it('每個 Fibonacci 數對應一塊正方形，邊長即數列值', () => {
    const fib = buildFibonacci(7);
    const geometry = buildSpiralGeometry(fib);
    expect(geometry.tiles).toHaveLength(7);
    expect(geometry.tiles.map((tile) => tile.s)).toEqual(fib);
    expect(geometry.worldWidth).toBeGreaterThan(0);
    expect(geometry.worldHeight).toBeGreaterThan(0);
    // 矩形面積 = 各方塊面積和（無重疊、無縫隙）
    const tileArea = fib.reduce((sum, s) => sum + s * s, 0);
    expect(geometry.worldWidth * geometry.worldHeight).toBeCloseTo(tileArea, 6);
  });
});
