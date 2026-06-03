import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const EXP_VIEW = {
  width: 720,
  height: 720,
};

export const EXP_PLOT = {
  x: 56,
  y: 88,
  w: 608,
  h: 544,
};

export const MODE_GROWTH = 0;
export const MODE_DECAY = 1;

export const EXP_REVEAL_SPEED = 0.035;

export type ExponentialMode = 'growth' | 'decay';

export type ExponentialPlotPoint = {
  x: number;
  y: number;
};

export type ExponentialState = {
  mode: ExponentialMode;
  logScale: boolean;
  tangentMode: boolean;
  C: number;
  k: number;
  kAbs: number;
  tMax: number;
  t0: number;
  y0: number;
  timeScale: number;
  slope: number;
  halfLife: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function exponentialModeFromValue(value: number | undefined): ExponentialMode {
  return Math.round(value ?? MODE_GROWTH) === MODE_DECAY ? 'decay' : 'growth';
}

export function deriveExponentialState(params: ParamValues): ExponentialState {
  const mode = exponentialModeFromValue(params.mode);
  const logScale = (params.logScale ?? 0) !== 0;
  const tangentMode = (params.tangentMode ?? 0) !== 0;
  const C = params.c ?? 1.4;
  const kAbs = params.kAbs ?? 0.32;
  const k = mode === 'growth' ? kAbs : -kAbs;
  const timeScale = Math.log(2) / kAbs;
  const tMax = clamp(timeScale * 5.2, 5.5, 12);
  const t0 = (params.tNorm ?? 0.42) * tMax;
  const y0 = C * Math.exp(k * t0);

  return {
    mode,
    logScale,
    tangentMode,
    C,
    k,
    kAbs,
    tMax,
    t0,
    y0,
    timeScale,
    slope: k * y0,
    halfLife: timeScale,
  };
}

export function mapExponentialT(t: number, data: ExponentialState): number {
  const p = EXP_PLOT;
  return p.x + (t / data.tMax) * p.w;
}

export function mapExponentialY(y: number, data: ExponentialState): number {
  const p = EXP_PLOT;

  if (data.logScale) {
    const yStart = data.C;
    const yEnd = data.C * Math.exp(data.k * data.tMax);
    let minLog = Math.min(Math.log(yStart), Math.log(yEnd));
    let maxLog = Math.max(Math.log(yStart), Math.log(yEnd));
    const pad = Math.max(0.35, (maxLog - minLog) * 0.08);
    minLog -= pad;
    maxLog += pad;
    return (
      p.y +
      p.h -
      ((Math.log(Math.max(y, 0.0001)) - minLog) / (maxLog - minLog)) * p.h
    );
  }

  const yMax =
    data.mode === 'growth'
      ? data.C * Math.exp(data.k * data.tMax) * 1.08
      : data.C * 1.18;

  return p.y + p.h - (y / yMax) * p.h;
}

export function buildExponentialCurvePoints(
  data: ExponentialState,
  samples = 360,
): ExponentialPlotPoint[] {
  const pts: ExponentialPlotPoint[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * data.tMax;
    const y = data.C * Math.exp(data.k * t);
    pts.push({
      x: mapExponentialT(t, data),
      y: mapExponentialY(y, data),
    });
  }
  return pts;
}

export function buildExponentialThumbnail(): ThumbnailSpec {
  const growth = buildThumbnailExpCurve('growth', 130);
  const decay = buildThumbnailExpCurve('decay', 130);
  const guide: CurvePoint[] = [
    { x: EXP_PLOT.x, y: EXP_PLOT.y + EXP_PLOT.h * 0.78, theta: 0, arcLength: 0 },
    { x: EXP_PLOT.x + EXP_PLOT.w, y: EXP_PLOT.y + EXP_PLOT.h * 0.78, theta: 1, arcLength: 1 },
  ];

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: guide,
        stroke: 'rgba(255, 255, 255, 0.28)',
        strokeWidth: 0.8,
        opacity: 0.65,
      },
      {
        points: growth,
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.35,
        opacity: 0.95,
      },
      {
        points: decay,
        stroke: 'rgba(130, 170, 220, 0.72)',
        strokeWidth: 1.05,
        opacity: 0.9,
      },
    ],
  };
}

function buildThumbnailExpCurve(mode: ExponentialMode, samples: number): CurvePoint[] {
  const points: CurvePoint[] = [];
  const strength = 3.4;
  const max = Math.exp(strength) - 1;

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const x = EXP_PLOT.x + t * EXP_PLOT.w;
    const yNorm =
      mode === 'growth'
        ? (Math.exp(strength * t) - 1) / max
        : Math.exp(-strength * t);
    const y = EXP_PLOT.y + EXP_PLOT.h - yNorm * EXP_PLOT.h * 0.88 - EXP_PLOT.h * 0.06;
    points.push({ x, y, theta: i, arcLength: i });
  }

  return points;
}
