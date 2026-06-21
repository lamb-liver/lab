import { TWO_PI } from '../../constants';
import type { CurvePoint, ThumbnailSpec } from '../../types';
import { expSmoothingFactor } from '../animationTiming';

export const TAU = Math.PI * 2;
export const EPS = 0.0001;
export const THETA_MIN = -TAU * 2;
export const THETA_MAX = TAU * 2;
export const TANGENT_LIMIT = 3.2;
export const SMOOTH_RATE_PER_SEC = 14;

export type UnitCircleTrigDefinitionParams = {
  theta: number;
  showRadians: boolean;
  showSpecialAngles: boolean;
  showQuadrants: boolean;
  showTangent: boolean;
};

export type UnitCircleSmoothState = {
  theta: number;
  quadrantMix: number;
  specialMix: number;
  tangentMix: number;
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

export type SpecialAngle = {
  angle: number;
  label: string;
  cos: string;
  sin: string;
};

export const SPECIAL_ANGLES: SpecialAngle[] = [
  { angle: 0, label: '0°', cos: '1', sin: '0' },
  { angle: Math.PI / 6, label: '30°', cos: '√3/2', sin: '1/2' },
  { angle: Math.PI / 4, label: '45°', cos: '√2/2', sin: '√2/2' },
  { angle: Math.PI / 3, label: '60°', cos: '1/2', sin: '√3/2' },
  { angle: Math.PI / 2, label: '90°', cos: '0', sin: '1' },
  { angle: Math.PI, label: '180°', cos: '-1', sin: '0' },
  { angle: (3 * Math.PI) / 2, label: '270°', cos: '0', sin: '-1' },
];

export const DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS: UnitCircleTrigDefinitionParams = {
  theta: Math.PI / 4,
  showRadians: false,
  showSpecialAngles: true,
  showQuadrants: true,
  showTangent: true,
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

export function signLabel(v: number) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < EPS) return '0';
  return v > 0 ? '+' : '−';
}

export function quadrantLabel(thetaNorm: number) {
  const c = Math.cos(thetaNorm);
  const s = Math.sin(thetaNorm);

  if (Math.abs(s) < EPS && c > 0) return '正 x 軸';
  if (Math.abs(c) < EPS && s > 0) return '正 y 軸';
  if (Math.abs(s) < EPS && c < 0) return '負 x 軸';
  if (Math.abs(c) < EPS && s < 0) return '負 y 軸';
  if (c > 0 && s > 0) return '第一象限';
  if (c < 0 && s > 0) return '第二象限';
  if (c < 0 && s < 0) return '第三象限';
  return '第四象限';
}

export function asUnitCircleParams(
  params: Partial<UnitCircleTrigDefinitionParams> & Record<string, unknown>,
): UnitCircleTrigDefinitionParams {
  return {
    theta: params.theta ?? DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.theta,
    showRadians: params.showRadians ?? DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.showRadians,
    showSpecialAngles:
      params.showSpecialAngles ?? DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.showSpecialAngles,
    showQuadrants: params.showQuadrants ?? DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.showQuadrants,
    showTangent: params.showTangent ?? DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.showTangent,
  };
}

export function setCircularTarget(current: number, normalizedValue: number) {
  const currentNorm = normalizeAngle(current);
  const delta = shortestAngleDelta(currentNorm, normalizedValue);
  return clamp(current + delta, THETA_MIN, THETA_MAX);
}

export function stepUnitCircleSmoothing(
  smooth: UnitCircleSmoothState,
  params: UnitCircleTrigDefinitionParams,
  deltaMs: number,
): UnitCircleSmoothState {
  const k = expSmoothingFactor(deltaMs, SMOOTH_RATE_PER_SEC);

  return {
    theta: smooth.theta + (params.theta - smooth.theta) * k,
    quadrantMix: smooth.quadrantMix + ((params.showQuadrants ? 1 : 0) - smooth.quadrantMix) * k,
    specialMix: smooth.specialMix + ((params.showSpecialAngles ? 1 : 0) - smooth.specialMix) * k,
    tangentMix: smooth.tangentMix + ((params.showTangent ? 1 : 0) - smooth.tangentMix) * k,
  };
}

