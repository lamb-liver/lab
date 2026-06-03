import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const BASEL_VIEW = {
  width: 900,
  height: 900,
};

export const PI2_OVER_6 = (Math.PI * Math.PI) / 6;
export const GAMMA = 0.5772156649;

export const MODE_PARTIAL = 0;
export const MODE_AREA = 1;
export const MODE_COMPARE = 2;
export const MODE_EULER = 3;
export const MODE_PSERIES = 4;
export const MODE_PARAM = 5;

export type BaselMode = 'partial' | 'area' | 'compare' | 'euler' | 'pseries' | 'param';

export type ChartBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SeriesPoint = {
  n: number;
  x: number;
  y: number;
  sum: number;
};

export type AreaSquare = {
  n: number;
  x: number;
  y: number;
  size: number;
  area: number;
};

export type CompareSeries = {
  harmonic: SeriesPoint[];
  basel: SeriesPoint[];
  geometric: SeriesPoint[];
  hMax: number;
  bMax: number;
  gMax: number;
};

export type SincPoint = {
  x: number;
  y: number;
};

export type ZeroMarker = {
  n: number;
  x: number;
  sign: 1 | -1;
  term: number;
};

const CHART_PAD_X = 92;
const CHART_PAD_TOP = 98;
const CHART_PAD_BOTTOM = 118;

export function baselModeFromValue(value: number | undefined): BaselMode {
  const mode = Math.round(value ?? MODE_PARTIAL);
  if (mode === MODE_AREA) return 'area';
  if (mode === MODE_COMPARE) return 'compare';
  if (mode === MODE_EULER) return 'euler';
  if (mode === MODE_PSERIES) return 'pseries';
  if (mode === MODE_PARAM) return 'param';
  return 'partial';
}

export function chartBounds(): ChartBounds {
  return {
    x: CHART_PAD_X,
    y: CHART_PAD_TOP,
    width: BASEL_VIEW.width - CHART_PAD_X * 2,
    height: BASEL_VIEW.height - CHART_PAD_TOP - CHART_PAD_BOTTOM,
  };
}

export function buildPartialSeries(params: ParamValues, revealProgress = 1): {
  points: SeriesPoint[];
  limit: number;
  sum: number;
} {
  const N = normalizeN(params.N);
  const p = params.p ?? 2;
  const bounds = chartBounds();
  const limit = estimateLimit(p, N) ?? Math.log(N) + 2;
  let sum = 0;
  const points: SeriesPoint[] = [];

  for (let n = 1; n <= N; n += 1) {
    const progress = termReveal(revealProgress, n, N);
    sum += (1 / Math.pow(n, p)) * progress;
    points.push({
      n,
      sum,
      x: bounds.x + mapRange(n, 1, N, 0, bounds.width),
      y: bounds.y + mapRange(sum, 0, limit, bounds.height, 0),
    });
  }

  return { points, limit, sum };
}

export function buildAreaSquares(params: ParamValues, revealProgress = 1): {
  squares: AreaSquare[];
  sum: number;
} {
  const N = normalizeN(params.N);
  const p = params.p ?? 2;
  const maxWidth = BASEL_VIEW.width - 150;
  const baseX = 78;
  let rowY = BASEL_VIEW.height - 112;
  let x = baseX;
  let rowHeight = 0;
  let rowWidth = 0;
  let sum = 0;
  const squares: AreaSquare[] = [];

  for (let n = 1; n <= N; n += 1) {
    const progress = termReveal(revealProgress, n, N);
    const area = 1 / Math.pow(n, p);
    const targetSize = Math.sqrt(area) * Math.min(190, maxWidth / 5);
    const size = targetSize * Math.sqrt(progress);

    if (rowWidth + size > maxWidth) {
      rowY -= rowHeight + 12;
      x = baseX;
      rowHeight = 0;
      rowWidth = 0;
    }

    squares.push({
      n,
      x,
      y: rowY - size,
      size,
      area,
    });
    x += size + 4;
    rowWidth += size + 4;
    rowHeight = Math.max(rowHeight, size);
    sum += area * progress;
  }

  return { squares, sum };
}

export function buildCompareSeries(params: ParamValues, revealProgress = 1): CompareSeries {
  const N = normalizeN(params.N);
  const bounds = chartBounds();
  const hMax = Math.log(N) + GAMMA + 0.5;
  const bMax = PI2_OVER_6 * 1.05;
  const gMax = 2.05;
  let h = 0;
  let b = 0;
  let g = 0;
  const harmonic: SeriesPoint[] = [];
  const basel: SeriesPoint[] = [];
  const geometric: SeriesPoint[] = [];

  for (let n = 1; n <= N; n += 1) {
    const progress = termReveal(revealProgress, n, N);
    h += (1 / n) * progress;
    b += (1 / (n * n)) * progress;
    g += (1 / Math.pow(2, n - 1)) * progress;
    const x = bounds.x + mapRange(n, 1, N, 0, bounds.width);
    harmonic.push({ n, sum: h, x, y: bounds.y + mapRange(h, 0, hMax, bounds.height, 0) });
    basel.push({ n, sum: b, x, y: bounds.y + mapRange(b, 0, bMax, bounds.height, 0) });
    geometric.push({ n, sum: g, x, y: bounds.y + mapRange(g, 0, gMax, bounds.height, 0) });
  }

  return { harmonic, basel, geometric, hMax, bMax, gMax };
}

