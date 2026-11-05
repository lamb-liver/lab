import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_SHARE_PARAMS,
  clampShare,
  readShare,
  sampleShareThumbnail,
  type ShareParams,
} from './geometry';

/** 控制項由 StationaryShareCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asShareParams(params: ParamValues | ShareParams): ShareParams {
  return clampShare(params);
}

export const stationaryShareModule: CurveModule = {
  id: 'stationary-share',
  paramSchema,
  defaultParams: { ...DEFAULT_SHARE_PARAMS },
  sample: (params) => sampleShareThumbnail(asShareParams(params)),
  getMetadata: (params) => {
    const reading = readShare(asShareParams(params));
    return {
      title: '穩態份額',
      formula: 'A = b/(a+b)',
      stats: [
        { key: 'share', label: '份額 A', value: reading.shareA.toFixed(3) },
        { key: 'flow', label: '流量', value: reading.flow.toFixed(3) },
      ],
    };
  },
};

export type { ShareParams };
