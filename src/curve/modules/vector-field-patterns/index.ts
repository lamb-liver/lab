import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  getFieldConfig,
  getSeedCount,
  sampleVectorFieldPatternThumbnail,
  type VectorFieldPattern,
  type VectorFieldPatternParams,
} from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'density',
    label: '密度 n',
    min: 9,
    max: 19,
    step: 2,
    default: 15,
  },
];

export const PATTERN_ORDER: VectorFieldPattern[] = [
  'source',
  'sink',
  'vortex',
  'saddle',
  'uniform',
];

export const DEFAULT_VECTOR_FIELD_PATTERN_PARAMS: VectorFieldPatternParams = {
  pattern: 'source',
  density: 15,
  normalized: true,
  showStreamlines: true,
};

function patternFromParam(value: unknown): VectorFieldPattern {
  if (typeof value === 'number') {
    return PATTERN_ORDER[Math.max(0, Math.min(PATTERN_ORDER.length - 1, Math.round(value)))] ?? 'source';
  }
  return PATTERN_ORDER.includes(value as VectorFieldPattern)
    ? (value as VectorFieldPattern)
    : 'source';
}

function asVectorFieldPatternParams(
  params: ParamValues | VectorFieldPatternParams,
): VectorFieldPatternParams {
  return {
    pattern: patternFromParam(params.pattern),
    density: params.density ?? DEFAULT_VECTOR_FIELD_PATTERN_PARAMS.density,
    normalized: params.normalized === undefined ? true : Boolean(params.normalized),
    showStreamlines: params.showStreamlines === undefined ? true : Boolean(params.showStreamlines),
  };
}

export function vectorFieldPatternParamsForMetadata(
  params: VectorFieldPatternParams,
): ParamValues {
  return {
    pattern: PATTERN_ORDER.indexOf(params.pattern),
    density: params.density,
    normalized: params.normalized ? 1 : 0,
    showStreamlines: params.showStreamlines ? 1 : 0,
  };
}

export const vectorFieldPatternsModule: CurveModule = {
  id: 'vector-field-patterns',
  paramSchema,
  defaultParams: vectorFieldPatternParamsForMetadata(DEFAULT_VECTOR_FIELD_PATTERN_PARAMS),
  sample: (params, { purpose }) => {
    const fieldParams = asVectorFieldPatternParams(params);
    const spec = sampleVectorFieldPatternThumbnail(fieldParams.pattern);
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const fieldParams = asVectorFieldPatternParams(params);
    const field = getFieldConfig(fieldParams.pattern);
    const density = Math.round(fieldParams.density);
    const lengthMode = fieldParams.normalized ? '歸一化' : '依 |F|';
    const streamMode = fieldParams.showStreamlines ? '顯示' : '隱藏';

    return {
      title: '向量場的基本圖樣',
      formula: field.formula,
      stats: [
        { key: 'pattern', label: '圖樣', value: field.name },
        { key: 'eigen', label: '特徵值', value: field.eigen },
        { key: 'arrows', label: '箭頭', value: `${density} × ${density}，${lengthMode}` },
        { key: 'streamlines', label: '流線', value: `${streamMode}，${getSeedCount(field, density)} 條` },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { VectorFieldPattern, VectorFieldPatternParams };
