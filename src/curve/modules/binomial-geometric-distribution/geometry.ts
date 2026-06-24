import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const BINOMIAL_GEOMETRIC_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_BINOMIAL = 0;
export const MODE_GEOMETRIC = 1;

export type DistributionMode = 'binomial' | 'geometric';

export type DistributionRow = {
  k: number;
  label: string;
  prob: number;
  bucket: boolean;
};

export type DistributionData = {
  dist: DistributionMode;
  n: number;
  p: number;
  rows: DistributionRow[];
  mean: number;
  variance: number;
  sigma: number;
  supportLabel: string;
  yMax: number;
};

export function modeFromValue(value: number | undefined): DistributionMode {
  return Math.round(value ?? MODE_BINOMIAL) === MODE_GEOMETRIC ? 'geometric' : 'binomial';
}

export function deriveDistributionData(params: ParamValues): DistributionData {
  const dist = modeFromValue(params.mode);
  const p = clamp((params.p ?? 35) / 100, 0.05, 0.95);
  const n = Math.round(clamp(params.n ?? 12, 2, 30));

  if (dist === 'geometric') {
    const mean = (1 - p) / p;
    const variance = (1 - p) / (p * p);
    const sigma = Math.sqrt(variance);
    const maxK = Math.round(clamp(Math.ceil(mean + 2 * sigma), 12, 60));
    const rows: DistributionRow[] = [];

    for (let k = 0; k < maxK; k += 1) {
      rows.push({
        k,
        label: String(k),
        prob: (1 - p) ** k * p,
        bucket: false,
      });
    }

    rows.push({
      k: maxK,
      label: `>=${maxK}`,
      prob: (1 - p) ** maxK,
      bucket: true,
    });

    return {
      dist,
      n,
      p,
      rows,
      mean,
      variance,
      sigma,
      supportLabel: 'X = 0, 1, 2, ...',
      yMax: getAdaptiveYMax(rows),
    };
  }

  const rows: DistributionRow[] = [];

  for (let k = 0; k <= n; k += 1) {
    rows.push({
      k,
      label: String(k),
      prob: choose(n, k) * p ** k * (1 - p) ** (n - k),
      bucket: false,
    });
  }

  const mean = n * p;
  const variance = n * p * (1 - p);

  return {
    dist,
    n,
    p,
    rows,
    mean,
    variance,
    sigma: Math.sqrt(variance),
    supportLabel: `X = 0, 1, ..., ${n}`,
    yMax: getAdaptiveYMax(rows),
  };
}

export function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNum(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

export function buildBinomialGeometricThumbnail(): ThumbnailSpec {
  const data = deriveDistributionData({ mode: MODE_BINOMIAL, n: 12, p: 35 });
  const bars: CurvePoint[] = [];
  const left = 150;
  const right = 750;
  const baseY = 670;
  const slot = (right - left) / data.rows.length;
  const barW = slot * 0.58;

  data.rows.forEach((row, i) => {
    const cx = left + slot * (i + 0.5);
    const h = (row.prob / data.yMax) * 300;
    bars.push(
      { x: cx - barW / 2, y: baseY, theta: i, arcLength: i },
      { x: cx - barW / 2, y: baseY - h, theta: i + 0.1, arcLength: i + 0.1 },
      { x: cx + barW / 2, y: baseY - h, theta: i + 0.2, arcLength: i + 0.2 },
      { x: cx + barW / 2, y: baseY, theta: i + 0.3, arcLength: i + 0.3 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.4, arcLength: i + 0.4 },
    );
  });

  return {
    coordinateSystem: 'canvas',
    paths: [{ points: bars, opacity: 0.74, strokeWidth: 0.9 }],
  };
}

export function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  const reduced = Math.min(r, n - r);
  let result = 1;

  for (let i = 1; i <= reduced; i += 1) {
    result = (result * (n - reduced + i)) / i;
  }

  return result;
}

function getAdaptiveYMax(rows: DistributionRow[]): number {
  return Math.max(0.16, Math.max(...rows.map((row) => row.prob)) * 1.22);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
