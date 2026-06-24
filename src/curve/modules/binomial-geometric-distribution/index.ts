import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  MODE_BINOMIAL,
  MODE_GEOMETRIC,
  buildBinomialGeometricThumbnail,
  deriveDistributionData,
  formatNum,
  modeFromValue,
  percent,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'n', label: '試驗次數 n', min: 2, max: 30, step: 1, default: 12 },
  { key: 'p', label: '成功率 p', min: 5, max: 95, step: 1, default: 35 },
];

const MODE_LABELS: Record<ReturnType<typeof modeFromValue>, string> = {
  binomial: '二項',
  geometric: '幾何',
};

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_BINOMIAL,
};

export const binomialGeometricDistributionModule: CurveModule = {
  id: 'binomial-geometric-distribution',
  paramSchema,
  defaultParams,
  sample: () => buildBinomialGeometricThumbnail(),
  getMetadata: (params): CurveMetadata => {
    const data = deriveDistributionData(params);
    const formula =
      data.dist === 'binomial'
        ? 'P(X=k)=C(n,k)p^k(1-p)^(n-k)'
        : 'P(X=k)=(1-p)^k p';

    return {
      title: '二項分布與幾何分布',
      formula,
      stats: [
        { key: 'mode', label: '分布', value: MODE_LABELS[data.dist] },
        { key: 'p', label: 'p', value: percent(data.p) },
        ...(data.dist === 'binomial' ? [{ key: 'n', label: 'n', value: data.n }] : []),
        { key: 'support', label: '支撐', value: data.supportLabel },
        { key: 'mean', label: 'E(X)', value: formatNum(data.mean, 3) },
        { key: 'variance', label: 'Var(X)', value: formatNum(data.variance, 3) },
        { key: 'sigma', label: 'σ', value: formatNum(data.sigma, 3) },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: 0.025 },
};

export { MODE_BINOMIAL, MODE_GEOMETRIC } from './geometry';
