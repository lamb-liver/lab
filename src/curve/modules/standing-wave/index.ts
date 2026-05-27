import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { AMPLITUDE_LERP, REVEAL_SPEED } from './animation';
import { DEFAULT_SAMPLE_STEP, sampleStandingWaveCurve } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'amplitude', label: '振幅 A', min: 10, max: 80, step: 1, default: 45 },
  {
    key: 'spatialFrequency',
    label: '空間頻率 k',
    min: 1,
    max: 12,
    step: 1,
    default: 4,
  },
  {
    key: 'timeSpeed',
    label: '時間速度 ω',
    min: 0.005,
    max: 0.1,
    step: 0.005,
    default: 0.04,
  },
];

export const standingWaveModule: CurveModule = {
  id: 'standing-wave',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose, revealProgress }) => {
    if (purpose === 'thumbnail') {
      const points = sampleStandingWaveCurve(
        params.amplitude,
        params.spatialFrequency,
        step,
        getStandingWaveThumbnailTime(params.timeSpeed),
        1,
      );
      const spec: ThumbnailSpec = {
        paths: [{ points }],
      };
      return spec;
    }
    return sampleStandingWaveCurve(
      params.amplitude,
      params.spatialFrequency,
      step,
      0,
      revealProgress ?? 1,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = runtime?.smoothParams ?? params;
    return {
      title: '駐波圖',
      formula: 'y = 2A sin(kx) cos(ωt)',
      stats: [
        { key: 'A', label: 'A', value: Math.round(smooth.amplitude) },
        {
          key: 'k',
          label: 'k',
          value: Math.round(params.spatialFrequency),
        },
        { key: 'omega', label: 'ω', value: params.timeSpeed.toFixed(3) },
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
  sampleStep: DEFAULT_SAMPLE_STEP,
  animation: { lerp: AMPLITUDE_LERP, revealSpeed: REVEAL_SPEED },
};

export { AMPLITUDE_LERP, REVEAL_SPEED } from './animation';

export function getStandingWaveThumbnailTime(_timeSpeed: number): number {
  // y = 2A sin(kx) cos(t); t = 0 gives cos(0) = 1 (max envelope),
  // while pi/2 would collapse to a flat line (cos(pi/2) = 0).
  return 0;
}
