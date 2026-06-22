import type { TriangleVerts, TrigExploreParams, TrigMode } from './types';

export const TAU = Math.PI * 2;

const TRIG_MODE_CIRCLE = 'circle' as const;
const TRIG_MODE_TRIANGLE = 'triangle' as const;
const TRIG_MODE_IDENTITY = 'identity' as const;

export const MODE_OPTIONS: Array<{ id: TrigMode; label: string; caption: string }> = [
  { id: TRIG_MODE_CIRCLE, label: '從圓到定義', caption: '單位圓：座標先給出 sin、cos，tan 由比值讀出。' },
  { id: TRIG_MODE_TRIANGLE, label: '從角到三角形', caption: '三角形：邊長、角度與外接圓半徑互相轉換。' },
  { id: TRIG_MODE_IDENTITY, label: '從旋轉到公式', caption: '角度合成：旋轉先後作用，對應加法定理。' },
];

export const DEFAULT_TRIANGLE: TriangleVerts = {
  A: { x: -1.22, y: -0.76 },
  B: { x: 1.18, y: -0.76 },
  C: { x: -0.22, y: 1.05 },
};

export const DEFAULT_PARAMS: TrigExploreParams = {
  mode: TRIG_MODE_CIRCLE,
  advanced: false,
  theta: Math.PI / 4,
  alpha: Math.PI / 5,
  beta: Math.PI / 4,
  triangle: { ...DEFAULT_TRIANGLE },
};

export const SMOOTH_RATE_PER_SEC = 14;
export const MAX_VISUAL_DELTA_MS = 50;
