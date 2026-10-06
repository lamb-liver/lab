import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_DISK_TRIANGLE_PARAMS,
  angleSumDegrees,
  clampDiskTriangle,
  formatDegrees,
  interiorAngle,
  sampleDiskTriangleThumbnail,
  type DiskTriangleParams,
} from './geometry';

/** 控制項由 PoincareTriangleCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asDiskTriangleParams(params: ParamValues | DiskTriangleParams): DiskTriangleParams {
  return clampDiskTriangle(params);
}

export const poincareTriangleModule: CurveModule = {
  id: 'poincare-triangle',
  paramSchema,
  defaultParams: { ...DEFAULT_DISK_TRIANGLE_PARAMS },
  sample: (params) => sampleDiskTriangleThumbnail(asDiskTriangleParams(params)),
  getMetadata: (params) => {
    const next = asDiskTriangleParams(params);
    return {
      title: '圓盤上的三角形',
      formula: '內角和 < 180°',
      stats: [
        { key: 'angle', label: '內角', value: formatDegrees(interiorAngle(next.r)) },
        { key: 'sum', label: '內角和', value: `${angleSumDegrees(next.r).toFixed(1)}°` },
      ],
    };
  },
};

export type { DiskTriangleParams };
