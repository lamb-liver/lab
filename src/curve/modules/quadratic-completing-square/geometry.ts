import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  computeWorkPlotRect as computeCartesianPlotRect,
  screenToWorld as cartesianScreenToWorld,
  stepViewHalfYSmoothing,
  worldToScreen as cartesianWorldToScreen,
  type PlotRect,
  type ViewSmoothState,
} from '../../cartesianPlot';
import {
  COEFF_A_MAX,
  COEFF_A_MIN,
  COEFF_B_MAX,
  COEFF_B_MIN,
  COEFF_C_MAX,
  COEFF_C_MIN,
  EPS,
  MIN_ABS_A,
  PLOT_X_MAX,
  PLOT_X_MIN,
  PRESETS,
  SAMPLE_STEP,
  VERTEX_H_MAX,
  VERTEX_H_MIN,
  VERTEX_K_MAX,
  VERTEX_K_MIN,
} from './constants';

export type { PlotRect, ViewSmoothState };

export type CurveSample = {
  x: number;
  y: number;
};

export type QuadraticCompletingSquareParams = {
  advanced: boolean;
  a: number;
  b: number;
  c: number;
};

export type QuadraticMeta = {
  a: number;
  b: number;
  c: number;
  h: number;
  k: number;
  delta: number;
  roots: number[];
  rootState: string;
};

export const DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS: QuadraticCompletingSquareParams = {
  advanced: false,
  a: PRESETS[0].a,
  b: PRESETS[0].b,
  c: PRESETS[0].c,
};

/** 縮圖專用：兩實根、頂點與對稱軸可辨識 */
export const THUMBNAIL_QUADRATIC_PARAMS: QuadraticCompletingSquareParams = {
  advanced: false,
  a: 1,
  b: -1,
  c: -2,
};

const THUMB_PLOT = { x: 118, y: 92, w: 364, h: 236 };

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

export function sanitizeA(value: number) {
  if (Math.abs(value) >= MIN_ABS_A) return value;
  return value < 0 ? -MIN_ABS_A : MIN_ABS_A;
}

export function asQuadraticCompletingSquareParams(
  params: Partial<QuadraticCompletingSquareParams> & Record<string, unknown>,
): QuadraticCompletingSquareParams {
  return {
    advanced: Boolean(params.advanced),
    a: Number(params.a ?? DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS.a),
    b: Number(params.b ?? DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS.b),
    c: Number(params.c ?? DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS.c),
  };
}

export function paramsForMetadata(params: QuadraticCompletingSquareParams) {
  return {
    advanced: params.advanced ? 1 : 0,
    a: params.a,
    b: params.b,
    c: params.c,
  };
}

export function cleanQuadraticParams(q: QuadraticCompletingSquareParams) {
  return {
    a: sanitizeA(q.a),
    b: clamp(q.b, COEFF_B_MIN, COEFF_B_MAX),
    c: clamp(q.c, COEFF_C_MIN, COEFF_C_MAX),
  };
}

export function quadraticValue(q: { a: number; b: number; c: number }, x: number) {
  return q.a * x * x + q.b * x + q.c;
}

export function quadraticRoots(a: number, b: number, c: number) {
  const d = b * b - 4 * a * c;
  if (d < -EPS) return [];
  if (Math.abs(d) <= EPS) return [-b / (2 * a)];
  const s = Math.sqrt(Math.max(0, d));
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((u, v) => u - v);
}

export function quadraticMeta(q: QuadraticCompletingSquareParams): QuadraticMeta {
  const clean = cleanQuadraticParams(q);
  const h = -clean.b / (2 * clean.a);
  const k = quadraticValue(clean, h);
  const delta = clean.b * clean.b - 4 * clean.a * clean.c;
  const roots = quadraticRoots(clean.a, clean.b, clean.c);
  const rootState = delta > EPS ? '兩實根' : Math.abs(delta) <= EPS ? '重根' : '無實根';

  return { ...clean, h, k, delta, roots, rootState };
}

export function sampleXs(a: number, b: number, step: number) {
  const n = Math.ceil((b - a) / step);
  const xs: number[] = [];
  for (let i = 0; i <= n; i++) {
    xs.push(Math.min(b, a + i * step));
  }
  return xs;
}

export function buildQuadraticCurve(q: QuadraticCompletingSquareParams, step = SAMPLE_STEP) {
  const clean = cleanQuadraticParams(q);
  return sampleXs(PLOT_X_MIN, PLOT_X_MAX, step).map((x) => ({
    x,
    y: quadraticValue(clean, x),
  }));
}

export function buildBaseParabolaCurve(a: number, step = SAMPLE_STEP) {
  return sampleXs(PLOT_X_MIN, PLOT_X_MAX, step).map((x) => ({
    x,
    y: a * x * x,
  }));
}

export type QuadraticSceneCache = {
  meta: QuadraticMeta;
  curve: CurveSample[];
  baseCurve: CurveSample[];
  targetViewHalfY: number;
};

export function buildQuadraticSceneCache(
  params: QuadraticCompletingSquareParams,
): QuadraticSceneCache {
  const meta = quadraticMeta(params);
  const curve = buildQuadraticCurve(params);
  const baseCurve = buildBaseParabolaCurve(meta.a);
  const targetViewHalfY = targetViewHalfYFromCurves([curve, baseCurve], meta);

  return { meta, curve, baseCurve, targetViewHalfY };
}

