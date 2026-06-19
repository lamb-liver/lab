import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import {
  LOGISTIC_CURVE_REVEAL_SPEED,
  buildLogisticCurveThumbnail,
  deriveLogisticStats,
  paramsFromValues,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'L', label: '承載上限 L', min: 40, max: 180, step: 1, default: 100 },
  { key: 'k', label: '成長速率 k', min: 0.3, max: 1.6, step: 0.01, default: 0.75 },
  { key: 'a', label: '初值偏移 a', min: 0.4, max: 18, step: 0.1, default: 12 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  showDyDt: 1,
  showExpCompare: 1,
};

export const logisticCurveModule: CurveModule = {
  id: 'logistic-curve',
  paramSchema,
  defaultParams,
  sample: () => buildLogisticCurveThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const smooth = paramsFromValues(resolveSmoothParams(params, runtime));
    const stats = deriveLogisticStats(smooth);

    return {
      title: '邏輯斯諦曲線',
      formula: 'y(t) = L / (1 + a·e^(-kt))',
      stats: [
        { key: 'y0', label: 'y(0)', value: stats.y0.toFixed(2) },
        { key: 'tStar', label: 't*', value: stats.tStar.toFixed(2) },
        { key: 'dyMax', label: '最大 dy/dt', value: stats.dyMax.toFixed(2) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: LOGISTIC_CURVE_REVEAL_SPEED, revealSpeed: LOGISTIC_CURVE_REVEAL_SPEED },
};

export { LOGISTIC_CURVE_REVEAL_SPEED } from './geometry';
