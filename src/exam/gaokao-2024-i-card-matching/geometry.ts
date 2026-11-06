/**
 * 2024 高考數學新課標 I 卷第 14 題：甲有 1、3、5、7，乙有 2、4、6、8，四輪各出一張、比大小，
 * 求甲得分至少 2 的機率。出牌順序不影響得分，只要看「甲的每張牌對上乙的哪一張」，共 4! = 24 種配對，等可能。
 */

export const JIA = [1, 3, 5, 7] as const;
export const YI = [2, 4, 6, 8] as const;

/** 一種配對：perm[i] 是甲第 i 張對上的乙牌索引 */
export type Matching = number[];

function permutations(n: number): number[][] {
  if (n === 1) return [[0]];
  const out: number[][] = [];
  for (const p of permutations(n - 1))
    for (let i = 0; i <= p.length; i += 1) out.push([...p.slice(0, i), n - 1, ...p.slice(i)]);
  return out;
}

export const MATCHINGS: Matching[] = permutations(4).sort((a, b) => a.join('').localeCompare(b.join('')));

export function score(m: Matching): number {
  return m.reduce((s, j, i) => s + (JIA[i] > YI[j] ? 1 : 0), 0);
}

export function distribution(): number[] {
  const d = [0, 0, 0, 0, 0];
  for (const m of MATCHINGS) d[score(m)] += 1;
  return d;
}
