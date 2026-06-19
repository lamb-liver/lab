import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  EIGENVECTOR_PRESETS,
  buildEigenvectorThumbnail,
  eigenData,
  eigenStatusText,
  fmt,
  fmtVec,
  matrixFromParams,
  vectorFromParams,
} from './geometry';

const DEFAULT_PRESET = EIGENVECTOR_PRESETS[0]!;

const paramSchema: ParamSchema = [
  { key: 'a', label: 'a', min: -3, max: 3, step: 0.01, default: DEFAULT_PRESET.matrix.a },
  { key: 'b', label: 'b', min: -3, max: 3, step: 0.01, default: DEFAULT_PRESET.matrix.b },
  { key: 'c', label: 'c', min: -3, max: 3, step: 0.01, default: DEFAULT_PRESET.matrix.c },
  { key: 'd', label: 'd', min: -3, max: 3, step: 0.01, default: DEFAULT_PRESET.matrix.d },
  { key: 'ux', label: 'u.x', min: -3.45, max: 3.45, step: 0.01, default: 1.35 },
  { key: 'uy', label: 'u.y', min: -3.45, max: 3.45, step: 0.01, default: 0.95 },
];

export const eigenvectorGeometryModule: CurveModule = {
  id: 'eigenvector-geometry',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      return buildEigenvectorThumbnail(params);
    }
    return buildEigenvectorThumbnail(params).paths[0]?.points ?? [];
  },
  getMetadata: (params: ParamValues) => {
    const matrix = matrixFromParams(params);
    const eigen = eigenData(matrix);
    const u = vectorFromParams(params);
    const stats = [
      { key: 'status', label: '狀態', value: eigenStatusText(eigen) },
      { key: 'trace', label: 'tr A', value: fmt(eigen.trace) },
      { key: 'det', label: 'det A', value: fmt(eigen.det) },
    ];

    if (eigen.kind === 'complex') {
      stats.push({
        key: 'lambda',
        label: 'λ',
        value: `${fmt(eigen.real)} ± ${fmt(eigen.imag)}i`,
      });
    } else if (eigen.kind === 'all') {
      stats.push({ key: 'lambda', label: 'λ', value: fmt(eigen.lambda) });
    } else {
      stats.push({
        key: 'lambda',
        label: 'λ',
        value: eigen.directions.map((direction) => fmt(direction.lambda)).join(', '),
      });
    }

    return {
      title: '特徵向量與伸縮比',
      formula: 'A v = λ v',
      stats: [
        ...stats,
        { key: 'u', label: 'u', value: fmtVec(u) },
      ].slice(0, 4),
    };
  },
  sampleStep: 8,
};

export {
  EIGENVECTOR_PRESETS,
  EIGENVECTOR_MAX_VECTOR,
  EIGENVECTOR_MIN_VECTOR,
  EIGENVECTOR_GRID_RADIUS,
  EIGENVECTOR_WORLD_RADIUS,
  type EigenvectorPresetId,
} from './geometry';
export {
  clampVectorLength,
  eigenData,
  eigenStatusText,
  fmt,
  fmtVec,
  matVec,
  matrixFromParams,
  paramsFromMatrixVector,
  presetById,
  scaleVec,
  trace,
  vectorFromParams,
  type EigenData,
  type Matrix2,
  type Vector2,
} from './geometry';
