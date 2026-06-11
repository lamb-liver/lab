import type { RationalParamKey, RationalPreset } from './types';

export const RATIONAL_X_MIN = -4;
export const RATIONAL_X_MAX = 4;
export const RATIONAL_SAMPLE_N = 560;
export const RATIONAL_GAP_PX = 28;
export const RATIONAL_POLE_EPS_RATIO = 0.0035;
export const RATIONAL_COLLISION_TOL = 0.035;

export const RATIONAL_PRESETS: RationalPreset[] = [
  {
    id: 'factor',
    label: '因式',
    title: 'A(x-r)/(x-a)',
    note: '零點、垂直漸近線、水平漸近線同時可見',
    params: { A: 1.35, r: -1.2, a: 1.1, h: 0.5, b: 0, m: 1, c: 1 },
    sliders: ['A', 'r', 'a'],
    yMin: -6,
    yMax: 6,
  },
  {
    id: 'hole',
    label: '洞',
    title: '約分與可去不連續',
    note: '同根被約去後，圖形主體保留一個洞',
    params: { A: 1.1, r: -1.6, a: 1.3, h: 0.4, b: 0, m: 1, c: 1 },
    sliders: ['A', 'r', 'a', 'h'],
    yMin: -6,
    yMax: 6,
  },
  {
    id: 'reciprocal',
    label: '水平',
    title: 'b + A/(x-a)',
    note: '分子次數低於分母的餘式項，遠處趨近水平線',
    params: { A: 1.8, r: 0, a: -0.8, h: 0, b: 1.1, m: 0, c: 1 },
    sliders: ['A', 'a', 'b'],
    yMin: -6,
    yMax: 6,
  },
  {
    id: 'oblique',
    label: '斜漸近線',
    title: 'mx+b+c/(x-a)',
    note: '一次式商 S(x)=mx+b 是遠處骨架',
    params: { A: 1, r: 0, a: -1.15, h: 0, b: 0.45, m: 0.8, c: 1.25 },
    sliders: ['m', 'b', 'c', 'a'],
    yMin: -7,
    yMax: 7,
  },
];

export const RATIONAL_PARAM_META: Record<RationalParamKey, { label: string; min: number; max: number }> = {
  A: { label: '倍率 A', min: -3, max: 3 },
  r: { label: '零點 r', min: -3.2, max: 3.2 },
  a: { label: '漸近線 a', min: -3.2, max: 3.2 },
  h: { label: '洞 h', min: -3.2, max: 3.2 },
  b: { label: '平移 b', min: -3, max: 3 },
  m: { label: '斜率 m', min: -2.2, max: 2.2 },
  c: { label: '餘式 c', min: -3, max: 3 },
};
