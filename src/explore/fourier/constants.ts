import type { CurveStyle } from '../../systems/rendering/types';

/** 完整 reveal 約 8–9 秒（60fps 下等效 ~0.002/frame） */
export const REVEAL_SPEED_PER_SEC = 0.12;

export const TAU = Math.PI * 2;

export const FOURIER_BASE_SIZE = 600;
export const FOURIER_1D_X_SPAN = 400;
export const FOURIER_1D_X_OFFSET = 100;

export const SAMPLE_STEP = 0.005;

export const FOURIER_CURVE_STYLE: CurveStyle = {
  ghost: { stroke: { r: 212, g: 184, b: 122, a: 18 }, weight: 1.6 },
  reveal: {
    layers: [
      { stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 7 },
      { stroke: { r: 212, g: 184, b: 122, a: 42 }, weight: 3.5 },
      { stroke: { r: 212, g: 184, b: 122, a: 230 }, weight: 1.5 },
    ],
  },
};
