import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  MODE_TREE,
  SCENARIO_CARD,
  SCENARIO_MEDICAL,
  SCENARIO_SPAM,
  buildBayesThumbnail,
  deriveData,
  modeFromValue,
  normalizeScenario,
  percent,
  scenarios,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'pA', label: '先驗 P(A)', min: 0, max: 100, step: 1, default: 1 },
  { key: 'pBgA', label: '條件 P(B|A)', min: 0, max: 100, step: 1, default: 95 },
  { key: 'pBgNotA', label: '條件 P(B|¬A)', min: 0, max: 100, step: 1, default: 5 },
];

const MODE_LABELS: Record<ReturnType<typeof modeFromValue>, string> = {
  tree: '樹狀圖',
  area: '面積模型',
  bayes: '貝氏更新',
};

const SCENARIO_LABELS: Record<number, string> = {
  [SCENARIO_MEDICAL]: '醫檢',
  [SCENARIO_CARD]: '抽牌',
  [SCENARIO_SPAM]: '垃圾信',
};

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
  getMetadata: (params): CurveMetadata => {
    const data = deriveData(params);
    const sid = normalizeScenario(params.scenario);
    return {
      title: '條件機率與貝氏定理',
      formula: 'P(A|B) = P(B|A)P(A)/P(B)',
      stats: [
        { key: 'scenario', label: '情境', value: SCENARIO_LABELS[sid] ?? scenarios[sid]!.A },
        { key: 'mode', label: '模式', value: MODE_LABELS[modeFromValue(params.mode)] },
        { key: 'P(A)', label: 'P(A)', value: percent(data.pA) },
        { key: 'posterior', label: 'P(A|B)', value: percent(data.posterior) },
      ],
    };
  },
  /** 互動走 conditionalProbabilityBayesRender；preset 僅滿足 CurveModule 型別。 */
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
