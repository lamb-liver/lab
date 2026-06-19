import { TWO_PI } from '../../constants';
import type { CurvePoint, ThumbnailSpec } from '../../types';

export const TAU = Math.PI * 2;
export const THETA_MIN = -Math.PI;
export const THETA_MAX = TAU * 2;
export const SMOOTH_RATE_PER_SEC = 14;

export type RadiusMode = 'unit' | 'double';

export type RadianArcLengthParams = {
  theta: number;
  radiusMode: RadiusMode;
  showSpecialAngles: boolean;
};

export type CircleLayout = {
  cx: number;
  cy: number;
  r: number;
  maxR: number;
};

export const DEFAULT_RADIAN_ARC_LENGTH_PARAMS: RadianArcLengthParams = {
  theta: Math.PI * 0.82,
  radiusMode: 'unit',
  showSpecialAngles: true,
};

export const RADIUS_BY_MODE: Record<RadiusMode, number> = {
  unit: 1,
  double: 2,
};

export const SPECIAL_ANGLES = [
  { angle: Math.PI / 6, label: 'π/6' },
  { angle: Math.PI / 4, label: 'π/4' },
  { angle: Math.PI / 3, label: 'π/3' },
  { angle: Math.PI / 2, label: 'π/2' },
  { angle: Math.PI, label: 'π' },
] as const;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function radiusFromMode(mode: RadiusMode) {
  return RADIUS_BY_MODE[mode] ?? 1;
}

export function arcLength(theta: number, radiusMode: RadiusMode) {
  return theta * radiusFromMode(radiusMode);
}

export function asRadianArcLengthParams(
  params: Partial<RadianArcLengthParams> & Record<string, unknown>,
): RadianArcLengthParams {
  const rawRadius = params.radiusMode ?? (params.radius === 2 ? 'double' : 'unit');
  const radiusMode = rawRadius === 'double' ? 'double' : 'unit';
  const showSpecialAngles = params.showSpecialAngles as unknown;

  return {
    theta: Number(params.theta ?? DEFAULT_RADIAN_ARC_LENGTH_PARAMS.theta),
    radiusMode,
    showSpecialAngles:
      showSpecialAngles === undefined
        ? DEFAULT_RADIAN_ARC_LENGTH_PARAMS.showSpecialAngles
        : showSpecialAngles === true || showSpecialAngles === 1,
  };
}

export function equivalentAngle(theta: number) {
  let a = theta % TAU;
  if (a > Math.PI) a -= TAU;
  if (a <= -Math.PI) a += TAU;
  return Object.is(a, -0) ? 0 : a;
}

export function setCircularTarget(current: number, rawAngle: number) {
  const next = rawAngle + Math.round((current - rawAngle) / TAU) * TAU;
  return clamp(next, THETA_MIN, THETA_MAX);
}

export function circleLayout(width: number, height: number, radiusMode: RadiusMode): CircleLayout {
  const pad = Math.max(30, Math.min(width, height) * 0.1);
  const visualW = Math.max(120, width - pad * 2);
  const visualH = Math.max(120, height - pad * 2);
  const maxR = Math.min(visualW * 0.34, visualH * 0.35, 168);
  const scale = radiusFromMode(radiusMode) === 1 ? 0.72 : 1;

  return {
    cx: width * 0.5,
    cy: height * 0.48,
    r: maxR * scale,
    maxR,
  };
}

export function pointOnCircle(theta: number, circle: CircleLayout) {
  return {
    x: circle.cx + Math.cos(theta) * circle.r,
    y: circle.cy - Math.sin(theta) * circle.r,
  };
}

export function thetaFromPoint(currentTheta: number, x: number, y: number, circle: CircleLayout) {
  const raw = Math.atan2(circle.cy - y, x - circle.cx);
  return setCircularTarget(currentTheta, raw);
}

export function pickThetaDrag(x: number, y: number, circle: CircleLayout) {
  return Math.hypot(x - circle.cx, y - circle.cy) <= circle.r + 28;
}

export function fmt(v: number, digits = 2) {
  if (!Number.isFinite(v)) return '—';
  if (Object.is(v, -0) || Math.abs(v) < 0.005) return '0';
  return Number(v.toFixed(digits)).toString();
}

export function formatDeg(theta: number) {
  return `${fmt((theta * 180) / Math.PI, 1)}°`;
}

export function formatArcLength(value: number) {
  return fmt(value, 2);
}

export function formatRad(theta: number) {
  const candidates = [
    [-Math.PI, '-π'],
    [-Math.PI / 2, '-π/2'],
    [0, '0'],
    [Math.PI / 6, 'π/6'],
    [Math.PI / 4, 'π/4'],
    [Math.PI / 3, 'π/3'],
    [Math.PI / 2, 'π/2'],
    [Math.PI, 'π'],
    [Math.PI * 1.5, '3π/2'],
    [TAU, '2π'],
    [Math.PI * 2.5, '5π/2'],
    [Math.PI * 3, '3π'],
    [Math.PI * 4, '4π'],
  ] as const;

  for (const [value, label] of candidates) {
    if (Math.abs(theta - value) < 0.025) return label;
  }

  return fmt(theta, 2);
}

function toCurvePoint(x: number, y: number, theta: number, scale = 40): CurvePoint {
  return {
    x: x * scale,
    y: -y * scale,
    theta,
    arcLength: Math.hypot(x, y) * scale,
  };
}

function circlePoints(radius: number, scale: number): CurvePoint[] {
  const step = TWO_PI / 56;
  const points: CurvePoint[] = [];
  for (let a = 0; a <= TWO_PI + step; a += step) {
    points.push(toCurvePoint(Math.cos(a) * radius, Math.sin(a) * radius, a, scale));
  }
  return points;
}

function arcPoints(theta: number, radius: number, scale: number): CurvePoint[] {
  const steps = Math.max(12, Math.ceil(Math.abs(theta) / 0.08));
  const points: CurvePoint[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = theta * (i / steps);
    points.push(toCurvePoint(Math.cos(a) * radius, Math.sin(a) * radius, a, scale));
  }
  return points;
}

export function sampleRadianArcLengthThumbnail(): ThumbnailSpec {
  const scale = 34;
  const theta = Math.PI * 0.82;
  const radius = 1.45;
  const P = { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius };

  return {
    paths: [
      {
        points: circlePoints(radius, scale),
        opacity: 0.32,
        strokeWidth: 0.8,
        excludeFromBbox: true,
      },
      {
        points: circlePoints(1, scale),
        opacity: 0.12,
        strokeWidth: 0.6,
        excludeFromBbox: true,
      },
      {
        points: arcPoints(theta, radius * 0.84, scale),
        strokeWidth: 2,
      },
      {
        points: [toCurvePoint(0, 0, 0, scale), toCurvePoint(P.x, P.y, theta, scale)],
        strokeWidth: 1.4,
      },
    ],
    circles: [
      { x: P.x * scale, y: -P.y * scale, r: 2.8, opacity: 0.95 },
      { x: radius * scale, y: 0, r: 2, opacity: 0.38 },
    ],
  };
}
