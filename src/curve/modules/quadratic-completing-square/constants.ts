export const PLOT_X_MIN = -5;
export const PLOT_X_MAX = 5;

export const COEFF_A_MIN = -2.5;
export const COEFF_A_MAX = 2.5;
export const COEFF_B_MIN = -6;
export const COEFF_B_MAX = 6;
export const COEFF_C_MIN = -6;
export const COEFF_C_MAX = 6;
export const MIN_ABS_A = 0.12;

export const VERTEX_H_MIN = -4;
export const VERTEX_H_MAX = 4;
export const VERTEX_K_MIN = -8;
export const VERTEX_K_MAX = 8;

export const SAMPLE_STEP = 0.025;
export const EPS = 1e-8;

export const PRESETS = [
  { label: '兩實根', a: 1, b: -1, c: -2 },
  { label: '重根', a: 1, b: -2, c: 1 },
  { label: '無實根', a: 1, b: 0, c: 2 },
] as const;

export const ROOT_LABELS = ['x₁', 'x₂'] as const;
