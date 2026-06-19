import { BASE_CANVAS_SIZE } from '../../constants';
import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { PARAM_LERP, REVEAL_SPEED } from './animation';
import {
  buildGridLines,
  calculateMatrix,
  calculateTransformBounds,
  GRID_SEGMENT_COUNT,
  sampleLinearTransformGridCurve,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'shearX', label: 'X 剪切 b', min: -1.5, max: 1.5, step: 0.1, default: 0.5 },
  { key: 'scaleY', label: 'Y 伸縮 d', min: 0.2, max: 1.8, step: 0.1, default: 1 },
  {
    key: 'transformSpeed',
    label: '變換速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const linearTransformGridModule: CurveModule = {
  id: 'linear-transform-grid',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose, revealProgress }) => {
    if (purpose === 'thumbnail') {
      const matrix = calculateMatrix(
        params.shearX,
        params.scaleY,
        getLinearTransformGridThumbnailTime(),
      );
      const { scaleFactor } = calculateTransformBounds(
        BASE_CANVAS_SIZE,
        BASE_CANVAS_SIZE,
        matrix,
      );
      const lines = buildGridLines(BASE_CANVAS_SIZE, matrix, 1);
      const spec: ThumbnailSpec = {
        paths: lines.map((line) => ({
          points: lineSegmentToCurvePoints(line, scaleFactor),
        })),
      };
      return spec;
    }
    return sampleLinearTransformGridCurve(
      params.shearX,
      params.scaleY,
      BASE_CANVAS_SIZE,
      0,
      step,
      revealProgress ?? 1,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '線性變換網格',
      formula: "x' = ax + by, y' = cx + dy",
      stats: [
        { key: 'b', label: 'b', value: smooth.shearX.toFixed(1) },
        { key: 'd', label: 'd', value: smooth.scaleY.toFixed(1) },
        { key: 'omega', label: 'ω', value: params.transformSpeed.toFixed(3) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 8,
  animation: { lerp: PARAM_LERP, revealSpeed: REVEAL_SPEED },
};

export { PARAM_LERP, REVEAL_SPEED } from './animation';
export { GRID_SEGMENT_COUNT } from './geometry';

export function getLinearTransformGridThumbnailTime(): number {
  return Math.PI / 2;
}

function lineSegmentToCurvePoints(
  line: { x1: number; y1: number; x2: number; y2: number },
  scaleFactor: number,
): CurvePoint[] {
  return [
    { x: line.x1 * scaleFactor, y: line.y1 * scaleFactor, theta: 0, arcLength: 0 },
    {
      x: line.x2 * scaleFactor,
      y: line.y2 * scaleFactor,
      theta: 1,
      arcLength: Math.hypot((line.x2 - line.x1) * scaleFactor, (line.y2 - line.y1) * scaleFactor),
    },
  ];
}
