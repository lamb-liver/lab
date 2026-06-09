import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  BASIS_OPTIONS,
  PARAM_H_MAX,
  PARAM_H_MIN,
  PARAM_K_MAX,
  PARAM_K_MIN,
  PLOT_X_MAX,
  PLOT_X_MIN,
} from './constants';

export type BasisKind = (typeof BASIS_OPTIONS)[number]['id'];

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CurveSample = {
  x: number;
  y: number;
};

export type FunctionGraphTransformParams = {
  basis: BasisKind;
  advanced: boolean;
  a: number;
  b: number;
  h: number;
  k: number;
};

export type ViewSmoothState = {
  viewHalfY: number;
};

export const DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS: FunctionGraphTransformParams = {
  basis: 'square',
  advanced: false,
  a: 1,
  b: 1,
  h: 0,
  k: 0,
};

const THUMB_PLOT = { x: 118, y: 92, w: 364, h: 236 };

/** 縮圖專用：讓 ghost 與變換後曲線、O 與 P 在卡片上可辨識 */
export const THUMBNAIL_TRANSFORM_PARAMS: FunctionGraphTransformParams = {
  basis: 'square',
  advanced: false,
  a: 0.82,
  b: 1.25,
  h: 1.1,
  k: -1.4,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function fmt(value: number) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 0.0005) return '0';
  const digits = Math.abs(value) >= 10 ? 1 : 2;
  return Number(value.toFixed(digits)).toString();
}

export function snapStep(value: number, step: number) {
  if (!step || !Number.isFinite(step)) return value;
  return Math.round(value / step) * step;
}

export function basisFromIndex(index: number): BasisKind {
  return BASIS_OPTIONS[clamp(Math.round(index), 0, BASIS_OPTIONS.length - 1)]?.id ?? 'square';
}

export function basisToIndex(basis: BasisKind): number {
  return Math.max(0, BASIS_OPTIONS.findIndex((item) => item.id === basis));
}

export function asFunctionGraphTransformParams(
  params: Partial<FunctionGraphTransformParams> & Record<string, unknown>,
): FunctionGraphTransformParams {
  const basis =
    typeof params.basis === 'string'
      ? (params.basis as BasisKind)
      : basisFromIndex(Number(params.basis ?? 1));

  return {
    basis,
    advanced: Boolean(params.advanced),
    a: Number(params.a ?? DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS.a),
    b: Number(params.b ?? DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS.b),
    h: Number(params.h ?? DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS.h),
    k: Number(params.k ?? DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS.k),
  };
}

export function paramsForMetadata(params: FunctionGraphTransformParams) {
  return {
    basis: basisToIndex(params.basis),
    advanced: params.advanced ? 1 : 0,
    a: params.a,
    b: params.b,
    h: params.h,
    k: params.k,
  };
}

export function baseValue(kind: BasisKind, x: number) {
  if (kind === 'linear') return x;
  if (kind === 'square') return x * x;
  if (kind === 'cubic') return x * x * x;
  if (kind === 'abs') return Math.abs(x);
  return x;
}

export function activeValue(params: FunctionGraphTransformParams, x: number) {
  return params.a * baseValue(params.basis, params.b * (x - params.h)) + params.k;
}

export function sampleXs(a: number, b: number, step: number) {
  const n = Math.ceil((b - a) / step);
  const xs: number[] = [];
  for (let i = 0; i <= n; i++) {
    xs.push(Math.min(b, a + i * step));
  }
  return xs;
}

export function buildCurves(params: FunctionGraphTransformParams, step = 0.03) {
  const xs = sampleXs(PLOT_X_MIN, PLOT_X_MAX, step);
  const ghost = xs.map((x) => ({ x, y: baseValue(params.basis, x) }));
  const active = xs.map((x) => ({ x, y: activeValue(params, x) }));
  return { ghost, active };
}

export function targetViewHalfYFromCurves(curves: CurveSample[][]) {
  const vals: number[] = [];
  for (const curve of curves) {
    for (const pt of curve) {
      if (Number.isFinite(pt.y)) vals.push(Math.abs(pt.y));
    }
  }

  if (!vals.length) return 5;

  vals.sort((a, b) => a - b);
  const p90 = vals[Math.floor(vals.length * 0.9)] || 1;
  const maxAbs = vals[vals.length - 1] || 1;
  return clamp(Math.min(maxAbs * 1.05, p90 * 1.8), 3.6, 18);
}

export function stepViewHalfYSmoothing(
  smooth: ViewSmoothState,
  target: number,
  deltaMs: number,
  maxDeltaMs = 50,
  ratePerSec = 8,
): ViewSmoothState {
  const dtSec = Math.min(deltaMs, maxDeltaMs) / 1000;
  const alpha = 1 - Math.exp(-ratePerSec * dtSec);
  return { viewHalfY: smooth.viewHalfY + (target - smooth.viewHalfY) * alpha };
}

export function computeWorkPlotRect(size: number): PlotRect {
  const pad = size < 560 ? 42 : 48;
  const caption = 24;
  return {
    x: pad,
    y: Math.round(pad * 0.55),
    w: size - pad * 2,
    h: size - pad - caption - Math.round(pad * 0.35),
  };
}

export function niceYStep(half: number) {
  if (half <= 4) return 1;
  if (half <= 8) return 2;
  return 4;
}

export function worldToScreen(
  plot: PlotRect,
  viewHalfY: number,
  x: number,
  y: number,
): { x: number; y: number } {
  return {
    x: plot.x + ((x - PLOT_X_MIN) / (PLOT_X_MAX - PLOT_X_MIN)) * plot.w,
    y: plot.y + plot.h - ((y + viewHalfY) / (viewHalfY * 2)) * plot.h,
  };
}

