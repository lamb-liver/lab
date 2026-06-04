export type LimitsMode = 'compare' | 'riemann' | 'tangent';

export type FnKey = 'x2' | 'sin' | 'exp';

export type RiemannMethod = 'left' | 'right' | 'mid';

export type PlotRect = { x: number; y: number; w: number; h: number };

export type FunctionDef = {
  key: FnKey;
  label: string;
  formula: string;
  a: number;
  b: number;
  yMin: number;
  yMax: number;
  f: (x: number) => number;
  df: (x: number) => number;
  exact: number;
  exactLabel: string;
  comparisonT: number;
};

export type LimitsRiemannParams = {
  mode: LimitsMode;
  fnKey: FnKey;
  method: RiemannMethod;
  n: number;
  tangentT: number;
  localH: number;
  scale: number;
};
