import {
  SCENE_MIN,
  analyzeRegion,
  constraint,
  constraintFromAngle,
  findOptimum,
  objectiveValue,
  redundantIndices,
  visibleRegionPolygon,
  type Constraint,
  type ObjectiveSense,
  type Vec2,
} from '../../curve/linearProgramming';

/**
 * 三種讀法作用在同一個線性規劃問題上：同一組約束、同一個目標函數。
 * 切換讀法只改變畫面強調什麼，不換題目——三者最後都指向同一個最優頂點，
 * 這一頁要證明的就是這件事。
 */
export type ReadingMode = 'constraints' | 'objective' | 'candidates';

export type LinearProgrammingParams = {
  /** 兩條可調約束的位移；方向固定，讓可行域始終是個看得懂的多邊形 */
  offsetA: number;
  offsetB: number;
  /** 目標方向的角度（度） */
  angle: number;
  sense: ObjectiveSense;
  mode: ReadingMode;
};

export const AXIS_HALF = 10;

export const DEFAULT_LINEAR_PROGRAMMING_PARAMS: LinearProgrammingParams = {
  offsetA: 4.47,
  offsetB: 4.74,
  angle: 34,
  sense: 'max',
  mode: 'constraints',
};

const ANGLE_A = 26.57;
const ANGLE_B = 71.57;

export type LinearProgrammingMetrics = {
  constraints: Constraint[];
  polygon: Vec2[];
  vertices: Vec2[];
  /** 每個角點的目標值，索引與 vertices 對齊 */
  values: number[];
  redundant: number[];
  optimal: number[];
  best: number | null;
  /** 依 z 由優到劣的角點索引 */
  ranking: number[];
  bounded: boolean;
  empty: boolean;
  unbounded: boolean;
  objective: { p: number; q: number };
};

export function constraintsOf(params: LinearProgrammingParams): Constraint[] {
  return [
    constraint(-1, 0, 0, 'x ≥ 0'),
    constraint(0, -1, 0, 'y ≥ 0'),
    constraintFromAngle(ANGLE_A, params.offsetA, '約束 A'),
    constraintFromAngle(ANGLE_B, params.offsetB, '約束 B'),
  ];
}

export function objectiveOf(params: LinearProgrammingParams): { p: number; q: number } {
  const rad = (params.angle * Math.PI) / 180;
  return { p: Math.cos(rad), q: Math.sin(rad) };
}

export function computeLinearProgrammingMetrics(
  params: LinearProgrammingParams,
): LinearProgrammingMetrics {
  const constraints = constraintsOf(params);
  const region = analyzeRegion(constraints);
  const objective = objectiveOf(params);
  const report = findOptimum(region, constraints, objective.p, objective.q, params.sense);

  const vertices = region.vertices.map((vertex) => vertex.point);

  return {
    constraints,
    polygon: visibleRegionPolygon(constraints, SCENE_MIN, AXIS_HALF),
    vertices,
    values: vertices.map((point) => objectiveValue(objective.p, objective.q, point)),
    redundant: region.empty ? [] : redundantIndices(constraints),
    optimal: report.optimal,
    best: report.best,
    ranking: report.ranking,
    bounded: region.bounded,
    empty: region.empty,
    unbounded: report.unbounded,
    objective,
  };
}

export function modeTitle(mode: ReadingMode): string {
  if (mode === 'constraints') return '哪些點可用';
  if (mode === 'objective') return '往哪個方向變好';
  return '最優落在哪裡';
}

/**
 * 三種讀法對「最優在哪」的說法。
 *
 * 措辭刻意不同、指向的位置刻意相同——這一頁要讓讀者看到的是
 * 三個描述講的是同一個點，而不是三種方法。
 */
export function modeVerdict(metrics: LinearProgrammingMetrics, mode: ReadingMode): string {
  if (metrics.empty) return '可行域為空，沒有解';
  if (metrics.unbounded) return '目標沿無界方向持續變好，最優值不存在';
  if (metrics.optimal.length === 0) return '沒有角點可比';

  const winners = metrics.optimal.map((index) => metrics.vertices[index]);
  const where = winners
    .map((point) => `(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`)
    .join('、');

  if (mode === 'constraints') return `可行域的角點中，${where} 是被選中的那個`;
  if (mode === 'objective') return `等值線掃到 ${where} 時離開可行域`;
  return winners.length > 1 ? `候選表中 ${where} 並列第一` : `候選表中 ${where} 排第一`;
}
