import { choose } from '../../curve/modules/combinatorial-path-counting/geometry';

export type CombinationMode = 'pascal' | 'path' | 'recurrence';

type RecurrenceParams = {
  n: number;
  k: number;
};

type CatalanContrast = {
  totalBalanced: number;
  legal: number;
  restrictedOut: number;
};

type ModeStatsInput = {
  mode: CombinationMode;
  pascal: { n: number; k: number; prime: number };
  path: { m: number; n: number };
  recurrence: RecurrenceParams;
};

function fmt(value: number, locale?: 'en'): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-TW').format(value);
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function safeChoose(n: number, k: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  const safeN = Math.max(0, Math.round(n));
  const safeK = Math.round(k);
  if (safeK < 0 || safeK > safeN) return 0;
  return choose(safeN, safeK);
}

function coefficientLabel(n: number, k: number, locale?: 'en'): string {
  const safeN = Math.max(0, Math.round(n));
  const safeK = clampInt(k, 0, safeN);
  return `C(${safeN}, ${safeK}) = ${fmt(safeChoose(safeN, safeK), locale)}`;
}

function pathCombinationLabel(m: number, n: number, locale?: 'en'): string {
  const safeM = Math.max(0, Math.round(m));
  const safeN = Math.max(0, Math.round(n));
  const total = safeM + safeN;
  const count = fmt(safeChoose(total, safeM), locale);
  if (locale === 'en') return `Path count C(${total}, ${safeM}) = ${count}`;
  return `路徑總數 C(${total}, ${safeM}) = ${count}`;
}

export function recurrenceParts(n: number, k: number): {
  left: number;
  right: number;
  total: number;
} {
  const safeN = Math.max(0, Math.round(n));
  const safeK = clampInt(k, 0, safeN);
  return {
    left: safeChoose(safeN - 1, safeK - 1),
    right: safeChoose(safeN - 1, safeK),
    total: safeChoose(safeN, safeK),
  };
}

export function recurrenceFormulaLabel(n: number, k: number, locale?: 'en'): string {
  const safeN = Math.max(0, Math.round(n));
  const safeK = clampInt(k, 0, safeN);
  const parts = recurrenceParts(safeN, safeK);

  if (safeN === 0) return `C(0, 0) = ${fmt(parts.total, locale)}`;
  if (safeK === 0) {
    return `C(${safeN}, 0) = C(${safeN - 1}, 0) = ${fmt(parts.total, locale)}`;
  }
  if (safeK === safeN) {
    return `C(${safeN}, ${safeN}) = C(${safeN - 1}, ${safeN - 1}) = ${fmt(parts.total, locale)}`;
  }

  return `C(${safeN}, ${safeK}) = C(${safeN - 1}, ${safeK - 1}) + C(${safeN - 1}, ${safeK}) = ${fmt(parts.left, locale)} + ${fmt(parts.right, locale)}`;
}

export function catalanContrast(n: number): CatalanContrast {
  const safeN = Math.max(0, Math.round(n));
  const totalBalanced = safeChoose(2 * safeN, safeN);
  const legal = Math.round(totalBalanced / (safeN + 1));
  return {
    totalBalanced,
    legal,
    restrictedOut: totalBalanced - legal,
  };
}

export function buildCombinationStats(input: ModeStatsInput, locale?: 'en'): string[] {
  if (input.mode === 'pascal') {
    const label = coefficientLabel(input.pascal.n, input.pascal.k, locale);
    if (locale === 'en') {
      return [
        'View: coefficient table',
        `${label}, a binomial coefficient`,
        'The same number also counts a choice of positions.',
      ];
    }
    return [
      '目前表徵：係數表',
      `${label}，也是二項式係數`,
      `同一數也可讀成選步位置。`,
    ];
  }

  if (input.mode === 'path') {
    if (locale === 'en') {
      return [
        'View: path model',
        pathCombinationLabel(input.path.m, input.path.n, locale),
        `The same number is also in row ${input.path.m + input.path.n} of Pascal's triangle.`,
      ];
    }
    return [
      '目前表徵：路徑模型',
      pathCombinationLabel(input.path.m, input.path.n),
      `同一數也在帕斯卡第 ${input.path.m + input.path.n} 列。`,
    ];
  }

  const parts = recurrenceParts(input.recurrence.n, input.recurrence.k);
  if (locale === 'en') {
    return [
      'View: recurrence',
      recurrenceFormulaLabel(input.recurrence.n, input.recurrence.k, locale),
      parts.left === 0 || parts.right === 0
        ? 'A boundary cell has only one parent.'
        : 'This number is the two cells of the previous row added together.',
    ];
  }
  return [
    '目前表徵：遞迴依賴',
    recurrenceFormulaLabel(input.recurrence.n, input.recurrence.k),
    parts.left === 0 || parts.right === 0
      ? `邊界格只有一個合法父格。`
      : `這個數由上一列兩格相加。`,
  ];
}
