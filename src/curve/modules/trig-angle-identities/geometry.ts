import type { CurvePoint, ThumbnailSpec } from '../../types';

export const TAU = Math.PI * 2;
export const EPS = 0.0001;
export const ANGLE_MIN = -TAU * 2;
export const ANGLE_MAX = TAU * 2;
export const DRAG_RADIUS = 34;
export const SMOOTH_RATE_PER_SEC = 14;
export const VALUE_SCALE = 0.43;

export type FormulaId = 'sinSum' | 'sinDiff' | 'cosSum' | 'cosDiff';
export type FormulaType = 'sum' | 'diff';
export type FormulaAxis = 'sin' | 'cos';

export type FormulaDef = {
  id: FormulaId;
  label: string;
  shortLabel: string;
  line1: string;
  line2: string;
  type: FormulaType;
  axis: FormulaAxis;
  lhs: (a: number, b: number) => number;
  rhs: (m: number, d: number) => number;
};

export type TrigAngleIdentitiesParams = {
  formulaId: FormulaId;
  alpha: number;
  beta: number;
  showRadians: boolean;
  reverseRead: boolean;
  showGuides: boolean;
};

export type TrigAngleIdentitiesSmoothState = {
  alpha: number;
  beta: number;
  guideMix: number;
};

export type CircleGeometry = {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  r: number;
};

export type CompositionSnap = {
  alpha: number;
  beta: number;
  alphaNorm: number;
  betaNorm: number;
  formulaM: number;
  formulaD: number;
  visualM: number;
  visualD: number;
  formula: FormulaDef;
  lhs: number;
  rhs: number;
  error: number;
  sameAngle: boolean;
};

export const FORMULAS: FormulaDef[] = [
  {
    id: 'sinSum',
    label: 'sinα + sinβ',
    shortLabel: 'sin+',
    line1: 'sinα + sinβ',
    line2: '2sin m cos d',
    type: 'sum',
    axis: 'sin',
    lhs: (a, b) => Math.sin(a) + Math.sin(b),
    rhs: (m, d) => 2 * Math.sin(m) * Math.cos(d),
  },
  {
    id: 'sinDiff',
    label: 'sinα − sinβ',
    shortLabel: 'sin−',
    line1: 'sinα − sinβ',
    line2: '2cos m sin d',
    type: 'diff',
    axis: 'sin',
    lhs: (a, b) => Math.sin(a) - Math.sin(b),
    rhs: (m, d) => 2 * Math.cos(m) * Math.sin(d),
  },
  {
    id: 'cosSum',
    label: 'cosα + cosβ',
    shortLabel: 'cos+',
    line1: 'cosα + cosβ',
    line2: '2cos m cos d',
    type: 'sum',
    axis: 'cos',
    lhs: (a, b) => Math.cos(a) + Math.cos(b),
    rhs: (m, d) => 2 * Math.cos(m) * Math.cos(d),
  },
  {
    id: 'cosDiff',
    label: 'cosα − cosβ',
    shortLabel: 'cos−',
    line1: 'cosα − cosβ',
    line2: '−2sin m sin d',
    type: 'diff',
    axis: 'cos',
    lhs: (a, b) => Math.cos(a) - Math.cos(b),
    rhs: (m, d) => -2 * Math.sin(m) * Math.sin(d),
  },
];

export const DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS: TrigAngleIdentitiesParams = {
  formulaId: 'sinSum',
  alpha: (2 * Math.PI) / 3,
  beta: Math.PI / 6,
  showRadians: false,
  reverseRead: false,
  showGuides: true,
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function fixNegZero(v: number) {
  return Object.is(v, -0) ? 0 : v;
}

export function normalizeAngle(a: number) {
  let v = a % TAU;
  if (v < 0) v += TAU;
  return fixNegZero(v);
}

export function clampSignedAngle(a: number) {
  let v = ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
  return fixNegZero(v);
}

export function shortestAngleDelta(from: number, to: number) {
  return clampSignedAngle(to - from);
}

export function fmt(v: number, digits = 3) {
  if (!Number.isFinite(v)) return '—';
  const fixed = fixNegZero(v);
  if (Math.abs(fixed) < 0.0005) return '0';
  return fixed
    .toFixed(digits)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*?)0+$/, '$1');
}

export function formatAngle(theta: number, showRadians: boolean) {
  if (showRadians) return `${fmt(theta / Math.PI)}π`;
  return `${Math.round((theta * 180) / Math.PI)}°`;
}

export function formulaFromId(id: FormulaId | string | undefined): FormulaDef {
  return FORMULAS.find((f) => f.id === id) ?? FORMULAS[0]!;
}

export function formulaDisplayLine(formula: FormulaDef) {
  if (formula.id === 'sinSum') return 'sinα+sinβ = 2sinm cosd';
  if (formula.id === 'sinDiff') return 'sinα−sinβ = 2cosm sind';
  if (formula.id === 'cosSum') return 'cosα+cosβ = 2cosm cosd';
  return 'cosα−cosβ = −2sinm sind';
}

