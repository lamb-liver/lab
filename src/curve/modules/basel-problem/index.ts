import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  MODE_PARTIAL,
  baselModeFromValue,
  buildBaselThumbnail,
  calculateBaselStats,
  normalizeN,
} from './geometry';

export const BASEL_REVEAL_LERP = 0.06;

const paramSchema: ParamSchema = [
  { key: 'N', label: '項數 N', min: 2, max: 80, step: 1, default: 12 },
  { key: 'p', label: '冪次 p', min: 0.4, max: 4, step: 0.05, default: 2 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_PARTIAL,
};

export const baselProblemModule: CurveModule = {
  id: 'basel-problem',
  paramSchema,
  defaultParams,
  sample: (params) => buildBaselThumbnail(params),
  getMetadata: (params, runtime): CurveMetadata => {
    const revealProgress = runtime ? runtime.revealPct / 100 : 1;
    const stats = calculateBaselStats(params, revealProgress);
    const mode = baselModeFromValue(params.mode);
    const MODE_LABELS: Record<typeof mode, string> = {
      partial: '部分和',
      area: '面積',
      compare: '比較',
      euler: 'Euler',
      pseries: 'p-級數',
      param: '零點',
    };
    return {
      title: '巴塞爾問題',
      formula: 'ζ(2) = Σ 1/n² = π²/6',
      stats: [
        { key: 'mode', label: '模式', value: MODE_LABELS[mode] },
        { key: 'N', label: '項數 N', value: normalizeN(params.N) },
        { key: 'sum', label: 'Sₙ', value: stats.sum.toFixed(6) },
        { key: 'error', label: '|誤差|', value: stats.error === null ? '—' : stats.error.toFixed(8) },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: BASEL_REVEAL_LERP, revealSpeed: BASEL_REVEAL_LERP },
};

export {
  MODE_AREA,
  MODE_COMPARE,
  MODE_EULER,
  MODE_PARAM,
  MODE_PARTIAL,
  MODE_PSERIES,
} from './geometry';
