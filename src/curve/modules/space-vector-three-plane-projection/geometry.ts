import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  degToRad,
  formatVec3,
  lengthVec3,
  project,
  vec3,
  type Projected,
  type Vec3,
  type ViewAngles,
} from '../../projection3d';

/** 只看某一個坐標平面時，用 'all' 以外的值聚焦 */
export type ProjectionPlane = 'all' | 'xy' | 'xz' | 'yz';

export type SpaceVectorProjectionParams = {
  vx: number;
  vy: number;
  vz: number;
  /** 觀察角度，單位為度 */
  yaw: number;
  pitch: number;
  plane: ProjectionPlane;
};

export type PlaneProjection = {
  plane: Exclude<ProjectionPlane, 'all'>;
  label: string;
  /** 投影後的向量：把不屬於該平面的分量設為 0 */
  vector: Vec3;
  length: number;
  /** 這個平面保留的兩個分量名稱，用來說明重複分量如何互相校驗 */
  keeps: [string, string];
};

export const AXIS_LIMIT = 3.2;

export const DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS: SpaceVectorProjectionParams = {
  vx: 2.1,
  vy: 1.5,
  vz: 1.9,
  yaw: 36,
  pitch: 24,
  plane: 'all',
};

export function viewFromParams(params: SpaceVectorProjectionParams): ViewAngles {
  return { yaw: degToRad(params.yaw), pitch: degToRad(params.pitch) };
}

export function vectorFromParams(params: SpaceVectorProjectionParams): Vec3 {
  return vec3(params.vx, params.vy, params.vz);
}

/**
 * 投影到坐標平面就是把某一個分量設為零。
 * 三個投影兩兩共用一個分量，那個重複分量就是互相校驗的線索。
 */
export function projectionsOf(v: Vec3): PlaneProjection[] {
  return [
    {
      plane: 'xy',
      label: 'proj_xy',
      vector: vec3(v.x, v.y, 0),
      length: Math.hypot(v.x, v.y),
      keeps: ['x', 'y'],
    },
    {
      plane: 'xz',
      label: 'proj_xz',
      vector: vec3(v.x, 0, v.z),
      length: Math.hypot(v.x, v.z),
      keeps: ['x', 'z'],
    },
    {
      plane: 'yz',
      label: 'proj_yz',
      vector: vec3(0, v.y, v.z),
      length: Math.hypot(v.y, v.z),
      keeps: ['y', 'z'],
    },
  ];
}

export function visibleProjections(
  v: Vec3,
  plane: ProjectionPlane,
): PlaneProjection[] {
  const all = projectionsOf(v);
  if (plane === 'all') return all;
  return all.filter((item) => item.plane === plane);
}

export function vectorLength(params: SpaceVectorProjectionParams): number {
  return lengthVec3(vectorFromParams(params));
}

// ── 縮圖 ────────────────────────────────────────────────────────────────

/** |v| 最大約 √3·3.2 ≈ 5.5，乘上此尺度後仍落在 BASE_CANVAS_SIZE / 2 = 300 之內 */
const THUMBNAIL_SCALE = 48;
const GOLD_STROKE = 'rgb(212, 184, 122)';
const XY_STROKE = 'rgba(160, 205, 255, 0.9)';
const XZ_STROKE = 'rgba(164, 225, 176, 0.9)';
const YZ_STROKE = 'rgba(198, 166, 235, 0.9)';
const GUIDE_STROKE = 'rgba(255, 255, 255, 0.28)';

const PLANE_STROKE: Record<Exclude<ProjectionPlane, 'all'>, string> = {
  xy: XY_STROKE,
  xz: XZ_STROKE,
  yz: YZ_STROKE,
};

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

export function sampleSpaceVectorProjectionThumbnail(
  params: SpaceVectorProjectionParams,
): ThumbnailSpec {
  const view = viewFromParams(params);
  const v = vectorFromParams(params);
  const origin = vec3(0, 0, 0);
  const projections = visibleProjections(v, params.plane);

  return {
    paths: [
      ...projections.map((item) => ({
        points: segment(origin, item.vector, view),
        stroke: PLANE_STROKE[item.plane],
        strokeWidth: 3,
      })),
      // 由 v 的端點垂下到各影子端點的輔助線
      ...projections.map((item) => ({
        points: segment(v, item.vector, view),
        stroke: GUIDE_STROKE,
        strokeWidth: 1.5,
      })),
      { points: segment(origin, v, view), stroke: GOLD_STROKE, strokeWidth: 4 },
    ],
  };
}

// 共用的向量數學集中在 projection3d，這裡再匯出讓呼叫端不必知道它搬過家
export { formatVec3 } from '../../projection3d';
