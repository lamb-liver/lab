export type DiscreteMode = 'position' | 'spread' | 'tail';
export type SpreadShape = 'compact' | 'uniform' | 'bimodal';
export type TailModel = 'binomial' | 'geometric';

export type DiscreteState = {
  mode: DiscreteMode;
  positionPmf: number[];
  selectedIndex: number;
  spreadShape: SpreadShape;
  tailModel: TailModel;
  n: number;
  p: number;
  k: number;
};

export type DistributionRow = {
  x: number;
  label: string;
  p: number;
  bucket: boolean;
};

export type DistributionStats = {
  sum: number;
  mean: number;
  variance: number;
  sigma: number;
  threshold: number | null;
  tailProb: number | null;
};

export type DistributionModel = {
  rows: DistributionRow[];
  stats: DistributionStats;
  yMax: number;
};

export const INITIAL_POSITION_PMF = normalize([
  0.04, 0.06, 0.1, 0.16, 0.24, 0.18, 0.12, 0.07, 0.03,
]);

export function createDefaultDiscreteState(): DiscreteState {
  return {
    mode: 'position',
    positionPmf: [...INITIAL_POSITION_PMF],
    selectedIndex: 4,
    spreadShape: 'compact',
    tailModel: 'binomial',
    n: 10,
    p: 0.35,
    k: 6,
  };
}

export function buildModel(state: DiscreteState): DistributionModel {
  const rows = getRows(state);
  const stats = getStats(state, rows);
  const yMax = getYMax(state, rows);
  return { rows, stats, yMax };
}

export function getRows(state: DiscreteState): DistributionRow[] {
  if (state.mode === 'position') {
    return state.positionPmf.map((p, i) => ({
      x: i,
      label: String(i),
      p,
      bucket: false,
    }));
  }

  if (state.mode === 'spread') return spreadRows(state.spreadShape);

  return tailRows(state);
}

export function getStats(state: DiscreteState, rows: DistributionRow[]): DistributionStats {
  if (state.mode === 'tail' && state.tailModel === 'geometric') {
    const p = clamp(state.p, 0.05, 0.9);
    const maxK = rows[rows.length - 1].x;
    const k = Math.round(clamp(state.k, 1, maxK));

    return {
      sum: 1,
      mean: 1 / p,
      variance: (1 - p) / (p * p),
      sigma: Math.sqrt((1 - p) / (p * p)),
      threshold: k,
      tailProb: (1 - p) ** (k - 1),
    };
  }

  const mean = rows.reduce((acc, row) => acc + row.x * row.p, 0);
  const variance = rows.reduce((acc, row) => acc + (row.x - mean) ** 2 * row.p, 0);
  const sigma = Math.sqrt(Math.max(0, variance));
  const sum = rows.reduce((acc, row) => acc + row.p, 0);
  const threshold =
    state.mode === 'tail'
      ? Math.round(clamp(state.k, rows[0].x, rows[rows.length - 1].x))
      : null;
  const tailProb =
    threshold === null
      ? null
      : rows.reduce((acc, row) => acc + (row.x >= threshold ? row.p : 0), 0);

  return {
    sum,
    mean,
    variance,
    sigma,
    threshold,
    tailProb,
  };
}

export function setProbabilityAt(pmf: number[], index: number, value: number): number[] {
  const next = [...pmf];
  const oldOthers = next.reduce((acc, p, i) => acc + (i === index ? 0 : p), 0);
  const rest = 1 - clamp(value, 0, 1);

  next[index] = 1 - rest;

  if (oldOthers <= 1e-9) {
    const each = rest / (next.length - 1);
    for (let i = 0; i < next.length; i += 1) {
      if (i !== index) next[i] = each;
    }
  } else {
    for (let i = 0; i < next.length; i += 1) {
      if (i !== index) next[i] = (next[i] / oldOthers) * rest;
    }
  }

  return normalize(next);
}

export function syncTailThreshold(state: DiscreteState): void {
  if (state.tailModel === 'binomial') {
    state.n = Math.round(clamp(state.n, 4, 20));
    state.p = clamp(state.p, 0.05, 0.95);
    state.k = Math.round(clamp(state.k, 0, state.n));
    return;
  }

  state.p = clamp(state.p, 0.05, 0.9);

  const mean = 1 / state.p;
  const sigma = Math.sqrt((1 - state.p) / (state.p * state.p));
  const maxK = Math.round(clamp(Math.ceil(mean + sigma), 16, 36));

  state.k = Math.round(clamp(Math.max(1, state.k), 1, maxK));
}

export function normalize(values: number[]): number[] {
  const safe = values.map((v) => Math.max(0, v));
  const total = safe.reduce((acc, v) => acc + v, 0);

  if (total <= 1e-9) return safe.map(() => 1 / safe.length);

  return safe.map((v) => v / total);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  const reduced = Math.min(r, n - r);
  let result = 1;

  for (let i = 1; i <= reduced; i += 1) {
    result = (result * (n - reduced + i)) / i;
  }

  return result;
}

function spreadRows(shape: SpreadShape): DistributionRow[] {
  if (shape === 'uniform') {
    return range(0, 8).map((x) => ({
      x,
      label: String(x),
      p: 1 / 9,
      bucket: false,
    }));
  }

  if (shape === 'bimodal') {
    return normalizeRows([0.03, 0.08, 0.2, 0.12, 0.04, 0.12, 0.2, 0.08, 0.03]);
  }

  return normalizeRows([0.01, 0.03, 0.07, 0.17, 0.44, 0.17, 0.07, 0.03, 0.01]);
}

function tailRows(state: DiscreteState): DistributionRow[] {
  if (state.tailModel === 'geometric') {
    const p = clamp(state.p, 0.05, 0.9);
    const mean = 1 / p;
    const sigma = Math.sqrt((1 - p) / (p * p));
    const maxX = Math.round(clamp(Math.ceil(mean + sigma), 16, 36));
    const rows: DistributionRow[] = [];

    for (let x = 1; x < maxX; x += 1) {
      rows.push({
        x,
        label: String(x),
        p: p * (1 - p) ** (x - 1),
        bucket: false,
      });
    }

    rows.push({
      x: maxX,
      label: `>=${maxX}`,
      p: (1 - p) ** (maxX - 1),
      bucket: true,
    });

    return rows;
  }

  const n = Math.round(clamp(state.n, 4, 20));
  const p = clamp(state.p, 0.05, 0.95);

  return range(0, n).map((x) => ({
    x,
    label: String(x),
    p: choose(n, x) * p ** x * (1 - p) ** (n - x),
    bucket: false,
  }));
}

function normalizeRows(values: number[]): DistributionRow[] {
  return normalize(values).map((p, i) => ({
    x: i,
    label: String(i),
    p,
    bucket: false,
  }));
}

function getYMax(state: DiscreteState, rows: DistributionRow[]): number {
  const maxProb = Math.max(...rows.map((row) => row.p));

  if (state.mode === 'position') return 1;
  if (state.mode === 'spread') return 0.55;

  return Math.max(0.18, maxProb * 1.2);
}

function range(a: number, b: number): number[] {
  const arr: number[] = [];
  for (let x = a; x <= b; x += 1) arr.push(x);
  return arr;
}
