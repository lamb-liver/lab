import type { CurvePoint, ThumbnailSpec } from '../../types';

export type RationalAsymptotePresetId = 'factor' | 'hole' | 'proper' | 'equal' | 'higher';

export type RationalAsymptotePreset = {
  id: RationalAsymptotePresetId;
  label: string;
  modeName: string;
  note: string;
  params: RationalAsymptoteParams;
  basicKeys: RationalAsymptoteParamKey[];
  advancedKeys: RationalAsymptoteParamKey[];
};

export type RationalAsymptoteParamKey = 'A' | 'r' | 'a' | 'h' | 'b' | 'c';

export type RationalAsymptoteParams = Record<RationalAsymptoteParamKey, number>;

export type RationalAsymptoteModel = {
  family: string;
  expression: string;
  degreeText: string;
  horizontal: { exists: true; value: number; label: string } | { exists: false; value: null; label: string };
  oblique?: { m: number; b: number; label: string };
  verticals: number[];
  holes: Array<{ x: number; y: number }>;
  zeros: number[];
  warning: string;
  f: (x: number) => number;
  stats: string[];
  formulas: string[];
};

export type GraphRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const RATIONAL_ASYMPTOTE_CONFIG = {
  xMin: -4,
  xMax: 4,
  yMin: -6,
  yMax: 6,
  sampleN: 640,
  gapPx: 28,
  poleEpsRatio: 0.0035,
  collisionTol: 0.035,
  localHalfWidth: 0.72,
  localYMin: -10,
  localYMax: 10,
} as const;

export const RATIONAL_ASYMPTOTE_PARAM_META = {
  A: { label: '倍率 A', min: -3, max: 3, step: 0.01 },
  r: { label: '零點 r', min: -3.2, max: 3.2, step: 0.01 },
  a: { label: '漸近線 a', min: -3.2, max: 3.2, step: 0.01 },
  h: { label: '洞 h / 第二根', min: -3.2, max: 3.2, step: 0.01 },
  b: { label: '高度 b', min: -3, max: 3, step: 0.01 },
  c: { label: '斜率 c', min: -2.2, max: 2.2, step: 0.01 },
} satisfies Record<RationalAsymptoteParamKey, { label: string; min: number; max: number; step: number }>;

export const RATIONAL_ASYMPTOTE_PRESETS: RationalAsymptotePreset[] = [
  {
    id: 'factor',
    label: '因式',
    modeName: '因式參數',
    note: 'R(x)=A(x-r)/(x-a)',
    params: { A: 1.35, r: -1.25, a: 1.1, h: -0.2, b: 1, c: 1 },
    basicKeys: ['A', 'r', 'a'],
    advancedKeys: [],
  },
  {
    id: 'hole',
    label: '洞',
    modeName: '可去不連續',
    note: '共同因式約去後留下洞',
    params: { A: 1.2, r: -1.6, a: 1.35, h: 0.25, b: 1, c: 1 },
    basicKeys: ['A', 'r', 'a'],
    advancedKeys: ['h'],
  },
  {
    id: 'proper',
    label: 'm<n',
    modeName: '分子次數較低',
    note: '遠處趨近 y=0',
    params: { A: 2, r: 0, a: -1.15, h: 1.55, b: 1, c: 1 },
    basicKeys: ['A', 'a'],
    advancedKeys: ['h'],
  },
  {
    id: 'equal',
    label: 'm=n',
    modeName: '同次數',
    note: '遠處趨近首項係數比',
    params: { A: 1.6, r: 0, a: -0.9, h: 0.5, b: 1.2, c: 1 },
    basicKeys: ['A', 'a', 'b'],
    advancedKeys: [],
  },
  {
    id: 'higher',
    label: 'm>n',
    modeName: '分子次數較高',
    note: '沒有水平漸近線',
    params: { A: 1, r: 0, a: -1.2, h: 0.5, b: 0.3, c: 1 },
    basicKeys: ['a', 'b', 'c'],
    advancedKeys: [],
  },
];

