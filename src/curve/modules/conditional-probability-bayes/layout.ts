import type { CurvePoint } from '../../types';

/** 互動與封面共用的邏輯座標（緊湊 bbox，減少黑邊） */
export const BAYES_VIEW = {
  width: 760,
  height: 440,
};

export type BayesLeafLayout = {
  cx: number;
  cy: number;
  w: number;
  h: number;
};

type BayesTreeLayout = {
  root: { x: number; y: number };
  a: { x: number; y: number };
  notA: { x: number; y: number };
  leafAB: BayesLeafLayout;
  leafNotAB: BayesLeafLayout;
};

type BayesAreaLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type BayesBarsLayout = {
  x: number;
  y: number;
  w: number;
  rowH: number;
  gap: number;
};

export const BAYES_TREE: BayesTreeLayout = {
  root: { x: 56, y: 220 },
  a: { x: 196, y: 132 },
  notA: { x: 196, y: 308 },
  leafAB: { cx: 368, cy: 118, w: 108, h: 34 },
  leafNotAB: { cx: 368, cy: 322, w: 108, h: 34 },
};

export const BAYES_AREA: BayesAreaLayout = {
  x: 88,
  y: 72,
  w: 584,
  h: 296,
};

export const BAYES_BARS: BayesBarsLayout = {
  x: 72,
  y: 88,
  w: 616,
  rowH: 40,
  gap: 52,
};

/** 樹模式：左樹右面積（封面與樹模式內頁） */
export const BAYES_TREE_PANEL_AREA: BayesAreaLayout = {
  x: 468,
  y: 72,
  w: 248,
  h: 296,
};

export function leafLeftAnchor(leaf: BayesLeafLayout): { x: number; y: number } {
  return { x: leaf.cx - leaf.w / 2, y: leaf.cy };
}

export function rectToCurvePoints(
  x: number,
  y: number,
  w: number,
  h: number,
  thetaBase = 0,
): CurvePoint[] {
  return [
    { x, y, theta: thetaBase, arcLength: 0 },
    { x: x + w, y, theta: thetaBase + 0.1, arcLength: 0.1 },
    { x: x + w, y: y + h, theta: thetaBase + 0.2, arcLength: 0.2 },
    { x, y: y + h, theta: thetaBase + 0.3, arcLength: 0.3 },
  ];
}
