import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  computeWorkPlotRect as computeCartesianPlotRect,
  stepViewHalfYSmoothing,
  worldToScreen as cartesianWorldToScreen,
  screenToWorldX as cartesianScreenToWorldX,
  type PlotRect,
  type ViewSmoothState,
} from '../../cartesianPlot';
import {
  EPS,
  EXP_BASE_MAX,
  EXP_BASE_MIN,
  FUNCTIONS,
  MODE_CONFIG,
  PLOT_X_MAX,
  PLOT_X_MIN,
  QUADRATIC_COEFF,
  SAMPLE_STEP,
  type InverseFunctionMode,
} from './constants';

export type { InverseFunctionMode, PlotRect, ViewSmoothState };

export type CurveSample = {
  x: number;
  y: number;
};

export type Point2 = {
  x: number;
  y: number;
};

export type InverseFunctionReflectionParams = {
  mode: InverseFunctionMode;
  advanced: boolean;
  input: number;
  base: number;
};

export type InverseMeta = {
  mode: InverseFunctionMode;
  input: number;
  domainMin: number;
  domainMax: number;
  passHlt: boolean;
  formula: string;
  inverseFormula: string;
  p: Point2;
  pMirror: Point2;
};

export type InverseSceneCache = {
  meta: InverseMeta;
  original: CurveSample[];
  reflected: CurveSample[];
  targetViewHalfY: number;
};

export const DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS: InverseFunctionReflectionParams = {
  mode: 'linear',
  advanced: true,
  input: MODE_CONFIG.linear.inputDefault,
  base: 2,
};

const THUMBNAIL_INVERSE_PARAMS: InverseFunctionReflectionParams = {
  mode: 'exponential',
  advanced: false,
  input: 1.25,
  base: 2,
};

const THUMB_PLOT = { x: 118, y: 92, w: 364, h: 236 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function fmt(value: number) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 0.0005) return '0';
  const digits = Math.abs(value) >= 10 ? 1 : 2;
  return Number(value.toFixed(digits)).toString();
}

function snapStep(value: number, step: number) {
  if (!step || !Number.isFinite(step)) return value;
  return Math.round(value / step) * step;
}

function signedText(value: number) {
  if (Math.abs(value) < 0.0005) return '';
  return value > 0 ? `+${fmt(value)}` : fmt(value);
}

function modeFromIndex(index: number): InverseFunctionMode {
  return FUNCTIONS[clamp(Math.round(index), 0, FUNCTIONS.length - 1)]?.id ?? 'linear';
}

function modeToIndex(mode: InverseFunctionMode): number {
  return Math.max(0, FUNCTIONS.findIndex((item) => item.id === mode));
}

export function asInverseFunctionReflectionParams(
  params: Partial<InverseFunctionReflectionParams> & Record<string, unknown>,
): InverseFunctionReflectionParams {
  const mode =
    typeof params.mode === 'string'
      ? (params.mode as InverseFunctionMode)
      : modeFromIndex(Number(params.mode ?? 0));

  return {
    mode,
    advanced: Boolean(params.advanced),
    input: clampInputForMode(
      mode,
      Number(params.input ?? MODE_CONFIG[mode].inputDefault),
    ),
    base: clamp(
      Number(params.base ?? DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS.base),
      EXP_BASE_MIN,
      EXP_BASE_MAX,
    ),
  };
}

export function paramsForMetadata(params: InverseFunctionReflectionParams) {
  const cfg = MODE_CONFIG[params.mode];
  return {
    mode: modeToIndex(params.mode),
    advanced: params.advanced ? 1 : 0,
    input: clampInputForMode(params.mode, params.input),
    base: params.base,
    inputMin: cfg.inputMin,
    inputMax: cfg.inputMax,
  };
}

export function clampInputForMode(mode: InverseFunctionMode, value: number) {
  const cfg = MODE_CONFIG[mode];
  return clamp(value, cfg.inputMin, cfg.inputMax);
}

export function inputRangeForMode(mode: InverseFunctionMode) {
  const cfg = MODE_CONFIG[mode];
  return { min: cfg.inputMin, max: cfg.inputMax };
}

