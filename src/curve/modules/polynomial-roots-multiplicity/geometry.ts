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
  LABEL_CLOSE_PX,
  LEAD_A_MAX,
  LEAD_A_MIN,
  MIN_ABS_A,
  MIN_INTERVAL_WIDTH,
  PLOT_X_MAX,
  PLOT_X_MIN,
  PRESET_EPS,
  PRESETS,
  ROOT_MAX,
  ROOT_MERGE_EPS,
  ROOT_MIN,
  SAMPLE_STEP,
} from './constants';

export type { PlotRect, ViewSmoothState };

const SIGN_LINE_RESERVE = 56;

export type CurveSample = {
  x: number;
  y: number;
};

export type Multiplicity = 1 | 2;

export type PolynomialRootsMultiplicityParams = {
  advanced: boolean;
  a: number;
  roots: [number, number, number];
  mult: [Multiplicity, Multiplicity, Multiplicity];
};

export type SignedSegment = {
  a: number;
  b: number;
  sign: 1 | -1;
};

export type PolynomialMeta = {
  roots: [number, number, number];
  mult: [Multiplicity, Multiplicity, Multiplicity];
  degree: number;
  breaks: number[];
  signedSegments: SignedSegment[];
  intervals: Array<[number, number]>;
};

export type PolynomialSceneCache = {
  meta: PolynomialMeta;
  curve: CurveSample[];
  targetViewHalfY: number;
};

export const DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS: PolynomialRootsMultiplicityParams = {
  advanced: false,
  a: PRESETS[1].a,
  roots: [...PRESETS[1].roots],
  mult: [...PRESETS[1].mult],
};

/** 縮圖：一重根場景，曲線 + 三零點可辨識 */
export const THUMBNAIL_POLYNOMIAL_PARAMS: PolynomialRootsMultiplicityParams = {
  advanced: false,
  a: 0.35,
  roots: [-2.4, 0.1, 2.2],
  mult: [1, 2, 1],
};

export const THUMBNAIL_VIEW_HALF_Y = 5.5;
const THUMBNAIL_PLOT_X_MIN = -3.4;
const THUMBNAIL_PLOT_X_MAX = 3.4;

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
  if (Math.abs(value) >= MIN_ABS_A) return clamp(value, LEAD_A_MIN, LEAD_A_MAX);
  return value < 0 ? -MIN_ABS_A : MIN_ABS_A;
}

export function asPolynomialRootsMultiplicityParams(
  params: Partial<PolynomialRootsMultiplicityParams> & Record<string, unknown>,
): PolynomialRootsMultiplicityParams {
  const roots = [
    Number(params.root0 ?? (params.roots as number[] | undefined)?.[0] ?? DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS.roots[0]),
    Number(params.root1 ?? (params.roots as number[] | undefined)?.[1] ?? DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS.roots[1]),
    Number(params.root2 ?? (params.roots as number[] | undefined)?.[2] ?? DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS.roots[2]),
  ] as [number, number, number];

  const multSource = params.mult as number[] | undefined;
  const mult = [
    (Number(params.mult0 ?? multSource?.[0] ?? 1) === 2 ? 2 : 1) as Multiplicity,
    (Number(params.mult1 ?? multSource?.[1] ?? 1) === 2 ? 2 : 1) as Multiplicity,
    (Number(params.mult2 ?? multSource?.[2] ?? 1) === 2 ? 2 : 1) as Multiplicity,
  ] as [Multiplicity, Multiplicity, Multiplicity];

  return {
    advanced: Boolean(params.advanced),
    a: Number(params.a ?? DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS.a),
    roots,
    mult,
  };
}

export function paramsForMetadata(params: PolynomialRootsMultiplicityParams) {
  return {
    advanced: params.advanced ? 1 : 0,
    a: params.a,
    root0: params.roots[0],
    root1: params.roots[1],
    root2: params.roots[2],
  };
}

export function polynomialValue(params: PolynomialRootsMultiplicityParams, x: number) {
  let y = sanitizeA(params.a);
  for (let i = 0; i < params.roots.length; i++) {
    const r = params.roots[i];
    const m = params.mult[i];
    y *= (x - r) ** m;
  }
  return y;
}

