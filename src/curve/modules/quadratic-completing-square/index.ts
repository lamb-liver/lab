import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import {
  COEFF_A_MAX,
  COEFF_A_MIN,
  COEFF_B_MAX,
  COEFF_B_MIN,
  COEFF_C_MAX,
  COEFF_C_MIN,
} from './constants';
import {
  buildQuadraticCompletingSquareThumbnail,
  asQuadraticCompletingSquareParams,
  fmt,
  quadraticMeta,
  rootsInline,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'a', label: '係數 a', min: COEFF_A_MIN, max: COEFF_A_MAX, step: 0.05, default: 1 },
  { key: 'b', label: '係數 b', min: COEFF_B_MIN, max: COEFF_B_MAX, step: 0.05, default: -1 },
  { key: 'c', label: '係數 c', min: COEFF_C_MIN, max: COEFF_C_MAX, step: 0.05, default: -2 },
];

const sliderDefaults = defaultsFromSchema(paramSchema);

export const quadraticCompletingSquareModule: CurveModule = {
  id: 'quadratic-completing-square',
  paramSchema,
  defaultParams: {
    ...sliderDefaults,
    advanced: 0,
  },
  sample: (_params, { purpose }) => {
    if (purpose === 'thumbnail') return buildQuadraticCompletingSquareThumbnail();
    return buildQuadraticCompletingSquareThumbnail().paths[2]?.points ?? [];
  },
  getMetadata: (params) => {
    const full = asQuadraticCompletingSquareParams(params);
    const meta = quadraticMeta(full);

    return {
      title: '二次函數配方',
      formula: 'f(x)=ax²+bx+c',
      stats: [
        { key: 'vertex', label: 'V', value: `(${fmt(meta.h)}, ${fmt(meta.k)})` },
        { key: 'delta', label: 'Δ', value: fmt(meta.delta) },
        { key: 'roots', label: '根', value: rootsInline(meta.roots) },
        { key: 'state', label: '狀態', value: meta.rootState },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  asQuadraticCompletingSquareParams,
  isPresetActive,
  paramsForMetadata,
  sanitizeA,
  type QuadraticCompletingSquareParams,
} from './geometry';