export function targetViewHalfYFromCurves(
  curves: CurveSample[][],
  meta?: Pick<QuadraticMeta, 'k'>,
) {
  const vals: number[] = [];

  for (const curve of curves) {
    for (const pt of curve) {
      if (Number.isFinite(pt.y)) vals.push(Math.abs(pt.y));
    }
  }

  if (meta && Number.isFinite(meta.k)) {
    vals.push(Math.abs(meta.k), 0);
  }

  if (!vals.length) return 5;

  vals.sort((a, b) => a - b);
  const p90 = vals[Math.floor(vals.length * 0.9)] || 1;
  const maxAbs = vals[vals.length - 1] || 1;
  return clamp(Math.min(maxAbs * 1.05, p90 * 1.85), 3.8, 20);
}

export { stepViewHalfYSmoothing };

export function computeWorkPlotRect(size: number): PlotRect {
  return computeCartesianPlotRect(size);
}

export { niceYStep } from '../../cartesianPlot';

export function worldToScreen(
  plot: PlotRect,
  viewHalfY: number,
  x: number,
  y: number,
): { x: number; y: number } {
  return cartesianWorldToScreen(plot, viewHalfY, PLOT_X_MIN, PLOT_X_MAX, x, y);
}

export function screenToWorld(
  plot: PlotRect,
  viewHalfY: number,
  screenX: number,
  screenY: number,
) {
  return cartesianScreenToWorld(
    plot,
    viewHalfY,
    PLOT_X_MIN,
    PLOT_X_MAX,
    screenX,
    screenY,
  );
}

export function vertexFromDrag(
  params: QuadraticCompletingSquareParams,
  worldX: number,
  worldY: number,
) {
  const q = cleanQuadraticParams(params);
  const h = snapStep(clamp(worldX, VERTEX_H_MIN, VERTEX_H_MAX), 0.05);
  const k = snapStep(clamp(worldY, VERTEX_K_MIN, VERTEX_K_MAX), 0.05);
  const nextB = -2 * q.a * h;
  const nextC = q.a * h * h + k;

  return {
    b: snapStep(clamp(nextB, COEFF_B_MIN, COEFF_B_MAX), 0.05),
    c: snapStep(clamp(nextC, COEFF_C_MIN, COEFF_C_MAX), 0.05),
  };
}

export function pickVertex(
  meta: QuadraticMeta,
  plot: PlotRect,
  viewHalfY: number,
  mouseX: number,
  mouseY: number,
) {
  const target = worldToScreen(plot, viewHalfY, meta.h, meta.k);
  return Math.abs(mouseX - target.x) <= 16 && Math.abs(mouseY - target.y) <= 16;
}

export function rootsInline(roots: number[]) {
  if (roots.length === 0) return '無實根';
  if (roots.length === 1) return `x₀=${fmt(roots[0])}`;
  return `x₁=${fmt(roots[0])}，x₂=${fmt(roots[1])}`;
}

export function buildCaption(meta: QuadraticMeta) {
  return `V=(${fmt(meta.h)}, ${fmt(meta.k)})；Δ=${fmt(meta.delta)}；${meta.rootState}`;
}

export function isPresetActive(
  params: QuadraticCompletingSquareParams,
  preset: (typeof PRESETS)[number],
) {
  return (
    Math.abs(params.a - preset.a) < EPS &&
    Math.abs(params.b - preset.b) < EPS &&
    Math.abs(params.c - preset.c) < EPS
  );
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

function clipCurveForThumbnail(curve: CurveSample[], viewHalfY: number) {
  const cap = viewHalfY * 1.04;
  return curve.filter((pt) => Number.isFinite(pt.y) && Math.abs(pt.y) <= cap);
}

export function buildQuadraticCompletingSquareThumbnail(): ThumbnailSpec {
  const params = THUMBNAIL_QUADRATIC_PARAMS;
  const meta = quadraticMeta(params);
  const curve = buildQuadraticCurve(params, 0.04);
  const ghost = buildBaseParabolaCurve(meta.a, 0.04);
  const viewHalfY = targetViewHalfYFromCurves([curve, ghost], meta);

  const axisLeft = mathToThumb(PLOT_X_MIN, 0, viewHalfY);
  const axisRight = mathToThumb(PLOT_X_MAX, 0, viewHalfY);
  const vertex = mathToThumb(meta.h, meta.k, viewHalfY);
  const axisTop = mathToThumb(meta.h, viewHalfY, viewHalfY);
  const axisBottom = mathToThumb(meta.h, -viewHalfY, viewHalfY);

  const rootPoints = meta.roots
    .filter((r) => r >= PLOT_X_MIN && r <= PLOT_X_MAX)
    .map((r) => mathToThumb(r, 0, viewHalfY));

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
        points: [
          { ...axisTop, theta: 0, arcLength: 0 },
          { ...axisBottom, theta: 1, arcLength: 1 },
        ],
        stroke: 'rgba(255, 255, 255, 0.18)',
        strokeWidth: 0.7,
        opacity: 0.55,
        excludeFromBbox: true,
      },
      {
        points: curveToThumbPoints(clipCurveForThumbnail(ghost, viewHalfY), viewHalfY),
        stroke: 'rgba(212, 184, 122, 0.28)',
        strokeWidth: 0.9,
        opacity: 0.55,
        excludeFromBbox: true,
      },
      {
        points: curveToThumbPoints(clipCurveForThumbnail(curve, viewHalfY), viewHalfY),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.6,
        opacity: 0.98,
      },
    ],
    circles: [
      {
        x: vertex.x,
        y: vertex.y,
        r: 4.8,
        fill: 'rgb(212, 184, 122)',
      },
      ...rootPoints.map((pt) => ({
        x: pt.x,
        y: pt.y,
        r: 3.2,
        fill: 'rgba(136, 136, 136, 0.85)',
      })),
    ],
  };
}