export function mergedBreaks(roots: number[]) {
  const raw = roots
    .map((r) => clamp(r, PLOT_X_MIN, PLOT_X_MAX))
    .sort((a, b) => a - b);
  const out: number[] = [];

  for (const value of raw) {
    if (!out.length || Math.abs(value - out[out.length - 1]) > ROOT_MERGE_EPS) {
      out.push(value);
    }
  }

  return out;
}

export function buildSignedSegments(
  params: PolynomialRootsMultiplicityParams,
  breaks: number[],
) {
  const points = [PLOT_X_MIN, ...breaks, PLOT_X_MAX]
    .sort((a, b) => a - b)
    .filter((x, i, arr) => i === 0 || Math.abs(x - arr[i - 1]) > ROOT_MERGE_EPS);
  const segments: SignedSegment[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (b - a <= MIN_INTERVAL_WIDTH) continue;
    segments.push({ a, b, sign: signOnInterval(params, a, b) });
  }

  return segments;
}

function signOnInterval(params: PolynomialRootsMultiplicityParams, a: number, b: number): 1 | -1 {
  const mid = (a + b) / 2;
  const direct = polynomialValue(params, mid);
  if (Math.abs(direct) > EPS) return direct > 0 ? 1 : -1;

  const probes = [0.25, 0.75, 0.1, 0.9, 0.4, 0.6];
  for (const t of probes) {
    const x = a + (b - a) * t;
    const y = polynomialValue(params, x);
    if (Math.abs(y) > EPS) return y > 0 ? 1 : -1;
  }

  return 1;
}

export function polynomialMeta(params: PolynomialRootsMultiplicityParams): PolynomialMeta {
  const roots: [number, number, number] = [...params.roots];
  const mult: [Multiplicity, Multiplicity, Multiplicity] = [...params.mult];
  const degree = mult.reduce((sum, v) => sum + v, 0);
  const breaks = mergedBreaks(roots);
  const signedSegments = buildSignedSegments(params, breaks);
  const intervals = signedSegments
    .filter((seg) => seg.sign > 0)
    .map((seg) => [seg.a, seg.b] as [number, number]);

  return { roots, mult, degree, breaks, signedSegments, intervals };
}

export function sampleXs(a: number, b: number, step: number) {
  const n = Math.ceil((b - a) / step);
  const xs: number[] = [];
  for (let i = 0; i <= n; i++) {
    xs.push(Math.min(b, a + i * step));
  }
  return xs;
}

export function buildPolynomialCurve(
  params: PolynomialRootsMultiplicityParams,
  step = SAMPLE_STEP,
) {
  return sampleXs(PLOT_X_MIN, PLOT_X_MAX, step).map((x) => ({
    x,
    y: polynomialValue(params, x),
  }));
}

export function targetViewHalfYFromCurve(curve: CurveSample[]) {
  const vals: number[] = [];
  for (const pt of curve) {
    if (Number.isFinite(pt.y)) vals.push(Math.abs(pt.y));
  }
  vals.push(0);

  if (!vals.length) return 5;

  vals.sort((a, b) => a - b);
  const p90 = vals[Math.floor(vals.length * 0.9)] || 1;
  const maxAbs = vals[vals.length - 1] || 1;
  return clamp(Math.min(maxAbs * 1.05, p90 * 1.85), 3.8, 24);
}

export function buildPolynomialSceneCache(
  params: PolynomialRootsMultiplicityParams,
): PolynomialSceneCache {
  const meta = polynomialMeta(params);
  const curve = buildPolynomialCurve(params);
  const targetViewHalfY = targetViewHalfYFromCurve(curve);
  return { meta, curve, targetViewHalfY };
}

export { stepViewHalfYSmoothing };

export function computePolynomialPlotRect(size: number): PlotRect {
  return computeCartesianPlotRect(size, SIGN_LINE_RESERVE);
}

