import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

/** 長軸是 2 的橢圓。e 是離心率，tDeg 是切點的離心角，從長軸正方向量起。 */
export type EllipseTangentParams = {
  e: number;
  tDeg: number;
};

export const E_MIN = 0.25;
export const E_MAX = 0.85;
export const T_MIN = 20;
export const T_MAX = 160;

export const DEFAULT_ELLIPSE_TANGENT_PARAMS: EllipseTangentParams = {
  e: 0.6,
  tDeg: 55,
};

/** 切線段留在畫面內。 */
export const VIEW = {
  x0: -1.55,
  x1: 1.55,
  y0: -1.55,
  y1: 1.55,
};

export type Vec = { x: number; y: number };

export type PlotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampEllipseTangent(
  params: Partial<EllipseTangentParams> | ParamValues,
): EllipseTangentParams {
  return {
    e: clamp(Number(params.e ?? DEFAULT_ELLIPSE_TANGENT_PARAMS.e), E_MIN, E_MAX),
    tDeg: clamp(Number(params.tDeg ?? DEFAULT_ELLIPSE_TANGENT_PARAMS.tDeg), T_MIN, T_MAX),
  };
}

export function semiMinor(e: number): number {
  return Math.sqrt(1 - e * e);
}

function radians(tDeg: number): number {
  return (tDeg * Math.PI) / 180;
}

export function pointOnEllipse(e: number, tDeg: number): Vec {
  const t = radians(tDeg);
  return { x: Math.cos(t), y: semiMinor(e) * Math.sin(t) };
}

export function foci(e: number): [Vec, Vec] {
  return [
    { x: -e, y: 0 },
    { x: e, y: 0 },
  ];
}

/** 切線方向。r'(t) = (−sin t, b cos t)，長度不會是 0。 */
export function tangentUnit(e: number, tDeg: number): Vec {
  const t = radians(tDeg);
  const x = -Math.sin(t);
  const y = semiMinor(e) * Math.cos(t);
  const len = Math.hypot(x, y);
  return { x: x / len, y: y / len };
}

export function ellipsePoints(e: number, steps: number): Vec[] {
  const points: Vec[] = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push(pointOnEllipse(e, (360 * i) / steps));
  }
  return points;
}

function distance(a: Vec, b: Vec): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 直線與焦半徑的夾角，取 0° 到 90°。 */
export function lineAngleDegrees(tangent: Vec, from: Vec, to: Vec): number {
  const vx = to.x - from.x;
  const vy = to.y - from.y;
  const len = Math.hypot(vx, vy);
  const dot = Math.abs(tangent.x * vx + tangent.y * vy) / len;
  return (Math.acos(Math.min(1, dot)) * 180) / Math.PI;
}

export type EllipseTangentReading = {
  p: Vec;
  f1: Vec;
  f2: Vec;
  tangent: Vec;
  sum: number;
  angle1: number;
  angle2: number;
};

export function readEllipseTangent(raw: EllipseTangentParams): EllipseTangentReading {
  const params = clampEllipseTangent(raw);
  const p = pointOnEllipse(params.e, params.tDeg);
  const [f1, f2] = foci(params.e);
  const tangent = tangentUnit(params.e, params.tDeg);
  return {
    p,
    f1,
    f2,
    tangent,
    sum: distance(p, f1) + distance(p, f2),
    angle1: lineAngleDegrees(tangent, p, f1),
    angle2: lineAngleDegrees(tangent, p, f2),
  };
}

/** 把點對切線做反射。反射後的另一焦點落在第一焦點與切點的直線上，而且距離和是 2。 */
export function reflectAcrossTangent(q: Vec, origin: Vec, tangent: Vec): Vec {
  const wx = q.x - origin.x;
  const wy = q.y - origin.y;
  const proj = wx * tangent.x + wy * tangent.y;
  const footX = origin.x + proj * tangent.x;
  const footY = origin.y + proj * tangent.y;
  return { x: 2 * footX - q.x, y: 2 * footY - q.y };
}

export function formatDegrees(degrees: number): string {
  return `${degrees.toFixed(1)}°`;
}

export function plotSquare(width: number, height: number): PlotRect {
  const pad = 18;
  const side = Math.max(1, Math.min(width, height) - pad * 2);
  return {
    left: (width - side) / 2,
    top: (height - side) / 2,
    width: side,
    height: side,
  };
}

export function mapX(plot: PlotRect, x: number): number {
  return plot.left + ((x - VIEW.x0) / (VIEW.x1 - VIEW.x0)) * plot.width;
}

export function mapY(plot: PlotRect, y: number): number {
  return plot.top + ((VIEW.y1 - y) / (VIEW.y1 - VIEW.y0)) * plot.height;
}

function point(x: number, y: number): CurvePoint {
  return { x, y, theta: 0, arcLength: 0 };
}

export function sampleEllipseTangentThumbnail(params: EllipseTangentParams): ThumbnailSpec {
  const reading = readEllipseTangent(params);
  const half = 0.75;
  const tangentEnd = (sign: number): Vec => ({
    x: reading.p.x + sign * half * reading.tangent.x,
    y: reading.p.y + sign * half * reading.tangent.y,
  });
  return {
    paths: [
      {
        points: ellipsePoints(params.e, 96).map((p) => point(p.x, p.y)),
        closed: true,
        stroke: '#d4b87a',
        strokeWidth: 1.4,
        opacity: 0.9,
      },
      {
        points: [point(reading.f1.x, reading.f1.y), point(reading.p.x, reading.p.y)],
        stroke: '#d4b87a',
        strokeWidth: 1.1,
        opacity: 0.55,
      },
      {
        points: [point(reading.f2.x, reading.f2.y), point(reading.p.x, reading.p.y)],
        stroke: '#d4b87a',
        strokeWidth: 1.1,
        opacity: 0.55,
      },
      {
        points: [point(tangentEnd(-1).x, tangentEnd(-1).y), point(tangentEnd(1).x, tangentEnd(1).y)],
        stroke: '#ffffff',
        strokeWidth: 1.2,
        opacity: 0.8,
      },
    ],
    circles: [
      { x: reading.f1.x, y: reading.f1.y, r: 0.045, fill: '#d4b87a' },
      { x: reading.f2.x, y: reading.f2.y, r: 0.045, fill: '#d4b87a' },
      { x: reading.p.x, y: reading.p.y, r: 0.05, fill: '#ffffff' },
    ],
  };
}
