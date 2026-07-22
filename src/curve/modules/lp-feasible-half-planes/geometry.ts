import {
  analyzeRegion,
  SCENE_MIN,
  clipLineToBox,
  constraint,
  constraintFromAngle,
  redundantIndices,
  regionArea,
  type Constraint,
  type FeasibleRegion,
  type Vec2,
} from '../../linearProgramming';
import type { CurvePoint, ThumbnailSpec } from '../../types';

/** 場景的世界座標半徑；約束線超出此範圍的部分不畫 */
export const AXIS_HALF = 10;

export type HalfPlaneView = 'mask' | 'region';

export type LpFeasibleHalfPlanesParams = {
  /** 正在編輯的可調約束，0–2 */
  selected: number;
  angle0: number;
  offset0: number;
  angle1: number;
  offset1: number;
  angle2: number;
  offset2: number;
  view: HalfPlaneView;
};

/**
 * x ≥ 0、y ≥ 0 固定在場景裡，寫成 ≤ 形式。
 * 課本的線性規劃題幾乎都帶著非負限制，把它們釘死可以讓三個可調約束
 * 專心示範「一條線切掉半個平面」，不必先花力氣把區域收進第一象限。
 */
const NON_NEGATIVE: Constraint[] = [
  constraint(-1, 0, 0, 'x ≥ 0'),
  constraint(0, -1, 0, 'y ≥ 0'),
];

/** 可調約束在 constraintsOf 回傳陣列中的起始位置 */
export const ADJUSTABLE_OFFSET = NON_NEGATIVE.length;

export const DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS: LpFeasibleHalfPlanesParams = {
  selected: 0,
  angle0: 30,
  offset0: 7,
  angle1: 75,
  offset1: 6,
  angle2: 45,
  offset2: 9,
  view: 'region',
};

export type HalfPlanesMetrics = {
  constraints: Constraint[];
  region: FeasibleRegion;
  redundant: number[];
  area: number;
  /** 每條約束在場景方框內的線段；平行於視野或落在框外時為 null */
  segments: Array<[Vec2, Vec2] | null>;
  status: '有界' | '無界' | '無解';
};

export function angleOf(params: LpFeasibleHalfPlanesParams, index: number): number {
  if (index === 0) return params.angle0;
  if (index === 1) return params.angle1;
  return params.angle2;
}

export function offsetOf(params: LpFeasibleHalfPlanesParams, index: number): number {
  if (index === 0) return params.offset0;
  if (index === 1) return params.offset1;
  return params.offset2;
}

export function patchConstraint(
  index: number,
  patch: { angle?: number; offset?: number },
): Partial<LpFeasibleHalfPlanesParams> {
  const out: Partial<LpFeasibleHalfPlanesParams> = {};
  if (patch.angle !== undefined) {
    if (index === 0) out.angle0 = patch.angle;
    else if (index === 1) out.angle1 = patch.angle;
    else out.angle2 = patch.angle;
  }
  if (patch.offset !== undefined) {
    if (index === 0) out.offset0 = patch.offset;
    else if (index === 1) out.offset1 = patch.offset;
    else out.offset2 = patch.offset;
  }
  return out;
}

export function constraintsOf(params: LpFeasibleHalfPlanesParams): Constraint[] {
  return [
    ...NON_NEGATIVE,
    constraintFromAngle(params.angle0, params.offset0, '約束 1'),
    constraintFromAngle(params.angle1, params.offset1, '約束 2'),
    constraintFromAngle(params.angle2, params.offset2, '約束 3'),
  ];
}

export function computeHalfPlanesMetrics(
  params: LpFeasibleHalfPlanesParams,
): HalfPlanesMetrics {
  const constraints = constraintsOf(params);
  const region = analyzeRegion(constraints);
  const status = region.empty ? '無解' : region.bounded ? '有界' : '無界';

  return {
    constraints,
    region,
    redundant: region.empty ? [] : redundantIndices(constraints),
    area: regionArea(region),
    segments: constraints.map((con) => clipLineToBox(con.a, con.b, con.c, SCENE_MIN, AXIS_HALF)),
    status,
  };
}

/**
 * 縮圖尺度：世界座標最遠到 ±10（見 AXIS_HALF），乘上 22 後為 ±220，
 * 落在 BASE_CANVAS_SIZE / 2 = 300 之內。
 */
const THUMBNAIL_SCALE = 22;

function toPoint(v: Vec2, index: number): CurvePoint {
  return { x: v.x * THUMBNAIL_SCALE, y: v.y * THUMBNAIL_SCALE, theta: index, arcLength: index };
}

export function sampleHalfPlanesThumbnail(
  params: LpFeasibleHalfPlanesParams,
): ThumbnailSpec {
  const metrics = computeHalfPlanesMetrics(params);
  const paths: ThumbnailSpec['paths'] = [];

  const polygon = metrics.region.vertices.map((v, index) => toPoint(v.point, index));
  if (polygon.length >= 3) paths.push({ points: polygon, closed: true });

  for (const segment of metrics.segments) {
    if (!segment) continue;
    paths.push({ points: [toPoint(segment[0], 0), toPoint(segment[1], 1)] });
  }

  return { paths };
}
