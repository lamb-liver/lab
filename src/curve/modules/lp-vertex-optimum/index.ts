import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { formatObjective, formatPoint, type ObjectiveSense } from '../../linearProgramming';
import {
  DEFAULT_LP_VERTEX_OPTIMUM_PARAMS,
  computeVertexOptimumMetrics,
  objectiveOf,
  sampleVertexOptimumThumbnail,
  type LpVertexOptimumParams,
} from './geometry';

/** 控制項由 LpVertexOptimumCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asLpVertexOptimumParams(
  params: ParamValues | LpVertexOptimumParams,
): LpVertexOptimumParams {
  const fallback = DEFAULT_LP_VERTEX_OPTIMUM_PARAMS;
  return {
    shape: params.shape === 'triangle' || params.shape === 1 ? 'triangle' : 'quad',
    angle: (params.angle as number) ?? fallback.angle,
    sense: params.sense === 'min' || params.sense === 1 ? 'min' : 'max',
    visiting: (params.visiting as number) ?? fallback.visiting,
  };
}

export function lpVertexOptimumParamsForMetadata(
  params: LpVertexOptimumParams,
): ParamValues {
  return {
    shape: params.shape === 'triangle' ? 1 : 0,
    angle: params.angle,
    sense: params.sense === 'min' ? 1 : 0,
    visiting: params.visiting,
  };
}

export const lpVertexOptimumModule: CurveModule = {
  id: 'lp-vertex-optimum',
  paramSchema,
  defaultParams: lpVertexOptimumParamsForMetadata(DEFAULT_LP_VERTEX_OPTIMUM_PARAMS),
  sample: (params, { purpose }) => {
    const spec = sampleVertexOptimumThumbnail(asLpVertexOptimumParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const vertexParams = asLpVertexOptimumParams(params);
    const metrics = computeVertexOptimumMetrics(vertexParams);
    const { p, q } = objectiveOf(vertexParams);
    const winners = metrics.candidates.filter((candidate) => candidate.optimal);

    return {
      title: '頂點法求最優解',
      formula: 'zⱼ = p xⱼ + q yⱼ，最優在角點取得',
      stats: [
        { key: 'objective', label: '目標', value: formatObjective(p, q, 2) },
        { key: 'sense', label: '求', value: vertexParams.sense === 'max' ? '最大值' : '最小值' },
        { key: 'count', label: '候選頂點', value: metrics.candidates.length },
        {
          key: 'best',
          label: '最優值',
          value: metrics.best === null ? '不存在' : metrics.best.toFixed(3),
        },
        {
          key: 'where',
          label: metrics.tiedCount > 1 ? '並列最優' : '最優頂點',
          value:
            winners.length === 0
              ? '無'
              : winners.map((candidate) => formatPoint(candidate.point, 1)).join('、'),
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export {
  AXIS_HALF,
  DEFAULT_LP_VERTEX_OPTIMUM_PARAMS,
  computeVertexOptimumMetrics,
  constraintsOf,
  edgeParallelAngle,
  nextVisiting,
  objectiveOf,
  type Candidate,
  type LpVertexOptimumParams,
  type RegionShape,
  type VertexOptimumMetrics,
} from './geometry';
export type { ObjectiveSense };
