import type { BasisKind, FunctionEquationsMode, FunctionEquationsParams } from './types';

export const GOLD = [212, 184, 122] as const;
export const TEXT = [232, 232, 232] as const;
export const MUTED = [136, 136, 136] as const;

export const X_MIN = -5;
export const X_MAX = 5;

export const VIEW_LERP_PER_SEC = 8;
export const MAX_VISUAL_DELTA_MS = 50;

export const MODE_OPTIONS: Array<{
  id: FunctionEquationsMode;
  label: string;
  caption: string;
}> = [
  {
    id: 'transform',
    label: '圖形變換',
    caption: '從曲線形狀讀 f(x)=0 與 f(x)>0',
  },
  {
    id: 'quadratic',
    label: '二次方程',
    caption: '判別式、頂點與 x 軸交點同步變化',
  },
  {
    id: 'polynomial',
    label: '多項式不等式',
    caption: '重數決定穿過或碰觸，數線讀出符號區間',
  },
];

export const BASIS_OPTIONS: Array<{ id: BasisKind; label: string; text: string }> = [
  { id: 'linear', label: 'x', text: 'f(x)=x' },
  { id: 'square', label: 'x²', text: 'f(x)=x²' },
  { id: 'cubic', label: 'x³', text: 'f(x)=x³' },
  { id: 'abs', label: '|x|', text: 'f(x)=|x|' },
];

export const DEFAULT_PARAMS: FunctionEquationsParams = {
  mode: 'transform',
  advanced: false,
  transform: { basis: 'square', a: 1, b: 1, h: 0, k: 0 },
  quadratic: { a: 1, b: -1, c: -2 },
  polynomial: { roots: [-2.2, 0.2, 2.1], mult: [1, 2, 1] },
};