export function presetById(id: string): RationalAsymptotePreset {
  return RATIONAL_ASYMPTOTE_PRESETS.find((preset) => preset.id === id) ?? RATIONAL_ASYMPTOTE_PRESETS[0]!;
}

export function presetIdFromIndex(index: number): RationalAsymptotePresetId {
  return RATIONAL_ASYMPTOTE_PRESETS[Math.round(index)]?.id ?? 'factor';
}

export function presetIndexFromId(id: RationalAsymptotePresetId): number {
  return Math.max(0, RATIONAL_ASYMPTOTE_PRESETS.findIndex((preset) => preset.id === id));
}

export function valuesFromParams(presetId: RationalAsymptotePresetId, params: RationalAsymptoteParams): Record<string, number> {
  return {
    preset: presetIndexFromId(presetId),
    A: params.A,
    r: params.r,
    a: params.a,
    h: params.h,
    b: params.b,
    c: params.c,
  };
}

export function paramsFromValues(values: Record<string, number>): { presetId: RationalAsymptotePresetId; params: RationalAsymptoteParams } {
  const presetId = presetIdFromIndex(values.preset ?? 0);
  const preset = presetById(presetId);
  return {
    presetId,
    params: {
      A: values.A ?? preset.params.A,
      r: values.r ?? preset.params.r,
      a: values.a ?? preset.params.a,
      h: values.h ?? preset.params.h,
      b: values.b ?? preset.params.b,
      c: values.c ?? preset.params.c,
    },
  };
}

export function buildRationalAsymptoteModel(
  preset: RationalAsymptotePreset,
  params: RationalAsymptoteParams,
): RationalAsymptoteModel {
  if (preset.id === 'hole') return buildHoleModel(params);
  if (preset.id === 'proper') return buildProperModel(params);
  if (preset.id === 'equal') return buildEqualDegreeModel(params);
  if (preset.id === 'higher') return buildHigherDegreeModel(params);
  return buildFactorModel(params);
}

export function createRationalAsymptotePlotRect(size: number): GraphRect {
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
  const { xMin, xMax } = RATIONAL_ASYMPTOTE_CONFIG;
  return g.x + ((x - xMin) / (xMax - xMin)) * g.w;
}

export function yToScreen(g: GraphRect, y: number, yMin = RATIONAL_ASYMPTOTE_CONFIG.yMin, yMax = RATIONAL_ASYMPTOTE_CONFIG.yMax): number {
  return g.y + g.h - ((y - yMin) / (yMax - yMin)) * g.h;
}

export function yToScreenClamped(g: GraphRect, y: number, yMin = RATIONAL_ASYMPTOTE_CONFIG.yMin, yMax = RATIONAL_ASYMPTOTE_CONFIG.yMax): number {
  return yToScreen(g, clampY(y, yMin, yMax), yMin, yMax);
}

