/**
 * 線性規劃系列共用的平面幾何，純數學、不依賴 p5 或 React。
 *
 * 三件 works 與 explore 頁讀的是同一個物件：一組半平面約束與一個目標函數。
 * 「可行域是哪些點」「等值線往哪掃」「最優落在哪個頂點」都由這裡算出來，
 * 各頁只決定畫什麼、強調什麼。
 */

export type Vec2 = { x: number; y: number };

/** 一條線性約束 a·x + b·y ≤ c。(a, b) 是指向被切掉那側的法向 */
export type Constraint = { a: number; b: number; c: number; label: string };

/** 可行域的一個角點，以及在此處等號成立的兩條約束 */
export type Vertex = { point: Vec2; active: [number, number] };

export type FeasibleRegion = {
  vertices: Vertex[];
  /** 可行域是否為空集合 */
  empty: boolean;
  /** 可行域是否有界；無界時 vertices 只是它的角點，不足以描述整個區域 */
  bounded: boolean;
};

export type ObjectiveSense = 'max' | 'min';

/**
 * 判定「點是否滿足約束」用的容差。
 *
 * 頂點是兩條約束的交點，浮點誤差會讓它在第三條約束上落在 c 的兩側；
 * 用嚴格 ≤ 會隨機丟掉本來就在可行域上的角點。這個值要比座標尺度小得多，
 * 又要比交點的累積誤差大。場景座標約在 ±10，1e-7 兩邊都留得夠。
 */
export const FEASIBLE_EPS = 1e-7;

/** 兩條約束近乎平行時無交點；以法向的外積判定 */
const PARALLEL_EPS = 1e-9;

/**
 * 觀看方框的下界。非負限制讓可行域都落在第一象限，方框只留一格負向邊，
 * 讓 x 軸與 y 軸本身看得見。四個 LP 頁面共用這個約定——裁切線段、
 * 裁切可行域、擺標籤都要用同一個框，否則字會落到畫布外面。
 */
export const SCENE_MIN = -1;

export function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function constraint(a: number, b: number, c: number, label: string): Constraint {
  return { a, b, c, label };
}

/** 由法向角度（度）與離原點的位移造出約束，讓介面可以用一個角度滑桿轉動整條線 */
export function constraintFromAngle(
  angleDeg: number,
  offset: number,
  label: string,
): Constraint {
  const rad = (angleDeg * Math.PI) / 180;
  return { a: Math.cos(rad), b: Math.sin(rad), c: offset, label };
}

/** a·x + b·y，也就是把點代進約束左式 */
export function evaluate(con: Constraint, point: Vec2): number {
  return con.a * point.x + con.b * point.y;
}

export function satisfies(con: Constraint, point: Vec2, eps = FEASIBLE_EPS): boolean {
  return evaluate(con, point) <= con.c + eps;
}

export function satisfiesAll(
  constraints: Constraint[],
  point: Vec2,
  eps = FEASIBLE_EPS,
): boolean {
  return constraints.every((con) => satisfies(con, point, eps));
}

/** 兩條約束等號成立時的交點；平行則沒有 */
export function intersectLines(c1: Constraint, c2: Constraint): Vec2 | null {
  const det = c1.a * c2.b - c2.a * c1.b;
  if (Math.abs(det) < PARALLEL_EPS) return null;
  return {
    x: (c1.c * c2.b - c2.c * c1.b) / det,
    y: (c1.a * c2.c - c2.a * c1.c) / det,
  };
}

/** 目標函數 z = p·x + q·y */
export function objectiveValue(p: number, q: number, point: Vec2): number {
  return p * point.x + q * point.y;
}

/**
 * 遞迴方向錐 {d | a_i·d ≤ 0 對所有 i}。若它只有零向量，可行域有界。
 *
 * 二維的好處是候選方向是有限的：這個錐若非零，它的極射線必定貼著某條約束的邊界，
 * 也就是某個法向轉 90°（兩個方向都要試）。逐一檢查即可，不必取樣。
 */
function recessionDirection(constraints: Constraint[]): Vec2 | null {
  if (constraints.length < 2) return constraints.length === 0 ? vec2(1, 0) : vec2(-constraints[0].a, -constraints[0].b);

  for (const con of constraints) {
    for (const sign of [1, -1]) {
      const d = vec2(-con.b * sign, con.a * sign);
      const norm = Math.hypot(d.x, d.y);
      if (norm < PARALLEL_EPS) continue;
      const unit = vec2(d.x / norm, d.y / norm);
      const contained = constraints.every((other) => other.a * unit.x + other.b * unit.y <= FEASIBLE_EPS);
      if (contained) return unit;
    }
  }
  return null;
}