export function paramsForModeSwitch(mode: InverseFunctionMode): Partial<InverseFunctionReflectionParams> {
  return {
    mode,
    input: MODE_CONFIG[mode].inputDefault,
  };
}

function quadraticValue(x: number) {
  return QUADRATIC_COEFF.a * (x - QUADRATIC_COEFF.h) ** 2 + QUADRATIC_COEFF.k;
}

export function evalByMode(params: InverseFunctionReflectionParams, x: number) {
  if (params.mode === 'linear') return 0.8 * x + 1;
  if (params.mode === 'quadraticRestricted' || params.mode === 'quadraticFull') {
    return quadraticValue(x);
  }
  if (params.mode === 'exponential') return params.base ** x;
  return 0;
}

export function quadraticHorizontalHits(y: number) {
  const inside = (y - QUADRATIC_COEFF.k) / QUADRATIC_COEFF.a;
  if (inside < -EPS) return [];
  if (Math.abs(inside) <= EPS) return [QUADRATIC_COEFF.h];
  const d = Math.sqrt(Math.max(0, inside));
  return [QUADRATIC_COEFF.h - d, QUADRATIC_COEFF.h + d].sort((a, b) => a - b);
}

export function geometryParamsEqual(
  a: InverseFunctionReflectionParams,
  b: InverseFunctionReflectionParams,
) {
  return a.mode === b.mode && a.input === b.input && a.base === b.base;
}

function formulaText(params: InverseFunctionReflectionParams) {
  if (params.mode === 'linear') return 'f(x)=0.8x+1';
  if (params.mode === 'quadraticRestricted') {
    return `f(x)=${fmt(QUADRATIC_COEFF.a)}(x-${fmt(QUADRATIC_COEFF.h)})²${signedText(QUADRATIC_COEFF.k)}，x≥${fmt(QUADRATIC_COEFF.h)}`;
  }
  if (params.mode === 'quadraticFull') {
    return `f(x)=${fmt(QUADRATIC_COEFF.a)}(x-${fmt(QUADRATIC_COEFF.h)})²${signedText(QUADRATIC_COEFF.k)}`;
  }
  return `f(x)=${fmt(params.base)}^x`;
}

function inverseFormulaText(params: InverseFunctionReflectionParams) {
  if (params.mode === 'linear') return 'f⁻¹(x)=(x-1)/0.8';
  if (params.mode === 'quadraticRestricted') {
    return `f⁻¹(x)=${fmt(QUADRATIC_COEFF.h)}+√((x${signedText(-QUADRATIC_COEFF.k)})/${fmt(QUADRATIC_COEFF.a)})`;
  }
  if (params.mode === 'quadraticFull') return '未限制：無反函數';
  return `f⁻¹(x)=log_${fmt(params.base)} x`;
}

export function inverseMeta(params: InverseFunctionReflectionParams): InverseMeta {
  const cfg = MODE_CONFIG[params.mode];
  const input = clampInputForMode(params.mode, params.input);
  const y = evalByMode(params, input);

  return {
    mode: params.mode,
    input,
    domainMin: cfg.inputMin,
    domainMax: cfg.inputMax,
    passHlt: params.mode !== 'quadraticFull',
    formula: formulaText(params),
    inverseFormula: inverseFormulaText(params),
    p: { x: input, y },
    pMirror: { x: y, y: input },
  };
}

export function sampleXs(a: number, b: number, step: number) {
  const n = Math.ceil((b - a) / step);
  const xs: number[] = [];
  for (let i = 0; i <= n; i++) {
    xs.push(Math.min(b, a + i * step));
  }
  return xs;
}

function buildOriginalCurve(meta: InverseMeta, params: InverseFunctionReflectionParams) {
  return sampleXs(meta.domainMin, meta.domainMax, SAMPLE_STEP).map((x) => ({
    x,
    y: evalByMode(params, x),
  }));
}

function reflectCurve(points: CurveSample[]) {
  return points.map((pt) => ({ x: pt.y, y: pt.x }));
}

