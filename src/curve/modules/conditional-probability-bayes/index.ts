import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  MODE_TREE,
  SCENARIO_MEDICAL,
  buildBayesThumbnail,
  deriveData,
  modeFromValue,
  normalizeScenario,
  percent,
  scenarios,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'pA', label: 'P(A) %', min: 0, max: 100, step: 1, default: 1 },
  { key: 'pBgA', label: 'P(B|A) %', min: 0, max: 100, step: 1, default: 95 },
  { key: 'pBgNotA', label: 'P(B|not A) %', min: 0, max: 100, step: 1, default: 5 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_TREE,
  scenario: SCENARIO_MEDICAL,
};

export const conditionalProbabilityBayesModule: CurveModule = {
  id: 'conditional-probability-bayes',
  paramSchema,
  defaultParams,
  sample: () => buildBayesThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const data = deriveData(params);
    const sid = normalizeScenario(params.scenario);
    return {
      title: '條件機率與貝氏定理',
      formula: 'P(A|B) = P(B|A)P(A)/P(B)',
      stats: [
        { key: 'scenario', label: 'scenario', value: scenarios[sid]!.A },
        { key: 'mode', label: 'mode', value: modeFromValue(params.mode) },
        { key: 'P(A)', label: 'P(A)', value: percent(data.pA) },
        { key: 'P(B)', label: 'P(B)', value: percent(data.pB) },
        { key: 'posterior', label: 'P(A|B)', value: percent(data.posterior) },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: 0.025 },
};

export {
  MODE_AREA,
  MODE_BAYES,
  MODE_TREE,
  SCENARIO_CARD,
  SCENARIO_MEDICAL,
  SCENARIO_SPAM,
} from './geometry';
