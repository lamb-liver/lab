import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

/** 兩段長度都落在這個區間，密度的峰才不會被畫面裁掉。 */
export type UniformSumParams = {
  a: number;
  b: number;
};

export const LENGTH_MIN = 0.6;
export const LENGTH_MAX = 2.4;

export const DEFAULT_UNIFORM_SUM_PARAMS: UniformSumParams = {
  a: 1.8,
  b: 0.9,
};

export const VIEW = {
  x0: -0.45,
  x1: 5.2,
  y0: -0.7,
  y1: 2.05,
};

export type PlotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type DensityCorner = { x: number; y: number };

export type UniformSumReading = {
  a: number;
  b: number;
  support: number;
  peak: number;
  flat: number;
  corners: DensityCorner[];
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampUniformSum(params: Partial<UniformSumParams> | ParamValues): UniformSumParams {
  return {
    a: clamp(Number(params.a ?? DEFAULT_UNIFORM_SUM_PARAMS.a), LENGTH_MIN, LENGTH_MAX),
    b: clamp(Number(params.b ?? DEFAULT_UNIFORM_SUM_PARAMS.b), LENGTH_MIN, LENGTH_MAX),
  };
}

/** 和落在 z 的密度。兩段各自均勻且獨立。 */
export function densityAt(a: number, b: number, z: number): number {
  if (z <= 0 || z >= a + b) return 0;
  const shorter = Math.min(a, b);
  const longer = Math.max(a, b);
  if (z <= shorter) return z / (a * b);
  if (z <= longer) return 1 / longer;
  return (a + b - z) / (a * b);
}

export function readUniformSum(params: Partial<UniformSumParams> | ParamValues): UniformSumReading {
  const { a, b } = clampUniformSum(params);
  const shorter = Math.min(a, b);
  const longer = Math.max(a, b);
  const peak = 1 / longer;
  return {
    a,
    b,
    support: a + b,
    peak,
    flat: longer - shorter,
    corners: [
      { x: 0, y: 0 },
      { x: shorter, y: peak },
      { x: longer, y: peak },
      { x: a + b, y: 0 },
    ],
  };
}

export function plotRect(width: number, height: number): PlotRect {
  const pad = 22;
  return {
    left: pad,
    top: pad,
    width: Math.max(1, width - pad * 2),
    height: Math.max(1, height - pad * 2),
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

export function sampleUniformSumThumbnail(params: UniformSumParams): ThumbnailSpec {
  const reading = readUniformSum(params);
  return {
    paths: [
      {
        points: reading.corners.map((corner) => point(corner.x, corner.y)),
        stroke: '#d4b87a',
        strokeWidth: 1.6,
        opacity: 0.95,
      },
      {
        points: [point(0, 0), point(reading.support, 0)],
        stroke: '#ffffff',
        strokeWidth: 1.1,
        opacity: 0.45,
      },
    ],
  };
}
