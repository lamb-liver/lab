import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ThumbnailSpec } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { FOCAL_LERP, REVEAL_SPEED } from './animation';
import {
  BASE_CANVAS,
  buildParabolaCurve,
  buildReflectionRays,
  CURVE_STEP,
  sampleParabolicReflectionCurve,
} from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'focalLength',
    label: '焦距 p',
    min: 15,
    max: 80,
    step: 1,
    default: 40,
  },
  { key: 'rayCount', label: '光束數', min: 4, max: 30, step: 1, default: 12 },
  {
    key: 'scanSpeed',
    label: '掃描速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const parabolicReflectionModule: CurveModule = {
  id: 'parabolic-reflection',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    if (purpose === 'thumbnail') {
      const parabola = buildParabolaCurve(BASE_CANVAS, params.focalLength, step);
      const rays = buildReflectionRays({
        canvasWidth: BASE_CANVAS,
        canvasHeight: BASE_CANVAS,
        currentFocalLength: params.focalLength,
        rayCount: params.rayCount,
        time: 0,
        revealProgress: 1,
      });
      const spec: ThumbnailSpec = {
        paths: [
          { points: toCurvePoints(parabola) },
          ...rays.map((ray) => ({ points: lineToCurvePoints(ray), opacity: 0.8 })),
        ],
      };
      return spec;
    }
    return sampleParabolicReflectionCurve(params.focalLength, step);
  },
  getMetadata: (params, runtime) => {
    const smooth = runtime?.smoothParams ?? params;
    return {
      title: 'PARABOLIC REFLECTION',
      formula: 'y² = 4px · F(p, 0)',
      stats: [
        { key: 'p', label: 'p', value: Math.round(smooth.focalLength) },
        { key: 'rays', label: 'rays', value: Math.round(params.rayCount) },
        { key: 'omega', label: 'ω', value: params.scanSpeed.toFixed(3) },
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
  sampleStep: CURVE_STEP,
  animation: { lerp: FOCAL_LERP, revealSpeed: REVEAL_SPEED },
};

export { FOCAL_LERP, REVEAL_SPEED } from './animation';

function toCurvePoints(raw: Array<{ x: number; y: number }>): CurvePoint[] {
  const points: CurvePoint[] = [];
  let arcLength = 0;
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < raw.length; i++) {
    const pt = raw[i]!;
    if (i > 0) arcLength += Math.hypot(pt.x - prevX, pt.y - prevY);
    points.push({ x: pt.x, y: pt.y, theta: i, arcLength });
    prevX = pt.x;
    prevY = pt.y;
  }
  return points;
}

function lineToCurvePoints(line: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}): CurvePoint[] {
  return [
    { x: line.x1, y: line.y1, theta: 0, arcLength: 0 },
    {
      x: line.x2,
      y: line.y2,
      theta: 1,
      arcLength: Math.hypot(line.x2 - line.x1, line.y2 - line.y1),
    },
  ];
}
