export type DiffEqMode = 'field' | 'euler';

export type EqKey = 'x' | 'minusY' | 'xPlusY';

export type PlotRect = { x: number; y: number; w: number; h: number };

export type Point2 = { x: number; y: number };

export type EquationDef = {
  key: EqKey;
  label: string;
  f: (x: number, y: number) => number;
  exact: (x: number, x0: number, y0: number) => number;
  note: string;
};

export type DiffEqParams = {
  mode: DiffEqMode;
  eqKey: EqKey;
  stepH: number;
  initialPoints: Point2[];
};
