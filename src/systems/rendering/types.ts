import type { CurvePoint, ParamValues } from '../../curve/types';

export type StrokeRGBA = { r: number; g: number; b: number; a: number };

export type CurveStyle = {
  ghost: { stroke: StrokeRGBA; weight: number };
  reveal: {
    layers: Array<{ stroke: StrokeRGBA; weight: number }>;
  };
};

export type RevealMode = 'byTheta' | 'byArcLength';

export type RenderConfig = {
  background: readonly [number, number, number];
  grid: 'polar' | 'cartesian' | 'harmonograph' | 'spirograph' | 'none';
  curveStyle: CurveStyle;
  revealMode: RevealMode;
};

export type RenderSnap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
  points: ReadonlyArray<CurvePoint>;
};
