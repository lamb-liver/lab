export type Vec2 = { x: number; y: number };

export type TrigMode = 'circle' | 'triangle' | 'identity';

export type TriangleVerts = {
  A: Vec2;
  B: Vec2;
  C: Vec2;
};

export type TrigExploreParams = {
  mode: TrigMode;
  advanced: boolean;
  theta: number;
  alpha: number;
  beta: number;
  triangle: TriangleVerts;
};

export type TrigSmoothState = {
  theta: number;
  alpha: number;
  beta: number;
  advancedMix: number;
};

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CircleGeometry = {
  cx: number;
  cy: number;
  r: number;
};

export type TriangleTransform = {
  cx: number;
  cy: number;
  s: number;
};

export type TriangleMetrics = {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  R: number;
};

export type Circumcircle = {
  o: Vec2;
  r: number;
};

export type TrigExploreSnap = {
  params: TrigExploreParams;
  smooth: TrigSmoothState;
};

export type VisualDragKind =
  | { type: 'theta' }
  | { type: 'triangle'; key: 'A' | 'B' | 'C' }
  | { type: 'alpha' }
  | { type: 'beta' };
