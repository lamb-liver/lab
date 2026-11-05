import { describe, expect, it } from 'vitest';
import { ROWS, TOTAL, blockerFor, pairingsFor, targetSums } from './geometry';

describe('2026 高考數學新課標 I 卷第 7 題的一百零八塔分組', () => {
  it('12 列共 108 座，組和平均 18', () => {
    expect(ROWS).toHaveLength(12);
    expect(TOTAL).toBe(108);
    expect(targetSums(4)).toEqual([8, 12, 16, 20, 24, 28]);
  });

  it('d = 2 組和是奇數，d = 6、8 首項太小', () => {
    expect(blockerFor(2)).toBe('odd-sum');
    expect(targetSums(6)[0]).toBe(3);
    expect(blockerFor(6)).toBe('odd-sum');
    expect(blockerFor(8)).toBe('non-positive');
  });

  it('只有 d = 4 配得出來，每種配對都用完 12 個數', () => {
    expect(blockerFor(4)).toBeNull();
    const all = pairingsFor(4);
    expect(all.length).toBeGreaterThan(0);
    for (const pairing of all) {
      const idx = pairing.flat().sort((a, b) => a - b);
      expect(idx).toEqual([...Array(12).keys()]);
      expect(pairing.map(([a, b]) => ROWS[a] + ROWS[b])).toEqual(targetSums(4));
    }
    expect(pairingsFor(2)).toEqual([]);
    expect(pairingsFor(6)).toEqual([]);
  });
});
