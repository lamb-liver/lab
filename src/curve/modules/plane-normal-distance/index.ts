import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS,
  computePlaneNormalDistanceMetrics,
  distanceFromGeneralForm,
  formatGeneralForm,
  formatVec3,
  samplePlaneNormalDistanceThumbnail,
  type PlaneNormalDistanceParams,
} from './geometry';

/** 控制項由 PlaneNormalDistanceCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asPlaneNormalDistanceParams(
  params: ParamValues | PlaneNormalDistanceParams,
): PlaneNormalDistanceParams {
  const fallback = DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS;
  return {
    planeTilt: (params.planeTilt as number) ?? fallback.planeTilt,
    planeAzimuth: (params.planeAzimuth as number) ?? fallback.planeAzimuth,
    h: (params.h as number) ?? fallback.h,
    pointZ: (params.pointZ as number) ?? fallback.pointZ,
    pointX: (params.pointX as number) ?? fallback.pointX,
    scale: (params.scale as number) ?? fallback.scale,
    yaw: (params.yaw as number) ?? fallback.yaw,
    pitch: (params.pitch as number) ?? fallback.pitch,
  };
}

export const planeNormalDistanceModule: CurveModule = {
  id: 'plane-normal-distance',
  paramSchema,
  defaultParams: { ...DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS },
  sample: (params, { purpose }) => {
    const spec = samplePlaneNormalDistanceThumbnail(asPlaneNormalDistanceParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const distanceParams = asPlaneNormalDistanceParams(params);
    const metrics = computePlaneNormalDistanceMetrics(distanceParams);
    const viaGeneralForm = distanceFromGeneralForm(
      metrics.coefficients,
      metrics.constant,
      metrics.point,
    );

    return {
      title: '平面法向量與點面距離',
      formula: 'dist = |a x₁ + b y₁ + c z₁ − h| / ‖n‖',
      stats: [
        { key: 'plane', label: '一般式', value: formatGeneralForm(metrics.coefficients, metrics.constant) },
        { key: 'point', label: 'P₁', value: formatVec3(metrics.point) },
        { key: 'dist', label: '距離', value: metrics.distance.toFixed(3) },
        {
          key: 'signed',
          label: '帶號距離',
          value: `${metrics.signedDistance.toFixed(3)}（${
            metrics.signedDistance >= 0 ? '法向那一側' : '法向反側'
          }）`,
        },
        { key: 'foot', label: '垂足', value: formatVec3(metrics.foot) },
        {
          key: 'scale',
          label: '尺度不變',
          value: `一般式算出 ${viaGeneralForm.toFixed(3)}，與尺度 k 無關`,
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { PlaneNormalDistanceParams };