export function buildCurveSegments(
  model: RationalAsymptoteModel,
): Array<Array<{ x: number; y: number }>> {
  const { xMin, xMax, yMin, yMax, sampleN, poleEpsRatio } = RATIONAL_ASYMPTOTE_CONFIG;
  const poleEps = (xMax - xMin) * poleEpsRatio;
  const segments: Array<Array<{ x: number; y: number }>> = [];
  let current: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= sampleN; i += 1) {
    const x = lerp(xMin, xMax, i / sampleN);
    const closeToPole = model.verticals.some((v) => Math.abs(x - v) < poleEps);
    const y = model.f(x);
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

export function buildRationalAsymptoteThumbnail(
  presetId: RationalAsymptotePresetId,
  params: RationalAsymptoteParams,
): ThumbnailSpec {
  const model = buildRationalAsymptoteModel(presetById(presetId), params);
  const paths = buildCurveSegments(model).map((segment) => ({
    points: segment.map((point, index): CurvePoint => ({
      x: point.x,
      y: point.y,
      theta: index,
      arcLength: index,
    })),
    stroke: '#d4b87a',
    strokeWidth: 1.4,
  }));

  if (model.horizontal.exists) {
    paths.push({
      points: [
        { x: RATIONAL_ASYMPTOTE_CONFIG.xMin, y: model.horizontal.value, theta: 0, arcLength: 0 },
        { x: RATIONAL_ASYMPTOTE_CONFIG.xMax, y: model.horizontal.value, theta: 1, arcLength: 1 },
      ],
      stroke: '#5dade2',
      strokeWidth: 0.8,
      opacity: 0.55,
      excludeFromBbox: true,
    });
  }

  for (const a of model.verticals) {
    paths.push({
      points: [
        { x: a, y: RATIONAL_ASYMPTOTE_CONFIG.yMin, theta: 0, arcLength: 0 },
        { x: a, y: RATIONAL_ASYMPTOTE_CONFIG.yMax, theta: 1, arcLength: 1 },
      ],
      stroke: '#e76f51',
      strokeWidth: 0.8,
      opacity: 0.5,
      excludeFromBbox: true,
    });
  }

  return { paths };
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const next = Math.abs(n) < 0.005 ? 0 : n;
  return next.toFixed(2);
}

function buildFactorModel(p: RationalAsymptoteParams): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const { r, a } = p;
  const removable = nearlyEqual(r, a);
  const verticals = removable ? [] : [a];
  const holes = removable ? [{ x: a, y: A }] : [];
  const zeros = removable ? [] : [r];

  return {
    family: '因式參數',
    expression: `R(x)=${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
    degreeText: 'm=n',
    horizontal: { exists: true, value: A, label: `y=${fmt(A)}` },
    verticals,
    holes,
    zeros,
    warning: removable ? 'r≈a：約分邊界，顯示為洞' : '',
    f: (x) => (A * (x - r)) / (x - a),
    stats: [
      `零點：${removable ? '無' : `x=${fmt(r)}`}`,
      `垂直漸近線：${removable ? '無' : `x=${fmt(a)}`}`,
      `水平漸近線：y=${fmt(A)}`,
      removable ? `洞：x=${fmt(a)}` : '洞：無',
    ],
    formulas: [
      `R(x)=${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
      'deg P = deg Q ⇒ 水平漸近線',
      `lim R(x) = ${fmt(A)}`,
      removable ? '分子分母同根 ⇒ 洞' : '分母為 0 且分子非 0 ⇒ 垂直漸近線',
    ],
  };
}

