import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const LOG_VIEW = {
  width: 720,
  height: 720,
};

export const LOG_LEFT_PLOT = {
  x: 36,
  y: 72,
  w: 304,
  h: 520,
};

export const LOG_RIGHT_PLOT = {
  x: 380,
  y: 72,
  w: 304,
  h: 520,
};

export const LOG_REVEAL_SPEED = 0.035;

export type PlotBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type AxisMode = 'linear' | 'log';

export type LogCurveId = 'exp' | 'power' | 'linear';

export type LogCurveDef = {
  id: LogCurveId;
  label: string;
  fn: (x: number) => number;
  weight: number;
  alpha: number;
};

export type LogarithmicState = {
  a: number;
  p: number;
  m: number;
  compareMode: boolean;
  showExp: boolean;
  showPower: boolean;
  showLinear: boolean;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  logMin: number;
  logMax: number;
  curves: LogCurveDef[];
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function powerFn(x: number, p: number): number {
  const raw = Math.pow(x + 1, p);
  const maxVal = Math.pow(5, p);
  return 1 + ((raw - 1) / (maxVal - 1)) * 9999;
}

function linearFn(x: number, m: number): number {
  return 1 + 250 * m * x;
}

export function deriveLogarithmicState(params: ParamValues): LogarithmicState {
  const a = params.a ?? 0.65;
  const p = params.p ?? 2.4;
  const m = params.m ?? 3;
  const compareMode = (params.compareMode ?? 0) !== 0;
  const showExp = (params.showExp ?? 1) !== 0;
  const showPower = (params.showPower ?? 0) !== 0;
  const showLinear = (params.showLinear ?? 0) !== 0;

  const curves: LogCurveDef[] = [];

  if (showExp) {
    curves.push({
      id: 'exp',
      label: '指數',
      fn: (x) => Math.pow(10, a * x),
      weight: 1.8,
      alpha: 235,
    });
  }

  if (compareMode && showPower) {
    curves.push({
      id: 'power',
      label: '冪函數',
      fn: (x) => powerFn(x, p),
      weight: 1.25,
      alpha: 130,
    });
  }

  if (compareMode && showLinear) {
    curves.push({
      id: 'linear',
      label: '線性',
      fn: (x) => linearFn(x, m),
      weight: 1.15,
      alpha: 120,
    });
  }

  return {
    a,
    p,
    m,
    compareMode,
    showExp,
    showPower,
    showLinear,
    xMin: 0,
    xMax: 4,
    yMin: 1,
    yMax: 10000,
    logMin: 0,
    logMax: 4,
    curves,
  };
}

export function mapLogX(x: number, box: PlotBox, data: LogarithmicState): number {
  return box.x + ((x - data.xMin) / (data.xMax - data.xMin)) * box.w;
}

export function mapLinearY(y: number, box: PlotBox, data: LogarithmicState): number {
  return box.y + box.h - ((y - data.yMin) / (data.yMax - data.yMin)) * box.h;
}

export function mapLogY(y: number, box: PlotBox, data: LogarithmicState): number {
  const logY = Math.log10(Math.max(y, data.yMin));
  return box.y + box.h - ((logY - data.logMin) / (data.logMax - data.logMin)) * box.h;
}

export type LogPlotPoint = { x: number; y: number };

export function buildLogCurvePoints(
  curve: LogCurveDef,
  box: PlotBox,
  data: LogarithmicState,
  axisMode: AxisMode,
  samples = 360,
): LogPlotPoint[] {
  const pts: LogPlotPoint[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const x = lerp(data.xMin, data.xMax, i / samples);
    const y = curve.fn(x);
    pts.push({
      x: mapLogX(x, box, data),
      y: axisMode === 'log' ? mapLogY(y, box, data) : mapLinearY(y, box, data),
    });
  }
  return pts;
}

export function buildLogarithmicThumbnail(): ThumbnailSpec {
  const data = deriveLogarithmicState({
    a: 0.65,
    p: 2.4,
    m: 3,
    compareMode: 0,
    showExp: 1,
    showPower: 0,
    showLinear: 0,
  });
  const curve = data.curves[0];
  if (!curve) {
    return { coordinateSystem: 'canvas', paths: [] };
  }

  const pts = buildLogCurvePoints(curve, LOG_RIGHT_PLOT, data, 'log', 100);
  const curvePoints: CurvePoint[] = pts.map((pt, i) => ({
    x: pt.x,
    y: pt.y,
    theta: i,
    arcLength: i,
  }));

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: curvePoints,
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.4,
        opacity: 0.92,
      },
    ],
  };
}
