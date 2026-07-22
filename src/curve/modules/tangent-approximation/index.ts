import { BASE_CANVAS_SIZE } from '../../constants';
import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { COLLAPSE_SPEED, PARAM_LERP } from './animation';
import {
  buildFunctionCurvePoints,
  buildSecantExtension,
  buildSecantSegment,
  sampleTangentApproximationCurve,
  tangentPointX,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'dx', label: '目標跨度 Δx', min: 0.001, max: 0.4, step: 0.001, default: 0.3 },
  {
    key: 'waveFrequency',
    label: '波動頻率 k',
    min: 0.5,
    max: 3.5,
    step: 0.1,
    default: 1.8,
  },
  {
    key: 'timeSpeed',
    label: '時間速度 ω',
    min: 0.005,
    max: 0.05,
    step: 0.005,
    default: 0.015,
  },
];

export const tangentApproximationModule: CurveModule = {
  id: 'tangent-approximation',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    if (purpose === 'thumbnail') {
      const time = getTangentApproximationThumbnailTime();
      const dx = params.dx;
      const px = tangentPointX(time);
      const secant = buildSecantSegment(BASE_CANVAS_SIZE, params.waveFrequency, time, px, dx);
      const spec: ThumbnailSpec = {
        paths: [
          {
            /**
             * 被逼近的那條曲線。原本只有 0.35 透明度，比割線還淡，
             * 縮圖看起來就只是「兩條交叉的線」，看不出誰在逼近誰。
             * 曲線才是主角，割線是疊在它上面的弦。
             */
            points: canvasPointsToCurvePoints(
              buildFunctionCurvePoints(BASE_CANVAS_SIZE, params.waveFrequency, time),
            ),
            opacity: 0.92,
            excludeFromBbox: true,
          },
          {
            points: canvasPointsToCurvePoints(secant),
          },
          {
            points: canvasPointsToCurvePoints(
              buildSecantExtension(
                BASE_CANVAS_SIZE,
                params.waveFrequency,
                time,
                px,
                dx,
              ),
            ),
            opacity: 0.5,
          },
        ],
        // 割線的兩個端點標出來，Δx 才看得見——那正是要收斂到零的量
        circles: secantEndpointCircles(secant),
      };
      return spec;
    }
    return sampleTangentApproximationCurve(
      BASE_CANVAS_SIZE,
      params.waveFrequency,
      0,
      step,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '切線逼近',
      formula: 'm = Δf/Δx → f′(x)',
      stats: [
        { key: 'dx', label: 'Δx', value: smooth.dx.toFixed(3) },
        { key: 'k', label: 'k', value: params.waveFrequency.toFixed(1) },
        { key: 'omega', label: 'ω', value: params.timeSpeed.toFixed(3) },
        {
          key: 'collapse',
          label: 'collapse',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: PARAM_LERP, revealSpeed: COLLAPSE_SPEED },
};

export { COLLAPSE_SPEED } from './animation';

export function getTangentApproximationThumbnailTime(): number {
  return 0;
}

/** 割線兩端各放一個點；線段為空時不放，避免產生非有限座標的圓 */
function secantEndpointCircles(secant: Array<{ x: number; y: number }>) {
  const first = secant[0];
  const last = secant[secant.length - 1];
  if (!first || !last) return [];
  return [first, last]
    .filter((pt) => Number.isFinite(pt.x) && Number.isFinite(pt.y))
    .map((pt) => ({ x: pt.x, y: pt.y, r: 7, fill: 'rgb(212, 184, 122)' }));
}

function canvasPointsToCurvePoints(raw: Array<{ x: number; y: number }>): CurvePoint[] {
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) cumulative += Math.hypot(x - prevX, y - prevY);
    points.push({ x, y, theta: i, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }
  return points;
}
