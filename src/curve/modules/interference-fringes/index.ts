import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ThumbnailPath, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
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
    const smooth = resolveSmoothParams(params, runtime);
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
  sampleStep: DEFAULT_SAMPLE_STEP,
  animation: { lerp: SOURCE_DISTANCE_LERP, revealSpeed: REVEAL_SPEED },
};

export { REVEAL_SPEED } from './animation';
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
): ThumbnailPath[] {
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
    .map((envelope) => {
      const isCenterLine = envelope.every((point) => Math.abs(point.x) < 0.001);
      return {
        points: toCurvePoints(envelope, step),
        opacity: isCenterLine ? 0.42 : 0.95,
        strokeWidth: isCenterLine ? 0.75 : 1.08,
        excludeFromBbox: isCenterLine,
      };
    });
}
