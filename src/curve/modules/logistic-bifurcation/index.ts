import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  MODE_COMPARE,
  buildLogisticThumbnail,
  buildOrbitData,
  logisticModeFromValue,
} from './geometry';

export const LOGISTIC_REVEAL_SPEED = 0.035;

const paramSchema: ParamSchema = [
  { key: 'r', label: '參數 r', min: 2.5, max: 4, step: 0.0001, default: 3.5 },
  { key: 'x0', label: '初值 x₀', min: 0.001, max: 0.999, step: 0.0001, default: 0.2 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_COMPARE,
  rMin: 2.5,
  rMax: 4,
  xMin: 0,
  xMax: 1,
  showFeig: 1,
  showCobweb: 1,
};

export const logisticBifurcationModule: CurveModule = {
  id: 'logistic-bifurcation',
  paramSchema,
  defaultParams,
  sample: (params) => buildLogisticThumbnail(params),
  getMetadata: (params, runtime): CurveMetadata => {
    const orbit = buildOrbitData(params);
    const mode = logisticModeFromValue(params.mode);
    const MODE_LABELS: Record<typeof mode, string> = {
      bifurcation: '分岔',
      orbit: '軌道',
      cobweb: '蛛網',
      compare: '對照',
    };
    const periodLabel =
      orbit.period === 'CHAOTIC' ? '混沌' : `${orbit.period}`;
    return {
      title: '邏輯斯諦映射分岔圖',
      formula: 'xₙ₊₁ = r xₙ(1 - xₙ)',
      stats: [
        { key: 'mode', label: '模式', value: MODE_LABELS[mode] },
        { key: 'r', label: 'r', value: (params.r ?? 3.5).toFixed(5) },
        { key: 'x0', label: 'x₀', value: (params.x0 ?? 0.2).toFixed(5) },
        { key: 'period', label: '週期', value: periodLabel },
        {
          key: 'range',
          label: 'r 範圍',
          value: `${(params.rMin ?? 2.5).toFixed(2)}–${(params.rMax ?? 4).toFixed(2)}`,
        },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: LOGISTIC_REVEAL_SPEED, revealSpeed: LOGISTIC_REVEAL_SPEED },
};

export { MODE_BIFURCATION, MODE_COBWEB, MODE_COMPARE, MODE_ORBIT } from './geometry';
