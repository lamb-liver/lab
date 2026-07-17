import type { CurvePoint, ThumbnailPath, ThumbnailSpec } from '../../types';

export type RationalObliqueModeId = 'oblique' | 'horizontal' | 'proper';
export type RationalObliqueParamKey = 'm' | 'b' | 'A' | 'c' | 'd';
export type RationalObliqueParams = Record<RationalObliqueParamKey, number>;

export type RationalObliqueMode = {
  id: RationalObliqueModeId;
  label: string;
  name: string;
  note: string;
  sliders: RationalObliqueParamKey[];
};

export type RationalObliqueModel = {
  family: string;
  degreeText: string;
  expression: string;
  split: string;
  remainder: string;
  remainderLabel: string;
  remainderEqualsMain: boolean;
  verticals: number[];
  zeros: number[];
  guide:
    | { type: 'oblique'; m: number; b: number; label: string }
    | { type: 'horizontal'; value: number; label: string };
  warning: string;
  f: (x: number) => number;
  s: (x: number) => number;
  e: (x: number) => number;
  stats: string[];
  formulas: string[];
};

export type GraphRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const RATIONAL_OBLIQUE_CONFIG = {
  xMin: -4,
  xMax: 4,
  yMin: -7,
  yMax: 7,
  sampleN: 680,
  gapPx: 30,
  poleEpsRatio: 0.0035,
  collisionTol: 0.035,
} as const;

export const RATIONAL_OBLIQUE_MODES: RationalObliqueMode[] = [
  {
    id: 'oblique',
    label: '斜',
    name: '斜漸近線',
    note: 'deg P = deg Q + 1',
    sliders: ['m', 'b', 'A', 'c'],
  },
  {
    id: 'horizontal',
    label: '水平',
    name: '水平漸近線',
    note: 'deg P = deg Q',
    sliders: ['b', 'A', 'c'],
  },
  {
    id: 'proper',
    label: '趨近 0',
    name: '分子次數較低',
    note: 'deg P < deg Q',
    sliders: ['A', 'c', 'd'],
  },
];

export const RATIONAL_OBLIQUE_PARAM_META = {
  m: { label: '斜率 m', min: -2.2, max: 2.2, step: 0.01 },
  b: { label: '截距 b', min: -3, max: 3, step: 0.01 },
  A: { label: '餘式強度 A', min: -4, max: 4, step: 0.01 },
  c: { label: '分母零點 c', min: -3.2, max: 3.2, step: 0.01 },
  d: { label: '第二零點 d', min: -3.2, max: 3.2, step: 0.01 },
} satisfies Record<RationalObliqueParamKey, { label: string; min: number; max: number; step: number }>;

export const rationalObliqueDefaultParams: RationalObliqueParams = {
  m: 0.85,
  b: 0.25,
  A: 1.45,
  c: -0.85,
  d: 1.45,
};

export function modeById(id: string): RationalObliqueMode {
  return RATIONAL_OBLIQUE_MODES.find((mode) => mode.id === id) ?? RATIONAL_OBLIQUE_MODES[0]!;
}

export function modeIdFromIndex(index: number): RationalObliqueModeId {
  return RATIONAL_OBLIQUE_MODES[Math.round(index)]?.id ?? 'oblique';
}

export function modeIndexFromId(id: RationalObliqueModeId): number {
  return Math.max(0, RATIONAL_OBLIQUE_MODES.findIndex((mode) => mode.id === id));
}

export function valuesFromParams(modeId: RationalObliqueModeId, params: RationalObliqueParams): Record<string, number> {
  return {
    mode: modeIndexFromId(modeId),
    m: params.m,
    b: params.b,
    A: params.A,
    c: params.c,
    d: params.d,
  };
}

