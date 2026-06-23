export const PLOT_X_MIN = -5;
export const PLOT_X_MAX = 5;
export const PARAM_H_MIN = -3;
export const PARAM_H_MAX = 3;
export const PARAM_K_MIN = -3;
export const PARAM_K_MAX = 3;

export const BASIS_OPTIONS = [
  { id: 'linear', label: 'x', text: 'f(x)=x' },
  { id: 'square', label: 'x²', text: 'f(x)=x²' },
  { id: 'cubic', label: 'x³', text: 'f(x)=x³' },
  { id: 'abs', label: '|x|', text: 'f(x)=|x|' },
] as const;
