import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { radToDeg } from '../../projection3d';
import {
  A_LENGTH,
  DEFAULT_CROSS_PRODUCT_PARAMS,
  computeCrossProductMetrics,
  formatVec3,
  sampleCrossProductThumbnail,
  type CrossProductGeometryParams,
  type CrossProductMode,
} from './geometry';

/** 控制項由 CrossProductGeometryCurveRoot 自行渲染，不走通用 ParamControls */
const paramSchema: ParamSchema = [];

function modeFromParam(value: number | CrossProductMode | undefined): CrossProductMode {
  if (value === 'righthand' || value === 1) return 'righthand';
  return 'area';
}

export function asCrossProductParams(
  params: ParamValues | CrossProductGeometryParams,
): CrossProductGeometryParams {
  return {
    theta: (params.theta as number) ?? DEFAULT_CROSS_PRODUCT_PARAMS.theta,
    lenB: (params.lenB as number) ?? DEFAULT_CROSS_PRODUCT_PARAMS.lenB,
    phi: (params.phi as number) ?? DEFAULT_CROSS_PRODUCT_PARAMS.phi,
    yaw: (params.yaw as number) ?? DEFAULT_CROSS_PRODUCT_PARAMS.yaw,
    pitch: (params.pitch as number) ?? DEFAULT_CROSS_PRODUCT_PARAMS.pitch,
    mode: modeFromParam(params.mode as number | CrossProductMode | undefined),
  };
}

export const crossProductGeometryModule: CurveModule = {
  id: 'cross-product-geometry',
  paramSchema,
  defaultParams: {
    theta: DEFAULT_CROSS_PRODUCT_PARAMS.theta,
    lenB: DEFAULT_CROSS_PRODUCT_PARAMS.lenB,
    phi: DEFAULT_CROSS_PRODUCT_PARAMS.phi,
    yaw: DEFAULT_CROSS_PRODUCT_PARAMS.yaw,
    pitch: DEFAULT_CROSS_PRODUCT_PARAMS.pitch,
    mode: 0,
  },
  sample: (params, { purpose }) => {
    const spec = sampleCrossProductThumbnail(asCrossProductParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const crossParams = asCrossProductParams(params);
    const metrics = computeCrossProductMetrics(crossParams);
    const relation = metrics.isDegenerate
      ? '近平行：面積趨近 0'
      : `sinθ = ${metrics.sinTheta.toFixed(3)}`;

    return {
      title: crossParams.mode === 'righthand' ? '右手定則與法向' : '外積的幾何意義',
      formula: '‖a × b‖ = |a| |b| sinθ',
      stats: [
        { key: 'a', label: 'a', value: formatVec3(metrics.a) },
        { key: 'b', label: 'b', value: formatVec3(metrics.b) },
        { key: 'theta', label: 'θ', value: `${radToDeg(metrics.theta).toFixed(1)}°` },
        {
          key: 'area',
          label: '‖a × b‖',
          value: `${metrics.area.toFixed(3)}（|a| = ${A_LENGTH}）`,
        },
        { key: 'n', label: 'n 方向', value: formatVec3(metrics.unitN) },
        { key: 'relation', label: '關係', value: relation },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { CrossProductGeometryParams, CrossProductMode };
