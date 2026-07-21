import {
  crossVec3,
  degToRad,
  directionFromAngles,
  dotVec3,
  formatVec3,
  lengthVec3,
  normalizeVec3,
  planeQuad,
  scaleVec3,
  subVec3,
  vec3,
  type Vec3,
  type ViewAngles,
} from '../../curve/projection3d';

/**
 * 三種讀法作用在同一個場景上：一支向量 v，以及由 a、b 張成的平面。
 * 切換讀法只改變強調什麼，不換題目。
 */
export type ReadingMode = 'position' | 'direction' | 'relation';

export type SpaceVectorsParams = {
  vx: number;
  vy: number;
  vz: number;
  /** 平面朝向：法向的仰角與方位，單位為度 */
  planeTilt: number;
  planeAzimuth: number;
  /** 平面位移：n̂·r = h */
  h: number;
  /** 觀察角度，單位為度 */
  yaw: number;
  pitch: number;
  mode: ReadingMode;
};

/** v 與平面的三種關係 */
export type RelationState = 'inPlane' | 'parallel' | 'apart';

export type SpaceVectorsMetrics = {
  v: Vec3;
  unitNormal: Vec3;
  /** 張成該平面的兩支向量，由法向推得 */
  a: Vec3;
  b: Vec3;
  /** 三個坐標平面上的影子 */
  shadows: Array<{ plane: 'xy' | 'xz' | 'yz'; vector: Vec3 }>;
  /** n̂·v：為零表示 v 的方向落在平面內 */
  normalComponent: number;
  /** n̂·v − h：v 端點到平面的帶號距離 */
  signedDistance: number;
  state: RelationState;
};

export const AXIS_LIMIT = 3;
export const PLANE_HALF = 2.1;
/** 與 line-plane-intersection 的退化判定用同一個量級；預設按鈕給的是精確的 0 */
const IN_PLANE_EPS = 1e-3;

export const DEFAULT_SPACE_VECTORS_PARAMS: SpaceVectorsParams = {
  vx: 1.9,
  vy: 1.2,
  vz: 1.6,
  planeTilt: 78,
  planeAzimuth: 30,
  h: 0.5,
  yaw: 36,
  pitch: 24,
  mode: 'position',
};

export function viewFromParams(params: SpaceVectorsParams): ViewAngles {
  return { yaw: degToRad(params.yaw), pitch: degToRad(params.pitch) };
}

/**
 * 由法向反推一組張成該平面的 a、b。
 * 讀者操作的是平面朝向，但畫面仍要畫出「哪兩支向量張成它」。
 */
export function spanningVectors(unitNormal: Vec3): { a: Vec3; b: Vec3 } {
  const seed = Math.abs(unitNormal.z) > 0.9 ? vec3(1, 0, 0) : vec3(0, 0, 1);
  const a = normalizeVec3(crossVec3(unitNormal, seed));
  const b = normalizeVec3(crossVec3(unitNormal, a));
  return { a: scaleVec3(a, 1.7), b: scaleVec3(b, 1.7) };
}

export function computeSpaceVectorsMetrics(params: SpaceVectorsParams): SpaceVectorsMetrics {
  const v = vec3(params.vx, params.vy, params.vz);
  const unitNormal = directionFromAngles(params.planeTilt, params.planeAzimuth);
  const { a, b } = spanningVectors(unitNormal);

  const normalComponent = dotVec3(unitNormal, v);
  const signedDistance = normalComponent - params.h;

  const directionInPlane = Math.abs(normalComponent) < IN_PLANE_EPS;
  const state: RelationState = directionInPlane
    ? Math.abs(params.h) < IN_PLANE_EPS
      ? 'inPlane'
      : 'parallel'
    : 'apart';

  return {
    v,
    unitNormal,
    a,
    b,
    shadows: [
      { plane: 'xy', vector: vec3(v.x, v.y, 0) },
      { plane: 'xz', vector: vec3(v.x, 0, v.z) },
      { plane: 'yz', vector: vec3(0, v.y, v.z) },
    ],
    normalComponent,
    signedDistance,
    state,
  };
}

/** v 端點在平面上的垂足 */
export function footOnPlane(metrics: SpaceVectorsMetrics): Vec3 {
  return subVec3(metrics.v, scaleVec3(metrics.unitNormal, metrics.signedDistance));
}

export function stateLabel(state: RelationState): string {
  if (state === 'inPlane') return 'v 落在平面內';
  if (state === 'parallel') return 'v 平行於平面';
  return 'v 與平面有距離';
}

// 共用的向量數學集中在 projection3d，這裡再匯出讓呼叫端不必知道它搬過家
export { directionFromAngles, planeQuad, formatVec3 } from '../../curve/projection3d';
