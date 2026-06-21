import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const LOGISTIC_VIEW = {
  width: 720,
  height: 720,
};

export const LOGISTIC_CHART = {
  x: 48,
  y: 56,
  w: 624,
  h: 600,
};

export const T_MIN = -4;
export const T_MAX = 12;

export const LOGISTIC_CURVE_REVEAL_SPEED = 0.42;
export const LOGISTIC_CURVE_SMOOTHING = 0.08;

export const SETTLE_EPS = {
  L: 0.35,
  k: 0.004,
  a: 0.035,
};

export type LogisticParams = {
  L: number;
  k: number;
  a: number;
};

export type LogisticStats = {
  y0: number;
  tStar: number;
  yStar: number;
  dyMax: number;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function paramsFromValues(params: ParamValues): LogisticParams {
  return {
    L: params.L ?? 100,
    k: params.k ?? 0.75,
    a: params.a ?? 12,
  };
}

export function getParamSignature(p: LogisticParams): string {
  return `${p.L.toFixed(0)}-${p.k.toFixed(2)}-${p.a.toFixed(1)}`;
}

export function logisticY(t: number, params: LogisticParams): number {
  return params.L / (1 + params.a * Math.exp(-params.k * t));
}

export function safeTAtFraction(p: number, params: LogisticParams): number {
  if (p <= 0 || p >= 1 || params.k <= 0 || params.a <= 0) {
    return Number.NaN;
  }
  return (Math.log(params.a) - Math.log(1 / p - 1)) / params.k;
}

export function deriveLogisticStats(params: LogisticParams): LogisticStats {
  const y0 = params.L / (1 + params.a);
  const tStar = Math.log(params.a) / params.k;
  const yStar = params.L / 2;
  const dyMax = (params.k * params.L) / 4;
  return { y0, tStar, yStar, dyMax };
}

export function paramsSettled(smooth: LogisticParams, target: LogisticParams): boolean {
  return (
    Math.abs(smooth.L - target.L) < SETTLE_EPS.L &&
    Math.abs(smooth.k - target.k) < SETTLE_EPS.k &&
    Math.abs(smooth.a - target.a) < SETTLE_EPS.a
  );
}

export function mapLogisticT(t: number): number {
  const c = LOGISTIC_CHART;
  return c.x + ((t - T_MIN) / (T_MAX - T_MIN)) * c.w;
}

export function mapLogisticY(y: number, L: number): number {
  const c = LOGISTIC_CHART;
  return c.y + c.h - (y / (L * 1.08)) * c.h;
}

export function lerpSmoothParams(
  smooth: LogisticParams,
  target: LogisticParams,
): LogisticParams {
  return {
    L: lerp(smooth.L, target.L, LOGISTIC_CURVE_SMOOTHING),
    k: lerp(smooth.k, target.k, LOGISTIC_CURVE_SMOOTHING),
    a: lerp(smooth.a, target.a, LOGISTIC_CURVE_SMOOTHING),
  };
}

export function buildLogisticCurveThumbnail(): ThumbnailSpec {
  const params = { L: 100, k: 0.75, a: 12 };
  const pts: CurvePoint[] = [];
  for (let i = 0; i <= 120; i += 1) {
    const t = T_MIN + ((T_MAX - T_MIN) * i) / 120;
    pts.push({
      x: mapLogisticT(t),
      y: mapLogisticY(logisticY(t, params), params.L),
      theta: i,
      arcLength: i,
    });
  }
  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: pts,
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.4,
        opacity: 0.92,
      },
    ],
  };
}
