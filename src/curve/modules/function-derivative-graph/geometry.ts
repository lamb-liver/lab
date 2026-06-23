import type { CurvePoint, ThumbnailSpec } from '../../types';

export type FunctionDerivativePresetId = 'quad' | 'cubic' | 'sin';

export type FunctionDerivativePreset = {
  id: FunctionDerivativePresetId;
  label: string;
  title: string;
  formula: string;
  derivative: string;
  note: string;
  monotonicText: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  dMin: number;
  dMax: number;
  f: (x: number) => number;
  df: (x: number) => number;
  zeros: () => number[];
};

export type FunctionDerivativeParams = {
  preset: FunctionDerivativePresetId;
  x0: number;
};

export type GraphRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type FunctionDerivativeLayout = {
  top: GraphRect;
  bottom: GraphRect;
};

export const FUNCTION_DERIVATIVE_SAMPLE_N = 360;
const FUNCTION_DERIVATIVE_SLOPE_TOL = 0.045;

export const FUNCTION_DERIVATIVE_PRESETS: FunctionDerivativePreset[] = [
  {
    id: 'quad',
    label: 'x²',
    title: 'f(x)=x²',
    formula: 'f(x)=x²',
    derivative: "f'(x)=2x",
    note: 'x=0 處水平，且由遞減轉遞增',
    monotonicText: '遞減：x<0；遞增：x>0',
    xMin: -3,
    xMax: 3,
    yMin: -1,
    yMax: 9,
    dMin: -6,
    dMax: 6,
    f: (x) => x * x,
    df: (x) => 2 * x,
    zeros: () => [0],
  },
  {
    id: 'cubic',
    label: 'x³−3x',
    title: 'f(x)=x³−3x',
    formula: 'f(x)=x³−3x',
    derivative: "f'(x)=3x²−3",
    note: '兩個水平切線，分別對應極大與極小',
    monotonicText: '遞增：x<-1 或 x>1；遞減：-1<x<1',
    xMin: -2.2,
    xMax: 2.2,
    yMin: -4.2,
    yMax: 4.2,
    dMin: -4,
    dMax: 12,
    f: (x) => x * x * x - 3 * x,
    df: (x) => 3 * x * x - 3,
    zeros: () => [-1, 1],
  },
  {
    id: 'sin',
    label: 'sin x',
    title: 'f(x)=sin x',
    formula: 'f(x)=sin x',
    derivative: "f'(x)=cos x",
    note: '斜率隨週期變化，零點對應波峰與波谷',
    monotonicText: '遞增/遞減隨 cos x 正負週期切換',
    xMin: -Math.PI * 2,
    xMax: Math.PI * 2,
    yMin: -1.35,
    yMax: 1.35,
    dMin: -1.35,
    dMax: 1.35,
    f: (x) => Math.sin(x),
    df: (x) => Math.cos(x),
    zeros: () => rangeCosZeros(-Math.PI * 2, Math.PI * 2),
  },
];

export function presetById(id: string): FunctionDerivativePreset {
  return FUNCTION_DERIVATIVE_PRESETS.find((preset) => preset.id === id) ??
    FUNCTION_DERIVATIVE_PRESETS[0]!;
}

export function presetIdFromIndex(index: number): FunctionDerivativePresetId {
  const preset = FUNCTION_DERIVATIVE_PRESETS[Math.round(index)];
  return preset?.id ?? 'quad';
}

export function presetIndexFromId(id: FunctionDerivativePresetId): number {
  return Math.max(
    0,
    FUNCTION_DERIVATIVE_PRESETS.findIndex((preset) => preset.id === id),
  );
}

export function paramsFromValues(values: Record<string, number>): FunctionDerivativeParams {
  return {
    preset: presetIdFromIndex(values.preset ?? 0),
    x0: values.x0 ?? 1.25,
  };
}

export function valuesFromParams(params: FunctionDerivativeParams): Record<string, number> {
  return {
    preset: presetIndexFromId(params.preset),
    x0: params.x0,
  };
}

export function clampX0(preset: FunctionDerivativePreset, x0: number): number {
  return clamp(x0, preset.xMin, preset.xMax);
}

export function visibleZeros(preset: FunctionDerivativePreset): number[] {
  return preset.zeros().filter((z) => z >= preset.xMin - 1e-9 && z <= preset.xMax + 1e-9);
}

export function nearestZeroInfo(
  preset: FunctionDerivativePreset,
  x: number,
): { x: number; distance: number; near: boolean } | null {
  const zeros = visibleZeros(preset);
  if (zeros.length === 0) return null;

  let best = zeros[0]!;
  let bestD = Math.abs(x - best);
  for (const z of zeros) {
    const d = Math.abs(x - z);
    if (d < bestD) {
      best = z;
      bestD = d;
    }
  }

  const xTol = (preset.xMax - preset.xMin) * 0.018;
  return { x: best, distance: bestD, near: bestD <= xTol };
}

export function zeroTypeText(preset: FunctionDerivativePreset, z: number): string {
  const eps = (preset.xMax - preset.xMin) * 0.006;
  const left = preset.df(z - eps);
  const right = preset.df(z + eps);

  if (left > 0 && right < 0) return '極大值候選';
  if (left < 0 && right > 0) return '極小值候選';
  if (left * right > 0) return '水平穿越／非極值';
  return '需看左右符號';
}

