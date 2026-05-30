import { BASE_CANVAS_SIZE } from '../../constants';
import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { PARAM_LERP, REVEAL_SPEED } from './animation';
import {
  buildBaseSquare,
  buildRotationScaleMatrix,
  buildStackedSegments,
  sampleRotationScaleCompositionCurve,
  STACK_LAYERS,
} from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'rotationStepDeg',
    label: '旋轉步進 θ',
    min: 0,
    max: 45,
    step: 0.5,
    default: 12,
  },
  {
    key: 'scaleFactor',
    label: '縮放比例 s',
    min: 0.85,
    max: 0.99,
    step: 0.005,
    default: 0.94,
  },
  {
    key: 'evolutionSpeed',
    label: '演變速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const rotationScaleCompositionModule: CurveModule = {
  id: 'rotation-scale-composition',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    if (purpose === 'thumbnail') {
      const base = buildBaseSquare(BASE_CANVAS_SIZE);
      const matrix = buildRotationScaleMatrix(
        params.rotationStepDeg,
        params.scaleFactor,
        0,
      );
      const segments = buildStackedSegments(base, matrix, STACK_LAYERS);
      const spec: ThumbnailSpec = {
        paths: segments.map((segment) => ({
          points: lineToCurvePoints(segment),
        })),
      };
      return spec;
    }
    return sampleRotationScaleCompositionCurve(
      BASE_CANVAS_SIZE,
      params.rotationStepDeg,
      params.scaleFactor,
      0,
      step,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '旋轉縮放疊加',
      formula: 'M = s·R(θ), iterate xₙ₊₁ = Mxₙ',
      stats: [
        {
          key: 'theta',
          label: 'θ',
          value: `${smooth.rotationStepDeg.toFixed(1)}°`,
        },
        { key: 's', label: 's', value: smooth.scaleFactor.toFixed(3) },
        { key: 'omega', label: 'ω', value: params.evolutionSpeed.toFixed(3) },
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
  sampleStep: 1,
  animation: { lerp: PARAM_LERP, revealSpeed: REVEAL_SPEED },
};

export { PARAM_LERP, REVEAL_SPEED } from './animation';

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
