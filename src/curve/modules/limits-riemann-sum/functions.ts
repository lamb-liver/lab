import type { FnKey, FunctionDef, RiemannMethod } from './types';

export function getFunctionDef(key: FnKey): FunctionDef {
  if (key === 'sin') {
    return {
      key: 'sin',
      label: 'sin x',
      formula: 'f(x)=sin x',
      a: 0,
      b: Math.PI,
      yMin: -0.15,
      yMax: 1.15,
      f: (x) => Math.sin(x),
      df: (x) => Math.cos(x),
      exact: 2,
      exactLabel: '2',
      comparisonT: 0.35,
    };
  }

  if (key === 'exp') {
    return {
      key: 'exp',
      label: 'eˣ',
      formula: 'f(x)=eˣ',
      a: 0,
      b: 1,
      yMin: -0.15,
      yMax: Math.E + 0.35,
      f: (x) => Math.exp(x),
      df: (x) => Math.exp(x),
      exact: Math.E - 1,
      exactLabel: 'e−1',
      comparisonT: 0.45,
    };
  }

  return {
    key: 'x2',
    label: 'x²',
    formula: 'f(x)=x²',
    a: 0,
    b: 1,
    yMin: -0.08,
    yMax: 1.18,
    f: (x) => x * x,
    df: (x) => 2 * x,
    exact: 1 / 3,
    exactLabel: '1/3',
    comparisonT: 0.55,
  };
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function scaleToPartitionCount(scale: number): number {
  return Math.round(6 + Math.pow(clamp01(scale), 1.5) * 154);
}

export function scaleToForwardH(fn: FunctionDef, scale: number): number {
  const span = fn.b - fn.a;
  const minVisibleH = span * 0.035;
  const h = span * (0.28 * Math.pow(1 - clamp01(scale), 1.35) + 0.035);
  return Math.max(h, minVisibleH);
}

export function clampForwardH(fn: FunctionDef, x: number, h: number): number {
  if (!Number.isFinite(h) || h <= 0) return 0;
  return Math.max(0, Math.min(h, fn.b - x));
}

export function isHViable(fn: FunctionDef, h: number): boolean {
  return h >= (fn.b - fn.a) * 1e-4;
}

export function computeForwardSecant(
  fn: FunctionDef,
  x: number,
  h: number,
): { x2: number; y2: number; slope: number; h: number; viable: boolean } {
  const effectiveH = clampForwardH(fn, x, h);
  const viable = isHViable(fn, effectiveH);
  const y = fn.f(x);
  const x2 = x + effectiveH;
  const y2 = viable ? fn.f(x2) : y;
  const slope = viable ? (y2 - y) / effectiveH : Number.NaN;

  return { x2, y2, slope, h: effectiveH, viable };
}

export function computeRiemann(
  fn: FunctionDef,
  n: number,
  method: RiemannMethod,
): { area: number } {
  const dx = (fn.b - fn.a) / n;
  let area = 0;

  for (let i = 0; i < n; i++) {
    const x0 = fn.a + i * dx;
    const x1 = x0 + dx;

    let sampleX = x0;
    if (method === 'right') sampleX = x1;
    if (method === 'mid') sampleX = (x0 + x1) / 2;

    area += fn.f(sampleX) * dx;
  }

  return { area };
}

export function formatNum(v: number): string {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) >= 100) return v.toFixed(2);
  if (Math.abs(v) >= 10) return v.toFixed(3);
  return v.toFixed(4);
}