export function circleGeometry(
  width: number,
  height: number,
  showSpecialAngles: boolean,
): CircleGeometry {
  const m = Math.max(28, Math.min(width, height) * 0.1);
  const plot = { x: m, y: m, w: width - m * 2, h: height - m * 2 };
  const extraBottom = showSpecialAngles ? 18 : 0;
  const ratio = plot.h < 390 ? 0.28 : 0.34;
  const r = Math.min(plot.w, plot.h - extraBottom) * ratio;

  return {
    ...plot,
    cx: plot.x + plot.w * 0.5,
    cy: plot.y + plot.h * 0.47,
    r,
  };
}

export function unitToScreen(x: number, y: number, geo: CircleGeometry) {
  return { x: geo.cx + x * geo.r, y: geo.cy - y * geo.r };
}

export function polarPoint(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

export function nearestSpecialAngle(thetaNorm: number) {
  let best: SpecialAngle | null = null;
  let bestDistance = Infinity;

  for (const item of SPECIAL_ANGLES) {
    const d = Math.abs(shortestAngleDelta(thetaNorm, item.angle));
    if (d < bestDistance) {
      bestDistance = d;
      best = item;
    }
  }

  return best ? { item: best, distance: bestDistance } : null;
}

export function getTrigValues(thetaNorm: number) {
  const cosValue = Math.cos(thetaNorm);
  const sinValue = Math.sin(thetaNorm);
  const tanValue = Math.abs(cosValue) < EPS ? NaN : sinValue / cosValue;
  return { cosValue, sinValue, tanValue };
}

export function getVisualCaption(thetaNorm: number) {
  const { cosValue, sinValue, tanValue } = getTrigValues(thetaNorm);
  const q = quadrantLabel(thetaNorm);
  let textValue = `${q}：cos ${signLabel(cosValue)}，sin ${signLabel(sinValue)}`;
  if (!Number.isFinite(tanValue)) textValue += '，tan 未定義';
  else textValue += `，tan ${signLabel(tanValue)}`;
  return textValue;
}

function toCurvePoint(x: number, y: number, theta: number, scale = 42): CurvePoint {
  return {
    x: x * scale,
    y: -y * scale,
    theta,
    arcLength: Math.hypot(x, y) * scale,
  };
}

function sampleUnitCircleOutline(scale: number): CurvePoint[] {
  const step = TWO_PI / 48;
  const points: CurvePoint[] = [];
  for (let a = 0; a <= TWO_PI + step; a += step) {
    points.push(toCurvePoint(Math.cos(a), Math.sin(a), a, scale));
  }
  return points;
}

export function sampleUnitCircleTrigDefinitionThumbnail(): ThumbnailSpec {
  const scale = 42;
  const theta = Math.PI / 4;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const O = { x: 0, y: 0 };
  const P = { x: c, y: s };
  const X = { x: c, y: 0 };
  const Y = { x: 0, y: s };

  return {
    paths: [
      {
        points: sampleUnitCircleOutline(scale),
        opacity: 0.35,
        strokeWidth: 0.8,
        excludeFromBbox: true,
      },
      {
        points: [toCurvePoint(O.x, O.y, 0, scale), toCurvePoint(P.x, P.y, 1, scale)],
        strokeWidth: 1.6,
      },
      {
        points: [toCurvePoint(P.x, P.y, 1, scale), toCurvePoint(X.x, X.y, 2, scale)],
        opacity: 0.28,
        strokeWidth: 0.9,
      },
      {
        points: [toCurvePoint(P.x, P.y, 2, scale), toCurvePoint(Y.x, Y.y, 3, scale)],
        opacity: 0.28,
        strokeWidth: 0.9,
      },
    ],
  };
}
