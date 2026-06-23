import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_OUTLIER,
  OUTLIER_PRESETS,
  buildRegressionOutlierInfluenceThumbnail,
  influenceStats,
} from './geometry';
import type { ScatterPoint } from '../scatter-correlation-regression/geometry';

const paramSchema: ParamSchema = [];
const defaultParams: ParamValues = {};

function fmt(v: number, digits = 3): string {
  return Number.isFinite(v) ? v.toFixed(digits).replace('-0.000', '0.000') : '—';
}

export function getRegressionOutlierInfluenceMetadata(
  outlier: ScatterPoint = DEFAULT_OUTLIER,
): CurveMetadata {
  const stats = influenceStats(outlier);
  return {
    title: '離群值對迴歸的影響',
    formula: 'Δb = b - b₀, e₀ = yₒ - ŷ₀',
    stats: [
      { key: 'outlier', label: 'xₒ, yₒ', value: `${outlier.x.toFixed(2)}, ${outlier.y.toFixed(2)}` },
      { key: 'b0', label: 'b₀', value: fmt(stats.b0) },
      { key: 'b', label: 'b', value: fmt(stats.b) },
      { key: 'deltaB', label: 'Δb', value: fmt(stats.deltaB) },
      { key: 'leverage', label: '|xₒ - x̄₀|', value: stats.horizontalDistance.toFixed(2) },
      { key: 'residual', label: 'e₀', value: fmt(stats.baseResidual) },
    ],
  };
}

export const regressionOutlierInfluenceModule: CurveModule = {
  id: 'regression-outlier-influence',
  paramSchema,
  defaultParams,
  sample: () => buildRegressionOutlierInfluenceThumbnail(),
  getMetadata: () => getRegressionOutlierInfluenceMetadata(),
  sampleStep: 1,
  animation: { lerp: 0.08, revealSpeed: 0.08 },
};

export {
  DEFAULT_OUTLIER,
  OUTLIER_PRESETS,
  influenceStats,
};