export function slopeStateText(slope: number): string {
  if (Math.abs(slope) < FUNCTION_DERIVATIVE_SLOPE_TOL) return '水平';
  return slope > 0 ? '遞增' : '遞減';
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const next = Math.abs(n) < 0.005 ? 0 : n;
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

export function createFunctionDerivativeLayout(size: number): FunctionDerivativeLayout {
  const padX = Math.min(54, Math.max(34, size * 0.08));
  const padTop = 52;
  const padBottom = 36;
  const gap = Math.min(46, Math.max(30, size * 0.075));
  const graphH = (size - padTop - padBottom - gap) / 2;
  return {
    top: { x: padX, y: padTop, w: size - 2 * padX, h: graphH },
    bottom: { x: padX, y: padTop + graphH + gap, w: size - 2 * padX, h: graphH },
  };
}

export function xToScreen(g: GraphRect, x: number, preset: FunctionDerivativePreset): number {
  return g.x + ((x - preset.xMin) / (preset.xMax - preset.xMin)) * g.w;
}

export function screenToX(g: GraphRect, sx: number, preset: FunctionDerivativePreset): number {
  const t = clamp((sx - g.x) / g.w, 0, 1);
  return lerp(preset.xMin, preset.xMax, t);
}

export function yToScreen(g: GraphRect, y: number, yMin: number, yMax: number): number {
  return g.y + g.h - ((y - yMin) / (yMax - yMin)) * g.h;
}

export function buildFunctionPoints(
  preset: FunctionDerivativePreset,
  fn: (x: number) => number,
  sampleN = FUNCTION_DERIVATIVE_SAMPLE_N,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= sampleN; i += 1) {
    const t = i / sampleN;
    const x = lerp(preset.xMin, preset.xMax, t);
    points.push({ x, y: fn(x) });
  }
  return points;
}

export function buildFunctionDerivativeThumbnail(
  params: FunctionDerivativeParams,
): ThumbnailSpec {
  const preset = presetById(params.preset);
  const size = 320;
  const layout = createFunctionDerivativeLayout(size);
  const x0 = clampX0(preset, params.x0);
  const f0 = preset.f(x0);
  const d0 = preset.df(x0);
  const topPoints = screenCurvePoints(layout.top, preset, preset.f, preset.yMin, preset.yMax);
  const bottomPoints = screenCurvePoints(layout.bottom, preset, preset.df, preset.dMin, preset.dMax);
  const sx = xToScreen(layout.top, x0, preset);
  const dx = (preset.xMax - preset.xMin) * 0.14;
  const x1 = clamp(x0 - dx, preset.xMin, preset.xMax);
  const x2 = clamp(x0 + dx, preset.xMin, preset.xMax);

  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: rectToCurvePoints(layout.top),
        stroke: '#ffffff',
        strokeWidth: 0.8,
        opacity: 0.12,
        excludeFromBbox: true,
      },
      {
        points: rectToCurvePoints(layout.bottom),
        stroke: '#ffffff',
        strokeWidth: 0.8,
        opacity: 0.12,
        excludeFromBbox: true,
      },
      { points: topPoints, stroke: '#d4b87a', strokeWidth: 2, opacity: 0.95 },
      { points: bottomPoints, stroke: '#5dade2', strokeWidth: 2, opacity: 0.95 },
      {
        points: toCurvePoints([
          { x: sx, y: layout.top.y },
          { x: sx, y: layout.bottom.y + layout.bottom.h },
        ]),
        stroke: '#d8d8d8',
        strokeWidth: 1,
        opacity: 0.45,
      },
      {
        points: toCurvePoints([
          {
            x: xToScreen(layout.top, x1, preset),
            y: yToScreen(layout.top, f0 + d0 * (x1 - x0), preset.yMin, preset.yMax),
          },
          {
            x: xToScreen(layout.top, x2, preset),
            y: yToScreen(layout.top, f0 + d0 * (x2 - x0), preset.yMin, preset.yMax),
          },
        ]),
        stroke: '#8bcc97',
        strokeWidth: 2,
      },
    ],
    circles: [
      {
        x: sx,
        y: yToScreen(layout.top, f0, preset.yMin, preset.yMax),
        r: 3.5,
        fill: '#d4b87a',
        opacity: 0.95,
      },
      {
        x: sx,
        y: yToScreen(layout.bottom, d0, preset.dMin, preset.dMax),
        r: 3.5,
        fill: '#5dade2',
        opacity: 0.95,
      },
    ],
  };
}

function screenCurvePoints(
  g: GraphRect,
  preset: FunctionDerivativePreset,
  fn: (x: number) => number,
  yMin: number,
  yMax: number,
): CurvePoint[] {
  return toCurvePoints(
    buildFunctionPoints(preset, fn).map((point) => ({
      x: xToScreen(g, point.x, preset),
      y: yToScreen(g, point.y, yMin, yMax),
    })),
  );
}

function rectToCurvePoints(g: GraphRect): CurvePoint[] {
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

function rangeCosZeros(minX: number, maxX: number): number[] {
  const out: number[] = [];
  for (let k = -8; k <= 8; k += 1) {
    const x = Math.PI / 2 + k * Math.PI;
    if (x >= minX - 1e-9 && x <= maxX + 1e-9) out.push(x);
  }
  return out;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
