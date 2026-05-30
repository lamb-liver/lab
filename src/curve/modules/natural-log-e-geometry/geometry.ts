import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const NAT_LOG_VIEW = {
  width: 720,
  height: 720,
};

export const NAT_LOG_PLOT = {
  x: 56,
  y: 72,
  w: 608,
  h: 544,
};

export const AREA_VIEW = {
  xMin: 0.25,
  xMax: 5,
  yMin: 0,
  yMax: 2.2,
};

export const INVERSE_VIEW = {
  min: -2,
  max: 5,
};

export const MODE_AREA = 0;
export const MODE_INVERSE = 1;

export const NAT_LOG_REVEAL_SPEED = 0.035;

export type NaturalLogMode = 'area' | 'inverse';

export type NaturalLogPlotPoint = { x: number; y: number };

export type NaturalLogState = {
  mode: NaturalLogMode;
  riemannMode: boolean;
  t: number;
  n: number;
  lnT: number;
  areaAbs: number;
  isPositiveArea: boolean;
  riemannEstimate: number;
};

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

export function naturalLogModeFromValue(value: number | undefined): NaturalLogMode {
  return Math.round(value ?? MODE_AREA) === MODE_INVERSE ? 'inverse' : 'area';
}

export function estimateMidpointRiemann(t: number, n: number): number {
  if (t === 1) return 0;

  const a = Math.min(1, t);
  const b = Math.max(1, t);
  const dx = (b - a) / n;
  let sum = 0;

  for (let i = 0; i < n; i += 1) {
    const x = a + (i + 0.5) * dx;
    sum += (1 / x) * dx;
  }

  return t >= 1 ? sum : -sum;
}

export function deriveNaturalLogState(params: ParamValues): NaturalLogState {
  const mode = naturalLogModeFromValue(params.mode);
  const riemannMode = mode === 'area' && (params.riemannMode ?? 0) !== 0;
  const t = params.t ?? Math.E;
  const n = Math.round(params.n ?? 24);
  const lnT = Math.log(t);

  return {
    mode,
    riemannMode,
    t,
    n,
    lnT,
    areaAbs: Math.abs(lnT),
    isPositiveArea: t >= 1,
    riemannEstimate: estimateMidpointRiemann(t, n),
  };
}

export function mapAreaX(x: number): number {
  const p = NAT_LOG_PLOT;
  const v = AREA_VIEW;
  return p.x + ((x - v.xMin) / (v.xMax - v.xMin)) * p.w;
}

export function mapAreaY(y: number): number {
  const p = NAT_LOG_PLOT;
  const v = AREA_VIEW;
  return p.y + p.h - ((y - v.yMin) / (v.yMax - v.yMin)) * p.h;
}

export function mapInvX(x: number): number {
  const p = NAT_LOG_PLOT;
  const v = INVERSE_VIEW;
  return p.x + ((x - v.min) / (v.max - v.min)) * p.w;
}

export function mapInvY(y: number): number {
  const p = NAT_LOG_PLOT;
  const v = INVERSE_VIEW;
  return p.y + p.h - ((y - v.min) / (v.max - v.min)) * p.h;
}

export function buildReciprocalCurvePoints(samples = 420): NaturalLogPlotPoint[] {
  const pts: NaturalLogPlotPoint[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const x = lerp(AREA_VIEW.xMin, AREA_VIEW.xMax, i / samples);
    pts.push({ x: mapAreaX(x), y: mapAreaY(1 / x) });
  }
  return pts;
}

export function buildNaturalLogThumbnail(): ThumbnailSpec {
  const data = deriveNaturalLogState({
    mode: MODE_AREA,
    t: Math.E,
    n: 24,
    riemannMode: 0,
  });

  const a = Math.min(1, data.t);
  const b = Math.max(1, data.t);
  const fillPts: CurvePoint[] = [];
  fillPts.push({ x: mapAreaX(a), y: mapAreaY(0), theta: 0, arcLength: 0 });
  for (let i = 0; i <= 60; i += 1) {
    const x = lerp(a, b, i / 60);
    fillPts.push({
      x: mapAreaX(x),
      y: mapAreaY(1 / x),
      theta: i + 1,
      arcLength: i + 1,
    });
  }
  fillPts.push({ x: mapAreaX(b), y: mapAreaY(0), theta: 62, arcLength: 62 });

  const curvePts = buildReciprocalCurvePoints(80).map((pt, i) => ({
    x: pt.x,
    y: pt.y,
    theta: i + 100,
    arcLength: i + 100,
  }));

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: fillPts,
        closed: true,
        fill: 'rgba(212, 184, 122, 0.28)',
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 0.6,
        opacity: 0.9,
      },
      {
        points: curvePts,
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.4,
        opacity: 0.92,
      },
    ],
  };
}