export function screenToWorld(
  plot: PlotRect,
  viewHalfY: number,
  screenX: number,
  screenY: number,
) {
  return {
    x: PLOT_X_MIN + ((screenX - plot.x) / plot.w) * (PLOT_X_MAX - PLOT_X_MIN),
    y: ((plot.y + plot.h - screenY) / plot.h) * (viewHalfY * 2) - viewHalfY,
  };
}

export function clampFeaturePoint(h: number, k: number) {
  return {
    h: snapStep(clamp(h, PARAM_H_MIN, PARAM_H_MAX), 0.05),
    k: snapStep(clamp(k, PARAM_K_MIN, PARAM_K_MAX), 0.05),
  };
}

export function pickFeaturePoint(
  params: FunctionGraphTransformParams,
  plot: PlotRect,
  viewHalfY: number,
  mouseX: number,
  mouseY: number,
) {
  const target = worldToScreen(plot, viewHalfY, params.h, params.k);
  return Math.abs(mouseX - target.x) <= 15 && Math.abs(mouseY - target.y) <= 15;
}

export function transformScaleText(symbol: 'a' | 'b', value: number, axis: '垂直' | '水平') {
  const absValue = Math.abs(value);
  const flip = value < 0 ? '＋翻轉' : '';

  if (absValue < 0.0005) return `${symbol}=0：壓成水平線`;
  if (Math.abs(absValue - 1) < 0.0005) return `${symbol}：${axis}不伸縮${flip}`;

  if (symbol === 'a') {
    return absValue > 1 ? `a：垂直拉伸${flip}` : `a：垂直壓縮${flip}`;
  }

  return absValue > 1 ? `b：水平壓縮${flip}` : `b：水平拉伸${flip}`;
}

export function buildStatsLines(params: FunctionGraphTransformParams) {
  const base = BASIS_OPTIONS.find((item) => item.id === params.basis)?.text || 'f(x)';
  return [
    base,
    'g(x)=a f(b(x-h))+k',
    `P=(${fmt(params.h)}, ${fmt(params.k)})`,
    transformScaleText('a', params.a, '垂直'),
    transformScaleText('b', params.b, '水平'),
  ];
}

export function buildCaption(params: FunctionGraphTransformParams) {
  return `P=(${fmt(params.h)}, ${fmt(params.k)})；a=${fmt(params.a)}，b=${fmt(params.b)}`;
}

function mathToThumb(x: number, y: number, viewHalfY: number): CurvePoint {
  const nx = (x - PLOT_X_MIN) / (PLOT_X_MAX - PLOT_X_MIN);
  const ny = (y + viewHalfY) / (viewHalfY * 2);
  return {
    x: THUMB_PLOT.x + nx * THUMB_PLOT.w,
    y: THUMB_PLOT.y + THUMB_PLOT.h - ny * THUMB_PLOT.h,
    theta: 0,
    arcLength: 0,
  };
}

function curveToThumbPoints(curve: CurveSample[], viewHalfY: number): CurvePoint[] {
  return curve
    .filter((pt) => Number.isFinite(pt.y))
    .map((pt, index) => {
      const mapped = mathToThumb(pt.x, pt.y, viewHalfY);
      return { ...mapped, theta: index, arcLength: index };
    });
}

export function buildFunctionGraphTransformThumbnail(): ThumbnailSpec {
  const params = THUMBNAIL_TRANSFORM_PARAMS;
  const ghost = sampleXs(PLOT_X_MIN, PLOT_X_MAX, 0.04).map((x) => ({
    x,
    y: baseValue(params.basis, x),
  }));
  const active = sampleXs(PLOT_X_MIN, PLOT_X_MAX, 0.04).map((x) => ({
    x,
    y: activeValue(params, x),
  }));
  const viewHalfY = targetViewHalfYFromCurves([ghost, active]);
  const axisLeft = mathToThumb(PLOT_X_MIN, 0, viewHalfY);
  const axisRight = mathToThumb(PLOT_X_MAX, 0, viewHalfY);
  const origin = mathToThumb(0, 0, viewHalfY);
  const target = mathToThumb(params.h, params.k, viewHalfY);

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: [
          { ...axisLeft, theta: 0, arcLength: 0 },
          { ...axisRight, theta: 1, arcLength: 1 },
        ],
        stroke: 'rgba(255, 255, 255, 0.22)',
        strokeWidth: 0.8,
        opacity: 0.7,
        excludeFromBbox: true,
      },
      {
        points: curveToThumbPoints(ghost, viewHalfY),
        stroke: 'rgba(212, 184, 122, 0.28)',
        strokeWidth: 0.9,
        opacity: 0.55,
        excludeFromBbox: true,
      },
      {
        points: [
          { ...origin, theta: 0, arcLength: 0 },
          { ...target, theta: 1, arcLength: 1 },
        ],
        stroke: 'rgba(255, 255, 255, 0.28)',
        strokeWidth: 0.7,
        opacity: 0.65,
        excludeFromBbox: true,
      },
      {
        points: curveToThumbPoints(active, viewHalfY),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.6,
        opacity: 0.98,
      },
    ],
    circles: [
      {
        x: origin.x,
        y: origin.y,
        r: 3.2,
        fill: 'rgba(212, 184, 122, 0.45)',
      },
      {
        x: target.x,
        y: target.y,
        r: 4.8,
        fill: 'rgb(212, 184, 122)',
      },
    ],
  };
}
