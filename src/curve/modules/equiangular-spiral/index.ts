import { defaultsFromSchema } from '../../defaults';
import type {
  CurveModule,
  CurvePoint,
  ParamSchema,
  ParamValues,
  ThumbnailSpec,
} from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import {
  INITIAL_RADIUS_A,
  REVEAL_RATIO,
  buildParametricCurve,
  computeRevealTheta,
  evaluateEquiangularSpiral,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'growthB', label: '成長係數 b', min: 0.04, max: 0.3, step: 0.01, default: 0.14 },
  {
    key: 'rotationSpeed',
    label: '旋轉速度',
    min: 0.002,
    max: 0.05,
    step: 0.002,
    default: 0.015,
  },
  { key: 'maxTheta', label: '最大角度 θ', min: 6, max: 32, step: 0.5, default: 18 },
];

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

export const equiangularSpiralModule: CurveModule = {
  id: 'equiangular-spiral',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      const ghost = buildParametricCurve(
        (theta) => evaluateEquiangularSpiral(theta, INITIAL_RADIUS_A, params.growthB),
        0,
        params.maxTheta,
      );
      const revealTheta = Math.min(
        params.maxTheta * REVEAL_RATIO,
        params.maxTheta,
      );
      const active = buildParametricCurve(
        (theta) => evaluateEquiangularSpiral(theta, INITIAL_RADIUS_A, params.growthB),
        0,
        revealTheta,
      );
      const head = evaluateEquiangularSpiral(
        revealTheta,
        INITIAL_RADIUS_A,
        params.growthB,
      );

      const spec: ThumbnailSpec = {
        paths: [
          {
            points: worldPathToCurvePoints(ghost),
            opacity: 0.35,
            excludeFromBbox: true,
          },
          { points: worldPathToCurvePoints(active) },
          {
            points: worldPathToCurvePoints([head]),
            strokeWidth: 0.6,
          },
        ],
      };
      return spec;
    }

    const active = buildParametricCurve(
      (theta) => evaluateEquiangularSpiral(theta, INITIAL_RADIUS_A, params.growthB),
      0,
      params.maxTheta,
    );
    return worldPathToCurvePoints(active);
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    const revealTheta =
      runtime?.revealTheta ??
      computeRevealTheta(smooth.maxTheta, 0, REVEAL_RATIO);
    return {
      title: '等角螺線',
      formula: 'r = a·e^(bθ)',
      stats: [
        { key: 'a', label: 'a', value: INITIAL_RADIUS_A.toFixed(1) },
        { key: 'b', label: 'b', value: smooth.growthB.toFixed(2) },
        { key: 'theta', label: 'θ max', value: smooth.maxTheta.toFixed(1) },
        {
          key: 'reveal',
          label: 'reveal θ',
          value: revealTheta.toFixed(2),
        },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: 0.08, revealSpeed: 0 },
};

export { PARAM_LERP } from './geometry';
