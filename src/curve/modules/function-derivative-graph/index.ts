import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  FUNCTION_DERIVATIVE_PRESETS,
  buildFunctionDerivativeThumbnail,
  clampX0,
  fmt,
  nearestZeroInfo,
  paramsFromValues,
  presetById,
  slopeStateText,
  valuesFromParams,
  visibleZeros,
  zeroTypeText,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'preset', label: '函數預設', min: 0, max: 2, step: 1, default: 0 },
  { key: 'x0', label: '檢查線 x₀', min: -6.28, max: 6.28, step: 0.01, default: 1.25 },
];

export const functionDerivativeGraphModule: CurveModule = {
  id: 'function-derivative-graph',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    const full = paramsFromValues(params);
    if (purpose === 'thumbnail') {
      return buildFunctionDerivativeThumbnail(full);
    }
    return buildFunctionDerivativeThumbnail(full).paths[2]?.points ?? [];
  },
  getMetadata: (params: ParamValues) => {
    const full = paramsFromValues(params);
    const preset = presetById(full.preset);
    const x0 = clampX0(preset, full.x0);
    const d0 = preset.df(x0);
    const zeroInfo = nearestZeroInfo(preset, x0);
    const extremum = zeroInfo?.near ? zeroTypeText(preset, zeroInfo.x) : '否';

    return {
      title: '原函數與導函數圖形對照',
      formula: `${preset.formula}；${preset.derivative}`,
      stats: [
        { key: 'x0', label: 'x₀', value: fmt(x0) },
        { key: 'f0', label: 'f(x₀)', value: fmt(preset.f(x0)) },
        { key: 'df0', label: "f'(x₀)", value: `${fmt(d0)}，${slopeStateText(d0)}` },
        { key: 'extremum', label: '極值候選', value: extremum },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  FUNCTION_DERIVATIVE_PRESETS,
  FUNCTION_DERIVATIVE_SLOPE_TOL,
  buildFunctionDerivativeThumbnail,
  buildFunctionPoints,
  clampX0,
  createFunctionDerivativeLayout,
  fmt,
  fmtAxis,
  nearestZeroInfo,
  paramsFromValues,
  presetById,
  presetIdFromIndex,
  presetIndexFromId,
  screenToX,
  slopeStateText,
  valuesFromParams,
  visibleZeros,
  xToScreen,
  yToScreen,
  zeroTypeText,
  type FunctionDerivativeParams,
  type FunctionDerivativePreset,
  type FunctionDerivativePresetId,
  type GraphRect,
} from './geometry';
