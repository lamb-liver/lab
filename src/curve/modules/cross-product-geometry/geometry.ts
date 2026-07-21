import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  crossVec3,
  degToRad,
  formatVec3,
  lengthVec3,
  normalizeVec3,
  project,
  vec3,
  type Projected,
  type Vec3,
  type ViewAngles,
} from '../../projection3d';

export type CrossProductMode = 'area' | 'righthand';

export type CrossProductGeometryParams = {
  /** a 與 b 的夾角，單位為度 */
  theta: number;
  /** |b|；|a| 固定為 A_LENGTH，讓面積只隨 |b| 與 sinθ 改變 */
  lenB: number;
  /** b 繞 a 軸旋轉的角度，單位為度；改變張成平面的傾斜而不改變夾角 */
  phi: number;
  /** 觀察角度，單位為度 */
  yaw: number;
  pitch: number;
  mode: CrossProductMode;
};

export type CrossProductMetrics = {
  a: Vec3;
  b: Vec3;
  n: Vec3;
  unitN: Vec3;
  area: number;
  theta: number;
  sinTheta: number;
  /** 近共線或退化為零向量時，面積與法向都趨近於零 */
  isDegenerate: boolean;
};

export const A_LENGTH = 3;
const DEGENERATE_AREA = 0.12;

export const DEFAULT_CROSS_PRODUCT_PARAMS: CrossProductGeometryParams = {
  theta: 62,
  lenB: 2.4,
  phi: 24,
  yaw: 38,
  pitch: 26,
  mode: 'area',
};

export function viewFromParams(params: CrossProductGeometryParams): ViewAngles {
  return { yaw: degToRad(params.yaw), pitch: degToRad(params.pitch) };
}

/**
 * a 固定沿 x 軸；b 以夾角 θ 張開後再繞 a 軸轉 φ。
 *
 * 這個參數化讓 θ 恰好就是 a 與 b 的夾角（與 φ 無關），所以
 * |a × b| = |a||b|sinθ 這條關係可以單獨由 θ 與 |b| 驗證。
 */
export function vectorsFromParams(params: CrossProductGeometryParams): { a: Vec3; b: Vec3 } {
  const theta = degToRad(params.theta);
  const phi = degToRad(params.phi);
  const a = vec3(A_LENGTH, 0, 0);
  const b = vec3(
    params.lenB * Math.cos(theta),
    params.lenB * Math.sin(theta) * Math.cos(phi),
    params.lenB * Math.sin(theta) * Math.sin(phi),
  );
  return { a, b };
}

export function computeCrossProductMetrics(
  params: CrossProductGeometryParams,
): CrossProductMetrics {
  const { a, b } = vectorsFromParams(params);
  const n = crossVec3(a, b);
  const area = lengthVec3(n);
  const theta = degToRad(params.theta);

  return {
    a,
    b,
    n,
    unitN: normalizeVec3(n),
    area,
    theta,
    sinTheta: Math.sin(theta),
    isDegenerate: area < DEGENERATE_AREA,
  };
}

/** 平行四邊形的四個頂點：0 → a → a+b → b */
export function parallelogramVertices(a: Vec3, b: Vec3): Vec3[] {
  return [
    vec3(0, 0, 0),
    a,
    vec3(a.x + b.x, a.y + b.y, a.z + b.z),
    b,
  ];
}

/** 法向箭頭長度隨面積成長但設上限，避免面積大時箭頭衝出畫面 */
export function normalArrowTip(metrics: CrossProductMetrics): Vec3 {
  const scale = Math.min(3.2, 0.9 + metrics.area * 0.28);
  return {
    x: metrics.unitN.x * scale,
    y: metrics.unitN.y * scale,
    z: metrics.unitN.z * scale,
  };
}

export function projectPoints(points: Vec3[], view: ViewAngles): Projected[] {
  return points.map((point) => project(point, view));
}

// ── 縮圖 ────────────────────────────────────────────────────────────────

/** |a| + max|b| ≈ 7，乘上此尺度後仍落在 BASE_CANVAS_SIZE / 2 = 300 之內 */
const THUMBNAIL_SCALE = 38;
const GOLD_STROKE = 'rgb(212, 184, 122)';
const GOLD_FILL = 'rgba(212, 184, 122, 0.18)';
const BLUE_STROKE = 'rgba(160, 205, 255, 0.9)';
const GREEN_STROKE = 'rgba(164, 225, 176, 0.9)';

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

export function sampleCrossProductThumbnail(
  params: CrossProductGeometryParams,
): ThumbnailSpec {
  const view = viewFromParams(params);
  const metrics = computeCrossProductMetrics(params);
  const { a, b } = metrics;
  const quad = parallelogramVertices(a, b).map(project0(view)).map(toCurvePoint);

  return {
    paths: [
      { points: quad, closed: true, stroke: GOLD_STROKE, fill: GOLD_FILL, strokeWidth: 3 },
      { points: segment(vec3(0, 0, 0), a, view), stroke: BLUE_STROKE, strokeWidth: 4 },
      { points: segment(vec3(0, 0, 0), b, view), stroke: GREEN_STROKE, strokeWidth: 4 },
      {
        points: segment(vec3(0, 0, 0), normalArrowTip(metrics), view),
        stroke: GOLD_STROKE,
        strokeWidth: 4,
      },
    ],
  };
}

function project0(view: ViewAngles) {
  return (point: Vec3): Projected => project(point, view);
}

// 共用的向量數學集中在 projection3d，這裡再匯出讓呼叫端不必知道它搬過家
export { formatVec3 } from '../../projection3d';
