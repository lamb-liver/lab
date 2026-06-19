import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  add,
  formatVector,
  sampleVectorAdditionScalarThumbnail,
  scaleVec,
  vectorFromParams,
  type VectorAdditionScalarParams,
} from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'scalar',
    label: '純量 c',
    min: -2,
    max: 2,
    step: 0.05,
    default: 0.8,
  },
];

export const DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS: VectorAdditionScalarParams = {
  ux: 1.35,
  uy: 0.75,
  vx: 0.65,
  vy: 1.2,
  scalar: 0.8,
};

function asVectorParams(params: ParamValues): VectorAdditionScalarParams {
  return {
    ux: params.ux ?? DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS.ux,
    uy: params.uy ?? DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS.uy,
    vx: params.vx ?? DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS.vx,
    vy: params.vy ?? DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS.vy,
    scalar: params.scalar ?? DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS.scalar,
  };
}

export const vectorAdditionScalarModule: CurveModule = {
  id: 'vector-addition-scalar',
  paramSchema,
  defaultParams: DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
  sample: (params, { purpose }) => {
    const vectorParams = asVectorParams(params);
    const spec = sampleVectorAdditionScalarThumbnail(vectorParams);
    if (purpose === 'thumbnail') return spec;
    return spec.paths[4]?.points ?? [];
  },
  getMetadata: (params) => {
    const vectorParams = asVectorParams(params);
    const { u, v } = vectorFromParams(vectorParams);
    const sum = add(u, v);
    const scaled = scaleVec(v, vectorParams.scalar);

    return {
      title: '向量加法與純量乘法',
      formula: 'u + v,  c v',
      stats: [
        { key: 'u', label: '向量 u', value: formatVector(u) },
        { key: 'v', label: '向量 v', value: formatVector(v) },
        { key: 'sum', label: 'u + v', value: formatVector(sum) },
        { key: 'scaled', label: 'c v', value: formatVector(scaled) },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export { asVectorParams };
export type { VectorAdditionScalarParams };