export function buildSincCurve(params: ParamValues, revealProgress = 1): {
  curve: SincPoint[];
  zeros: ZeroMarker[];
  partialFill: Array<{ n: number; x: number; width: number; term: number }>;
  sum: number;
} {
  const N = normalizeN(params.N);
  const p = params.p ?? 2;
  const centerX = BASEL_VIEW.width * 0.5;
  const midY = BASEL_VIEW.height * 0.39;
  const xRange = (N + 1) * Math.PI;
  const scaleX = (BASEL_VIEW.width - 150) / (xRange * 2);
  const scaleY = BASEL_VIEW.height * 0.18;
  const steps = Math.floor(600 * revealProgress);
  const curve: SincPoint[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / 600;
    const xValue = mapRange(t, 0, 1, -xRange, xRange);
    const yValue = Math.abs(xValue) < 1e-8 ? 1 : Math.sin(xValue) / xValue;
    curve.push({
      x: centerX + xValue * scaleX,
      y: midY - yValue * scaleY,
    });
  }

  const maxZeros = Math.min(N, Math.floor((BASEL_VIEW.width / 2 - 90) / (Math.PI * scaleX)));
  const zeros: ZeroMarker[] = [];
  const partialFill: Array<{ n: number; x: number; width: number; term: number }> = [];
  let sum = 0;
  let fillX = 92;
  const fillWidth = BASEL_VIEW.width - 184;

  for (let n = 1; n <= maxZeros; n += 1) {
    const progress = termReveal(revealProgress, n, maxZeros);
    if (progress <= 0) continue;
    const term = 1 / Math.pow(n, p);
    for (const sign of [1, -1] as const) {
      zeros.push({
        n,
        sign,
        term,
        x: centerX + sign * n * Math.PI * scaleX,
      });
    }
    const width = (term / PI2_OVER_6) * fillWidth * progress;
    partialFill.push({ n, x: fillX, width, term });
    fillX += width;
    sum += term * progress;
  }

  return { curve, zeros, partialFill, sum };
}

export function buildBaselThumbnail(params: ParamValues): ThumbnailSpec {
  const series = buildPartialSeries({ ...params, p: 2 }, 1);
  const sinc = buildSincCurve({ ...params, p: 2 }, 1);
  const fillPaths = sinc.partialFill.slice(0, 8).map((fill, index) => ({
    points: rectPoints(fill.x, BASEL_VIEW.height - 166, fill.width, 56, index * 10),
    closed: true,
    fill: index === 0 ? 'rgba(212, 184, 122, 0.32)' : 'rgba(212, 184, 122, 0.18)',
    stroke: 'rgba(212, 184, 122, 0.58)',
    strokeWidth: 0.55,
    opacity: 0.9,
  }));
  return {
    coordinateSystem: 'canvas',
    paths: [
      ...fillPaths,
      {
        points: pointsToCurvePoints(series.points),
        opacity: 1,
        strokeWidth: 1.28,
      },
      {
        points: pointsToCurvePoints([
          { x: chartBounds().x, y: chartBounds().y + mapRange(PI2_OVER_6, 0, series.limit, chartBounds().height, 0) },
          {
            x: chartBounds().x + chartBounds().width,
            y: chartBounds().y + mapRange(PI2_OVER_6, 0, series.limit, chartBounds().height, 0),
          },
        ]),
        opacity: 0.35,
        strokeWidth: 0.8,
      },
    ],
  };
}

function rectPoints(x: number, y: number, w: number, h: number, t: number): CurvePoint[] {
  return [
    { x, y, theta: t, arcLength: t },
    { x: x + w, y, theta: t + 1, arcLength: t + 1 },
    { x: x + w, y: y + h, theta: t + 2, arcLength: t + 2 },
    { x, y: y + h, theta: t + 3, arcLength: t + 3 },
  ];
}

export function calculateBaselStats(params: ParamValues, revealProgress = 1): {
  sum: number;
  error: number | null;
  relErr: number | null;
  limit: number | null;
} {
  const p = params.p ?? 2;
  const { sum } = buildPartialSeries(params, revealProgress);
  if (Math.abs(p - 2) < 1e-6) {
    const error = Math.abs(sum - PI2_OVER_6);
    return {
      sum,
      error,
      relErr: (error / PI2_OVER_6) * 100,
      limit: PI2_OVER_6,
    };
  }
  return {
    sum,
    error: null,
    relErr: null,
    limit: estimateLimit(p, normalizeN(params.N)),
  };
}

export function estimateLimit(p: number, N = 80): number | null {
  if (Math.abs(p - 2) < 1e-6) return PI2_OVER_6;
  if (p <= 1) return null;
  let sum = 0;
  const maxN = Math.max(5000, N * 50);
  for (let n = 1; n <= maxN; n += 1) {
    sum += 1 / Math.pow(n, p);
  }
  return sum;
}

export function normalizeN(value: number | undefined): number {
  return Math.max(2, Math.min(80, Math.round(value ?? 12)));
}

export function termReveal(revealProgress: number, n: number, N: number): number {
  return clamp01(revealProgress * N - (n - 1));
}

function pointsToCurvePoints(points: Array<{ x: number; y: number }>): CurvePoint[] {
  let cumulative = 0;
  let prev = points[0];
  return points.map((point, index) => {
    if (index > 0 && prev) {
      cumulative += Math.hypot(point.x - prev.x, point.y - prev.y);
    }
    prev = point;
    return {
      x: point.x,
      y: point.y,
      theta: index,
      arcLength: cumulative,
    };
  });
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
