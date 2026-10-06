import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

/** f(x) = 1 + (1/2) sin x，從 0 積到 x 的面積有閉式。 */
export type UpperLimitParams = {
  x: number;
  h: number;
};

export const X_MIN = 0.4;
export const X_MAX = 5;
export const H_MIN = 0.05;
export const H_MAX = 1.2;

export const DEFAULT_UPPER_LIMIT_PARAMS: UpperLimitParams = {
  x: 2.2,
  h: 0.7,
};

/** 畫面座標範圍。x+h 最大是 6.2，留在右緣裡面。 */
export const VIEW = {
  x0: -0.35,
  x1: 6.55,
  y0: -0.4,
  y1: 2.2,
};

export type PlotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function f(x: number): number {
  return 1 + 0.5 * Math.sin(x);
}

/** ∫₀ˣ f = x − (1/2) cos x + 1/2。A(0) = 0。 */
export function area(x: number): number {
  return x - 0.5 * Math.cos(x) + 0.5;
}

export function deltaRatio(x: number, h: number): number {
  return (area(x + h) - area(x)) / h;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampUpperLimit(params: Partial<UpperLimitParams> | ParamValues): UpperLimitParams {
  return {
    x: clamp(Number(params.x ?? DEFAULT_UPPER_LIMIT_PARAMS.x), X_MIN, X_MAX),
    h: clamp(Number(params.h ?? DEFAULT_UPPER_LIMIT_PARAMS.h), H_MIN, H_MAX),
  };
}

export function formatReading(value: number): string {
  return value.toFixed(3);
}

export function plotRect(width: number, height: number): PlotRect {
  const left = 36;
  const right = 16;
  const top = 16;
  const bottom = 28;
  return {
    left,
    top,
    width: Math.max(1, width - left - right),
    height: Math.max(1, height - top - bottom),
  };
}

export function mapX(plot: PlotRect, x: number): number {
  return plot.left + ((x - VIEW.x0) / (VIEW.x1 - VIEW.x0)) * plot.width;
}

export function mapY(plot: PlotRect, y: number): number {
  return plot.top + ((VIEW.y1 - y) / (VIEW.y1 - VIEW.y0)) * plot.height;
}

function point(x: number, y: number): CurvePoint {
  return { x, y, theta: 0, arcLength: 0 };
}

export function sampleUpperLimitThumbnail(params: UpperLimitParams): ThumbnailSpec {
  const steps = 48;
  const areaPath: CurvePoint[] = [point(0, 0)];
  for (let i = 0; i <= steps; i += 1) {
    const t = (params.x * i) / steps;
    areaPath.push(point(t, f(t)));
  }
  areaPath.push(point(params.x, 0));

  const curve: CurvePoint[] = [];
  for (let i = 0; i <= 72; i += 1) {
    const t = (VIEW.x1 * i) / 72;
    curve.push(point(t, f(t)));
  }

  const height = f(params.x);
  const strip = [
    point(params.x, 0),
    point(params.x, height),
    point(params.x + params.h, height),
    point(params.x + params.h, 0),
  ];

  return {
    paths: [
      {
        points: areaPath,
        closed: true,
        fill: '#d4b87a',
        opacity: 0.34,
        stroke: '#d4b87a',
        strokeWidth: 1,
      },
      {
        points: strip,
        closed: true,
        stroke: '#d4b87a',
        strokeWidth: 1.5,
      },
      { points: curve, stroke: '#ffffff', strokeWidth: 1.4 },
    ],
  };
}