export function paramsFromValues(values: Record<string, number>): { modeId: RationalObliqueModeId; params: RationalObliqueParams } {
  return {
    modeId: modeIdFromIndex(values.mode ?? 0),
    params: {
      m: values.m ?? rationalObliqueDefaultParams.m,
      b: values.b ?? rationalObliqueDefaultParams.b,
      A: values.A ?? rationalObliqueDefaultParams.A,
      c: values.c ?? rationalObliqueDefaultParams.c,
      d: values.d ?? rationalObliqueDefaultParams.d,
    },
  };
}

export function buildRationalObliqueModel(
  mode: RationalObliqueMode,
  params: RationalObliqueParams,
): RationalObliqueModel {
  if (mode.id === 'horizontal') return buildHorizontalModel(params);
  if (mode.id === 'proper') return buildProperModel(params);
  return buildObliqueModel(params);
}

export function createRationalObliquePlotRect(size: number): GraphRect {
  const padX = Math.min(56, Math.max(36, size * 0.08));
  const padTop = 58;
  const padBottom = 42;
  return {
    x: padX,
    y: padTop,
    w: size - 2 * padX,
    h: size - padTop - padBottom,
  };
}

export function xToScreen(g: GraphRect, x: number): number {
  const { xMin, xMax } = RATIONAL_OBLIQUE_CONFIG;
  return g.x + ((x - xMin) / (xMax - xMin)) * g.w;
}

export function yToScreen(g: GraphRect, y: number, yMin = RATIONAL_OBLIQUE_CONFIG.yMin, yMax = RATIONAL_OBLIQUE_CONFIG.yMax): number {
  return g.y + g.h - ((y - yMin) / (yMax - yMin)) * g.h;
}

export function yToScreenClamped(g: GraphRect, y: number, yMin = RATIONAL_OBLIQUE_CONFIG.yMin, yMax = RATIONAL_OBLIQUE_CONFIG.yMax): number {
  return yToScreen(g, clampY(y, yMin, yMax), yMin, yMax);
}

export function buildFunctionSegments(
  fn: (x: number) => number,
  verticals: number[],
  yMin = RATIONAL_OBLIQUE_CONFIG.yMin,
  yMax = RATIONAL_OBLIQUE_CONFIG.yMax,
): Array<Array<{ x: number; y: number }>> {
  const { xMin, xMax, sampleN, poleEpsRatio } = RATIONAL_OBLIQUE_CONFIG;
  const poleEps = (xMax - xMin) * poleEpsRatio;
  const segments: Array<Array<{ x: number; y: number }>> = [];
  let current: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= sampleN; i += 1) {
    const x = lerp(xMin, xMax, i / sampleN);
    const closeToPole = verticals.some((v) => Math.abs(x - v) < poleEps);
    const y = fn(x);
    const finite = Number.isFinite(y);

    if (closeToPole || !finite || y < yMin - 1.5 || y > yMax + 1.5) {
      if (current.length > 1) segments.push(current);
      current = [];
      continue;
    }

    current.push({ x, y: clampY(y, yMin, yMax) });
  }

  if (current.length > 1) segments.push(current);
  return segments;
}

