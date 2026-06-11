import type { CurvePoint, ThumbnailSpec } from '../../types';

export type TaylorPresetId = 'sin' | 'cos' | 'exp';

export type TaylorPreset = {
  id: TaylorPresetId;
  label: string;
  formula: string;
  note: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  aMin: number;
  aMax: number;
  f: (x: number) => number;
  deriv: (a: number, k: number) => number;
  maclaurin: string;
};

export type TaylorParams = {
  preset: TaylorPresetId;
  a: number;
  n: number;
};

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const TAYLOR_SAMPLE_N = 420;
export const TAYLOR_MAX_N = 12;
export const TAYLOR_MIN_N = 0;
export const TAYLOR_MAX_TERM_CURVES = 7;

const FACT = buildFactorials(TAYLOR_MAX_N);

export const TAYLOR_PRESETS: TaylorPreset[] = [
  {
    id: 'sin',
    label: 'sin x',
    formula: 'f(x)=sin x',
    note: '奇次項主導，中心附近最貼合',
    xMin: -Math.PI * 2,
    xMax: Math.PI * 2,
    yMin: -2.1,
    yMax: 2.1,
    aMin: -Math.PI,
    aMax: Math.PI,
    f: (x) => Math.sin(x),
    deriv: (a, k) => {
      const r = ((k % 4) + 4) % 4;
      if (r === 0) return Math.sin(a);
      if (r === 1) return Math.cos(a);
      if (r === 2) return -Math.sin(a);
      return -Math.cos(a);
    },
    maclaurin: 'sin x = x - x^3/3! + x^5/5! - ...',
  },
  {
    id: 'cos',
    label: 'cos x',
    formula: 'f(x)=cos x',
    note: '偶次項主導，中心改變後也會混入奇次項',
    xMin: -Math.PI * 2,
    xMax: Math.PI * 2,
    yMin: -2.1,
    yMax: 2.1,
    aMin: -Math.PI,
    aMax: Math.PI,
    f: (x) => Math.cos(x),
    deriv: (a, k) => {
      const r = ((k % 4) + 4) % 4;
      if (r === 0) return Math.cos(a);
      if (r === 1) return -Math.sin(a);
      if (r === 2) return -Math.cos(a);
      return Math.sin(a);
    },
    maclaurin: 'cos x = 1 - x^2/2! + x^4/4! - ...',
  },
  {
    id: 'exp',
    label: 'e^x',
    formula: 'f(x)=e^x',
    note: '各階導數仍是 e^x，係數最規律',
    xMin: -2.5,
    xMax: 2.5,
    yMin: -1.2,
    yMax: 12.5,
    aMin: -1.5,
    aMax: 1.5,
    f: (x) => Math.exp(x),
    deriv: (a) => Math.exp(a),
    maclaurin: 'e^x = 1 + x + x^2/2! + x^3/3! + ...',
  },
];

export function presetById(id: string): TaylorPreset {
  return TAYLOR_PRESETS.find((preset) => preset.id === id) ?? TAYLOR_PRESETS[0]!;
}

export function presetIdFromIndex(index: number): TaylorPresetId {
  return TAYLOR_PRESETS[Math.round(index)]?.id ?? 'sin';
}

export function presetIndexFromId(id: TaylorPresetId): number {
  return Math.max(0, TAYLOR_PRESETS.findIndex((preset) => preset.id === id));
}

export function paramsFromValues(values: Record<string, number>): TaylorParams {
  return {
    preset: presetIdFromIndex(values.preset ?? 0),
    a: values.a ?? 0,
    n: clamp(Math.round(values.n ?? 3), TAYLOR_MIN_N, TAYLOR_MAX_N),
  };
}

export function valuesFromParams(params: TaylorParams): Record<string, number> {
  return {
    preset: presetIndexFromId(params.preset),
    a: params.a,
    n: params.n,
  };
}

export function clampA(preset: TaylorPreset, a: number): number {
  return clamp(a, preset.aMin, preset.aMax);
}

export function clampN(n: number): number {
  return clamp(Math.round(n), TAYLOR_MIN_N, TAYLOR_MAX_N);
}

export function taylorValue(
  preset: TaylorPreset,
  x: number,
  a: number,
  n: number,
): number {
  let sum = 0;
  for (let k = 0; k <= clampN(n); k += 1) {
    sum += taylorTerm(preset, x, a, k);
  }
  return sum;
}

export function taylorTerm(
  preset: TaylorPreset,
  x: number,
  a: number,
  k: number,
): number {
  if (!Number.isInteger(k) || k < 0 || k >= FACT.length) return 0;
  return (preset.deriv(a, k) / FACT[k]!) * Math.pow(x - a, k);
}

export function maxErrorInView(
  preset: TaylorPreset,
  a: number,
  n: number,
  sampleN = TAYLOR_SAMPLE_N,
): number {
  let maxE = 0;
  for (let i = 0; i <= sampleN; i += 1) {
    const x = lerp(preset.xMin, preset.xMax, i / sampleN);
    const e = Math.abs(preset.f(x) - taylorValue(preset, x, a, n));
    if (Number.isFinite(e)) maxE = Math.max(maxE, e);
  }
  return maxE;
}

