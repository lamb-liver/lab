import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const PASCAL_VIEW = {
  width: 900,
  height: 900,
};

export const PASCAL_ROWS_MIN = 1;
export const PASCAL_ROWS_MAX = 42;
export const PASCAL_PRIMES = [2, 3, 5, 7] as const;

export type PascalCell = {
  n: number;
  k: number;
  x: number;
  y: number;
  r: number;
  value: number;
};

export type PascalFrameData = {
  rows: number;
  prime: number;
  pascalMod: number[][];
  cellMap: PascalCell[][];
};

export function normalizeRows(value: number | undefined): number {
  const rounded = Math.round(value ?? 24);
  return Math.max(PASCAL_ROWS_MIN, Math.min(PASCAL_ROWS_MAX, rounded));
}

export function normalizePrime(value: number | undefined): number {
  const rounded = Math.round(value ?? 2);
  if (PASCAL_PRIMES.includes(rounded as (typeof PASCAL_PRIMES)[number])) return rounded;
  return 2;
}

export function buildPascalMod(rows: number, prime: number): number[][] {
  const table: number[][] = [];
  for (let n = 0; n <= rows; n += 1) {
    const row: number[] = [];
    for (let k = 0; k <= n; k += 1) {
      if (k === 0 || k === n) row.push(1 % prime);
      else row.push((table[n - 1]![k - 1]! + table[n - 1]![k]!) % prime);
    }
    table.push(row);
  }
  return table;
}

export function buildPascalFrameData(params: ParamValues): PascalFrameData {
  const rows = normalizeRows(params.rows);
  const prime = normalizePrime(params.prime);
  const pascalMod = buildPascalMod(rows, prime);

  const topY = 125;
  const bottomPadding = 70;
  const availableH = PASCAL_VIEW.height - topY - bottomPadding;
  const availableW = PASCAL_VIEW.width - 120;
  const stepX = availableW / (rows + 1);
  const stepY = availableH / Math.max(rows, 1);
  const gap = Math.min(stepX, stepY);
  const r = Math.max(3.2, Math.min(13, gap * 0.34));

  const cellMap: PascalCell[][] = [];
  for (let n = 0; n <= rows; n += 1) {
    const row: PascalCell[] = [];
    for (let k = 0; k <= n; k += 1) {
      const x = PASCAL_VIEW.width / 2 + (k - n / 2) * gap;
      const y = topY + n * gap * 0.88;
      row.push({ n, k, x, y, r, value: pascalMod[n]![k]! });
    }
    cellMap.push(row);
  }

  return {
    rows,
    prime,
    pascalMod,
    cellMap,
  };
}

export function buildDependencyCone(n: number, k: number): Set<string> {
  const highlight = new Set<string>();
  for (let i = 0; i <= n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      if (j <= k && k - j <= n - i) highlight.add(cellKey(i, j));
    }
  }
  return highlight;
}

export function pickCellAtWorld(
  cellMap: PascalCell[][],
  x: number,
  y: number,
): { n: number; k: number } | null {
  for (const row of cellMap) {
    for (const cell of row) {
      const dx = x - cell.x;
      const dy = y - cell.y;
      if (dx * dx + dy * dy < (cell.r * 1.8) * (cell.r * 1.8)) return { n: cell.n, k: cell.k };
    }
  }
  return null;
}

export function cellKey(n: number, k: number): string {
  return `${n}:${k}`;
}

export function buildPascalThumbnail(params: ParamValues): ThumbnailSpec {
  const data = buildPascalFrameData({ ...params, rows: 24, prime: normalizePrime(params.prime) });
  const points: CurvePoint[] = [];

  for (const row of data.cellMap) {
    for (const cell of row) {
      if (cell.value === 0) continue;
      points.push(
        { x: cell.x, y: cell.y, theta: cell.n, arcLength: 0 },
        { x: cell.x + 0.01, y: cell.y, theta: cell.n, arcLength: 0.01 },
        { x: Number.NaN, y: Number.NaN, theta: cell.n, arcLength: 0.01 },
      );
    }
  }

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points,
        opacity: 0.84,
        strokeWidth: 0.72,
      },
    ],
  };
}