export function buildRationalObliqueThumbnail(
  modeId: RationalObliqueModeId,
  params: RationalObliqueParams,
): ThumbnailSpec {
  const model = buildRationalObliqueModel(modeById(modeId), params);
  const paths: ThumbnailPath[] = buildFunctionSegments(model.f, model.verticals).map((segment) => ({
    points: segment.map((point, index): CurvePoint => ({
      x: point.x,
      y: point.y,
      theta: index,
      arcLength: index,
    })),
    stroke: '#d4b87a',
    strokeWidth: 1.4,
  }));

  const guidePoints =
    model.guide.type === 'oblique'
      ? [
          {
            x: RATIONAL_OBLIQUE_CONFIG.xMin,
            y: model.guide.m * RATIONAL_OBLIQUE_CONFIG.xMin + model.guide.b,
            theta: 0,
            arcLength: 0,
          },
          {
            x: RATIONAL_OBLIQUE_CONFIG.xMax,
            y: model.guide.m * RATIONAL_OBLIQUE_CONFIG.xMax + model.guide.b,
            theta: 1,
            arcLength: 1,
          },
        ]
      : [
          { x: RATIONAL_OBLIQUE_CONFIG.xMin, y: model.guide.value, theta: 0, arcLength: 0 },
          { x: RATIONAL_OBLIQUE_CONFIG.xMax, y: model.guide.value, theta: 1, arcLength: 1 },
        ];

  paths.push({
    points: guidePoints,
    stroke: '#5dade2',
    strokeWidth: 0.8,
    opacity: 0.55,
    excludeFromBbox: true,
  });

  for (const c of model.verticals) {
    paths.push({
      points: [
        { x: c, y: RATIONAL_OBLIQUE_CONFIG.yMin, theta: 0, arcLength: 0 },
        { x: c, y: RATIONAL_OBLIQUE_CONFIG.yMax, theta: 1, arcLength: 1 },
      ],
      stroke: '#e76f51',
      strokeWidth: 0.8,
      opacity: 0.5,
      excludeFromBbox: true,
    });
  }

  return { paths };
}

export function rightEdgeLabelDataPoint(fn: (x: number) => number, verticals: number[]): { x: number; y: number } {
  const { xMin, xMax, yMin, yMax, sampleN, gapPx, poleEpsRatio } = RATIONAL_OBLIQUE_CONFIG;
  const poleEps = (xMax - xMin) * poleEpsRatio;

  for (let i = sampleN; i >= 0; i -= 1) {
    const x = lerp(xMin, xMax, i / sampleN);
    if (verticals.some((v) => Math.abs(x - v) < poleEps)) continue;
    const y = fn(x);
    if (!Number.isFinite(y) || y < yMin - gapPx / 20 || y > yMax + gapPx / 20) continue;
    return { x, y: clampY(y, yMin, yMax) };
  }

  return { x: xMin, y: yMin };
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const next = Math.abs(n) < 0.005 ? 0 : n;
  return next.toFixed(2);
}

function buildObliqueModel(p: RationalObliqueParams): RationalObliqueModel {
  const m = safeNonzero(p.m, 0.06);
  const b = p.b;
  const A = safeNonzero(p.A, 0.1);
  const c = p.c;
  const zeros = quadraticRoots(m, b - m * c, A - b * c).filter((z) => !nearlyEqual(z, c));

  return {
    family: '斜漸近線',
    degreeText: 'deg P = deg Q + 1',
    expression: `R(x)=${fmt(m)}x+${fmt(b)}+${fmt(A)}/(x-${fmt(c)})`,
    split: `S(x)=${fmt(m)}x+${fmt(b)}`,
    remainder: `E(x)=${fmt(A)}/(x-${fmt(c)})`,
    remainderLabel: 'E(x)',
    remainderEqualsMain: false,
    verticals: [c],
    zeros,
    guide: { type: 'oblique', m, b, label: `S(x)=${fmt(m)}x+${fmt(b)}` },
    warning: '',
    f: (x) => m * x + b + A / (x - c),
    s: (x) => m * x + b,
    e: (x) => A / (x - c),
    stats: [
      `S(x)：${fmt(m)}x+${fmt(b)}`,
      `垂直漸近線：x=${fmt(c)}`,
      `餘式項：${fmt(A)}/(x-${fmt(c)})`,
      '狀態：斜漸近線',
    ],
    formulas: [
      'R(x)=S(x)+E(x)',
      `S(x)=${fmt(m)}x+${fmt(b)}`,
      `E(x)=${fmt(A)}/(x-${fmt(c)})`,
      'E(x)→0 ⇒ R(x) 貼近 S(x)',
    ],
  };
}