export function reverseFormulaLine(formula: FormulaDef) {
  if (formula.id === 'sinSum') return '2sinm cosd → sinα+sinβ';
  if (formula.id === 'sinDiff') return '2cosm sind → sinα−sinβ';
  if (formula.id === 'cosSum') return '2cosm cosd → cosα+cosβ';
  return '−2sinm sind → cosα−cosβ';
}

export function asTrigAngleIdentitiesParams(
  params: Partial<TrigAngleIdentitiesParams> & Record<string, unknown>,
): TrigAngleIdentitiesParams {
  return {
    formulaId: formulaFromId(params.formulaId as FormulaId | undefined).id,
    alpha: params.alpha ?? DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.alpha,
    beta: params.beta ?? DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.beta,
    showRadians: params.showRadians ?? DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.showRadians,
    reverseRead: params.reverseRead ?? DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.reverseRead,
    showGuides: params.showGuides ?? DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.showGuides,
  };
}

export function setCircularTarget(current: number, normalizedValue: number) {
  const currentNorm = normalizeAngle(current);
  const delta = shortestAngleDelta(currentNorm, normalizedValue);
  return clamp(current + delta, ANGLE_MIN, ANGLE_MAX);
}

export function stepTrigAngleIdentitiesSmoothing(
  smooth: TrigAngleIdentitiesSmoothState,
  params: TrigAngleIdentitiesParams,
  deltaMs: number,
): TrigAngleIdentitiesSmoothState {
  const safeDelta = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 16.67;
  const dt = Math.min(0.05, safeDelta / 1000);
  const k = 1 - Math.exp(-dt * SMOOTH_RATE_PER_SEC);

  return {
    alpha: smooth.alpha + (params.alpha - smooth.alpha) * k,
    beta: smooth.beta + (params.beta - smooth.beta) * k,
    guideMix: smooth.guideMix + ((params.showGuides ? 1 : 0) - smooth.guideMix) * k,
  };
}

export function makeCompositionSnap(
  params: TrigAngleIdentitiesParams,
  smooth: TrigAngleIdentitiesSmoothState,
): CompositionSnap {
  const alpha = smooth.alpha;
  const beta = smooth.beta;
  const alphaNorm = normalizeAngle(alpha);
  const betaNorm = normalizeAngle(beta);

  const formulaM = (alpha + beta) / 2;
  const formulaD = (alpha - beta) / 2;

  const visualBeta = alpha + shortestAngleDelta(alphaNorm, betaNorm);
  const visualM = (alpha + visualBeta) / 2;
  const visualD = (alpha - visualBeta) / 2;

  const formula = formulaFromId(params.formulaId);
  const lhs = formula.lhs(alpha, beta);
  const rhs = formula.rhs(formulaM, formulaD);

  return {
    alpha,
    beta,
    alphaNorm,
    betaNorm,
    formulaM,
    formulaD,
    visualM,
    visualD,
    formula,
    lhs,
    rhs,
    error: lhs - rhs,
    sameAngle: Math.abs(shortestAngleDelta(alphaNorm, betaNorm)) < (2 * Math.PI) / 180,
  };
}

export function circleGeometry(width: number, height: number): CircleGeometry {
  const m = Math.max(28, Math.min(width, height) * 0.1);
  const plot = { x: m, y: m, w: width - m * 2, h: height - m * 2 };
  const ratio = plot.h < 390 ? 0.28 : 0.32;
  const r = Math.min(plot.w, plot.h) * ratio;

  return {
    ...plot,
    cx: plot.x + plot.w * 0.5,
    cy: plot.y + plot.h * 0.47,
    r,
  };
}

export function polarPoint(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

export function unitToScreen(x: number, y: number, geo: CircleGeometry) {
  return { x: geo.cx + x * geo.r, y: geo.cy - y * geo.r };
}

export function getVisualCaption(reverseRead: boolean) {
  return reverseRead
    ? '積化和差：把乘積項反向讀成兩個角的和或差。'
    : '和差化積：兩角先拆成中點角 m 與偏移 d，再讀取對應分量。';
}

function toCurvePoint(x: number, y: number, theta: number, scale = 42): CurvePoint {
  return {
    x: x * scale,
    y: -y * scale,
    theta,
    arcLength: Math.hypot(x, y) * scale,
  };
}

export function sampleTrigAngleIdentitiesThumbnail(): ThumbnailSpec {
  const alpha = (2 * Math.PI) / 3;
  const beta = Math.PI / 6;
  const O = { x: 0, y: 0 };
  const A = { x: Math.cos(alpha), y: Math.sin(alpha) };
  const B = { x: Math.cos(beta), y: Math.sin(beta) };

  return {
    paths: [
      {
        points: [toCurvePoint(O.x, O.y, 0), toCurvePoint(A.x, A.y, 1)],
        strokeWidth: 1.6,
      },
      {
        points: [toCurvePoint(O.x, O.y, 0), toCurvePoint(B.x, B.y, 1)],
        strokeWidth: 1.3,
        opacity: 0.72,
      },
      {
        points: [toCurvePoint(A.x, A.y, 1), toCurvePoint(B.x, B.y, 2)],
        opacity: 0.22,
        strokeWidth: 0.8,
      },
    ],
    circles: [
      {
        x: 0,
        y: 0,
        r: 42,
        strokeWidth: 0.9,
        opacity: 0.28,
      },
    ],
  };
}
