export const PLOT_X_MIN = -5;
export const PLOT_X_MAX = 5;
export const SAMPLE_STEP = 0.025;
export const EPS = 1e-8;

export const QUADRATIC_COEFF = {
  a: 0.45,
  h: 1,
  k: -2,
} as const;

export const FUNCTIONS = [
  { id: 'linear', label: '線性', short: 'linear' },
  { id: 'quadraticRestricted', label: '二次限制', short: 'quad+' },
  { id: 'quadraticFull', label: '二次未限制', short: 'quad' },
  { id: 'exponential', label: '指數 / 對數', short: 'exp' },
] as const;

export type InverseFunctionMode = (typeof FUNCTIONS)[number]['id'];

export const MODE_CONFIG: Record<
  InverseFunctionMode,
  { inputMin: number; inputMax: number; inputDefault: number }
> = {
  linear: { inputMin: -4.2, inputMax: 4.2, inputDefault: 1.5 },
  quadraticRestricted: { inputMin: QUADRATIC_COEFF.h, inputMax: 4.35, inputDefault: 2.6 },
  quadraticFull: { inputMin: -3.4, inputMax: 4.35, inputDefault: -1.4 },
  exponential: { inputMin: -3, inputMax: 2, inputDefault: 1.25 },
};

export const EXP_BASE_MIN = 1.25;
export const EXP_BASE_MAX = 2.2;
