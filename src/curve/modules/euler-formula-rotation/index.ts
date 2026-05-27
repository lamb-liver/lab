import type { CurveModule, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { defaultsFromSchema } from '../../defaults';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { PARAM_LERP } from './animation';

const paramSchema: ParamSchema = [
  { key: 'amplitude', label: '振幅 A', min: 0.5, max: 2.2, step: 0.05, default: 1.45 },
  { key: 'frequency', label: '角頻率 ω', min: 0.5, max: 3, step: 0.1, default: 1 },
  { key: 'phase', label: '初相位 δ', min: 0, max: Math.PI * 2, step: 0.01, default: 0 },
];

function sampleEulerFormulaRotationThumbnail(
  amplitude: number,
  phase: number,
): ThumbnailSpec {
  const planeRadius = 70 * (amplitude / 2.2);
  const cx = -90;
  const x = cx + Math.cos(phase) * amplitude * planeRadius;
  const y = -Math.sin(phase) * amplitude * planeRadius;

  const wave: Array<{ x: number; y: number; theta: number; arcLength: number }> = [];
  for (let i = 0; i < 80; i++) {
    const t = i / 79;
    const px = 20 + t * 120;
    const py = -Math.sin(phase + t * Math.PI * 2) * planeRadius * 0.55;
    wave.push({ x: px, y: py, theta: t, arcLength: t * 120 });
  }

  return {
    paths: [
      {
        points: [
          { x: cx - planeRadius, y: 0, theta: 0, arcLength: 0 },
          { x: cx + planeRadius, y: 0, theta: 1, arcLength: planeRadius * 2 },
        ],
        opacity: 0.25,
        strokeWidth: 0.8,
        excludeFromBbox: true,
      },
      {
        points: [
          { x: cx, y: 0, theta: 0, arcLength: 0 },
          { x, y, theta: 1, arcLength: Math.hypot(x - cx, y) },
        ],
        strokeWidth: 1.4,
      },
      { points: wave, strokeWidth: 1.1 },
    ],
  };
}

export const eulerFormulaRotationModule: CurveModule = {
  id: 'euler-formula-rotation',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      return sampleEulerFormulaRotationThumbnail(params.amplitude, params.phase);
    }
    return sampleEulerFormulaRotationThumbnail(params.amplitude, params.phase).paths[1]?.points ?? [];
  },
  getMetadata: (params, runtime) => {
    const smooth = runtime?.smoothParams ?? params;
    return {
      title: 'EULER ROTATION',
      formula: 'e^(i(ωt + δ)) = cos(ωt + δ) + i sin(ωt + δ)',
      stats: [
        { key: 'A', label: 'A', value: params.amplitude.toFixed(2) },
        { key: 'omega', label: 'ω', value: params.frequency.toFixed(1) },
        {
          key: 'delta',
          label: 'δ',
          value: `${(smooth.phase / Math.PI).toFixed(2)}π`,
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  animation: { lerp: PARAM_LERP, revealSpeed: 0 },
};

export { PARAM_LERP, TIME_SPEED } from './animation';

export function measureEulerFormulaRotationCanvas(host: HTMLElement): {
  width: number;
  height: number;
} {
  const w = host.clientWidth;
  const width = w > 0 ? Math.min(w, 900) : 900;
  const clamped = Math.max(280, width);
  return { width: clamped, height: Math.round(clamped * 0.72) };
}
