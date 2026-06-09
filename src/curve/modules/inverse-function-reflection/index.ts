import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { EXP_BASE_MAX, EXP_BASE_MIN } from './constants';
import {
  buildInverseFunctionReflectionThumbnail,
  asInverseFunctionReflectionParams,
  fmt,
  inverseMeta,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'base', label: '底數 q', min: EXP_BASE_MIN, max: EXP_BASE_MAX, step: 0.05, default: 2 },
];

const sliderDefaults = defaultsFromSchema(paramSchema);

export const inverseFunctionReflectionModule: CurveModule = {
  id: 'inverse-function-reflection',
  paramSchema,
  defaultParams: {
    ...sliderDefaults,
    mode: 0,
    advanced: 1,
    input: 1.5,
  },
  sample: (_params, { purpose }) => {
    if (purpose === 'thumbnail') return buildInverseFunctionReflectionThumbnail();
    return buildInverseFunctionReflectionThumbnail().paths[1]?.points ?? [];
  },
  getMetadata: (params) => {
    const full = asInverseFunctionReflectionParams(params);
    const meta = inverseMeta(full);

    return {
      title: '反函數鏡射',
      formula: meta.formula,
      stats: [
        { key: 'inverse', label: 'f⁻¹', value: meta.inverseFormula },
        { key: 'p', label: 'P', value: `(${fmt(meta.p.x)}, ${fmt(meta.p.y)})` },
        { key: 'pm', label: 'P′', value: `(${fmt(meta.pMirror.x)}, ${fmt(meta.pMirror.y)})` },
        {
          key: 'hlt',
          label: '水平線測試',
          value: meta.passHlt ? '通過' : '未通過',
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  asInverseFunctionReflectionParams,
  clampInputForMode,
  formulaText,
  geometryParamsEqual,
  inputRangeForMode,
  inverseFormulaText,
  modeFromIndex,
  modeToIndex,
  paramsForMetadata,
  paramsForModeSwitch,
  type InverseFunctionMode,
  type InverseFunctionReflectionParams,
} from './geometry';
