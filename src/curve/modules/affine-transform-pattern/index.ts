import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { PARAM_LERP, REVEAL_SPEED } from './animation';
import {
  buildAffineMatrix,
  buildBasePattern,
  buildRecursiveTransformSegments,
  buildTranslationVectors,
  sampleAffineTransformPatternCurve,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'rotationDeg', label: '旋轉角度 θ', min: 0, max: 90, step: 1, default: 45 },
  { key: 'translation', label: '平移距離 e', min: 20, max: 140, step: 1, default: 80 },
  {
    key: 'evolutionSpeed',
    label: '演變速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const affineTransformPatternModule: CurveModule = {
  id: 'affine-transform-pattern',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose, revealProgress }) => {
    if (purpose === 'thumbnail') {
      const base = buildBasePattern();
      const matrix = buildAffineMatrix(params.rotationDeg, 0);
      const translations = buildTranslationVectors(params.translation, 1);
      const segments = buildRecursiveTransformSegments(base, matrix, translations);
      const spec: ThumbnailSpec = {
        paths: segments.map((segment) => ({
          points: lineToCurvePoints(segment),
        })),
      };
      return spec;
    }
    return sampleAffineTransformPatternCurve(
      params.rotationDeg,
      params.translation,
      0,
      step,
      revealProgress ?? 1,
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '仿射變換圖樣',
      formula: "x' = ax + by + tx, y' = cx + dy + ty",
      stats: [
        { key: 'theta', label: 'θ', value: `${Math.round(smooth.rotationDeg)}°` },
        { key: 'e', label: 'e', value: Math.round(smooth.translation) },
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
