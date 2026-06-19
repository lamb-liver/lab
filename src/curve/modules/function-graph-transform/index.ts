import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import { BASIS_OPTIONS } from './constants';
import {
  buildFunctionGraphTransformThumbnail,
  asFunctionGraphTransformParams,
  fmt,
  transformScaleText,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'a', label: '垂直倍率 a', min: -2.5, max: 2.5, step: 0.05, default: 1 },
  { key: 'b', label: '水平倍率 b', min: -2.5, max: 2.5, step: 0.05, default: 1 },
  { key: 'h', label: '水平位移 h', min: -3, max: 3, step: 0.05, default: 0 },
  { key: 'k', label: '垂直位移 k', min: -3, max: 3, step: 0.05, default: 0 },
];

const sliderDefaults = defaultsFromSchema(paramSchema);

export const functionGraphTransformModule: CurveModule = {
  id: 'function-graph-transform',
  paramSchema,
  defaultParams: {
    ...sliderDefaults,
    basis: 1,
    advanced: 0,
  },
  sample: (_params, { purpose }) => {
    if (purpose === 'thumbnail') return buildFunctionGraphTransformThumbnail();
    return buildFunctionGraphTransformThumbnail().paths[1]?.points ?? [];
  },
  getMetadata: (params) => {
    const full = asFunctionGraphTransformParams(params);
    const base = BASIS_OPTIONS.find((item) => item.id === full.basis)?.text || 'f(x)';

    return {
      title: '函數圖形變換',
      formula: 'g(x)=a f(b(x-h))+k',
      stats: [
        { key: 'base', label: '基底', value: base },
        { key: 'p', label: 'P', value: `(${fmt(full.h)}, ${fmt(full.k)})` },
        { key: 'a', label: 'a', value: transformScaleText('a', full.a, '垂直') },
        { key: 'b', label: 'b', value: transformScaleText('b', full.b, '水平') },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  asFunctionGraphTransformParams,
  paramsForMetadata,
  basisFromIndex,
  basisToIndex,
  type BasisKind,
  type FunctionGraphTransformParams,
} from './geometry';
