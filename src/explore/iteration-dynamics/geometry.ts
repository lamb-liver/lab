/**
 * 疊代動力學：邏輯斯蒂映射的純數學。無 p5／React 依賴，全部可測。
 * 邏輯斯蒂映射 f(x) = r·x·(1−x)，x∈[0,1]，r∈[0,4]。
 */
import {
  BIF_COLUMNS,
  BIF_SAMPLES,
  BIF_TRANSIENT,
  CHAOS_SEED,
  CHAOS_STEPS,
  CHAOS_VERTICES,
  CHAOS_WARMUP,
  CLASSIFY_EPS,
  CLASSIFY_MAX_PERIOD,
  CLASSIFY_TAIL,
  CLASSIFY_TRANSIENT,
  R_MAX,
  R_MIN,
  X0_DEFAULT,
} from './constants';
import { logistic } from '../../curve/modules/logistic-bifurcation/geometry';
import { mulberry32 } from '../../curve/prng';

export type Point = readonly [number, number];

export type BehaviorKind = 'fixed' | 'periodic' | 'unresolved';

export interface Behavior {
  kind: BehaviorKind;
  /** periodic 時的週期（fixed 視為 period 1，未辨識為 0） */
  period: number;
  label: string;
}

/** 單步邏輯斯蒂映射 */
export const logisticMap = logistic;

/** 軌道序列 [x0, x1, …, x_steps]（長度 steps+1） */
export function orbit(r: number, x0: number, steps: number): number[] {
  const xs: number[] = [x0];
  let x = x0;
  for (let i = 0; i < steps; i += 1) {
    x = logisticMap(r, x);
    xs.push(x);
  }
  return xs;
}

/**
 * 蛛網階梯的頂點序列（[0,1]² 座標）：
 * (x0,0) → (x0,f(x0)) → (f(x0),f(x0)) → (f(x0),f(f(x0))) → …
 * 每一步貢獻一段垂直（到曲線）＋一段水平（到對角線）。長度 = 2·steps + 1。
 */
export function cobwebPath(r: number, x0: number, steps: number): Point[] {
  const pts: Point[] = [[x0, 0]];
  let x = x0;
  for (let i = 0; i < steps; i += 1) {
    const y = logisticMap(r, x);
    pts.push([x, y]); // 垂直到曲線
    pts.push([y, y]); // 水平到對角線
    x = y;
  }
  return pts;
}

/** 邏輯斯蒂拋物線取樣點（x 從 0 到 1） */
export function logisticCurvePoints(r: number, samples: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const x = i / samples;
    pts.push([x, logisticMap(r, x)]);
  }
  return pts;
}

/**
 * 混沌遊戲：從隨機點出發，反覆「朝隨機選中的頂點移動 ratio 比例」。
 * ratio=0.5 + 三頂點 → 謝爾賓斯基三角形。純函式、種子可重現。
 */
export function chaosGamePoints(
  ratio: number,
  options: {
    vertices?: readonly (readonly [number, number])[];
    steps?: number;
    warmup?: number;
    seed?: number;
  } = {},
): Point[] {
  const vertices = options.vertices ?? CHAOS_VERTICES;
  const steps = options.steps ?? CHAOS_STEPS;
  const warmup = options.warmup ?? CHAOS_WARMUP;
  const seed = options.seed ?? CHAOS_SEED;
  const rng = mulberry32(seed);

  let x = rng();
  let y = rng();
  const step = (): void => {
    const v = vertices[Math.floor(rng() * vertices.length)]!;
    x += (v[0] - x) * ratio;
    y += (v[1] - y) * ratio;
  };

  for (let i = 0; i < warmup; i += 1) step();
  const pts: Point[] = [];
  for (let i = 0; i < steps; i += 1) {
    step();
    pts.push([x, y]);
  }
  return pts;
}

export interface BifurcationColumn {
  r: number;
  /** 丟棄暫態後收集的吸引子取樣值 */
  xs: number[];
}

/**
 * 分岔圖資料：在 [rMin, rMax] 掃描 r，每個 r 丟棄暫態後收集吸引子取樣。
 * 純資料（不含繪圖），由呼叫端 memoize 一次。
 */
export function bifurcationData(
  options: {
    rMin?: number;
    rMax?: number;
    columns?: number;
    transient?: number;
    samples?: number;
    x0?: number;
  } = {},
): BifurcationColumn[] {
  const rMin = options.rMin ?? R_MIN;
  const rMax = options.rMax ?? R_MAX;
  const columns = options.columns ?? BIF_COLUMNS;
  const transient = options.transient ?? BIF_TRANSIENT;
  const samples = options.samples ?? BIF_SAMPLES;
  const x0 = options.x0 ?? X0_DEFAULT;

  const out: BifurcationColumn[] = [];
  for (let c = 0; c <= columns; c += 1) {
    const r = rMin + (rMax - rMin) * (columns === 0 ? 0 : c / columns);
    let x = x0;
    for (let i = 0; i < transient; i += 1) x = logisticMap(r, x);
    const xs: number[] = [];
    for (let i = 0; i < samples; i += 1) {
      x = logisticMap(r, x);
      xs.push(x);
    }
    out.push({ r, xs });
  }
  return out;
}

/** 尾段去重後的相異值數（判斷週期／混沌用；測試輔助） */
export function distinctCount(xs: number[], eps = CLASSIFY_EPS): number {
  const sorted = [...xs].sort((a, b) => a - b);
  let count = 0;
  let prev = Number.NaN;
  for (const x of sorted) {
    if (Number.isNaN(prev) || x - prev > eps) {
      count += 1;
      prev = x;
    }
  }
  return count;
}

/**
 * 分類長期行為：丟棄暫態後，在尾段偵測最小週期。
 * 有限取樣不能證明混沌，偵測不到時只回報「未偵測到短週期」。
 */
export function classifyBehavior(
  r: number,
  x0 = X0_DEFAULT,
  options: { transient?: number; tail?: number; maxPeriod?: number; eps?: number } = {},
): Behavior {
  const transient = options.transient ?? CLASSIFY_TRANSIENT;
  const tail = options.tail ?? CLASSIFY_TAIL;
  const maxPeriod = options.maxPeriod ?? CLASSIFY_MAX_PERIOD;
  const eps = options.eps ?? CLASSIFY_EPS;

  if (r <= 3) return { kind: 'fixed', period: 1, label: '收斂到固定點' };

  let x = x0;
  for (let i = 0; i < transient; i += 1) x = logisticMap(r, x);

  const seq: number[] = [];
  for (let i = 0; i < tail; i += 1) {
    x = logisticMap(r, x);
    seq.push(x);
  }

  const last = seq[seq.length - 1]!;
  for (let period = 1; period <= maxPeriod; period += 1) {
    if (Math.abs(seq[seq.length - 1 - period]! - last) < eps) {
      // 確認尾段以此週期穩定重複
      let stable = true;
      for (let k = 1; k <= period && stable; k += 1) {
        const a = seq[seq.length - k]!;
        const b = seq[seq.length - k - period]!;
        if (Math.abs(a - b) >= eps) stable = false;
      }
      if (stable) {
        if (period === 1) return { kind: 'fixed', period: 1, label: '收斂到固定點' };
        return { kind: 'periodic', period, label: `週期 ${period} 循環` };
      }
    }
  }
  return { kind: 'unresolved', period: 0, label: '未偵測到 ' + maxPeriod + ' 期內週期' };
}