export function isBounded(constraints: Constraint[]): boolean {
  return recessionDirection(constraints) === null;
}

/** 以形心的方位角排序，得到可以直接連成多邊形的頂點順序 */
function sortAroundCentroid(vertices: Vertex[]): Vertex[] {
  if (vertices.length < 3) return vertices;
  const cx = vertices.reduce((sum, v) => sum + v.point.x, 0) / vertices.length;
  const cy = vertices.reduce((sum, v) => sum + v.point.y, 0) / vertices.length;
  return [...vertices].sort(
    (l, r) => Math.atan2(l.point.y - cy, l.point.x - cx) - Math.atan2(r.point.y - cy, r.point.x - cx),
  );
}

/**
 * 可行域的角點：任兩條約束的交點中，同時滿足其餘所有約束的那些。
 *
 * 退化（三線共點）時同一個座標會由不同的約束對算出來，去重後只留第一組；
 * 這對繪圖與頂點表都夠用，因為它們關心的是位置。
 */
export function feasibleVertices(constraints: Constraint[]): Vertex[] {
  const found: Vertex[] = [];

  for (let i = 0; i < constraints.length; i += 1) {
    for (let j = i + 1; j < constraints.length; j += 1) {
      const point = intersectLines(constraints[i], constraints[j]);
      if (!point) continue;
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
      if (!satisfiesAll(constraints, point)) continue;

      const duplicate = found.some(
        (v) => Math.hypot(v.point.x - point.x, v.point.y - point.y) < 1e-6,
      );
      if (duplicate) continue;
      found.push({ point, active: [i, j] });
    }
  }

  return sortAroundCentroid(found);
}

export function analyzeRegion(constraints: Constraint[]): FeasibleRegion {
  const vertices = feasibleVertices(constraints);
  const bounded = isBounded(constraints);

  /**
   * 無界時沒有角點也可能是非空的（例如只有一條約束），所以只在有界的情況下
   * 才能用「沒有角點」推出空集合。
   */
  const empty = bounded && vertices.length === 0;

  return { vertices, empty, bounded };
}

/** 依頂點順序算凸多邊形面積（鞋帶公式）；無界或空集合回傳 0 */
export function regionArea(region: FeasibleRegion): number {
  if (!region.bounded || region.vertices.length < 3) return 0;
  const pts = region.vertices.map((v) => v.point);
  let sum = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

/**
 * 冗餘約束：把它拿掉，可行域不變。
 *
 * 判準是「其餘約束圍出的區域裡，這條約束的左式取不到超過 c 的值」。
 * 若減掉它之後的區域往某個方向無界、而那個方向會讓左式變大，那就取得到，
 * 不是冗餘——這一步不能只看角點。
 */
export function isRedundant(constraints: Constraint[], index: number): boolean {
  const con = constraints[index];
  const rest = constraints.filter((_, i) => i !== index);
  if (rest.length === 0) return false;

  const escape = recessionDirection(rest);
  if (escape && con.a * escape.x + con.b * escape.y > FEASIBLE_EPS) return false;

  const restVertices = feasibleVertices(rest);
  if (restVertices.length === 0) return false;

  return restVertices.every((v) => evaluate(con, v.point) <= con.c + FEASIBLE_EPS);
}

export function redundantIndices(constraints: Constraint[]): number[] {
  return constraints
    .map((_, index) => index)
    .filter((index) => isRedundant(constraints, index));
}

export type OptimumReport = {
  /** 依 z 由優到劣排序後的頂點索引 */
  ranking: number[];
  /** 並列最優的頂點索引；長度為 2 代表整段邊都是最優 */
  optimal: number[];
  best: number | null;
  /** 目標在可行域上無界，最優值不存在 */
  unbounded: boolean;
};

/** 兩個 z 值視為並列的容差；比 FEASIBLE_EPS 寬，因為 z 是座標的線性組合 */
const TIE_EPS = 1e-6;

export function findOptimum(
  region: FeasibleRegion,
  constraints: Constraint[],
  p: number,
  q: number,
  sense: ObjectiveSense,
): OptimumReport {
  const empty: OptimumReport = { ranking: [], optimal: [], best: null, unbounded: false };
  if (region.empty || region.vertices.length === 0) return empty;

  /**
   * 無界區域上，只要有一個遞迴方向讓 z continue 變好，最優值就不存在。
   * 有界時 recessionDirection 回傳 null，這一段自然跳過。
   */
  if (!region.bounded) {
    const escape = recessionDirection(constraints);
    if (escape) {
      const gain = p * escape.x + q * escape.y;
      if ((sense === 'max' && gain > TIE_EPS) || (sense === 'min' && gain < -TIE_EPS)) {
        return { ...empty, unbounded: true };
      }
    }
  }

  const values = region.vertices.map((v) => objectiveValue(p, q, v.point));
  const ranking = values
    .map((_, index) => index)
    .sort((l, r) => (sense === 'max' ? values[r] - values[l] : values[l] - values[r]));

  const bestValue = values[ranking[0]];
  const optimal = ranking.filter((index) => Math.abs(values[index] - bestValue) <= TIE_EPS);

  return { ranking, optimal, best: bestValue, unbounded: false };
}

/** 半平面對凸多邊形的裁切（Sutherland–Hodgman 的單邊版本） */
function clipPolygonByConstraint(polygon: Vec2[], con: Constraint): Vec2[] {
  if (polygon.length === 0) return polygon;
  const out: Vec2[] = [];

  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    const dCurrent = evaluate(con, current) - con.c;
    const dNext = evaluate(con, next) - con.c;

    if (dCurrent <= FEASIBLE_EPS) out.push(current);
    // 一進一出就在邊界上補一個交點
    if ((dCurrent > FEASIBLE_EPS) !== (dNext > FEASIBLE_EPS)) {
      const t = dCurrent / (dCurrent - dNext);
      out.push(vec2(current.x + (next.x - current.x) * t, current.y + (next.y - current.y) * t));
    }
  }

  return out;
}

