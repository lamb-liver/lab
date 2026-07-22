import {
  SCENE_MIN,
  analyzeRegion,
  constraint,
  findOptimum,
  objectiveValue,
  visibleRegionPolygon,
  type Constraint,
  type ObjectiveSense,
  type Vec2,
} from '../../linearProgramming';
import type { CurvePoint, ThumbnailSpec } from '../../types';

export const AXIS_HALF = 10;

export type RegionShape = 'quad' | 'triangle';

export type LpVertexOptimumParams = {
  shape: RegionShape;
  /** 目標方向的角度（度）；p = cos θ、q = sin θ */
  angle: number;
  sense: ObjectiveSense;
  /**
   * 逐一走訪走到第幾個頂點；−1 表示尚未開始，整張表一起看。
   * 走訪順序就是候選表的列順序。
   */
  visiting: number;
};

export const DEFAULT_LP_VERTEX_OPTIMUM_PARAMS: LpVertexOptimumParams = {
  shape: 'quad',
  angle: 34,
  sense: 'max',
  visiting: -1,
};

const NON_NEGATIVE: Constraint[] = [
  constraint(-1, 0, 0, 'x ≥ 0'),
  constraint(0, -1, 0, 'y ≥ 0'),
];

/**
 * 兩組固定的可行域。這一頁的主角是頂點表，不是拖約束——
 * 「約束怎麼圍出區域」在《約束半平面與可行域》講過了，這裡只需要一個角點數不同的對照。
 */
const SHAPES: Record<RegionShape, Constraint[]> = {
  quad: [...NON_NEGATIVE, constraint(2, 1, 10, '2x + y ≤ 10'), constraint(1, 3, 15, 'x + 3y ≤ 15')],
  triangle: [...NON_NEGATIVE, constraint(1, 1, 7, 'x + y ≤ 7')],
};

export function constraintsOf(params: LpVertexOptimumParams): Constraint[] {
  return SHAPES[params.shape];
}

export function objectiveOf(params: LpVertexOptimumParams): { p: number; q: number } {
  const rad = (params.angle * Math.PI) / 180;
  return { p: Math.cos(rad), q: Math.sin(rad) };
}

export type Candidate = {
  point: Vec2;
  value: number;
  /** 在依 z 排序後的名次，0 為最優 */
  rank: number;
  optimal: boolean;
};

export type VertexOptimumMetrics = {
  constraints: Constraint[];
  polygon: Vec2[];
  candidates: Candidate[];
  best: number | null;
  /** 並列最優的候選數；2 代表整段邊都是最優 */
  tiedCount: number;
  unbounded: boolean;
  /** 目前走訪到的候選索引；未開始或超出範圍時為 null */
  visitingIndex: number | null;
};

export function computeVertexOptimumMetrics(
  params: LpVertexOptimumParams,
): VertexOptimumMetrics {
  const constraints = constraintsOf(params);
  const region = analyzeRegion(constraints);
  const { p, q } = objectiveOf(params);
  const report = findOptimum(region, constraints, p, q, params.sense);

  const candidates: Candidate[] = region.vertices.map((vertex, index) => ({
    point: vertex.point,
    value: objectiveValue(p, q, vertex.point),
    rank: report.ranking.indexOf(index),
    optimal: report.optimal.includes(index),
  }));

  const visitingIndex =
    params.visiting >= 0 && params.visiting < candidates.length ? params.visiting : null;

  return {
    constraints,
    polygon: visibleRegionPolygon(constraints, SCENE_MIN, AXIS_HALF),
    candidates,
    best: report.best,
    tiedCount: report.optimal.length,
    unbounded: report.unbounded,
    visitingIndex,
  };
}

/** 走訪往前一步；走完最後一個就回到「整張表一起看」 */
export function nextVisiting(params: LpVertexOptimumParams, total: number): number {
  const next = params.visiting + 1;
  return next >= total ? -1 : next;
}

/**
 * 讓等值線恰好與某一條邊平行的角度。
 *
 * 並列最優要求目標方向與邊的法向同向，靠拖角度滑桿幾乎碰不到，
 * 所以直接由該邊的法向算出角度給預設按鈕用。
 */
export function edgeParallelAngle(shape: RegionShape): number {
  const con = SHAPES[shape][2];
  return (Math.atan2(con.b, con.a) * 180) / Math.PI;
}

/**
 * 縮圖尺度：世界座標最遠到 10（見 AXIS_HALF），乘上 26 後為 260，
 * 落在 BASE_CANVAS_SIZE / 2 = 300 之內。
 */
const THUMBNAIL_SCALE = 26;

function toPoint(v: Vec2, index: number): CurvePoint {
  return { x: v.x * THUMBNAIL_SCALE, y: v.y * THUMBNAIL_SCALE, theta: index, arcLength: index };
}

export function sampleVertexOptimumThumbnail(
  params: LpVertexOptimumParams,
): ThumbnailSpec {
  const metrics = computeVertexOptimumMetrics(params);
  const paths: ThumbnailSpec['paths'] = [];

  if (metrics.polygon.length >= 3) {
    paths.push({ points: metrics.polygon.map((v, index) => toPoint(v, index)), closed: true });
  }

  return {
    paths,
    circles: metrics.candidates.map((candidate) => ({
      x: candidate.point.x * THUMBNAIL_SCALE,
      y: candidate.point.y * THUMBNAIL_SCALE,
      r: candidate.optimal ? 12 : 7,
    })),
  };
}
