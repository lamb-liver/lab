import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  TAYLOR_MAX_N,
  TAYLOR_MIN_N,
  buildTaylorThumbnail,
  clampA,
  clampN,
  fmt,
  maxErrorInView,
  paramsFromValues,
  presetById,
  taylorValue,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'preset', label: '函數選擇', min: 0, max: 2, step: 1, default: 0 },
  { key: 'a', label: '展開中心 a', min: -3.14, max: 3.14, step: 0.01, default: 0 },
  { key: 'n', label: '階數 n', min: TAYLOR_MIN_N, max: TAYLOR_MAX_N, step: 1, default: 3 },
];

export const taylorPolynomialApproximationModule: CurveModule = {
  id: 'taylor-polynomial-approximation',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    const full = paramsFromValues(params);
    if (purpose === 'thumbnail') {
      return buildTaylorThumbnail(full);
    }
    return buildTaylorThumbnail(full).paths[2]?.points ?? [];
  },
  getMetadata: (params: ParamValues) => {
    const full = paramsFromValues(params);
    const preset = presetById(full.preset);
    const a = clampA(preset, full.a);
    const n = clampN(full.n);
    return {
      title: '泰勒多項式逼近',
      formula: `${preset.formula}；T_n(x)=Σ f^(k)(a)(x-a)^k/k!`,
      stats: [
        { key: 'function', label: 'f(x)', value: preset.label },
        { key: 'a', label: 'a', value: fmt(a) },
        { key: 'n', label: 'n', value: n },
        { key: 'error', label: 'max |E|', value: fmt(maxErrorInView(preset, a, n)) },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  TAYLOR_MAX_N,
  TAYLOR_MAX_TERM_CURVES,
  TAYLOR_MIN_N,
  TAYLOR_PRESETS,
  buildFunctionPoints,
  buildTaylorThumbnail,
  clampA,
  clampN,
  clampY,
  createTaylorPlotRect,
  fmt,
  fmtAxis,
  maxErrorInView,
  paramsFromValues,
  presetById,
  presetIdFromIndex,
  presetIndexFromId,
  screenToX,
  taylorTerm,
  taylorValue,
  valuesFromParams,
  xToScreen,
  yToScreen,
  yToScreenClamped,
  type PlotRect,
  type TaylorParams,
  type TaylorPreset,
  type TaylorPresetId,
} from './geometry';
