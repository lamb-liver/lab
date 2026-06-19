import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema } from '../../types';
import {
  PHI,
  buildFibonacci,
  buildFibonacciThumbnail,
  fibonacciRatio,
} from './geometry';

export const FIBONACCI_REVEAL_SPEED = 0.045;

const paramSchema: ParamSchema = [
  { key: 'n', label: '項數 n', min: 2, max: 14, step: 1, default: 10 },
];

export const fibonacciSpiralModule: CurveModule = {
  id: 'fibonacci-spiral',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params) => buildFibonacciThumbnail(params.n ?? 10),
  getMetadata: (params, runtime): CurveMetadata => {
    const n = Math.round(params.n ?? 10);
    const fib = buildFibonacci(n);
    const ratio = fibonacciRatio(fib);
    return {
      title: '費波那契螺線',
      formula: 'Fₙ = Fₙ₋₁ + Fₙ₋₂',
      stats: [
        { key: 'n', label: 'n', value: n },
        { key: 'ratio', label: 'Fₙ / Fₙ₋₁', value: ratio.toFixed(6) },
        { key: 'phi', label: 'φ', value: PHI.toFixed(6) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: FIBONACCI_REVEAL_SPEED, revealSpeed: FIBONACCI_REVEAL_SPEED },
};

export { PHI, buildFibonacci, buildSpiralGeometry } from './geometry';
