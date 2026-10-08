import type { CurvePoint, ThumbnailPath, ThumbnailSpec } from '../../types';

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

const ASYMPTOTE_PRESET_EN: Record<
  RationalAsymptotePresetId,
  { label: string; modeName: string; note: string }
> = {
  factor: { label: 'Factors', modeName: 'Factor form', note: 'R(x)=A(x-r)/(x-a)' },
  hole: {
    label: 'Hole',
    modeName: 'Removable discontinuity',
    note: 'A cancelled common factor leaves a hole',
  },
  proper: { label: 'm<n', modeName: 'Lower numerator degree', note: 'Approaches y=0 far away' },
  equal: {
    label: 'm=n',
    modeName: 'Equal degrees',
    note: 'Approaches the leading-coefficient ratio',
  },
  higher: { label: 'm>n', modeName: 'Higher numerator degree', note: 'No horizontal asymptote' },
};

const ASYMPTOTE_PARAM_EN: Record<RationalAsymptoteParamKey, string> = {
  A: 'Scale A',
  r: 'Zero r',
  a: 'Asymptote a',
  h: 'Hole h / second root',
  b: 'Height b',
  c: 'Slope c',
};

/** Display only. Omitted locale keeps the Chinese text. */
export function asymptotePresetText(preset: RationalAsymptotePreset, locale?: 'en') {
  if (locale !== 'en') return { label: preset.label, modeName: preset.modeName, note: preset.note };
  return ASYMPTOTE_PRESET_EN[preset.id];
}

/** Display only. Omitted locale keeps the Chinese text. */
export function asymptoteParamLabel(key: RationalAsymptoteParamKey, locale?: 'en') {
  if (locale !== 'en') return RATIONAL_ASYMPTOTE_PARAM_META[key].label;
  return ASYMPTOTE_PARAM_EN[key];
}

function t(zh: string, en: string, locale?: 'en') {
  return locale === 'en' ? en : zh;
}

