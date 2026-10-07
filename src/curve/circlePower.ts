import type { CurvePoint, ThumbnailSpec } from './types';

/** 圓外點的割線與切線。側欄乘積由交點距離算出，不把 p²−1 填進去。 */

export type Point = { x: number; y: number };

export type SegmentPair = {
  nearPoint: Point;
  farPoint: Point;
  near: number;
  far: number;
  /** near × far，用未捨入的長度。 */
  product: number;
};

export type Tangent = {
  point: Point;
  length: number;
  /** 切線段長的平方，用未捨入的長度。 */
  square: number;
};

export const P_MIN = 1.35;
export const P_MAX = 2.4;
export const P_DEFAULT = 1.8;

/** 再小的話，斜線交點會和水平線的 A、B 疊在一起。 */
export const THETA_MIN_DEG = 8;
export const THETA_DEFAULT_DEG = 18;

/**
 * 直線離圓心的距離停在這裡，不到半徑 1。
 * 這是裕度，讓兩個交點在變成切點之前就停住。
 */
export const TANGENT_MARGIN = 0.92;

/** 三頁共用。寬高都是 4.1，圓才不會被拉成橢圓。p = 2.4 的點與切線段留在框內。 */
export const VIEW = {
  x0: -1.4,
  x1: 2.7,
  y0: -2.05,
  y1: 2.05,
};

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

export function clampP(value: number): number {
  return clamp(value, P_MIN, P_MAX);
}

/** 偏角上限（度）。0.92 見 TANGENT_MARGIN。 */
export function thetaMaxDeg(p: number): number {
  return (Math.asin(TANGENT_MARGIN / clampP(p)) * 180) / Math.PI;
}

export function clampTheta(p: number, thetaDeg: number): number {
  return clamp(thetaDeg, THETA_MIN_DEG, thetaMaxDeg(p));
}

export function settle(p: number, thetaDeg: number): { p: number; thetaDeg: number } {
  const nextP = clampP(p);
  return { p: nextP, thetaDeg: clampTheta(nextP, thetaDeg) };
}

/**
 * 四捨五入到小數第三位後再顯示。
 * 0.8225 → 0.823。乘積要先用未捨入長度相乘，再進來這裡。
 */
export function format3(value: number): string {
  const sign = value < 0 ? -1 : 1;
  const scaled = Math.round(Math.abs(value) * 1000 + 1e-8);
  const whole = Math.floor(scaled / 1000);
  const frac = String(scaled % 1000).padStart(3, '0');
  return `${sign < 0 ? '-' : ''}${whole}.${frac}`;
}

export function formatDegrees(thetaDeg: number): string {
  return `${thetaDeg.toFixed(1)}°`;
}

export function exteriorPoint(p: number): Point {
  return { x: clampP(p), y: 0 };
}

function pair(origin: Point, nearPoint: Point, farPoint: Point): SegmentPair {
  const near = Math.hypot(nearPoint.x - origin.x, nearPoint.y - origin.y);
  const far = Math.hypot(farPoint.x - origin.x, farPoint.y - origin.y);
  return { nearPoint, farPoint, near, far, product: near * far };
}

/** 水平割線。過圓心只為把 A、B 釘在 (1,0)、(-1,0)。 */
export function horizontalSecant(p: number): SegmentPair {
  return pair(exteriorPoint(p), { x: 1, y: 0 }, { x: -1, y: 0 });
}

/** 向上偏的割線。近端是離 P 較近的那個交點。 */
export function slantedSecant(p: number, thetaDeg: number): SegmentPair {
  const settled = settle(p, thetaDeg);
  const theta = (settled.thetaDeg * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const origin = exteriorPoint(settled.p);
  const root = Math.sqrt(Math.max(0, 1 - settled.p * settled.p * sin * sin));
  const tNear = settled.p * cos - root;
  const tFar = settled.p * cos + root;
  const at = (t: number): Point => ({
    x: origin.x - t * cos,
    y: origin.y + t * sin,
  });
  return pair(origin, at(tNear), at(tFar));
}

/** 上側切點。下側等長，圖上不畫。 */
export function upperTangent(p: number): Tangent {
  const origin = exteriorPoint(p);
  const x = 1 / origin.x;
  const point = { x, y: Math.sqrt(Math.max(0, 1 - x * x)) };
  const length = Math.hypot(point.x - origin.x, point.y - origin.y);
  return { point, length, square: length * length };
}

export function plotFrame(width: number, height: number): PlotRect {
  const pad = 18;
  const span = VIEW.x1 - VIEW.x0;
  const scale = Math.min((width - pad * 2) / span, (height - pad * 2) / span);
  const side = Math.max(1, scale * span);
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

function thumbPoint(point: Point): { x: number; y: number; theta: number; arcLength: number } {
  return { x: point.x, y: point.y, theta: 0, arcLength: 0 };
}

/** 縮圖只收圓與線上的點，不收標籤。 */
export function sampleCirclePowerThumbnail(
  kind: 'two-secants' | 'tangent-secant',
  p: number,
  thetaDeg: number,
): ThumbnailSpec {
  const origin = exteriorPoint(p);
  const boundary: CurvePoint[] = [];
  for (let i = 0; i <= 72; i += 1) {
    const t = (2 * Math.PI * i) / 72;
    boundary.push(thumbPoint({ x: Math.cos(t), y: Math.sin(t) }));
  }
  const lineOf = (far: Point) => [thumbPoint(origin), thumbPoint(far)];
  const horizontal = horizontalSecant(p);
  const slanted = slantedSecant(p, thetaDeg);
  const tangent = upperTangent(p);
  const lines =
    kind === 'two-secants'
      ? [lineOf(horizontal.farPoint), lineOf(slanted.farPoint)]
      : [lineOf(slanted.farPoint), lineOf(tangent.point)];
  return {
    paths: [
      { points: boundary, closed: true, stroke: '#ffffff', strokeWidth: 1, opacity: 0.35 },
      ...lines.map((points) => ({
        points,
        stroke: '#d4b87a',
        strokeWidth: 1.4,
        opacity: 0.9,
      })),
    ],
  };
}
