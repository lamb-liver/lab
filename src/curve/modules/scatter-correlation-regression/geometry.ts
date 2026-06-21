import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export type ScatterPoint = {
  x: number;
  y: number;
};

export type ScatterRegressionParams = {
  n: number;
  beta: number;
  curve: number;
  noise: number;
};

export type RegressionFit = {
  xbar: number;
  ybar: number;
  r: number;
  a: number;
  b: number;
  rss: number;
};

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const SCATTER_VIEW = { width: 720, height: 720 };
export const SCATTER_PLOT: PlotRect = { x: 70, y: 78, w: 580, h: 560 };

export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function paramsFromValues(params: ParamValues): ScatterRegressionParams {
  return {
    n: Math.round(params.n ?? 12),
    beta: params.beta ?? 0.72,
    curve: params.curve ?? 0,
    noise: params.noise ?? 0.85,
  };
}

export function createScatterPoints(params: ScatterRegressionParams): ScatterPoint[] {
  const points: ScatterPoint[] = [];

  for (let i = 0; i < params.n; i += 1) {
    const t = params.n === 1 ? 0.5 : i / (params.n - 1);
    const x = 1.05 + 7.9 * t + 0.22 * Math.sin(i * 2.41 + 0.7);
    const dx = x - 5;
    const y =
      5 +
      params.beta * dx +
      params.curve * (dx * dx - 7.2) * 0.42 +
      params.noise * (0.72 * Math.sin(i * 2.17 + 1.1) + 0.36 * Math.cos(i * 3.43));

    points.push({ x: clamp(x, 0.35, 9.65), y: clamp(y, 0.35, 9.65) });
  }

  return points;
}

export function regression(points: ScatterPoint[]): RegressionFit | null {
  const n = points.length;
  if (n < 2) return null;

  const xbar = points.reduce((sum, p) => sum + p.x, 0) / n;
  const ybar = points.reduce((sum, p) => sum + p.y, 0) / n;

  let sxx = 0;
  let syy = 0;
  let sxy = 0;

  for (const p of points) {
    const dx = p.x - xbar;
    const dy = p.y - ybar;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }

  const r = sxx <= 1e-9 || syy <= 1e-9 ? 0 : clamp(sxy / Math.sqrt(sxx * syy), -1, 1);
  const b = sxx <= 1e-9 ? 0 : sxy / sxx;
  const a = ybar - b * xbar;
  let rss = 0;

  for (const p of points) {
    const e = p.y - (a + b * p.x);
    rss += e * e;
  }

  return { xbar, ybar, r, a, b, rss };
}

export function translatePoints(points: ScatterPoint[], dx: number, dy: number): ScatterPoint[] {
  return points.map((p) => ({ x: clamp(p.x + dx, 0, 10), y: clamp(p.y + dy, 0, 10) }));
}

export function scaleCloud(points: ScatterPoint[], factor: number): ScatterPoint[] {
  const fit = regression(points);
  if (!fit) return points;

  return points.map((p) => ({
    x: clamp(fit.xbar + (p.x - fit.xbar) * factor, 0, 10),
    y: clamp(fit.ybar + (p.y - fit.ybar) * factor, 0, 10),
  }));
}

export function flipYDirection(points: ScatterPoint[]): ScatterPoint[] {
  return points.map((p) => ({ x: p.x, y: 10 - p.y }));
}

export function worldToCanvas(plot: PlotRect, x: number, y: number): ScatterPoint {
  return {
    x: plot.x + (x / 10) * plot.w,
    y: plot.y + plot.h - (y / 10) * plot.h,
  };
}

export function canvasToWorld(plot: PlotRect, x: number, y: number): ScatterPoint {
  return {
    x: clamp(((x - plot.x) / plot.w) * 10, 0, 10),
    y: clamp(((plot.y + plot.h - y) / plot.h) * 10, 0, 10),
  };
}

export function hitPlot(plot: PlotRect, x: number, y: number): boolean {
  return x >= plot.x && x <= plot.x + plot.w && y >= plot.y && y <= plot.y + plot.h;
}

export function scatterViewTransform(width: number, height: number) {
  const scale = Math.min(width / SCATTER_VIEW.width, height / SCATTER_VIEW.height);
  return {
    scale,
    ox: (width - SCATTER_VIEW.width * scale) / 2,
    oy: (height - SCATTER_VIEW.height * scale) / 2,
  };
}

export function screenToScatterView(width: number, height: number, x: number, y: number): ScatterPoint {
  const t = scatterViewTransform(width, height);
  return {
    x: (x - t.ox) / t.scale,
    y: (y - t.oy) / t.scale,
  };
}

export function buildScatterCorrelationThumbnail(): ThumbnailSpec {
  const params = { n: 14, beta: 0.82, curve: 0.12, noise: 0.55 };
  const points = createScatterPoints(params);
  const fit = regression(points);
  const frame = [
    { x: SCATTER_PLOT.x, y: SCATTER_PLOT.y },
    { x: SCATTER_PLOT.x + SCATTER_PLOT.w, y: SCATTER_PLOT.y },
    { x: SCATTER_PLOT.x + SCATTER_PLOT.w, y: SCATTER_PLOT.y + SCATTER_PLOT.h },
    { x: SCATTER_PLOT.x, y: SCATTER_PLOT.y + SCATTER_PLOT.h },
  ].map(toCurvePoint);
  const line = fit
    ? [
        worldToCanvas(SCATTER_PLOT, 0, clamp(fit.a, 0, 10)),
        worldToCanvas(SCATTER_PLOT, 10, clamp(fit.a + fit.b * 10, 0, 10)),
      ].map(toCurvePoint)
    : [];

  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: frame, closed: true, stroke: 'rgb(255, 255, 255)', strokeWidth: 0.8, opacity: 0.16 },
      { points: line, stroke: 'rgb(212, 184, 122)', strokeWidth: 1.8, opacity: 0.95 },
    ],
    circles: points.map((point) => {
      const c = worldToCanvas(SCATTER_PLOT, point.x, point.y);
      return { x: c.x, y: c.y, r: 4.2, fill: 'rgb(255, 255, 255)', opacity: 0.65 };
    }),
  };
}

function toCurvePoint(point: ScatterPoint, i: number): CurvePoint {
  return { x: point.x, y: point.y, theta: i, arcLength: i };
}