function buildHoleModel(p: RationalAsymptoteParams): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const { r, a } = p;
  const h = p.h;
  const holeCollides = nearlyEqual(h, a);
  const holes = holeCollides ? [] : [{ x: h, y: (A * (h - r)) / (h - a) }];
  const zeros = nearAny(r, [a, h]) ? [] : [r];

  return {
    family: '可去不連續',
    expression: `R(x)=${fmt(A)}(x-${fmt(r)})(x-${fmt(h)})/[(x-${fmt(a)})(x-${fmt(h)})]`,
    degreeText: '約簡後 m=n',
    horizontal: { exists: true, value: A, label: `y=${fmt(A)}` },
    verticals: [a],
    holes,
    zeros,
    warning: holeCollides ? 'h 與 a 太接近：暫停洞標記' : '',
    f: (x) => (A * (x - r)) / (x - a),
    stats: [
      `零點：${zeros.length ? `x=${fmt(zeros[0]!)}` : '無'}`,
      `洞：${holeCollides ? '暫停顯示' : `x=${fmt(h)}`}`,
      `垂直漸近線：x=${fmt(a)}`,
      `水平漸近線：y=${fmt(A)}`,
    ],
    formulas: [
      `約簡後：${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
      `被約去因式：x-${fmt(h)}`,
      `遠處高度：y=${fmt(A)}`,
      holeCollides ? 'h≈a 時洞與漸近線語意衝突' : '共同因式位置留下洞',
    ],
  };
}

function buildProperModel(p: RationalAsymptoteParams): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const a = p.a;
  let h = p.h;
  if (nearlyEqual(h, a)) h = a + RATIONAL_ASYMPTOTE_CONFIG.collisionTol * 2.2;
  const verticals = [a, h].sort((x, y) => x - y);

  return {
    family: '分子次數較低',
    expression: `R(x)=${fmt(A)}/[(x-${fmt(a)})(x-${fmt(h)})]`,
    degreeText: 'm<n',
    horizontal: { exists: true, value: 0, label: 'y=0' },
    verticals,
    holes: [],
    zeros: [],
    warning: '',
    f: (x) => A / ((x - a) * (x - h)),
    stats: [
      '零點：無',
      `垂直漸近線：${verticals.map((v) => `x=${fmt(v)}`).join('，')}`,
      '水平漸近線：y=0',
      '次數：m<n',
    ],
    formulas: [
      `R(x)=${fmt(A)}/[(x-${fmt(a)})(x-${fmt(h)})]`,
      'deg P < deg Q',
      'lim R(x)=0',
      '遠處貼近 x 軸',
    ],
  };
}

function buildEqualDegreeModel(p: RationalAsymptoteParams): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const { a, b } = p;
  const zero = Math.abs(b) < 1e-8 ? null : a - A / b;
  const zeros = zero !== null && Number.isFinite(zero) && !nearlyEqual(zero, a) ? [zero] : [];

  return {
    family: '同次數',
    expression: `R(x)=${fmt(b)}+${fmt(A)}/(x-${fmt(a)})`,
    degreeText: 'm=n',
    horizontal: { exists: true, value: b, label: `y=${fmt(b)}` },
    verticals: [a],
    holes: [],
    zeros,
    warning: '',
    f: (x) => b + A / (x - a),
    stats: [
      `零點：${zeros.length ? `x=${fmt(zeros[0]!)}` : '無或在視窗外'}`,
      `垂直漸近線：x=${fmt(a)}`,
      `水平漸近線：y=${fmt(b)}`,
      '次數：m=n',
    ],
    formulas: [
      `R(x)=${fmt(b)}+${fmt(A)}/(x-${fmt(a)})`,
      'deg P = deg Q',
      `lim R(x) = ${fmt(b)}`,
      '首項係數比給水平高度',
    ],
  };
}

function buildHigherDegreeModel(p: RationalAsymptoteParams): RationalAsymptoteModel {
  const { a, b } = p;
  const c = safeNonzero(p.c, 0.12);
  const zeros = quadraticRoots(c, b - 2 * c * a, c * a * a - a * b + 1).filter((z) => !nearlyEqual(z, a));

  return {
    family: '分子次數較高',
    expression: `R(x)=${fmt(c)}(x-${fmt(a)})+${fmt(b)}+1/(x-${fmt(a)})`,
    degreeText: 'm>n',
    horizontal: { exists: false, value: null, label: '無水平漸近線' },
    oblique: { m: c, b: b - c * a, label: `y=${fmt(c)}x+${fmt(b - c * a)}` },
    verticals: [a],
    holes: [],
    zeros,
    warning: 'm>n：本頁只標示無水平漸近線',
    f: (x) => c * (x - a) + b + 1 / (x - a),
    stats: [
      `零點：${zeros.length ? zeros.map((z) => `x=${fmt(z)}`).join('，') : '無或在視窗外'}`,
      `垂直漸近線：x=${fmt(a)}`,
      '水平漸近線：無',
      '次數：m>n',
    ],
    formulas: [
      `R(x)=${fmt(c)}(x-${fmt(a)})+${fmt(b)}+1/(x-${fmt(a)})`,
      'deg P > deg Q',
      '水平漸近線不存在',
      '若差 1，可另讀斜漸近線',
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
  return Math.abs(a - b) < RATIONAL_ASYMPTOTE_CONFIG.collisionTol;
}

function nearAny(x: number, xs: number[]): boolean {
  return xs.some((v) => nearlyEqual(x, v));
}

function clampY(y: number, yMin: number, yMax: number): number {
  if (!Number.isFinite(y)) return y > 0 ? yMax : yMin;
  return clamp(y, yMin, yMax);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
