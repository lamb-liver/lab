import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ThumbnailSpec } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { REVEAL_SPEED, SOURCE_DISTANCE_LERP } from './animation';
import { DEFAULT_SAMPLE_STEP, sampleInterferenceFringesCurve } from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'sourceDistance',
    label: '波源距離 d',
    min: 30,
    max: 200,
    step: 1,
    default: 80,
  },
  { key: 'wavelength', label: '波長 λ', min: 15, max: 80, step: 1, default: 30 },
  {
    key: 'timeSpeed',
    label: '時間速度 ω',
    min: 0.005,
    max: 0.08,
    step: 0.005,
    default: 0.03,
  },
];

export const interferenceFringesModule: CurveModule = {
  id: 'interference-fringes',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose, revealProgress }) => {
    if (purpose === 'thumbnail') {
      const spec: ThumbnailSpec = {
        paths: buildInterferenceThumbnailPaths(
          params.sourceDistance,
          params.wavelength,
          step,
        ),
      };
      return spec;
    }
    return sampleInterferenceFringesCurve(
      params.sourceDistance,
      params.wavelength,
      step,
      0,
      revealProgress ?? 1,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = runtime?.smoothParams ?? params;
    return {
      title: '干涉條紋',
      formula: 'Δr = nλ, x = a cosh(t), y = b sinh(t)',
      stats: [
        { key: 'd', label: 'd', value: Math.round(smooth.sourceDistance) },
        { key: 'lambda', label: 'λ', value: Math.round(params.wavelength) },
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
  animation: { lerp: SOURCE_DISTANCE_LERP, revealSpeed: REVEAL_SPEED },
};

export { REVEAL_SPEED, SOURCE_DISTANCE_LERP } from './animation';
import { BASE_CANVAS, buildInterferenceGeometry } from './geometry';

function toCurvePoints(raw: Array<{ x: number; y: number }>, step: number): CurvePoint[] {
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) cumulative += Math.hypot(x - prevX, y - prevY);
    points.push({ x, y, theta: i * step, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }
  return points;
}

function buildInterferenceThumbnailPaths(
  sourceDistance: number,
  wavelength: number,
  step: number,
) {
  const geometry = buildInterferenceGeometry({
    canvasWidth: BASE_CANVAS,
    canvasHeight: BASE_CANVAS,
    currentSourceDistance: sourceDistance,
    wavelength,
    time: 0,
    revealProgress: 1,
    sampleStep: step,
  });
  return geometry.envelopes
    .filter((envelope) => envelope.length > 1)
    .map((envelope) => ({ points: toCurvePoints(envelope, step) }));
}