function buildHorizontalModel(p: RationalObliqueParams): RationalObliqueModel {
  const b = p.b;
  const A = safeNonzero(p.A, 0.1);
  const c = p.c;
  const zero = Math.abs(b) < 1e-8 ? null : c - A / b;
  const zeros = zero !== null && Number.isFinite(zero) && !nearlyEqual(zero, c) ? [zero] : [];

  return {
    family: '水平漸近線',
    degreeText: 'deg P = deg Q',
    expression: `R(x)=${fmt(b)}+${fmt(A)}/(x-${fmt(c)})`,
    split: `S(x)=${fmt(b)}`,
    remainder: `E(x)=${fmt(A)}/(x-${fmt(c)})`,
    remainderLabel: 'E(x)',
    remainderEqualsMain: false,
    verticals: [c],
    zeros,
    guide: { type: 'horizontal', value: b, label: `y=${fmt(b)}` },
    warning: 'deg P = deg Q：遠處讀水平線',
    f: (x) => b + A / (x - c),
    s: () => b,
    e: (x) => A / (x - c),
    stats: [
      `水平漸近線：y=${fmt(b)}`,
      `垂直漸近線：x=${fmt(c)}`,
      `餘式項：${fmt(A)}/(x-${fmt(c)})`,
      '狀態：水平漸近線',
    ],
    formulas: ['R(x)=b+E(x)', `b=${fmt(b)}`, `E(x)=${fmt(A)}/(x-${fmt(c)})`, 'E(x)→0 ⇒ R(x) 貼近 y=b'],
  };
}

function buildProperModel(p: RationalObliqueParams): RationalObliqueModel {
  const A = safeNonzero(p.A, 0.1);
  const c = p.c;
  let d = p.d;
  let warning = 'deg P < deg Q：遠處趨近 0';
  if (nearlyEqual(c, d)) {
    d = c + RATIONAL_OBLIQUE_CONFIG.collisionTol * 2.2;
    warning = 'c≈d：第二零點自動錯開';
  }
  const verticals = [c, d].sort((x, y) => x - y);

  return {
    family: '分子次數較低',
    degreeText: 'deg P < deg Q',
    expression: `R(x)=${fmt(A)}/[(x-${fmt(c)})(x-${fmt(d)})]`,
    split: 'S(x)=0',
    remainder: 'E(x)=R(x)',
    remainderLabel: 'E(x)=R(x)',
    remainderEqualsMain: true,
    verticals,
    zeros: [],
    guide: { type: 'horizontal', value: 0, label: 'y=0' },
    warning,
    f: (x) => A / ((x - c) * (x - d)),
    s: () => 0,
    e: (x) => A / ((x - c) * (x - d)),
    stats: [
      '水平漸近線：y=0',
      `垂直漸近線：${verticals.map((v) => `x=${fmt(v)}`).join('，')}`,
      '餘式項：E(x)=R(x)',
      '狀態：非斜漸近線',
    ],
    formulas: [
      `R(x)=${fmt(A)}/[(x-${fmt(c)})(x-${fmt(d)})]`,
      'deg P < deg Q',
      'lim R(x)=0',
      '此模式用來對照斜漸近線',
    ],
  };
}

function quadraticRoots(A: number, B: number, C: number): number[] {
  if (Math.abs(A) < 1e-10) {
    if (Math.abs(B) < 1e-10) return [];
    return [-C / B];
  }

  const disc = B * B - 4 * A * C;
  if (disc < -1e-10) return [];
  if (Math.abs(disc) < 1e-10) return [-B / (2 * A)];

  const root = Math.sqrt(Math.max(0, disc));
  return [(-B - root) / (2 * A), (-B + root) / (2 * A)];
}

function safeNonzero(v: number, minAbs: number): number {
  if (Math.abs(v) >= minAbs) return v;
  return v < 0 ? -minAbs : minAbs;
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < RATIONAL_OBLIQUE_CONFIG.collisionTol;
}

function clampY(y: number, yMin: number, yMax: number): number {
  if (!Number.isFinite(y)) return y > 0 ? yMax : yMin;
  return clamp(y, yMin, yMax);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