export function computeSignLineRect(plot: PlotRect): PlotRect {
  return {
    x: plot.x,
    y: plot.y + plot.h + 14,
    w: plot.w,
    h: 28,
  };
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

export function rootFromDrag(index: number, worldX: number) {
  const root = snapStep(clamp(worldX, ROOT_MIN, ROOT_MAX), 0.05);
  return { index, root };
}

export function pickRoot(
  meta: PolynomialMeta,
  plot: PlotRect,
  viewHalfY: number,
  mouseX: number,
  mouseY: number,
) {
  for (let i = 0; i < meta.roots.length; i++) {
    const r = meta.roots[i];
    if (r < PLOT_X_MIN || r > PLOT_X_MAX) continue;
    const s = worldToScreen(plot, viewHalfY, r, 0);
    if (Math.abs(mouseX - s.x) <= 15 && Math.abs(mouseY - s.y) <= 15) {
      return i;
    }
  }
  return -1;
}

export function rootLabelOffsets(
  roots: number[],
  plot: PlotRect,
  viewHalfY: number,
  base: number,
  step: number,
) {
  const offsets = roots.map(() => base);
  const indexed = roots
    .map((r, i) => ({ r, i, x: worldToScreen(plot, viewHalfY, r, 0).x }))
    .sort((a, b) => a.x - b.x);

  let clusterStart = 0;
  while (clusterStart < indexed.length) {
    let clusterEnd = clusterStart;
    while (
      clusterEnd + 1 < indexed.length &&
      Math.abs(indexed[clusterEnd + 1].x - indexed[clusterEnd].x) < LABEL_CLOSE_PX
    ) {
      clusterEnd++;
    }

    for (let j = clusterStart; j <= clusterEnd; j++) {
      const rank = j - clusterStart;
      offsets[indexed[j].i] = base + rank * step;
    }

    clusterStart = clusterEnd + 1;
  }

  return offsets;
}

export function positiveIntervalText(
  intervals: Array<[number, number]>,
  maxShown = 2,
) {
  if (!intervals.length) return 'f(x)>0：無';

  const shown = intervals
    .slice(0, maxShown)
    .map((seg) => `(${fmt(seg[0])},${fmt(seg[1])})`)
    .join('∪');
  const rest = intervals.length > maxShown ? '…' : '';

  return `f(x)>0：${shown}${rest}`;
}

export function buildCaption(meta: PolynomialMeta) {
  return `f(x)=a∏(x-rᵢ)^mᵢ；n=${meta.degree}；${positiveIntervalText(meta.intervals, 2)}`;
}

export function isPresetActive(
  params: PolynomialRootsMultiplicityParams,
  preset: (typeof PRESETS)[number],
) {
  if (Math.abs(params.a - preset.a) > PRESET_EPS) return false;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(params.roots[i] - preset.roots[i]) > PRESET_EPS) return false;
    if (params.mult[i] !== preset.mult[i]) return false;
  }
  return true;
}

export function applyPreset(
  preset: (typeof PRESETS)[number],
): PolynomialRootsMultiplicityParams {
  return {
    advanced: false,
    a: preset.a,
    roots: [...preset.roots],
    mult: [...preset.mult],
  };
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

export function buildPolynomialRootsMultiplicityThumbnail(): ThumbnailSpec {
  const params = THUMBNAIL_POLYNOMIAL_PARAMS;
  const meta = polynomialMeta(params);
  const viewHalfY = THUMBNAIL_VIEW_HALF_Y;
  const curve = clipCurveForThumbnail(
    buildPolynomialCurve(params, 0.04).filter(
      (pt) => pt.x >= THUMBNAIL_PLOT_X_MIN && pt.x <= THUMBNAIL_PLOT_X_MAX,
    ),
    viewHalfY,
  );

  const axisLeft = mathToThumb(PLOT_X_MIN, 0, viewHalfY);
  const axisRight = mathToThumb(PLOT_X_MAX, 0, viewHalfY);

  const rootPoints = meta.roots
    .filter((r) => r >= PLOT_X_MIN && r <= PLOT_X_MAX)
    .map((r, i) => ({
      pt: mathToThumb(r, 0, viewHalfY),
      mult: meta.mult[i],
    }));

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
        points: curveToThumbPoints(curve, viewHalfY),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.6,
        opacity: 0.98,
      },
    ],
    circles: rootPoints.map(({ pt, mult }) => ({
      x: pt.x,
      y: pt.y,
      r: mult === 1 ? 5 : 6.5,
      fill: mult === 1 ? 'rgba(212, 184, 122, 0.75)' : 'rgb(212, 184, 122)',
    })),
  };
}
