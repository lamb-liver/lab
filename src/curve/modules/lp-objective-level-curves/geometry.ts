import {
  SCENE_MIN,
  clipLineToBox,
  objectiveValue,
  vec2,
  type Vec2,
} from '../../linearProgramming';
import type { CurvePoint, ThumbnailSpec } from '../../types';

/** 場景的世界座標上界 */
export const AXIS_HALF = 10;

export type LpObjectiveLevelCurvesParams = {
  /** 目標函數 z = p·x + q·y 的兩個係數 */
  p: number;
  q: number;
  /** 目前這條等值線的 z 值 */
  k: number;
  /** 測試點座標 */
  tx: number;
  ty: number;
  /** 是否畫出整族等值線，而不只是目前這一條 */
  showFamily: boolean;
};

export const DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS: LpObjectiveLevelCurvesParams = {
  p: 3,
  q: 2,
  k: 18,
  tx: 4,
  ty: 3,
  showFamily: true,
};

/** 相鄰兩條等值線的 k 差；族線就是以此為間隔往兩側鋪開 */
export const LEVEL_STEP = 6;

export type LevelLine = { k: number; segment: [Vec2, Vec2] };

export type ObjectiveMetrics = {
  normal: Vec2;
  normalLength: number;
  /** 測試點，以及通過它的那條等值線的 k */
  testPoint: Vec2;
  testValue: number;
  /** 目前這一條等值線；係數全為零時沒有直線 */
  current: [Vec2, Vec2] | null;
  family: LevelLine[];
  /** 相鄰等值線的垂直間距 = Δk / ‖n‖ */
  spacing: number;
  degenerate: boolean;
};

export function computeObjectiveMetrics(
  params: LpObjectiveLevelCurvesParams,
): ObjectiveMetrics {
  const normal = vec2(params.p, params.q);
  const normalLength = Math.hypot(normal.x, normal.y);
  const degenerate = normalLength < 1e-9;
  const testPoint = vec2(params.tx, params.ty);

  const current = degenerate
    ? null
    : clipLineToBox(params.p, params.q, params.k, SCENE_MIN, AXIS_HALF);

  const family: LevelLine[] = [];
  if (!degenerate && params.showFamily) {
    // 往兩側各鋪幾條；落在框外的自然被裁掉，不必先算能畫幾條
    for (let step = -4; step <= 4; step += 1) {
      if (step === 0) continue;
      const k = params.k + step * LEVEL_STEP;
      const segment = clipLineToBox(params.p, params.q, k, SCENE_MIN, AXIS_HALF);
      if (segment) family.push({ k, segment });
    }
  }

  return {
    normal,
    normalLength,
    testPoint,
    testValue: objectiveValue(params.p, params.q, testPoint),
    current,
    family,
    spacing: degenerate ? 0 : LEVEL_STEP / normalLength,
    degenerate,
  };
}

/** 把 k 換成「沿法向平移多遠」，拖曳等值線時用 */
export function levelFromPoint(params: LpObjectiveLevelCurvesParams, point: Vec2): number {
  return objectiveValue(params.p, params.q, point);
}

/**
 * 縮圖尺度：世界座標最遠到 10（見 AXIS_HALF），乘上 24 後為 240，
 * 落在 BASE_CANVAS_SIZE / 2 = 300 之內。
 */
const THUMBNAIL_SCALE = 24;

function toPoint(v: Vec2, index: number): CurvePoint {
  return { x: v.x * THUMBNAIL_SCALE, y: v.y * THUMBNAIL_SCALE, theta: index, arcLength: index };
}

export function sampleObjectiveThumbnail(
  params: LpObjectiveLevelCurvesParams,
): ThumbnailSpec {
  const metrics = computeObjectiveMetrics({ ...params, showFamily: true });
  const paths: ThumbnailSpec['paths'] = [];

  if (metrics.current) {
    paths.push({ points: [toPoint(metrics.current[0], 0), toPoint(metrics.current[1], 1)] });
  }
  for (const line of metrics.family) {
    paths.push({ points: [toPoint(line.segment[0], 0), toPoint(line.segment[1], 1)] });
  }

  return { paths };
}
