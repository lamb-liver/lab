import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  addVec3,
  degToRad,
  directionFromAngles,
  dotVec3,
  lengthVec3,
  planeQuad,
  project,
  scaleVec3,
  subVec3,
  vec3,
  type Projected,
  type Vec3,
  type ViewAngles,
} from '../../projection3d';

export type PlaneNormalDistanceParams = {
  /** 平面法向的仰角與方位，單位為度 */
  planeTilt: number;
  planeAzimuth: number;
  /** 以單位法向表示時的平面常數：n̂·r = h */
  h: number;
  /** 測試點 P₁ 沿 z 軸的高度與沿 x 軸的水平位置 */
  pointZ: number;
  pointX: number;
  /**
   * 方程尺度：一般式寫成 (k·n̂)·r = k·h。
   * 同乘非零常數不改變平面本身，只改變係數的大小。
   */
  scale: number;
  /** 觀察角度，單位為度 */
  yaw: number;
  pitch: number;
};

export type PlaneNormalDistanceMetrics = {
  /** 單位法向 */
  unitNormal: Vec3;
  /** 一般式實際使用的係數 (a, b, c) 與常數 h，會隨 scale 變化 */
  coefficients: Vec3;
  constant: number;
  point: Vec3;
  /** n̂·P₁ − h：帶號距離，正負代表測試點在法向的哪一側 */
  signedDistance: number;
  distance: number;
  /** 測試點在平面上的垂足 */
  foot: Vec3;
};

export const AXIS_LIMIT = 3;
export const PLANE_HALF = 2.1;

export const DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS: PlaneNormalDistanceParams = {
  planeTilt: 68,
  planeAzimuth: 28,
  h: 0.4,
  pointZ: 1.8,
  pointX: 1.2,
  scale: 1,
  yaw: 36,
  pitch: 24,
};

export function viewFromParams(params: PlaneNormalDistanceParams): ViewAngles {
  return { yaw: degToRad(params.yaw), pitch: degToRad(params.pitch) };
}

export function computePlaneNormalDistanceMetrics(
  params: PlaneNormalDistanceParams,
): PlaneNormalDistanceMetrics {
  const unitNormal = directionFromAngles(params.planeTilt, params.planeAzimuth);
  const point = vec3(params.pointX, 0, params.pointZ);

  // 距離用單位法向算：n̂·P₁ − h 本身就是帶號距離，不必再除以 ‖n‖
  const signedDistance = dotVec3(unitNormal, point) - params.h;

  return {
    unitNormal,
    coefficients: scaleVec3(unitNormal, params.scale),
    constant: params.h * params.scale,
    point,
    signedDistance,
    distance: Math.abs(signedDistance),
    foot: subVec3(point, scaleVec3(unitNormal, signedDistance)),
  };
}

/**
 * 一般式的距離公式：|a x₁ + b y₁ + c z₁ − h| / ‖n‖。
 * 這裡刻意用縮放後的係數計算，用來驗證結果與尺度無關。
 */
export function distanceFromGeneralForm(
  coefficients: Vec3,
  constant: number,
  point: Vec3,
): number {
  const norm = lengthVec3(coefficients);
  if (norm < 1e-9) return Number.NaN;
  return Math.abs(dotVec3(coefficients, point) - constant) / norm;
}

export function formatGeneralForm(coefficients: Vec3, constant: number): string {
  // 全式統一用 U+2212 減號：toFixed 會給 ASCII 連字號，混用時同一行會出現兩種減號
  const signed = (value: number) => value.toFixed(2).replace('-', '−');
  const follow = (value: number, name: string) =>
    `${value < 0 ? ' − ' : ' + '}${Math.abs(value).toFixed(2)}${name}`;
  return `${signed(coefficients.x)}x${follow(coefficients.y, 'y')}${follow(
    coefficients.z,
    'z',
  )} = ${signed(constant)}`;
}

// ── 縮圖 ────────────────────────────────────────────────────────────────

/** 平面半對角 2.1·√2 ≈ 2.97 加上錨點 |h| ≤ 2，以及測試點 |P| ≤ √(3²+3²)；約 4.3 以內 */
const THUMBNAIL_SCALE = 64;
const GOLD_STROKE = 'rgb(212, 184, 122)';
const PLANE_STROKE = 'rgba(160, 205, 255, 0.75)';
const PLANE_FILL = 'rgba(160, 205, 255, 0.12)';
const NORMAL_STROKE = 'rgba(164, 225, 176, 0.9)';

function toCurvePoint(point: Projected, index: number): CurvePoint {
  return {
    x: point.x * THUMBNAIL_SCALE,
    y: point.y * THUMBNAIL_SCALE,
    theta: index,
    arcLength: index,
  };
}

function segment(from: Vec3, to: Vec3, view: ViewAngles): CurvePoint[] {
  return [project(from, view), project(to, view)].map(toCurvePoint);
}

export function samplePlaneNormalDistanceThumbnail(
  params: PlaneNormalDistanceParams,
): ThumbnailSpec {
  const view = viewFromParams(params);
  const metrics = computePlaneNormalDistanceMetrics(params);
  const quad = planeQuad(metrics.unitNormal, params.h, PLANE_HALF)
    .map((corner) => project(corner, view))
    .map(toCurvePoint);
  const anchor = scaleVec3(metrics.unitNormal, params.h);

  return {
    paths: [
      { points: quad, closed: true, stroke: PLANE_STROKE, fill: PLANE_FILL, strokeWidth: 2.5 },
      {
        points: segment(anchor, addVec3(anchor, metrics.unitNormal), view),
        stroke: NORMAL_STROKE,
        strokeWidth: 3,
      },
      { points: segment(metrics.foot, metrics.point, view), stroke: GOLD_STROKE, strokeWidth: 4 },
    ],
  };
}

// 共用的向量數學集中在 projection3d，這裡再匯出讓呼叫端不必知道它搬過家
export { directionFromAngles, planeBasis, planeQuad, formatVec3 } from '../../projection3d';
