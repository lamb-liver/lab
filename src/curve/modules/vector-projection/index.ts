import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  formatNearZero,
  formatVector,
  getProjectionData,
  sampleVectorProjectionThumbnail,
  vectorFromParams,
  type ProjectionMode,
  type ProjectionViewMode,
  type VectorProjectionParams,
} from './geometry';

const paramSchema: ParamSchema = [];

export const DEFAULT_VECTOR_PROJECTION_PARAMS: VectorProjectionParams = {
  ax: 3.3,
  ay: 2.4,
  bx: 4.2,
  by: 1.2,
  projectionMode: 'a_on_b',
  viewMode: 'projection',
};

function projectionModeFromParam(value: unknown): ProjectionMode {
  if (value === 'b_on_a' || value === 1) return 'b_on_a';
  return 'a_on_b';
}

function viewModeFromParam(value: unknown): ProjectionViewMode {
  if (value === 'basis' || value === 1) return 'basis';
  return 'projection';
}

export function asVectorProjectionParams(
  params: ParamValues | VectorProjectionParams,
): VectorProjectionParams {
  return {
    ax: params.ax ?? DEFAULT_VECTOR_PROJECTION_PARAMS.ax,
    ay: params.ay ?? DEFAULT_VECTOR_PROJECTION_PARAMS.ay,
    bx: params.bx ?? DEFAULT_VECTOR_PROJECTION_PARAMS.bx,
    by: params.by ?? DEFAULT_VECTOR_PROJECTION_PARAMS.by,
    projectionMode: projectionModeFromParam(params.projectionMode),
    viewMode: viewModeFromParam(params.viewMode),
  };
}

export function vectorProjectionParamsForMetadata(
  params: VectorProjectionParams,
): ParamValues {
  return {
    ax: params.ax,
    ay: params.ay,
    bx: params.bx,
    by: params.by,
    projectionMode: params.projectionMode === 'b_on_a' ? 1 : 0,
    viewMode: params.viewMode === 'basis' ? 1 : 0,
  };
}

export const vectorProjectionModule: CurveModule = {
  id: 'vector-projection',
  paramSchema,
  defaultParams: vectorProjectionParamsForMetadata(DEFAULT_VECTOR_PROJECTION_PARAMS),
  sample: (params, { purpose }) => {
    const projectionParams = asVectorProjectionParams(params);
    const spec = sampleVectorProjectionThumbnail(projectionParams);
    if (purpose === 'thumbnail') return spec;
    return spec.paths[3]?.points ?? [];
  },
  getMetadata: (params) => {
    const projectionParams = asVectorProjectionParams(params);
    const { a, b } = vectorFromParams(projectionParams);
    const data = getProjectionData(projectionParams);
    const isBasis = projectionParams.viewMode === 'basis';

    return {
      title: isBasis ? '正交基分解' : '向量投影與分解',
      formula: isBasis
        ? `${data.targetLabel} = c₁e₁ + c₂e₂`
        : `${data.fullProjLabel} = (${data.targetLabel}·${data.baseLabel} / ${data.baseLabel}·${data.baseLabel}) ${data.baseLabel}`,
      stats: isBasis
        ? [
            { key: 'a', label: '向量 a', value: formatVector(a) },
            { key: 'b', label: '向量 b', value: formatVector(b) },
            { key: 'c1', label: '係數 c₁', value: data.c1.toFixed(3) },
            { key: 'c2', label: '係數 c₂', value: data.c2.toFixed(3) },
          ]
        : [
            { key: 'a', label: '向量 a', value: formatVector(a) },
            { key: 'b', label: '向量 b', value: formatVector(b) },
            { key: 'proj', label: data.projLabel, value: formatVector(data.proj) },
            {
              key: 'perp',
              label: data.perpLabel,
              value: `|${data.perpLabel}| = ${data.perpLen.toFixed(3)}, dot ${formatNearZero(data.perpDot)}`,
            },
          ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { ProjectionMode, ProjectionViewMode, VectorProjectionParams };
