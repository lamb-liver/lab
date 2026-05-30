import { BASE_CANVAS_SIZE } from '../../constants';
import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { PARAM_LERP, REVEAL_SPEED } from './animation';
import {
  buildRiemannCurvePoints,
  buildRiemannRectangles,
  sampleRiemannSumCurve,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'partitionCount', label: '分割數量 n', min: 4, max: 120, step: 1, default: 12 },
  {
    key: 'waveFrequency',
    label: '波動頻率 k',
    min: 0.5,
    max: 4,
    step: 0.1,
    default: 2,
  },
  {
    key: 'timeSpeed',
    label: '時間速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const riemannSumModule: CurveModule = {
  id: 'riemann-sum',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    if (purpose === 'thumbnail') {
      const time = getRiemannSumThumbnailTime();
      const curve = canvasPointsToCurvePoints(
        buildRiemannCurvePoints(BASE_CANVAS_SIZE, params.waveFrequency, time, 1, step),
      );
      const rects = buildRiemannRectangles(
        BASE_CANVAS_SIZE,
        params.partitionCount,
        params.waveFrequency,
        time,
        1,
      );
      const spec: ThumbnailSpec = {
        paths: [
          { points: curve },
          ...rects.map((rect) => ({
            points: rectangleToOpenPathCurvePoints(rect),
          })),
        ],
      };
      return spec;
    }
    return sampleRiemannSumCurve(
      BASE_CANVAS_SIZE,
      params.waveFrequency,
      0,
      step,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '黎曼和',
      formula: 'Area ≈ Σ f(xᵢ)·Δx',
      stats: [
        { key: 'n', label: 'n', value: Math.round(smooth.partitionCount) },
        { key: 'k', label: 'k', value: params.waveFrequency.toFixed(1) },
        { key: 'omega', label: 'ω', value: params.timeSpeed.toFixed(3) },
        {
          key: 'domain',
          label: 'domain',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 2,
  animation: { lerp: PARAM_LERP, revealSpeed: REVEAL_SPEED },
};

export { PARAM_LERP, REVEAL_SPEED } from './animation';

export function getRiemannSumThumbnailTime(): number {
  return 0;
}

function canvasPointsToCurvePoints(raw: Array<{ x: number; y: number }>): CurvePoint[] {
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) cumulative += Math.hypot(x - prevX, y - prevY);
    points.push({ x, y: -y, theta: i, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }
  return points;
}

function rectangleToOpenPathCurvePoints(rect: {
  leftX: number;
  topY: number;
  rightX: number;
}): CurvePoint[] {
  const baseY = 0;
  const raw = [
    { x: rect.leftX, y: baseY },
    { x: rect.leftX, y: rect.topY },
    { x: rect.rightX, y: rect.topY },
    { x: rect.rightX, y: baseY },
  ];
  return canvasPointsToCurvePoints(raw);
}
