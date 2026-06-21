import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  buildPercentileBoxPlotThumbnail,
  boxSummary,
  createBoxplotValues,
  paramsFromValues,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'n', label: '資料數 n', min: 6, max: 28, step: 1, default: 15 },
  { key: 'spread', label: '分散度 s', min: 0.4, max: 1.45, step: 0.01, default: 1 },
  { key: 'skew', label: '偏斜量 γ', min: -1, max: 1, step: 0.01, default: 0.25 },
  { key: 'fenceK', label: '鬚線倍數 k', min: 1, max: 2.5, step: 0.05, default: 1.5 },
];

const defaultParams: ParamValues = defaultsFromSchema(paramSchema);

export function getPercentileBoxPlotMetadata(
  params: ParamValues,
  values: number[] = createBoxplotValues(paramsFromValues(params)),
): CurveMetadata {
  const summary = boxSummary(values, params.fenceK ?? 1.5);
  return {
    title: '百分位數與盒鬚圖',
    formula: 'IQR = Q₃ - Q₁, fence = Q ± k·IQR',
    stats: [
      { key: 'n', label: 'n', value: values.length },
      { key: 'q1', label: 'Q₁', value: summary.q1.toFixed(2) },
      { key: 'q2', label: 'Q₂', value: summary.q2.toFixed(2) },
      { key: 'q3', label: 'Q₃', value: summary.q3.toFixed(2) },
    ],
  };
}

export const percentileBoxPlotModule: CurveModule = {
  id: 'percentile-box-plot',
  paramSchema,
  defaultParams,
  sample: () => buildPercentileBoxPlotThumbnail(),
  getMetadata: (params): CurveMetadata => getPercentileBoxPlotMetadata(params),
  sampleStep: 1,
  animation: { lerp: 0.08, revealSpeed: 0.08 },
};

export {
  boxSummary,
  createBoxplotValues,
  paramsFromValues,
  percentile,
  shiftValues,
  stretchValues,
} from './geometry';
