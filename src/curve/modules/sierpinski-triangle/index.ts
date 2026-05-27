import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  HAUSDORFF_DIMENSION,
  MAX_DEPTH,
  MODE_CHAOS,
  MODE_COMPARE,
  MODE_RECURSIVE,
  buildSierpinskiThumbnail,
  sierpinskiModeFromValue,
} from './geometry';

export const SIERPINSKI_REVEAL_SPEED = 0.018;

const paramSchema: ParamSchema = [
  { key: 'depth', label: '遞迴深度 n', min: 1, max: MAX_DEPTH, step: 1, default: 6 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_COMPARE,
};

export const sierpinskiTriangleModule: CurveModule = {
  id: 'sierpinski-triangle',
  paramSchema,
  defaultParams,
  sample: (params) => buildSierpinskiThumbnail(params.depth ?? 6),
  getMetadata: (params, runtime): CurveMetadata => {
    const depth = Math.round(params.depth ?? 6);
    const mode = sierpinskiModeFromValue(params.mode);
    return {
      title: '謝爾賓斯基三角形',
      formula: 'Pₖ₊₁ = (Pₖ + Vᵢ) / 2',
      stats: [
        { key: 'mode', label: 'mode', value: mode },
        { key: 'depth', label: 'depth', value: depth },
        { key: 'area', label: 'remaining area', value: Math.pow(3 / 4, depth).toFixed(6) },
        { key: 'scale', label: 'scale', value: '1/2' },
        { key: 'copies', label: 'copies', value: 3 },
        { key: 'dimension', label: 'dim', value: HAUSDORFF_DIMENSION.toFixed(5) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: SIERPINSKI_REVEAL_SPEED, revealSpeed: SIERPINSKI_REVEAL_SPEED },
};

export { MODE_CHAOS, MODE_COMPARE, MODE_RECURSIVE } from './geometry';
