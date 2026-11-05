/**
 * 2026 高考數學新課標 I 卷第 7 題：一百零八塔 12 列的座數
 * 1, 3, 3, 5, 5, 7, 9, 11, 13, 15, 17, 19（和為 108）兩兩分成 6 組，
 * 6 個組和要排成公差 d > 0 的等差數列。組和平均 18，所以首項 b₁ = 18 − 5d/2。
 * 每個數都是奇數，組和都是偶數，d 必須是 4 的倍數；b₁ > 0 又要 d < 7.2，只剩 d = 4。
 */

export const ROWS = [1, 3, 3, 5, 5, 7, 9, 11, 13, 15, 17, 19] as const;
export const TOTAL = ROWS.reduce((s, v) => s + v, 0);
export const D_OPTIONS = [2, 4, 6, 8] as const;
export type DOption = (typeof D_OPTIONS)[number];
export const ANSWER_D: DOption = 4;

/** 公差 d 時 6 個組和 b₁…b₆（由小到大） */
export function targetSums(d: number): number[] {
  const first = TOTAL / 6 - (5 * d) / 2;
  return Array.from({ length: 6 }, (_, i) => first + i * d);
}

/** 一組配對：每對是 ROWS 的兩個索引，依組和由小到大排列 */
export type Pairing = [number, number][];

/** 列出所有能讓組和恰為 targetSums(d) 的配對（同值的數視為不同列，但不重複計算同一種數值配對） */
export function pairingsFor(d: number): Pairing[] {
  const sums = targetSums(d);
  if (sums.some((s) => !Number.isInteger(s) || s <= 0)) return [];
  const out: Pairing[] = [];
  const seen = new Set<string>();
  const used = new Array(ROWS.length).fill(false);
  const pairs: [number, number][] = [];

  const search = (level: number) => {
    if (level === sums.length) {
      const key = pairs.map(([a, b]) => `${ROWS[a]}+${ROWS[b]}`).join('|');
      if (!seen.has(key)) {
        seen.add(key);
        out.push(pairs.map(([a, b]) => [a, b] as [number, number]));
      }
      return;
    }
    const target = sums[level];
    for (let i = 0; i < ROWS.length; i += 1) {
      if (used[i]) continue;
      for (let j = i + 1; j < ROWS.length; j += 1) {
        if (used[j] || ROWS[i] + ROWS[j] !== target) continue;
        used[i] = used[j] = true;
        pairs.push([i, j]);
        search(level + 1);
        pairs.pop();
        used[i] = used[j] = false;
      }
    }
  };
  search(0);
  return out;
}

/** 這個 d 為什麼不行（可行時回傳 null） */
export type Blocker = 'odd-sum' | 'non-positive' | 'no-pairing' | null;

export function blockerFor(d: number): Blocker {
  const sums = targetSums(d);
  if (sums[0] <= 0) return 'non-positive';
  if (sums.some((s) => !Number.isInteger(s) || s % 2 !== 0)) return 'odd-sum';
  return pairingsFor(d).length > 0 ? null : 'no-pairing';
}
