import { describe, expect, it } from 'vitest';
import {
  buildCatalanNumbers,
  choose,
  generateDyckWords,
  generateTriangulations,
  matchParentheses,
} from './geometry';

describe('catalan-numbers 幾何', () => {
  it('遞迴產生正確的 Catalan 數', () => {
    expect(buildCatalanNumbers(6)).toEqual([1, 1, 2, 5, 14, 42, 132]);
  });

  it('choose 為二項係數', () => {
    expect(choose(5, 2)).toBe(10);
    expect(choose(10, 0)).toBe(1);
    expect(choose(10, 10)).toBe(1);
    // Catalan 閉式：C_n = C(2n, n) / (n + 1)
    expect(choose(8, 4) / 5).toBe(14);
  });

  it('Dyck words 個數為 C_n 且皆平衡', () => {
    const words = generateDyckWords(3);
    expect(words).toHaveLength(5);
    for (const word of words) {
      const pairs = matchParentheses(word);
      expect(pairs).toHaveLength(3);
    }
  });

  it('凸多邊形三角剖分個數為 C_{n-2}，且每個剖分含 n−2 個三角形', () => {
    const hexagon = generateTriangulations(6);
    expect(hexagon).toHaveLength(14);
    for (const triangulation of hexagon) {
      expect(triangulation).toHaveLength(4);
    }
  });
});
