import { describe, expect, it } from 'vitest';
import {
  buildDependencyCone,
  buildPascalMod,
  cellKey,
  normalizePrime,
  normalizeRows,
} from './geometry';

function chooseExact(n: number, k: number): number {
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = (result * (n - k + i)) / i;
  return Math.round(result);
}

describe('pascals-triangle 幾何', () => {
  it('buildPascalMod 等於二項係數 mod p', () => {
    const table = buildPascalMod(6, 7);
    for (let n = 0; n <= 6; n += 1) {
      for (let k = 0; k <= n; k += 1) {
        expect(table[n]![k], `C(${n},${k}) mod 7`).toBe(chooseExact(n, k) % 7);
      }
    }
  });

  it('mod 2 時第 2^m − 1 列全為 1（Sierpinski 性質）', () => {
    const table = buildPascalMod(7, 2);
    expect(table[7]).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    expect(table[4]).toEqual([1, 0, 0, 0, 1]);
  });

  it('normalize 夾住非法輸入', () => {
    expect(normalizePrime(4)).toBe(2);
    expect(normalizePrime(5)).toBe(5);
    expect(normalizeRows(9999)).toBeLessThanOrEqual(64);
    expect(normalizeRows(-5)).toBeGreaterThanOrEqual(1);
  });

  it('依賴錐只含能到達目標的格子', () => {
    const cone = buildDependencyCone(3, 1);
    expect(cone.has(cellKey(3, 1))).toBe(true);
    expect(cone.has(cellKey(0, 0))).toBe(true);
    expect(cone.has(cellKey(3, 3))).toBe(false);
    expect(cone.size).toBe(6);
  });
});
