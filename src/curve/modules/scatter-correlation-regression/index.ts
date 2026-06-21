import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  buildScatterCorrelationThumbnail,
  createScatterPoints,
  paramsFromValues,
  regression,
  type ScatterPoint,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'n', label: '資料數 n', min: 4, max: 24, step: 1, default: 12 },
  { key: 'beta', label: '線性趨勢 β', min: -1.4, max: 1.4, step: 0.01, default: 0.72 },
  { key: 'curve', label: '彎曲量 c', min: -1.2, max: 1.2, step: 0.01, default: 0 },
  { key: 'noise', label: '雜訊 σ', min: 0, max: 2.4, step: 0.01, default: 0.85 },
];

const defaultParams: ParamValues = defaultsFromSchema(paramSchema);

export function getScatterCorrelationMetadata(
  params: ParamValues,
  points: ScatterPoint[] = createScatterPoints(paramsFromValues(params)),
): CurveMetadata {
  const fit = regression(points);
  return {
    title: '散布圖、相關與迴歸線',
    formula: 'r = Σdxdy / √(Σdx²Σdy²), ŷ = a + bx',
    stats: fit
      ? [
          { key: 'n', label: 'n', value: points.length },
          { key: 'r', label: 'r', value: fit.r.toFixed(3) },
          { key: 'absR', label: '|r|', value: Math.abs(fit.r).toFixed(3) },
          { key: 'mean', label: 'x̄, ȳ', value: `${fit.xbar.toFixed(2)}, ${fit.ybar.toFixed(2)}` },
          { key: 'line', label: 'ŷ', value: `${fit.a.toFixed(2)} ${fit.b < 0 ? '-' : '+'} ${Math.abs(fit.b).toFixed(2)}x` },
          { key: 'rss', label: 'RSS', value: fit.rss.toFixed(2) },
        ]
      : [
          { key: 'n', label: 'n', value: points.length },
          { key: 'r', label: 'r', value: '—' },
        ],
  };
}

export const scatterCorrelationRegressionModule: CurveModule = {
  id: 'scatter-correlation-regression',
  paramSchema,
  defaultParams,
  sample: () => buildScatterCorrelationThumbnail(),
  getMetadata: (params): CurveMetadata => getScatterCorrelationMetadata(params),
  sampleStep: 1,
  animation: { lerp: 0.08, revealSpeed: 0.08 },
};

export {
  createScatterPoints,
  flipYDirection,
  paramsFromValues,
  scaleCloud,
  translatePoints,
} from './geometry';
