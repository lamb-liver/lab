import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const BAYES_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_TREE = 0;
export const MODE_AREA = 1;
export const MODE_BAYES = 2;

export const SCENARIO_MEDICAL = 0;
export const SCENARIO_CARD = 1;
export const SCENARIO_SPAM = 2;

export type BayesMode = 'tree' | 'area' | 'bayes';

export type ScenarioConfig = {
  pA: number;
  pBgA: number;
  pBgNotA: number;
  A: string;
  B: string;
};

export const scenarios: Record<number, ScenarioConfig> = {
  [SCENARIO_MEDICAL]: { pA: 0.01, pBgA: 0.95, pBgNotA: 0.05, A: 'Disease', B: 'Positive' },
  [SCENARIO_CARD]: { pA: 0.25, pBgA: 1.0, pBgNotA: 1 / 3, A: 'Heart', B: 'Red' },
  [SCENARIO_SPAM]: { pA: 0.18, pBgA: 0.88, pBgNotA: 0.12, A: 'Spam', B: 'Flagged' },
};

export function modeFromValue(value: number | undefined): BayesMode {
  const mode = Math.round(value ?? MODE_TREE);
  if (mode === MODE_AREA) return 'area';
  if (mode === MODE_BAYES) return 'bayes';
  return 'tree';
}

export function normalizeScenario(value: number | undefined): number {
  const rounded = Math.round(value ?? SCENARIO_MEDICAL);
  if (rounded in scenarios) return rounded;
  return SCENARIO_MEDICAL;
}

export function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function deriveData(params: ParamValues) {
  const pA = (params.pA ?? 1) / 100;
  const pBgA = (params.pBgA ?? 95) / 100;
  const pBgNotA = (params.pBgNotA ?? 5) / 100;
  const scenario = scenarios[normalizeScenario(params.scenario)];
  const pNotA = 1 - pA;
  const jointAB = pA * pBgA;
  const jointNotAB = pNotA * pBgNotA;
  const pB = jointAB + jointNotAB;
  const posterior = pB > 0 ? jointAB / pB : 0;
  return {
    pA,
    pNotA,
    pBgA,
    pBgNotA,
    jointAB,
    jointNotAB,
    pB,
    posterior,
    A: scenario.A,
    B: scenario.B,
  };
}

export function buildBayesThumbnail(): ThumbnailSpec {
  const tree: CurvePoint[] = [
    { x: 180, y: 470, theta: 0, arcLength: 0 },
    { x: 380, y: 360, theta: 1, arcLength: 1 },
    { x: 620, y: 320, theta: 2, arcLength: 2 },
    { x: Number.NaN, y: Number.NaN, theta: 3, arcLength: 3 },
    { x: 180, y: 470, theta: 4, arcLength: 4 },
    { x: 380, y: 590, theta: 5, arcLength: 5 },
    { x: 620, y: 545, theta: 6, arcLength: 6 },
  ];
  const area: CurvePoint[] = [
    { x: 640, y: 310, theta: 7, arcLength: 7 },
    { x: 810, y: 310, theta: 8, arcLength: 8 },
    { x: 810, y: 610, theta: 9, arcLength: 9 },
    { x: 640, y: 610, theta: 10, arcLength: 10 },
    { x: 640, y: 310, theta: 11, arcLength: 11 },
    { x: Number.NaN, y: Number.NaN, theta: 12, arcLength: 12 },
    { x: 640, y: 390, theta: 13, arcLength: 13 },
    { x: 810, y: 390, theta: 14, arcLength: 14 },
    { x: 810, y: 470, theta: 15, arcLength: 15 },
    { x: 640, y: 470, theta: 16, arcLength: 16 },
    { x: 640, y: 390, theta: 17, arcLength: 17 },
  ];
  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: tree, opacity: 0.9, strokeWidth: 1.05 },
      { points: area, opacity: 0.62, strokeWidth: 0.9 },
    ],
  };
}
