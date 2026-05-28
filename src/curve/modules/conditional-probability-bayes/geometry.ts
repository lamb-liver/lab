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
  const points: CurvePoint[] = [
    { x: 260, y: 510, theta: 0, arcLength: 0 },
    { x: 560, y: 410, theta: 1, arcLength: 1 },
    { x: 900, y: 340, theta: 2, arcLength: 2 },
    { x: Number.NaN, y: Number.NaN, theta: 3, arcLength: 3 },
    { x: 260, y: 510, theta: 4, arcLength: 4 },
    { x: 560, y: 610, theta: 5, arcLength: 5 },
    { x: 900, y: 560, theta: 6, arcLength: 6 },
  ];
  return { paths: [{ points, opacity: 0.8, strokeWidth: 0.9 }] };
}
