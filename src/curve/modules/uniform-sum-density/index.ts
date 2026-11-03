import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_UNIFORM_SUM_PARAMS,
  clampUniformSum,
  readUniformSum,
  sampleUniformSumThumbnail,
  type UniformSumParams,
} from './geometry';

/** 控制項由 UniformSumDensityCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asUniformSumParams(params: ParamValues | UniformSumParams): UniformSumParams {
  return clampUniformSum(params);
}

export const uniformSumDensityModule: CurveModule = {
  id: 'uniform-sum-density',
  paramSchema,
  defaultParams: { ...DEFAULT_UNIFORM_SUM_PARAMS },
  sample: (params) => sampleUniformSumThumbnail(asUniformSumParams(params)),
  getMetadata: (params) => {
    const reading = readUniformSum(asUniformSumParams(params));
    return {
      title: '和的密度',
      formula: 'peak = 1/max(a, b)',
      stats: [
        { key: 'peak', label: '峰高', value: reading.peak.toFixed(3) },
        { key: 'flat', label: '平頂寬', value: reading.flat.toFixed(3) },
      ],
    };
  },
};

export type { UniformSumParams };
