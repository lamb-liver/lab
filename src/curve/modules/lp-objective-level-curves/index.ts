import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { formatPoint } from '../../linearProgramming';
import {
  DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS,
  LEVEL_STEP,
  computeObjectiveMetrics,
  sampleObjectiveThumbnail,
  type LpObjectiveLevelCurvesParams,
} from './geometry';

/** 控制項由 LpObjectiveLevelCurvesCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asLpObjectiveLevelCurvesParams(
  params: ParamValues | LpObjectiveLevelCurvesParams,
): LpObjectiveLevelCurvesParams {
  const fallback = DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS;
  return {
    p: (params.p as number) ?? fallback.p,
    q: (params.q as number) ?? fallback.q,
    k: (params.k as number) ?? fallback.k,
    tx: (params.tx as number) ?? fallback.tx,
    ty: (params.ty as number) ?? fallback.ty,
    showFamily: params.showFamily === undefined ? fallback.showFamily : params.showFamily !== 0,
  };
}

export function lpObjectiveLevelCurvesParamsForMetadata(
  params: LpObjectiveLevelCurvesParams,
): ParamValues {
  return {
    p: params.p,
    q: params.q,
    k: params.k,
    tx: params.tx,
    ty: params.ty,
    showFamily: params.showFamily ? 1 : 0,
  };
}

export const lpObjectiveLevelCurvesModule: CurveModule = {
  id: 'lp-objective-level-curves',
  paramSchema,
  defaultParams: lpObjectiveLevelCurvesParamsForMetadata(
    DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS,
  ),
  sample: (params, { purpose }) => {
    const spec = sampleObjectiveThumbnail(asLpObjectiveLevelCurvesParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const objectiveParams = asLpObjectiveLevelCurvesParams(params);
    const metrics = computeObjectiveMetrics(objectiveParams);

    return {
      title: '目標函數等值線',
      formula: 'z = px + qy，等值線 px + qy = k',
      stats: [
        { key: 'normal', label: '法向 n', value: formatPoint(metrics.normal) },
        { key: 'norm', label: '‖n‖', value: metrics.normalLength.toFixed(3) },
        { key: 'k', label: '目前 k', value: objectiveParams.k.toFixed(2) },
        {
          key: 'test',
          label: `測試點 ${formatPoint(metrics.testPoint, 1)}`,
          value: `z = ${metrics.testValue.toFixed(2)}`,
        },
        {
          key: 'spacing',
          label: `相鄰間距（Δk = ${LEVEL_STEP}）`,
          value: metrics.degenerate ? '係數皆為零，沒有等值線' : metrics.spacing.toFixed(3),
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export {
  AXIS_HALF,
  DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS,
  LEVEL_STEP,
  computeObjectiveMetrics,
  levelFromPoint,
  type LpObjectiveLevelCurvesParams,
  type ObjectiveMetrics,
} from './geometry';
