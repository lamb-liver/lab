import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';
import { BAYES_TREE, BAYES_TREE_PANEL_AREA, leafLeftAnchor, rectToCurvePoints } from './layout';

export { BAYES_AREA, BAYES_BARS, BAYES_TREE, BAYES_TREE_PANEL_AREA, BAYES_VIEW } from './layout';

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

const GOLD_FILL = 'rgba(212, 184, 122, 0.28)';
const GOLD_STROKE = 'rgb(212, 184, 122)';
const BLUE_FILL = 'rgba(130, 170, 220, 0.24)';
const BLUE_STROKE = 'rgb(130, 170, 220)';
const GUIDE_STROKE = 'rgba(255, 255, 255, 0.35)';

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
  const scenario = scenarios[normalizeScenario(params.scenario)]!;
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

function segment(x1: number, y1: number, x2: number, y2: number, t: number): CurvePoint[] {
  return [
    { x: x1, y: y1, theta: t, arcLength: t },
    { x: x2, y: y2, theta: t + 0.1, arcLength: t + 0.1 },
    { x: Number.NaN, y: Number.NaN, theta: t + 0.2, arcLength: t + 0.2 },
  ];
}

/** 封面：左樹（高亮 A∩B 路徑）+ 右側面積 A∩B */
export function buildBayesThumbnail(): ThumbnailSpec {
  const data = deriveData({
    pA: 8,
    pBgA: 90,
    pBgNotA: 8,
    scenario: SCENARIO_MEDICAL,
  });
  const tree = BAYES_TREE;
  const area = BAYES_TREE_PANEL_AREA;
  const abEnd = leafLeftAnchor(tree.leafAB);
  const notAbEnd = leafLeftAnchor(tree.leafNotAB);

  const treePaths: ThumbnailSpec['paths'] = [
    {
      points: segment(tree.root.x, tree.root.y, tree.a.x, tree.a.y, 0),
      stroke: GUIDE_STROKE,
      strokeWidth: 0.85,
      opacity: 0.55,
    },
    {
      points: segment(tree.root.x, tree.root.y, tree.notA.x, tree.notA.y, 1),
      stroke: GUIDE_STROKE,
      strokeWidth: 0.85,
      opacity: 0.4,
    },
    {
      points: segment(tree.a.x, tree.a.y, abEnd.x, abEnd.y, 2),
      stroke: GOLD_STROKE,
      strokeWidth: 1.35,
      opacity: 0.95,
    },
    {
      points: segment(tree.notA.x, tree.notA.y, notAbEnd.x, notAbEnd.y, 3),
      stroke: BLUE_STROKE,
      strokeWidth: 1,
      opacity: 0.65,
    },
  ];

  const aW = area.w * data.pA;
  const abH = area.h * data.pBgA;
  const notAbH = area.h * data.pBgNotA;
  const areaPaths: ThumbnailSpec['paths'] = [
    {
      points: rectToCurvePoints(area.x, area.y, area.w, area.h, 10),
      closed: true,
      stroke: GUIDE_STROKE,
      strokeWidth: 0.7,
      fill: 'rgba(255, 255, 255, 0.04)',
      opacity: 1,
    },
    {
      points: rectToCurvePoints(area.x, area.y, aW, area.h, 11),
      closed: true,
      fill: GOLD_FILL,
      stroke: GOLD_STROKE,
      strokeWidth: 0.55,
      opacity: 0.9,
    },
    {
      points: rectToCurvePoints(area.x + aW, area.y, area.w - aW, area.h, 12),
      closed: true,
      fill: 'rgba(255, 255, 255, 0.05)',
      stroke: GUIDE_STROKE,
      strokeWidth: 0.5,
      opacity: 0.85,
    },
    {
      points: rectToCurvePoints(area.x, area.y + area.h - abH, aW, abH, 13),
      closed: true,
      fill: 'rgba(212, 184, 122, 0.55)',
      stroke: GOLD_STROKE,
      strokeWidth: 0.65,
      opacity: 1,
    },
    {
      points: rectToCurvePoints(area.x + aW, area.y + area.h - notAbH, area.w - aW, notAbH, 14),
      closed: true,
      fill: 'rgba(130, 170, 220, 0.42)',
      stroke: BLUE_STROKE,
      strokeWidth: 0.6,
      opacity: 1,
    },
  ];

  const nodeR = 5;
  const circles: NonNullable<ThumbnailSpec['circles']> = [
    { x: tree.root.x, y: tree.root.y, r: nodeR, fill: 'none', stroke: GUIDE_STROKE, strokeWidth: 0.8 },
    { x: tree.a.x, y: tree.a.y, r: nodeR, fill: 'none', stroke: GOLD_STROKE, strokeWidth: 0.9 },
    { x: tree.notA.x, y: tree.notA.y, r: nodeR, fill: 'none', stroke: GUIDE_STROKE, strokeWidth: 0.75 },
    {
      x: tree.leafAB.cx,
      y: tree.leafAB.cy,
      r: 7,
      fill: GOLD_FILL,
      stroke: GOLD_STROKE,
      strokeWidth: 0.7,
    },
    {
      x: tree.leafNotAB.cx,
      y: tree.leafNotAB.cy,
      r: 7,
      fill: BLUE_FILL,
      stroke: BLUE_STROKE,
      strokeWidth: 0.65,
      opacity: 0.85,
    },
  ];

  return {
    coordinateSystem: 'canvas',
    paths: [...treePaths, ...areaPaths],
    circles,
  };
}
