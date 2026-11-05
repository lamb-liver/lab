import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

/** 離開 A、離開 B 的速率。下限避開 0，兩態才有穩態。 */
export type ShareParams = {
  a: number;
  b: number;
};

export const RATE_MIN = 0.05;
export const RATE_MAX = 1;

export const DEFAULT_SHARE_PARAMS: ShareParams = {
  a: 0.2,
  b: 0.6,
};

export const VIEW = {
  x0: -2.7,
  x1: 2.7,
  y0: -0.72,
  y1: 0.95,
};

export const BAR = { x0: -2.35, x1: 2.35, y: 0.04 };
export const ARROW_A_Y = 0.52;
export const ARROW_B_Y = -0.4;
const ARROW_HEAD = 9;

/** 最短速率仍是一個箭頭，再長就沿著線段長出去，最長仍短於線段。 */
export function arrowReach(rate: number, barSpan: number): number {
  const full = Math.max(ARROW_HEAD, barSpan * 0.42);
  const t = (rate - RATE_MIN) / (RATE_MAX - RATE_MIN);
  return ARROW_HEAD + t * (full - ARROW_HEAD);
}

export type PlotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ShareReading = {
  a: number;
  b: number;
  shareA: number;
  shareB: number;
  flow: number;
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampShare(params: Partial<ShareParams> | ParamValues): ShareParams {
  return {
    a: clamp(Number(params.a ?? DEFAULT_SHARE_PARAMS.a), RATE_MIN, RATE_MAX),
    b: clamp(Number(params.b ?? DEFAULT_SHARE_PARAMS.b), RATE_MIN, RATE_MAX),
  };
}

/** π_A = b/(a+b)。流量 a·π_A 與 b·π_B 相等。 */
export function readShare(params: Partial<ShareParams> | ParamValues): ShareReading {
  const { a, b } = clampShare(params);
  const shareA = b / (a + b);
  const shareB = a / (a + b);
  return { a, b, shareA, shareB, flow: a * shareA };
}

export function plotRect(width: number, height: number): PlotRect {
  const pad = 28;
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

export function sampleShareThumbnail(params: ShareParams): ThumbnailSpec {
  const reading = readShare(params);
  const split = BAR.x0 + (BAR.x1 - BAR.x0) * reading.shareA;
  return {
    paths: [
      {
        points: [point(BAR.x0, BAR.y), point(split, BAR.y)],
        stroke: '#d4b87a',
        strokeWidth: 6,
        opacity: 0.95,
      },
      {
        points: [point(split, BAR.y), point(BAR.x1, BAR.y)],
        stroke: '#ffffff',
        strokeWidth: 6,
        opacity: 0.35,
      },
      {
        points: [point(BAR.x0, ARROW_A_Y), point(BAR.x0 + 0.35 + reading.a * 1.5, ARROW_A_Y)],
        stroke: '#d4b87a',
        strokeWidth: 1.6,
        opacity: 0.9,
      },
      {
        points: [point(BAR.x1, ARROW_B_Y), point(BAR.x1 - (0.35 + reading.b * 1.5), ARROW_B_Y)],
        stroke: '#ffffff',
        strokeWidth: 1.6,
        opacity: 0.75,
      },
    ],
  };
}
