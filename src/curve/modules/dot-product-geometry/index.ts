import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  computeDotProductMetrics,
  formatAngle,
  formatVector,
  sampleDotProductGeometryThumbnail,
  vectorFromParams,
  type DotProductGeometryParams,
  type DotProductMode,
} from './geometry';

const paramSchema: ParamSchema = [];

export const DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS: DotProductGeometryParams = {
  ux: 3.2,
  uy: 1.6,
  vx: 2.2,
  vy: 3.0,
  mode: 'dot',
};

function modeFromParam(value: number | DotProductMode | undefined): DotProductMode {
  if (value === 'work' || value === 1) return 'work';
  return 'dot';
}

export function asDotProductParams(params: ParamValues | DotProductGeometryParams): DotProductGeometryParams {
  return {
    ux: params.ux ?? DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.ux,
    uy: params.uy ?? DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.uy,
    vx: params.vx ?? DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.vx,
    vy: params.vy ?? DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.vy,
    mode: modeFromParam(params.mode as number | DotProductMode | undefined),
  };
}

export const dotProductGeometryModule: CurveModule = {
  id: 'dot-product-geometry',
  paramSchema,
  defaultParams: {
    ux: DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.ux,
    uy: DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.uy,
    vx: DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.vx,
    vy: DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS.vy,
    mode: 0,
  },
  sample: (params, { purpose }) => {
    const dotParams = asDotProductParams(params);
    const spec = sampleDotProductGeometryThumbnail(dotParams);
    if (purpose === 'thumbnail') return spec;
    return spec.paths[2]?.points ?? [];
  },
  getMetadata: (params) => {
    const dotParams = asDotProductParams(params);
    const { u, v } = vectorFromParams(dotParams);
    const metrics = computeDotProductMetrics(dotParams);
    const angleValue = metrics.hasAngle ? formatAngle(metrics.theta) : '—';
    const compValue = metrics.lenV > 1e-6 ? metrics.comp.toFixed(3) : '—';

    return {
      title: dotParams.mode === 'work' ? '功的內積模型' : '內積的幾何意義',
      formula: `${metrics.resultLabel} = |${metrics.labelA}| |${metrics.labelB}| cosθ`,
      stats: [
        { key: 'u', label: metrics.labelA, value: formatVector(u) },
        { key: 'v', label: metrics.labelB, value: formatVector(v) },
        { key: 'theta', label: 'θ / cosθ', value: `${angleValue} / ${metrics.cosTheta.toFixed(3)}` },
        { key: 'dot', label: metrics.resultLabel, value: `${metrics.dot.toFixed(3)} · comp = ${compValue}` },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { DotProductGeometryParams, DotProductMode };
