export type ConicMode = 'eccentricity' | 'focus';

export type FocusCurveType = 'ellipse' | 'parabola' | 'hyperbola';

export type PathPoint = { x: number; y: number; t: number };

export type ConicPath = {
  type: string;
  closed: boolean;
  points: PathPoint[];
};

export type FocusScene = {
  type: FocusCurveType;
  title: string;
  formula: string;
  constantText: string;
  foci?: [{ x: number; y: number }, { x: number; y: number }];
  focus?: { x: number; y: number };
  directrixX?: number;
  paths: ConicPath[];
};
