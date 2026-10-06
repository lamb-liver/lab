import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_UPPER_LIMIT_PARAMS,
  area,
  clampUpperLimit,
  deltaRatio,
  f,
  formatReading,
  sampleUpperLimitThumbnail,
  type UpperLimitParams,
} from './geometry';

/** 控制項由 VariableUpperLimitCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asUpperLimitParams(params: ParamValues | UpperLimitParams): UpperLimitParams {
  return clampUpperLimit(params);
}

export const variableUpperLimitModule: CurveModule = {
  id: 'variable-upper-limit',
  paramSchema,
  defaultParams: { ...DEFAULT_UPPER_LIMIT_PARAMS },
  sample: (params) => sampleUpperLimitThumbnail(asUpperLimitParams(params)),
  getMetadata: (params) => {
    const next = asUpperLimitParams(params);
    return {
      title: '面積與右端高度',
      formula: "A'(x) = f(x)",
      stats: [
        { key: 'area', label: '面積 A', value: formatReading(area(next.x)) },
        { key: 'height', label: '高度 f(x)', value: formatReading(f(next.x)) },
        { key: 'ratio', label: 'ΔA/h', value: formatReading(deltaRatio(next.x, next.h)) },
      ],
    };
  },
};

export type { UpperLimitParams };
