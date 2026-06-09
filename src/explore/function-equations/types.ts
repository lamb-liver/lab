export type FunctionEquationsMode = 'transform' | 'quadratic' | 'polynomial';

export type BasisKind = 'linear' | 'square' | 'cubic' | 'abs';

export type Multiplicity = 1 | 2;

export type TransformParams = {
  basis: BasisKind;
  a: number;
  b: number;
  h: number;
  k: number;
};

export type QuadraticParams = {
  a: number;
  b: number;
  c: number;
};

export type PolynomialParams = {
  roots: [number, number, number];
  mult: [Multiplicity, Multiplicity, Multiplicity];
};

export type FunctionEquationsParams = {
  mode: FunctionEquationsMode;
  advanced: boolean;
  transform: TransformParams;
  quadratic: QuadraticParams;
  polynomial: PolynomialParams;
};

export type FunctionEquationsSmooth = {
  viewHalfY: number;
};

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SceneLayout = {
  plot: PlotRect;
  numberLine: { x: number; y: number; w: number };
};

export type CurvePoint = {
  x: number;
  y: number;
};