export function createTaylorPlotRect(size: number): PlotRect {
  const padX = Math.min(60, Math.max(34, size * 0.08));
  const padTop = 58;
  const padBottom = 46;
  return {
    x: padX,
    y: padTop,
    w: size - 2 * padX,
    h: size - padTop - padBottom,
  };
}

export function xToScreen(g: PlotRect, x: number, preset: TaylorPreset): number {
  return g.x + ((x - preset.xMin) / (preset.xMax - preset.xMin)) * g.w;
}

export function screenToX(g: PlotRect, sx: number, preset: TaylorPreset): number {
  const t = clamp((sx - g.x) / g.w, 0, 1);
  return lerp(preset.xMin, preset.xMax, t);
}

export function yToScreen(g: PlotRect, y: number, preset: TaylorPreset): number {
  return g.y + g.h - ((y - preset.yMin) / (preset.yMax - preset.yMin)) * g.h;
}

export function yToScreenClamped(g: PlotRect, y: number, preset: TaylorPreset): number {
  return yToScreen(g, clampY(y, preset), preset);
}

export function clampY(y: number, preset: TaylorPreset): number {
  if (!Number.isFinite(y)) return y > 0 ? preset.yMax : preset.yMin;
  return clamp(y, preset.yMin, preset.yMax);
}

export function buildFunctionPoints(
  preset: TaylorPreset,
  fn: (x: number) => number,
  sampleN = TAYLOR_SAMPLE_N,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= sampleN; i += 1) {
    const x = lerp(preset.xMin, preset.xMax, i / sampleN);
    points.push({ x, y: fn(x) });
  }
  return points;
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const next = Math.abs(n) < 0.005 ? 0 : n;
  if (Math.abs(next) >= 1000) return next.toExponential(2);
  return next.toFixed(2);
}

export function fmtAxis(n: number): string {
  if (Math.abs(n) < 0.005) return '0';
  if (Math.abs(n / Math.PI - Math.round(n / Math.PI)) < 1e-6) {
    const k = Math.round(n / Math.PI);
    if (k === 1) return 'π';
    if (k === -1) return '−π';
    return `${k}π`;
  }
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function buildTaylorThumbnail(params: TaylorParams): ThumbnailSpec {
  const preset = presetById(params.preset);
  const a = clampA(preset, params.a);
  const n = clampN(params.n);
  const size = 320;
  const plot = createTaylorPlotRect(size);
  const ghost = screenCurvePoints(plot, preset, preset.f);
  const taylor = screenCurvePoints(plot, preset, (x) => taylorValue(preset, x, a, n));
  const sx = xToScreen(plot, a, preset);
  const sy = yToScreenClamped(plot, preset.f(a), preset);

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: rectToCurvePoints(plot),
        stroke: '#ffffff',
        strokeWidth: 0.8,
        opacity: 0.12,
        excludeFromBbox: true,
      },
      { points: ghost, stroke: '#d8d8d8', strokeWidth: 1.6, opacity: 0.34 },
      { points: taylor, stroke: '#d4b87a', strokeWidth: 2.5, opacity: 0.96 },
      {
        points: toCurvePoints([
          { x: sx, y: plot.y },
          { x: sx, y: plot.y + plot.h },
        ]),
        stroke: '#d4b87a',
        strokeWidth: 1,
        opacity: 0.42,
      },
    ],
    circles: [{ x: sx, y: sy, r: 3.5, fill: '#d4b87a', opacity: 0.96 }],
  };
}

function screenCurvePoints(
  plot: PlotRect,
  preset: TaylorPreset,
  fn: (x: number) => number,
): CurvePoint[] {
  return toCurvePoints(
    buildFunctionPoints(preset, fn).map((point) => ({
      x: xToScreen(plot, point.x, preset),
      y: yToScreenClamped(plot, point.y, preset),
    })),
  );
}

function rectToCurvePoints(g: PlotRect): CurvePoint[] {
  return toCurvePoints([
    { x: g.x, y: g.y },
    { x: g.x + g.w, y: g.y },
    { x: g.x + g.w, y: g.y + g.h },
    { x: g.x, y: g.y + g.h },
    { x: g.x, y: g.y },
  ]);
}

function toCurvePoints(points: Array<{ x: number; y: number }>): CurvePoint[] {
  let arcLength = 0;
  return points.map((point, index) => {
    if (index > 0) {
      const prev = points[index - 1]!;
      arcLength += Math.hypot(point.x - prev.x, point.y - prev.y);
    }
    return {
      x: point.x,
      y: point.y,
      theta: index,
      arcLength,
    };
  });
}

function buildFactorials(maxK: number): number[] {
  const arr = [1];
  for (let i = 1; i <= maxK; i += 1) arr[i] = arr[i - 1]! * i;
  return arr;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
