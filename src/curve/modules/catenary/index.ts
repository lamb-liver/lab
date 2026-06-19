import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import {
  PARAM_LERP,
  buildParametricCurve,
  evaluateTractrix,
  mirrorY,
  sampleCatenaryCurve,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'ropeLength', label: '固定繩長 L', min: 0.6, max: 2.5, step: 0.05, default: 1.5 },
  { key: 'maxT', label: '歷史範圍 t', min: 1, max: 5, step: 0.05, default: 3.5 },
  {
    key: 'timeSpeed',
    label: '時間速度 ω',
    min: 0.005,
    max: 0.04,
    step: 0.005,
    default: 0.015,
  },
];

export const catenaryModule: CurveModule = {
  id: 'catenary',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    if (purpose === 'thumbnail') {
      const dynamicT = params.maxT;
      const ghostUpper = buildParametricCurve(
        (t) => evaluateTractrix(t, params.ropeLength),
        0,
        params.maxT,
      );
      const ghostLower = mirrorY(ghostUpper);
      const dynamicUpper = buildParametricCurve(
        (t) => evaluateTractrix(t, params.ropeLength),
        0,
        dynamicT,
      );
      const dynamicLower = mirrorY(dynamicUpper);
      const objectPoint = evaluateTractrix(dynamicT, params.ropeLength);
      const pullerPoint = { x: params.ropeLength * dynamicT, y: 0 };
      const ropeUpper = [objectPoint, pullerPoint];
      const ropeLower = [{ x: objectPoint.x, y: -objectPoint.y }, pullerPoint];

      const spec: ThumbnailSpec = {
        paths: [
          { points: worldPathToCurvePoints(ghostUpper), opacity: 0.35, excludeFromBbox: true },
          { points: worldPathToCurvePoints(ghostLower), opacity: 0.35, excludeFromBbox: true },
          { points: worldPathToCurvePoints(dynamicUpper) },
          { points: worldPathToCurvePoints(dynamicLower) },
          { points: worldPathToCurvePoints(ropeUpper) },
          { points: worldPathToCurvePoints(ropeLower) },
        ],
      };
      return spec;
    }
    return sampleCatenaryCurve(params.ropeLength, params.maxT, step);
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '曳物線',
      formula: 'x = L(t - tanh t), y = L sech t',
      stats: [
        { key: 'L', label: 'L', value: smooth.ropeLength.toFixed(2) },
        { key: 't', label: 't', value: smooth.maxT.toFixed(2) },
        {
          key: 'pull',
          label: 'pull',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: PARAM_LERP, revealSpeed: 0 },
};

export { PARAM_LERP } from './geometry';

function worldPathToCurvePoints(path: Array<{ x: number; y: number }>): CurvePoint[] {
  const points: CurvePoint[] = [];
  let arcLength = 0;
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < path.length; i++) {
    const pt = path[i]!;
    if (i > 0) arcLength += Math.hypot(pt.x - prevX, pt.y - prevY);
    points.push({ x: pt.x, y: pt.y, theta: i, arcLength });
    prevX = pt.x;
    prevY = pt.y;
  }
  return points;
}
