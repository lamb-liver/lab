import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  addVec3,
  degToRad,
  directionFromAngles,
  dotVec3,
  planeQuad,
  project,
  scaleVec3,
  vec3,
  type Projected,
  type Vec3,
  type ViewAngles,
} from '../../projection3d';

/** n·d 是否為零，決定落在三種狀態的哪一種 */
export type IntersectionState = 'point' | 'parallel' | 'contained';

export type LinePlaneParams = {
  /** 平面法向的仰角與方位，單位為度 */
  planeTilt: number;
  planeAzimuth: number;
  /** 平面常數 h：n·r = h */
  h: number;
  /** 直線方向的仰角與方位，單位為度 */
  lineTilt: number;
  lineAzimuth: number;
  /** 直線起點沿 z 軸的高度 */
  originZ: number;
  /** 觀察角度，單位為度 */
  yaw: number;
  pitch: number;
};

export type LinePlaneMetrics = {
  n: Vec3;
  d: Vec3;
  r0: Vec3;
  /** n·d：為零表示直線與平面平行（含落在平面上） */
  nDotD: number;
  /** n·r0 − h：為零表示起點就在平面上 */
  offset: number;
  state: IntersectionState;
  /** 只有 state 為 'point' 時有意義 */
  t: number | null;
  point: Vec3 | null;
};

export const LINE_HALF_LENGTH = 3.4;
export const AXIS_LIMIT = 3.2;
const PARALLEL_EPS = 1e-3;
const ON_PLANE_EPS = 1e-3;

export const DEFAULT_LINE_PLANE_PARAMS: LinePlaneParams = {
  planeTilt: 76,
  planeAzimuth: 24,
  h: 0.6,
  lineTilt: 28,
  lineAzimuth: 108,
  originZ: -0.6,
  yaw: 34,
  pitch: 22,
};

export function viewFromParams(params: LinePlaneParams): ViewAngles {
  return { yaw: degToRad(params.yaw), pitch: degToRad(params.pitch) };
}

export function computeLinePlaneMetrics(params: LinePlaneParams): LinePlaneMetrics {
  const n = directionFromAngles(params.planeTilt, params.planeAzimuth);
  const d = directionFromAngles(params.lineTilt, params.lineAzimuth);
  const r0 = vec3(0, 0, params.originZ);

  const nDotD = dotVec3(n, d);
  const offset = dotVec3(n, r0) - params.h;

  if (Math.abs(nDotD) < PARALLEL_EPS) {
    return {
      n,
      d,
      r0,
      nDotD,
      offset,
      state: Math.abs(offset) < ON_PLANE_EPS ? 'contained' : 'parallel',
      t: null,
      point: null,
    };
  }

  const t = -offset / nDotD;
  return {
    n,
    d,
    r0,
    nDotD,
    offset,
    state: 'point',
    t,
    point: addVec3(r0, scaleVec3(d, t)),
  };
}

export function pointOnLine(metrics: LinePlaneMetrics, t: number): Vec3 {
  return addVec3(metrics.r0, scaleVec3(metrics.d, t));
}

export function stateLabel(state: IntersectionState): string {
  if (state === 'point') return '交於一點';
  if (state === 'parallel') return '平行且不相交';
  return '直線落在平面上';
}

// ── 縮圖 ────────────────────────────────────────────────────────────────

/**
 * 最壞情況：平面錨點 |h| ≤ 2 加上半對角 2.2·√2 ≈ 3.11，或起點 |r₀| ≤ 2 加線長 3.4，
 * 都約在 5.4 以內；乘上此尺度後仍落在 BASE_CANVAS_SIZE / 2 = 300 之內。
 */
const THUMBNAIL_SCALE = 52;
const PLANE_HALF = 2.2;
const GOLD_STROKE = 'rgb(212, 184, 122)';
const PLANE_STROKE = 'rgba(160, 205, 255, 0.75)';
const PLANE_FILL = 'rgba(160, 205, 255, 0.12)';

function toCurvePoint(point: Projected, index: number): CurvePoint {
  return {
    x: point.x * THUMBNAIL_SCALE,
    y: point.y * THUMBNAIL_SCALE,
    theta: index,
    arcLength: index,
  };
}

export function sampleLinePlaneThumbnail(params: LinePlaneParams): ThumbnailSpec {
  const view = viewFromParams(params);
  const metrics = computeLinePlaneMetrics(params);
  const quad = planeQuad(metrics.n, params.h, PLANE_HALF)
    .map((point) => project(point, view))
    .map(toCurvePoint);
  const line = [
    pointOnLine(metrics, -LINE_HALF_LENGTH),
    pointOnLine(metrics, LINE_HALF_LENGTH),
  ]
    .map((point) => project(point, view))
    .map(toCurvePoint);

  return {
    paths: [
      { points: quad, closed: true, stroke: PLANE_STROKE, fill: PLANE_FILL, strokeWidth: 2.5 },
      { points: line, stroke: GOLD_STROKE, strokeWidth: 4 },
    ],
  };
}

// 共用的向量數學集中在 projection3d，這裡再匯出讓呼叫端不必知道它搬過家
export { directionFromAngles, planeAnchor, planeBasis, planeQuad, formatVec3 } from '../../projection3d';