function targetViewHalfYFromCurves(
  curves: CurveSample[][],
  meta: Pick<InverseMeta, 'p' | 'pMirror'>,
) {
  const vals: number[] = [];

  for (const curve of curves) {
    for (const pt of curve) {
      if (Number.isFinite(pt.y)) vals.push(Math.abs(pt.y));
    }
  }

  vals.push(0);
  if (Number.isFinite(meta.p.y)) vals.push(Math.abs(meta.p.y));
  if (Number.isFinite(meta.pMirror.y)) vals.push(Math.abs(meta.pMirror.y));

  if (!vals.length) return 5;

  vals.sort((a, b) => a - b);
  const p90 = vals[Math.floor(vals.length * 0.9)] || 1;
  const maxAbs = vals[vals.length - 1] || 1;
  return clamp(Math.min(maxAbs * 1.08, p90 * 1.85), 4.2, 12);
}

export function buildInverseSceneCache(
  params: InverseFunctionReflectionParams,
): InverseSceneCache {
  const meta = inverseMeta(params);
  const original = buildOriginalCurve(meta, params);
  const reflected = reflectCurve(original);
  const targetViewHalfY = targetViewHalfYFromCurves([original, reflected], meta);

  return { meta, original, reflected, targetViewHalfY };
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

export function screenToWorldX(plot: PlotRect, _viewHalfY: number, screenX: number) {
  return cartesianScreenToWorldX(plot, PLOT_X_MIN, PLOT_X_MAX, screenX);
}

export function inputFromDrag(
  mode: InverseFunctionMode,
  worldX: number,
) {
  return snapStep(clampInputForMode(mode, worldX), 0.05);
}

export function pickPointP(
  meta: InverseMeta,
  plot: PlotRect,
  viewHalfY: number,
  mouseX: number,
  mouseY: number,
) {
  const target = worldToScreen(plot, viewHalfY, meta.p.x, meta.p.y);
  return Math.abs(mouseX - target.x) <= 16 && Math.abs(mouseY - target.y) <= 16;
}

export function buildCaption(meta: InverseMeta) {
  return meta.passHlt
    ? `P=(${fmt(meta.p.x)}, ${fmt(meta.p.y)})；P′=(${fmt(meta.pMirror.x)}, ${fmt(meta.pMirror.y)})`
    : 'P 可鏡射到 P′，但原圖形未通過水平線測試，不能直接視為反函數';
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

export function buildInverseFunctionReflectionThumbnail(): ThumbnailSpec {
  const params = THUMBNAIL_INVERSE_PARAMS;
  const meta = inverseMeta(params);
  const original = buildOriginalCurve(meta, params);
  const reflected = reflectCurve(original);
  const viewHalfY = targetViewHalfYFromCurves([original, reflected], meta);

  const mirrorLine = sampleXs(PLOT_X_MIN, PLOT_X_MAX, 0.5).map((x) => mathToThumb(x, x, viewHalfY));
  const p = mathToThumb(meta.p.x, meta.p.y, viewHalfY);
  const pm = mathToThumb(meta.pMirror.x, meta.pMirror.y, viewHalfY);

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: mirrorLine.map((pt, index) => ({ ...pt, theta: index, arcLength: index })),
        stroke: 'rgba(255, 255, 255, 0.24)',
        strokeWidth: 0.8,
        opacity: 0.65,
        excludeFromBbox: true,
      },
      {
        points: curveToThumbPoints(original, viewHalfY),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.6,
        opacity: 0.98,
      },
      {
        points: curveToThumbPoints(reflected, viewHalfY),
        stroke: 'rgba(212, 184, 122, 0.42)',
        strokeWidth: 1.1,
        opacity: 0.75,
      },
      {
        points: [
          { ...p, theta: 0, arcLength: 0 },
          { ...pm, theta: 1, arcLength: 1 },
        ],
        stroke: 'rgba(255, 255, 255, 0.22)',
        strokeWidth: 0.7,
        opacity: 0.6,
        excludeFromBbox: true,
      },
    ],
    circles: [
      { x: p.x, y: p.y, r: 4.6, fill: 'rgb(212, 184, 122)' },
      { x: pm.x, y: pm.y, r: 3.8, fill: 'rgba(136, 136, 136, 0.85)' },
    ],
  };
}
