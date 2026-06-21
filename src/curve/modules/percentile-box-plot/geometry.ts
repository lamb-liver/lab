import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export type BoxplotParams = {
  n: number;
  spread: number;
  skew: number;
  fenceK: number;
};

export type BoxplotSummary = {
  sorted: number[];
  q1: number;
  q2: number;
  q3: number;
  p10: number;
  p90: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  whiskerLow: number;
  whiskerHigh: number;
  outliers: number[];
};

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const BOXPLOT_VIEW = { width: 720, height: 720 };
export const BOXPLOT_PLOT: PlotRect = { x: 70, y: 82, w: 580, h: 548 };

export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function paramsFromValues(params: ParamValues): BoxplotParams {
  return {
    n: Math.round(params.n ?? 15),
    spread: params.spread ?? 1,
    skew: params.skew ?? 0.25,
    fenceK: params.fenceK ?? 1.5,
  };
}

export function createBoxplotValues(params: BoxplotParams): number[] {
  const values: number[] = [];

  for (let i = 0; i < params.n; i += 1) {
    const t = params.n === 1 ? 0.5 : i / (params.n - 1);
    const base = 5 + (t - 0.5) * 5.8 * params.spread;
    const wave = 0.42 * Math.sin(i * 1.73 + 0.4) + 0.24 * Math.cos(i * 2.61);
    const skewTerm = params.skew * (t * t - 0.28) * 3.2;
    values.push(clamp(base + wave + skewTerm, 0.2, 9.8));
  }

  if (params.n >= 12) {
    values[0] = clamp(0.9 - params.spread * 0.2, 0.2, 9.8);
    values[values.length - 1] = clamp(9.15 + params.skew * 0.35, 0.2, 9.8);
  }

  return values;
}

export function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 0) return 0;
  if (n === 1) return sorted[0];

  const rank = (p / 100) * (n - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  const t = rank - lo;
  return sorted[lo] + (sorted[hi] - sorted[lo]) * t;
}

export function boxSummary(values: number[], fenceK: number): BoxplotSummary {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 25);
  const q2 = percentile(sorted, 50);
  const q3 = percentile(sorted, 75);
  const p10 = percentile(sorted, 10);
  const p90 = percentile(sorted, 90);
  const iqr = q3 - q1;
  const lowerFence = q1 - fenceK * iqr;
  const upperFence = q3 + fenceK * iqr;
  const inside = sorted.filter((v) => v >= lowerFence && v <= upperFence);

  return {
    sorted,
    q1,
    q2,
    q3,
    p10,
    p90,
    iqr,
    lowerFence,
    upperFence,
    whiskerLow: inside.length ? inside[0] : (sorted[0] ?? 0),
    whiskerHigh: inside.length ? inside[inside.length - 1] : (sorted[sorted.length - 1] ?? 0),
    outliers: sorted.filter((v) => v < lowerFence || v > upperFence),
  };
}

export function sortedValuesWithIndex(values: number[]) {
  return values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value);
}

export function shiftValues(values: number[], delta: number): number[] {
  return values.map((v) => clamp(v + delta, 0, 10));
}

export function stretchValues(values: number[], factor: number): number[] {
  const med = percentile(values, 50);
  return values.map((v) => clamp(med + (v - med) * factor, 0, 10));
}

export function valueToCanvas(plot: PlotRect, v: number): number {
  return plot.x + (v / 10) * plot.w;
}

export function canvasToValue(plot: PlotRect, x: number): number {
  return clamp(((x - plot.x) / plot.w) * 10, 0, 10);
}

export function hitPlot(plot: PlotRect, x: number, y: number): boolean {
  return x >= plot.x && x <= plot.x + plot.w && y >= plot.y && y <= plot.y + plot.h;
}

export function boxplotViewTransform(width: number, height: number) {
  const scale = Math.min(width / BOXPLOT_VIEW.width, height / BOXPLOT_VIEW.height);
  return {
    scale,
    ox: (width - BOXPLOT_VIEW.width * scale) / 2,
    oy: (height - BOXPLOT_VIEW.height * scale) / 2,
  };
}

export function screenToBoxplotView(width: number, height: number, x: number, y: number) {
  const t = boxplotViewTransform(width, height);
  return {
    x: (x - t.ox) / t.scale,
    y: (y - t.oy) / t.scale,
  };
}

export function buildPercentileBoxPlotThumbnail(): ThumbnailSpec {
  const values = createBoxplotValues({ n: 15, spread: 1, skew: 0.25, fenceK: 1.5 });
  const summary = boxSummary(values, 1.5);
  const y = BOXPLOT_PLOT.y + BOXPLOT_PLOT.h * 0.38;
  const boxH = 72;
  const axisY = BOXPLOT_PLOT.y + BOXPLOT_PLOT.h * 0.75;

  const xLow = valueToCanvas(BOXPLOT_PLOT, summary.whiskerLow);
  const xHigh = valueToCanvas(BOXPLOT_PLOT, summary.whiskerHigh);
  const xQ1 = valueToCanvas(BOXPLOT_PLOT, summary.q1);
  const xQ2 = valueToCanvas(BOXPLOT_PLOT, summary.q2);
  const xQ3 = valueToCanvas(BOXPLOT_PLOT, summary.q3);

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: [
          { x: BOXPLOT_PLOT.x, y: axisY },
          { x: BOXPLOT_PLOT.x + BOXPLOT_PLOT.w, y: axisY },
        ].map(toCurvePoint),
        stroke: 'rgb(255, 255, 255)',
        strokeWidth: 0.8,
        opacity: 0.16,
      },
      {
        points: [
          { x: xLow, y },
          { x: xHigh, y },
        ].map(toCurvePoint),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.6,
        opacity: 0.9,
      },
      {
        points: [
          { x: xQ1, y: y - boxH / 2 },
          { x: xQ3, y: y - boxH / 2 },
          { x: xQ3, y: y + boxH / 2 },
          { x: xQ1, y: y + boxH / 2 },
        ].map(toCurvePoint),
        closed: true,
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.4,
        fill: 'rgb(212, 184, 122)',
        opacity: 0.42,
      },
      {
        points: [
          { x: xQ2, y: y - boxH * 0.58 },
          { x: xQ2, y: y + boxH * 0.58 },
        ].map(toCurvePoint),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 2,
        opacity: 0.95,
      },
    ],
    circles: values.map((value, i) => ({
      x: valueToCanvas(BOXPLOT_PLOT, value),
      y: axisY - 20 + (i % 3) * 10,
      r: summary.outliers.includes(value) ? 4.8 : 3.6,
      fill: summary.outliers.includes(value) ? 'rgb(231, 111, 81)' : 'rgb(255, 255, 255)',
      opacity: summary.outliers.includes(value) ? 0.9 : 0.55,
    })),
  };
}

function toCurvePoint(point: { x: number; y: number }, i: number): CurvePoint {
  return { x: point.x, y: point.y, theta: i, arcLength: i };
}
