import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  SURFACE_FORMULA,
  SURFACE_KINDS,
  computeGradientMetrics,
  formatVec,
  sampleGradientThumbnail,
  surfaceKindFromIndex,
  type GradientLevelCurvesParams,
} from './geometry';

/** 控制項由 GradientLevelCurvesCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asGradientLevelCurvesParams(
  params: ParamValues | GradientLevelCurvesParams,
): GradientLevelCurvesParams {
  const fallback = DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS;
  if ('kind' in params && typeof params.kind === 'string') {
    return {
      kind: params.kind,
      px: params.px ?? fallback.px,
      py: params.py ?? fallback.py,
      showFamily: params.showFamily === undefined ? fallback.showFamily : Boolean(params.showFamily),
    };
  }

  const values = params as ParamValues;
  return {
    kind: surfaceKindFromIndex(values.kind ?? 0),
    px: values.px ?? fallback.px,
    py: values.py ?? fallback.py,
    showFamily: values.showFamily === undefined ? fallback.showFamily : values.showFamily !== 0,
  };
}

export function gradientLevelCurvesParamsForMetadata(
  params: GradientLevelCurvesParams,
): ParamValues {
  return {
    kind: SURFACE_KINDS.indexOf(params.kind),
    px: params.px,
    py: params.py,
    showFamily: params.showFamily ? 1 : 0,
  };
}

export const gradientLevelCurvesModule: CurveModule = {
  id: 'gradient-level-curves',
  paramSchema,
  defaultParams: gradientLevelCurvesParamsForMetadata(DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS),
  sample: (params, { purpose }) => {
    const spec = sampleGradientThumbnail(asGradientLevelCurvesParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const surfaceParams = asGradientLevelCurvesParams(params);
    const metrics = computeGradientMetrics(surfaceParams);
    const formula = SURFACE_FORMULA[surfaceParams.kind];

    return {
      title: '梯度與等位線',
      formula: `${formula.f}，${formula.grad}`,
      stats: [
        { key: 'point', label: '測試點 P', value: formatVec(metrics.point) },
        { key: 'value', label: 'f(P)', value: metrics.value.toFixed(2) },
        {
          key: 'grad',
          label: '∇f(P)',
          value: metrics.critical ? '0（臨界點）' : formatVec(metrics.gradient),
        },
        {
          key: 'norm',
          label: '‖∇f‖',
          value: metrics.gradientLength.toFixed(2),
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export {
  AXIS_HALF,
  DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  SURFACE_FORMULA,
  SURFACE_KINDS,
  computeGradientMetrics,
  formatVec,
  type GradientLevelCurvesParams,
  type SurfaceKind,
} from './geometry';
