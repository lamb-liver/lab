import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_LINE_PLANE_PARAMS,
  computeLinePlaneMetrics,
  formatVec3,
  sampleLinePlaneThumbnail,
  stateLabel,
  type LinePlaneParams,
} from './geometry';

/** 控制項由 LinePlaneIntersectionCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asLinePlaneParams(
  params: ParamValues | LinePlaneParams,
): LinePlaneParams {
  return {
    planeTilt: (params.planeTilt as number) ?? DEFAULT_LINE_PLANE_PARAMS.planeTilt,
    planeAzimuth: (params.planeAzimuth as number) ?? DEFAULT_LINE_PLANE_PARAMS.planeAzimuth,
    h: (params.h as number) ?? DEFAULT_LINE_PLANE_PARAMS.h,
    lineTilt: (params.lineTilt as number) ?? DEFAULT_LINE_PLANE_PARAMS.lineTilt,
    lineAzimuth: (params.lineAzimuth as number) ?? DEFAULT_LINE_PLANE_PARAMS.lineAzimuth,
    originZ: (params.originZ as number) ?? DEFAULT_LINE_PLANE_PARAMS.originZ,
    yaw: (params.yaw as number) ?? DEFAULT_LINE_PLANE_PARAMS.yaw,
    pitch: (params.pitch as number) ?? DEFAULT_LINE_PLANE_PARAMS.pitch,
  };
}

export const linePlaneIntersectionModule: CurveModule = {
  id: 'line-plane-intersection',
  paramSchema,
  defaultParams: { ...DEFAULT_LINE_PLANE_PARAMS },
  sample: (params, { purpose }) => {
    const spec = sampleLinePlaneThumbnail(asLinePlaneParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[1]?.points ?? [];
  },
  getMetadata: (params) => {
    const linePlaneParams = asLinePlaneParams(params);
    const metrics = computeLinePlaneMetrics(linePlaneParams);

    return {
      title: '空間直線與平面交點',
      formula: 't = (h − n·r₀) / (n·d)',
      stats: [
        { key: 'state', label: '狀態', value: stateLabel(metrics.state) },
        { key: 'n', label: 'n', value: formatVec3(metrics.n) },
        { key: 'd', label: 'd', value: formatVec3(metrics.d) },
        { key: 'nd', label: 'n·d', value: metrics.nDotD.toFixed(4) },
        {
          key: 'offset',
          label: 'n·r₀ − h',
          value: metrics.offset.toFixed(4),
        },
        {
          key: 't',
          label: 't',
          value: metrics.t === null ? '無解' : metrics.t.toFixed(3),
        },
        {
          key: 'point',
          label: '交點',
          value: metrics.point === null ? '—' : formatVec3(metrics.point),
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { LinePlaneParams };