/**
 * 可行域落在觀看方框內的那一塊，回傳可以直接填色的多邊形。
 *
 * 為什麼不直接用 `feasibleVertices`：無界的可行域角點不足三個，連不成多邊形，
 * 但它在畫面上明明是一塊看得見的區域。先拿方框當多邊形、再逐條約束裁切，
 * 有界與無界就走同一條路徑；可行域為空時自然得到空陣列。
 */
export function visibleRegionPolygon(
  constraints: Constraint[],
  boxMin: number,
  boxMax: number,
): Vec2[] {
  let polygon: Vec2[] = [
    vec2(boxMin, boxMin),
    vec2(boxMax, boxMin),
    vec2(boxMax, boxMax),
    vec2(boxMin, boxMax),
  ];

  for (const con of constraints) {
    polygon = clipPolygonByConstraint(polygon, con);
    if (polygon.length === 0) return [];
  }

  return polygon;
}

export function formatPoint(point: Vec2, digits = 2): string {
  return `(${point.x.toFixed(digits)}, ${point.y.toFixed(digits)})`;
}

/**
 * 「z = 3.0x − 2.0y」；負號一律 U+2212。
 *
 * 不要用字串 replace 去補：p 為負時開頭的減號與 q 為負時中間的減號來源不同，
 * 只處理其中一個就會在同一行混用兩種減號。
 */
export function formatObjective(p: number, q: number, digits = 1): string {
  const lead = p < 0 ? '−' : '';
  const sign = q < 0 ? '−' : '+';
  return `z = ${lead}${Math.abs(p).toFixed(digits)}x ${sign} ${Math.abs(q).toFixed(digits)}y`;
}

/** 「1.50x + 2.00y ≤ 6.00」；負號用 U+2212，與站內其他讀數一致 */
export function formatConstraint(con: Constraint, digits = 2): string {
  const sign = con.b < 0 ? '−' : '+';
  const b = Math.abs(con.b).toFixed(digits);
  return `${con.a.toFixed(digits)}x ${sign} ${b}y ≤ ${con.c.toFixed(digits)}`.replace(/-/g, '−');
}

/**
 * 一條直線在觀看方框 [min, max]² 內的兩個端點，用來畫出約束線與等值線。
 * 線完全在框外時回傳 null。
 *
 * 方框不對稱（場景只留一格負向邊），所以要收 min 與 max 兩個界；
 * 端點也是標籤的落點，用錯範圍字就會跑到畫布外面。
 */
export function clipLineToBox(
  a: number,
  b: number,
  c: number,
  min: number,
  max: number,
): [Vec2, Vec2] | null {
  const hits: Vec2[] = [];
  const push = (point: Vec2) => {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
    const inside =
      point.x >= min - 1e-6 &&
      point.x <= max + 1e-6 &&
      point.y >= min - 1e-6 &&
      point.y <= max + 1e-6;
    if (!inside) return;
    if (hits.some((h) => Math.hypot(h.x - point.x, h.y - point.y) < 1e-9)) return;
    hits.push(point);
  };

  if (Math.abs(b) > PARALLEL_EPS) {
    push(vec2(min, (c - a * min) / b));
    push(vec2(max, (c - a * max) / b));
  }
  if (Math.abs(a) > PARALLEL_EPS) {
    push(vec2((c - b * min) / a, min));
    push(vec2((c - b * max) / a, max));
  }

  if (hits.length < 2) return null;
  return [hits[0], hits[1]];
}
