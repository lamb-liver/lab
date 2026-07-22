import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { formatConstraint } from '../../linearProgramming';
import {
  ADJUSTABLE_OFFSET,
  DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS,
  computeHalfPlanesMetrics,
  sampleHalfPlanesThumbnail,
  type HalfPlaneView,
  type LpFeasibleHalfPlanesParams,
} from './geometry';

/** 控制項由 LpFeasibleHalfPlanesCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

/** ParamValues 只裝得下數字，列舉在進出時換成 0/1（與 vector-projection 同一套做法） */
function viewFromParam(value: unknown): HalfPlaneView {
  return value === 'mask' || value === 1 ? 'mask' : 'region';
}

export function asLpFeasibleHalfPlanesParams(
  params: ParamValues | LpFeasibleHalfPlanesParams,
): LpFeasibleHalfPlanesParams {
  const fallback = DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS;
  return {
    selected: (params.selected as number) ?? fallback.selected,
    angle0: (params.angle0 as number) ?? fallback.angle0,
    offset0: (params.offset0 as number) ?? fallback.offset0,
    angle1: (params.angle1 as number) ?? fallback.angle1,
    offset1: (params.offset1 as number) ?? fallback.offset1,
    angle2: (params.angle2 as number) ?? fallback.angle2,
    offset2: (params.offset2 as number) ?? fallback.offset2,
    view: viewFromParam(params.view),
  };
}

export function lpFeasibleHalfPlanesParamsForMetadata(
  params: LpFeasibleHalfPlanesParams,
): ParamValues {
  return {
    selected: params.selected,
    angle0: params.angle0,
    offset0: params.offset0,
    angle1: params.angle1,
    offset1: params.offset1,
    angle2: params.angle2,
    offset2: params.offset2,
    view: params.view === 'mask' ? 1 : 0,
  };
}

export const lpFeasibleHalfPlanesModule: CurveModule = {
  id: 'lp-feasible-half-planes',
  paramSchema,
  defaultParams: lpFeasibleHalfPlanesParamsForMetadata(
    DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS,
  ),
  sample: (params, { purpose }) => {
    const spec = sampleHalfPlanesThumbnail(asLpFeasibleHalfPlanesParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const halfPlaneParams = asLpFeasibleHalfPlanesParams(params);
    const metrics = computeHalfPlanesMetrics(halfPlaneParams);
    const redundantLabels = metrics.redundant
      .map((index) => metrics.constraints[index].label)
      .join('、');

    return {
      title: '約束半平面與可行域',
      formula: 'F = { (x, y) | aᵢx + bᵢy ≤ cᵢ }',
      stats: [
        { key: 'status', label: '可行域', value: metrics.status },
        { key: 'vertices', label: '角點數', value: metrics.region.vertices.length },
        {
          key: 'area',
          label: '面積',
          value: metrics.region.bounded ? metrics.area.toFixed(2) : '無界，面積不存在',
        },
        {
          key: 'redundant',
          label: '冗餘約束',
          value: redundantLabels.length > 0 ? redundantLabels : '無',
        },
        {
          key: 'selected',
          label: '選取中',
          value: formatConstraint(
            metrics.constraints[ADJUSTABLE_OFFSET + halfPlaneParams.selected],
          ),
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export {
  ADJUSTABLE_OFFSET,
  AXIS_HALF,
  DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS,
  angleOf,
  computeHalfPlanesMetrics,
  constraintsOf,
  offsetOf,
  patchConstraint,
  type HalfPlaneView,
  type HalfPlanesMetrics,
  type LpFeasibleHalfPlanesParams,
} from './geometry';
