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
  };
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
