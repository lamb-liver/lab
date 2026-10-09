import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  LOG_REVEAL_SPEED,
  buildLogarithmicThumbnail,
  deriveLogarithmicState,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'a', label: '指數斜率 a', min: 0.2, max: 1, step: 0.01, default: 0.65 },
  { key: 'p', label: '冪次 p', min: 1, max: 5, step: 0.05, default: 2.4 },
  { key: 'm', label: '線性倍率 m', min: 0.5, max: 8, step: 0.05, default: 3 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  compareMode: 0,
  showExp: 1,
  showPower: 0,
  showLinear: 0,
};

export const logarithmicScaleModule: CurveModule = {
  id: 'logarithmic-scale',
  paramSchema,
  defaultParams,
  sample: () => buildLogarithmicThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const data = deriveLogarithmicState(params);
    const stats = [
      { key: 'a', label: '指數斜率 a', value: data.a.toFixed(2) },
      { key: 'formula', label: '關係式', value: 'log₁₀ y = ax' },
    ];

    if (data.compareMode && data.showLinear) {
      stats.push({ key: 'm', label: '線性倍率 m', value: data.m.toFixed(2) });
    }

    stats.push({
      key: 'reveal',
      label: 'reveal',
      value: runtime ? `${runtime.revealPct}%` : '—',
    });

    return {
      title: '對數尺度',
      formula: 'y = 10^(ax) · log₁₀ y = ax',
      stats,
    };
  },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: LOG_REVEAL_SPEED },
};

export { LOG_REVEAL_SPEED } from './geometry';
