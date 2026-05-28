export type ComplexMode = 'operation' | 'euler' | 'demoivre';

export type OpKey = 'add' | 'sub' | 'mul' | 'div';

export type Complex = { re: number; im: number };

export type PlotRect = { x: number; y: number; w: number; h: number };

export type ComplexEulerParams = {
  mode: ComplexMode;
  opKey: OpKey;
  z1: Complex;
  z2: Complex;
  theta: number;
  n: number;
  deTheta: number;
};