function joinXs(xs: number[], locale?: 'en') {
  return xs.map((value) => `x=${fmt(value)}`).join(locale === 'en' ? ', ' : '，');
}

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
  locale?: 'en',
): RationalAsymptoteModel {
  if (preset.id === 'hole') return buildHoleModel(params, locale);
  if (preset.id === 'proper') return buildProperModel(params, locale);
  if (preset.id === 'equal') return buildEqualDegreeModel(params, locale);
  if (preset.id === 'higher') return buildHigherDegreeModel(params, locale);
  return buildFactorModel(params, locale);
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
  const paths: ThumbnailPath[] = buildCurveSegments(model).map((segment) => ({
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

function buildFactorModel(p: RationalAsymptoteParams, locale?: 'en'): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const { r, a } = p;
  const removable = nearlyEqual(r, a);
  const verticals = removable ? [] : [a];
  const holes = removable ? [{ x: a, y: A }] : [];
  const zeros = removable ? [] : [r];

  return {
    family: t('因式參數', 'Factor form', locale),
    expression: `R(x)=${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
    degreeText: 'm=n',
    horizontal: { exists: true, value: A, label: `y=${fmt(A)}` },
    verticals,
    holes,
    zeros,
    warning: removable ? t('r≈a：約分邊界，顯示為洞', 'r≈a: cancellation boundary, shown as a hole', locale) : '',
    f: (x) => (A * (x - r)) / (x - a),
    stats: [
      t(`零點：${removable ? '無' : `x=${fmt(r)}`}`, `Zero: ${removable ? 'none' : `x=${fmt(r)}`}`, locale),
      t(
        `垂直漸近線：${removable ? '無' : `x=${fmt(a)}`}`,
        `Vertical asymptote: ${removable ? 'none' : `x=${fmt(a)}`}`,
        locale,
      ),
      t(`水平漸近線：y=${fmt(A)}`, `Horizontal asymptote: y=${fmt(A)}`, locale),
      removable ? t(`洞：x=${fmt(a)}`, `Hole: x=${fmt(a)}`, locale) : t('洞：無', 'Hole: none', locale),
    ],
    formulas: [
      `R(x)=${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
      t('deg P = deg Q ⇒ 水平漸近線', 'deg P = deg Q ⇒ horizontal asymptote', locale),
      `lim R(x) = ${fmt(A)}`,
      removable
        ? t('分子分母同根 ⇒ 洞', 'Shared root ⇒ hole', locale)
        : t('分母為 0 且分子非 0 ⇒ 垂直漸近線', 'Denominator 0 and numerator not 0 ⇒ vertical asymptote', locale),
    ],
  };
}

function buildHoleModel(p: RationalAsymptoteParams, locale?: 'en'): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const { r, a } = p;
  const h = p.h;
  const holeCollides = nearlyEqual(h, a);
  const holes = holeCollides ? [] : [{ x: h, y: (A * (h - r)) / (h - a) }];
  const zeros = nearAny(r, [a, h]) ? [] : [r];

  return {
    family: t('可去不連續', 'Removable discontinuity', locale),
    expression: `R(x)=${fmt(A)}(x-${fmt(r)})(x-${fmt(h)})/[(x-${fmt(a)})(x-${fmt(h)})]`,
    degreeText: t('約簡後 m=n', 'After cancellation m=n', locale),
    horizontal: { exists: true, value: A, label: `y=${fmt(A)}` },
    verticals: [a],
    holes,
    zeros,
    warning: holeCollides ? t('h 與 a 太接近：暫停洞標記', 'h and a are too close: hole mark paused', locale) : '',
    f: (x) => (A * (x - r)) / (x - a),
    stats: [
      t(`零點：${zeros.length ? `x=${fmt(zeros[0]!)}` : '無'}`, `Zero: ${zeros.length ? `x=${fmt(zeros[0]!)}` : 'none'}`, locale),
      t(
        `洞：${holeCollides ? '暫停顯示' : `x=${fmt(h)}`}`,
        `Hole: ${holeCollides ? 'mark paused' : `x=${fmt(h)}`}`,
        locale,
      ),
      t(`垂直漸近線：x=${fmt(a)}`, `Vertical asymptote: x=${fmt(a)}`, locale),
      t(`水平漸近線：y=${fmt(A)}`, `Horizontal asymptote: y=${fmt(A)}`, locale),
    ],
    formulas: [
      t(
        `約簡後：${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
        `After cancellation: ${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
        locale,
      ),
      t(`被約去因式：x-${fmt(h)}`, `Cancelled factor: x-${fmt(h)}`, locale),
      t(`遠處高度：y=${fmt(A)}`, `Far height: y=${fmt(A)}`, locale),
      holeCollides
        ? t('h≈a 時洞與漸近線語意衝突', 'h≈a: the hole and the asymptote conflict', locale)
        : t('共同因式位置留下洞', 'The common factor leaves a hole', locale),
    ],
  };
}

function buildProperModel(p: RationalAsymptoteParams, locale?: 'en'): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const a = p.a;
  let h = p.h;
  if (nearlyEqual(h, a)) h = a + RATIONAL_ASYMPTOTE_CONFIG.collisionTol * 2.2;
  const verticals = [a, h].sort((x, y) => x - y);

  return {
    family: t('分子次數較低', 'Lower numerator degree', locale),
    expression: `R(x)=${fmt(A)}/[(x-${fmt(a)})(x-${fmt(h)})]`,
    degreeText: 'm<n',
    horizontal: { exists: true, value: 0, label: 'y=0' },
    verticals,
    holes: [],
    zeros: [],
    warning: '',
    f: (x) => A / ((x - a) * (x - h)),
    stats: [
      t('零點：無', 'Zero: none', locale),
      t(`垂直漸近線：${joinXs(verticals, locale)}`, `Vertical asymptote: ${joinXs(verticals, locale)}`, locale),
      t('水平漸近線：y=0', 'Horizontal asymptote: y=0', locale),
      t('次數：m<n', 'Degrees: m<n', locale),
    ],
    formulas: [
      `R(x)=${fmt(A)}/[(x-${fmt(a)})(x-${fmt(h)})]`,
      'deg P < deg Q',
      'lim R(x)=0',
      t('遠處貼近 x 軸', 'Far away it hugs the x-axis', locale),
    ],
  };
}

function buildEqualDegreeModel(p: RationalAsymptoteParams, locale?: 'en'): RationalAsymptoteModel {
  const A = safeNonzero(p.A, 0.12);
  const { a, b } = p;
  const zero = Math.abs(b) < 1e-8 ? null : a - A / b;
  const zeros = zero !== null && Number.isFinite(zero) && !nearlyEqual(zero, a) ? [zero] : [];

  return {
    family: t('同次數', 'Equal degrees', locale),
    expression: `R(x)=${fmt(b)}+${fmt(A)}/(x-${fmt(a)})`,
    degreeText: 'm=n',
    horizontal: { exists: true, value: b, label: `y=${fmt(b)}` },
    verticals: [a],
    holes: [],
    zeros,
    warning: '',
    f: (x) => b + A / (x - a),
    stats: [
      t(
        `零點：${zeros.length ? `x=${fmt(zeros[0]!)}` : '無或在視窗外'}`,
        `Zero: ${zeros.length ? `x=${fmt(zeros[0]!)}` : 'none or outside the window'}`,
        locale,
      ),
      t(`垂直漸近線：x=${fmt(a)}`, `Vertical asymptote: x=${fmt(a)}`, locale),
      t(`水平漸近線：y=${fmt(b)}`, `Horizontal asymptote: y=${fmt(b)}`, locale),
      t('次數：m=n', 'Degrees: m=n', locale),
    ],
    formulas: [
      `R(x)=${fmt(b)}+${fmt(A)}/(x-${fmt(a)})`,
      'deg P = deg Q',
      `lim R(x) = ${fmt(b)}`,
      t('首項係數比給水平高度', 'The leading-coefficient ratio sets the horizontal height', locale),
    ],
  };
}

function buildHigherDegreeModel(p: RationalAsymptoteParams, locale?: 'en'): RationalAsymptoteModel {
  const { a, b } = p;
  const c = safeNonzero(p.c, 0.12);
  const zeros = quadraticRoots(c, b - 2 * c * a, c * a * a - a * b + 1).filter((z) => !nearlyEqual(z, a));

  return {
    family: t('分子次數較高', 'Higher numerator degree', locale),
    expression: `R(x)=${fmt(c)}(x-${fmt(a)})+${fmt(b)}+1/(x-${fmt(a)})`,
    degreeText: 'm>n',
    horizontal: { exists: false, value: null, label: t('無水平漸近線', 'No horizontal asymptote', locale) },
    oblique: { m: c, b: b - c * a, label: `y=${fmt(c)}x+${fmt(b - c * a)}` },
    verticals: [a],
    holes: [],
    zeros,
    warning: t(
      'm>n：本頁只標示無水平漸近線',
      'm>n: this page only marks that there is no horizontal asymptote',
      locale,
    ),
    f: (x) => c * (x - a) + b + 1 / (x - a),
    stats: [
      t(
        `零點：${zeros.length ? joinXs(zeros, locale) : '無或在視窗外'}`,
        `Zero: ${zeros.length ? joinXs(zeros, locale) : 'none or outside the window'}`,
        locale,
      ),
      t(`垂直漸近線：x=${fmt(a)}`, `Vertical asymptote: x=${fmt(a)}`, locale),
      t('水平漸近線：無', 'Horizontal asymptote: none', locale),
      t('次數：m>n', 'Degrees: m>n', locale),
    ],
    formulas: [
      `R(x)=${fmt(c)}(x-${fmt(a)})+${fmt(b)}+1/(x-${fmt(a)})`,
      'deg P > deg Q',
      t('水平漸近線不存在', 'No horizontal asymptote', locale),
      t('若差 1，可另讀斜漸近線', 'If the gap is 1, read an oblique asymptote', locale),
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
