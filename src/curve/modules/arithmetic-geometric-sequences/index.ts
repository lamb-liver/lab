import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  MODE_ARITHMETIC,
  buildArithmeticScene,
  buildGeometricScene,
  buildSequenceThumbnail,
  sequenceModeFromParams,
} from './geometry';

export const SEQUENCE_REVEAL_SPEED = 0.08;

const paramSchema: ParamSchema = [
  { key: 'arithmeticA1', label: '首項 a₁', min: 1, max: 12, step: 0.1, default: 2 },
  { key: 'arithmeticD', label: '公差 d', min: 0.2, max: 4, step: 0.1, default: 1 },
  { key: 'arithmeticN', label: '項數 n', min: 1, max: 20, step: 1, default: 8 },
  { key: 'geometricA1', label: '首項 a₁', min: 0.2, max: 3, step: 0.05, default: 1 },
  { key: 'geometricR', label: '公比 r', min: 0.2, max: 0.98, step: 0.01, default: 0.5 },
  { key: 'geometricN', label: '項數 n', min: 1, max: 20, step: 1, default: 8 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_ARITHMETIC,
};

export const arithmeticGeometricSequencesModule: CurveModule = {
  id: 'arithmetic-geometric-sequences',
  paramSchema,
  defaultParams,
  sample: (params) => buildSequenceThumbnail(params),
  getMetadata: (params, runtime): CurveMetadata => {
    const reveal = runtime ? runtime.revealPct / 100 : 1;
    const mode = sequenceModeFromParams(params);
    if (mode === 'geometric') {
      const scene = buildGeometricScene(params, reveal);
      return {
        title: '等比數列',
        formula: 'Sₙ = a₁(1 - rⁿ) / (1 - r)',
        stats: [
          { key: 'a1', label: 'a₁', value: (params.geometricA1 ?? 1).toFixed(2) },
          { key: 'r', label: '公比 r', value: (params.geometricR ?? 0.5).toFixed(2) },
          { key: 'n', label: '項數 n', value: Math.round(params.geometricN ?? 8) },
          { key: 'sum', label: 'Sₙ', value: scene.formulaSum.toFixed(3) },
        ],
      };
    }

    const scene = buildArithmeticScene(params, reveal);
    return {
      title: '等差數列',
      formula: 'Sₙ = n(a₁ + aₙ) / 2',
      stats: [
        { key: 'a1', label: 'a₁', value: (params.arithmeticA1 ?? 2).toFixed(2) },
        { key: 'd', label: '公差 d', value: (params.arithmeticD ?? 1).toFixed(2) },
        { key: 'n', label: '項數 n', value: Math.round(params.arithmeticN ?? 8) },
        { key: 'sum', label: 'Sₙ', value: scene.formulaSum.toFixed(3) },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: SEQUENCE_REVEAL_SPEED, revealSpeed: SEQUENCE_REVEAL_SPEED },
};

export { MODE_ARITHMETIC, MODE_GEOMETRIC } from './geometry';
