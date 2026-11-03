import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_STEREO_PARAMS,
  clampStereo,
  readStereo,
  sampleStereoThumbnail,
  type StereoParams,
} from './geometry';

/** 控制項由 StereographicProjectionCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asStereoParams(params: ParamValues | StereoParams): StereoParams {
  return clampStereo(params);
}

export const stereographicProjectionModule: CurveModule = {
  id: 'stereographic-projection',
  paramSchema,
  defaultParams: { ...DEFAULT_STEREO_PARAMS },
  sample: (params) => sampleStereoThumbnail(asStereoParams(params)),
  getMetadata: (params) => {
    const reading = readStereo(asStereoParams(params));
    return {
      title: '球極投影',
      formula: 'r = 1/tan(t/2)',
      stats: [
        { key: 'radius', label: '距離', value: reading.radius.toFixed(3) },
        { key: 'height', label: '高度', value: reading.point.z.toFixed(3) },
      ],
    };
  },
};

export type { StereoParams };
