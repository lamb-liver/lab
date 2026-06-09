export const PLOT_X_MIN = -5;
export const PLOT_X_MAX = 5;
export const ROOT_MIN = -4.5;
export const ROOT_MAX = 4.5;
export const LEAD_A_MIN = -2.5;
export const LEAD_A_MAX = 2.5;
export const MIN_ABS_A = 0.12;

export const SAMPLE_STEP = 0.025;
export const ROOT_MERGE_EPS = 0.001;
export const MIN_INTERVAL_WIDTH = 0.001;
export const EPS = 1e-8;
export const PRESET_EPS = 0.025;
export const LABEL_CLOSE_PX = 38;

export const ROOT_COUNT = 3;

export const PRESETS = [
  { label: '三穿越', a: 0.35, roots: [-2.4, 0.1, 2.2] as const, mult: [1, 1, 1] as const },
  { label: '一重根', a: 0.35, roots: [-2.4, 0.1, 2.2] as const, mult: [1, 2, 1] as const },
  { label: '雙碰觸', a: 0.35, roots: [-2.4, 0.1, 2.2] as const, mult: [2, 1, 2] as const },
] as const;

export const ROOT_LABELS = ['r₁', 'r₂', 'r₃'] as const;
export const MULT_LABELS = ['m₁', 'm₂', 'm₃'] as const;
