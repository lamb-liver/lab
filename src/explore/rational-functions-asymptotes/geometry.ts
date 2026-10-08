import {
  RATIONAL_COLLISION_TOL,
  RATIONAL_PARAM_META,
  RATIONAL_PRESETS,
  RATIONAL_X_MAX,
  RATIONAL_X_MIN,
} from './constants';
import type {
  RationalModel,
  RationalParamKey,
  RationalParams,
  RationalPreset,
  RationalPresetId,
  Rect,
} from './types';

const PRESET_EN: Record<RationalPresetId, { label: string; note: string }> = {
  factor: {
    label: 'Factors',
    note: 'The zero, the vertical asymptote, and the horizontal asymptote are all visible',
  },
  hole: {
    label: 'Hole',
    note: 'After a shared root is cancelled, the main graph keeps one hole',
  },
  reciprocal: {
    label: 'Horizontal',
    note: 'A remainder of lower degree, approaching a horizontal line far away',
  },
  oblique: {
    label: 'Oblique asymptote',
    note: 'The linear quotient S(x)=mx+b is the far skeleton',
  },
};

const PARAM_EN: Record<RationalParamKey, string> = {
  A: 'Scale A',
  r: 'Zero r',
  a: 'Asymptote a',
  h: 'Hole h',
  b: 'Shift b',
  m: 'Slope m',
  c: 'Remainder c',
};

/** Display only. Omitted locale keeps the Chinese text. */
export function rationalPresetText(preset: RationalPreset, locale?: 'en') {
  if (locale !== 'en') return { label: preset.label, note: preset.note };
  return PRESET_EN[preset.id];
}

/** Display only. Omitted locale keeps the Chinese text. */
export function rationalParamLabel(key: RationalParamKey, locale?: 'en') {
  if (locale !== 'en') return RATIONAL_PARAM_META[key].label;
  return PARAM_EN[key];
}

function t(zh: string, en: string, locale?: 'en') {
  return locale === 'en' ? en : zh;
}

function joinXs(xs: string[], locale?: 'en') {
  return xs.join(locale === 'en' ? ', ' : '，');
}

export function presetById(id: RationalPresetId): RationalPreset {
  return RATIONAL_PRESETS.find((preset) => preset.id === id) ?? RATIONAL_PRESETS[0]!;
}

export function buildRationalModel(
  preset: RationalPreset,
  params: RationalParams,
  locale?: 'en',
): RationalModel {
  if (preset.id === 'factor') return buildFactorModel(params, false, locale);
  if (preset.id === 'hole') return buildFactorModel(params, true, locale);
  if (preset.id === 'reciprocal') return buildReciprocalModel(params, locale);
  if (preset.id === 'oblique') return buildObliqueModel(params, locale);
  return buildFactorModel(params, false, locale);
}

export function measureRationalExploreCanvas(host: HTMLElement): { width: number; height: number } {
  const width = Math.max(320, Math.floor(host.clientWidth || 720));
  const height = clamp(Math.round(width * 0.66), 360, 620);
  return { width, height };
}

export function createRationalPlotRect(width: number, height: number): Rect {
  const padX = Math.min(64, Math.max(38, width * 0.08));
  const padTop = 58;
  const padBottom = 44;
  return {
    x: padX,
    y: padTop,
    w: width - 2 * padX,
    h: height - padTop - padBottom,
  };
}

export function xToScreen(g: Rect, x: number): number {
  return g.x + ((x - RATIONAL_X_MIN) / (RATIONAL_X_MAX - RATIONAL_X_MIN)) * g.w;
}

export function yToScreen(g: Rect, y: number, preset: RationalPreset): number {
  return g.y + g.h - ((y - preset.yMin) / (preset.yMax - preset.yMin)) * g.h;
}

export function yToScreenClamped(g: Rect, y: number, preset: RationalPreset): number {
  return yToScreen(g, clampY(y, preset), preset);
}

function clampY(y: number, preset: RationalPreset): number {
  if (!Number.isFinite(y)) return y > 0 ? preset.yMax : preset.yMin;
  return clamp(y, preset.yMin, preset.yMax);
}

export function buildStatusLines(model: RationalModel, locale?: 'en'): string[] {
  const zeros = model.zeros.length
    ? joinXs(model.zeros.map((z) => `x=${fmt(z)}`), locale)
    : t('無或在視窗外', 'none or outside the window', locale);
  const holes = model.warning
    ? t('暫停顯示（h≈a）', 'mark paused (h≈a)', locale)
    : model.holes.length
      ? joinXs(model.holes.map((h) => `x=${fmt(h.x)}`), locale)
      : t('無', 'none', locale);
  const verticals = model.verticals.length
    ? joinXs(model.verticals.map((v) => `x=${fmt(v)}`), locale)
    : t('無', 'none', locale);

  return [
    t(`模式：${model.family}`, `Mode: ${model.family}`, locale),
    t(`零點：${zeros}`, `Zero: ${zeros}`, locale),
    t(`洞：${holes}`, `Hole: ${holes}`, locale),
    t(`垂直漸近線：${verticals}`, `Vertical asymptote: ${verticals}`, locale),
  ];
}

export function buildFormulaLines(model: RationalModel, locale?: 'en'): string[] {
  const holeList = joinXs(model.holes.map((h) => `x=${fmt(h.x)}`), locale);
  return [
    model.simplified,
    t(`遠處骨架：${model.far.label}`, `Far skeleton: ${model.far.label}`, locale),
    model.warning
      || (model.holes.length
        ? t(`可去不連續：${holeList}`, `Removable discontinuity: ${holeList}`, locale)
        : t('可去不連續：無', 'Removable discontinuity: none', locale)),
    t('先約分，再判斷零點與漸近線', 'Cancel first, then read zeros and asymptotes', locale),
  ];
}

export function buildAdvancedLines(model: RationalModel, locale?: 'en'): string[] {
  return [
    model.title,
    model.split,
    model.warning || t('垂直漸近線：約簡後分母為 0', 'Vertical asymptote: denominator is 0 after cancellation', locale),
    t('洞：被約去的共同因式位置', 'Hole: where a common factor was cancelled', locale),
  ];
}

export function roundParam(value: number): number {
  return Math.round(value * 100) / 100;
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const next = Math.abs(n) < 0.005 ? 0 : n;
  if (Math.abs(next) >= 1000) return next.toExponential(2);
  return next.toFixed(2);
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function buildFactorModel(params: RationalParams, hasHole: boolean, locale?: 'en'): RationalModel {
  const A = safeNonzero(params.A, 0.12);
  const r = params.r;
  const a = params.a;
  const h = params.h;
  const verticals = [a];
  const holes = [];
  const holeCollidesWithAsymptote = hasHole && nearlyEqual(h, a);
  const warning = holeCollidesWithAsymptote
    ? t('h 與 a 太接近：暫停洞標記', 'h and a are too close: hole mark paused', locale)
    : '';

  if (hasHole && !holeCollidesWithAsymptote) {
    holes.push({ x: h, y: evalFactor(A, r, a, h) });
  }

  const zeros = [];
  const hiddenXs = verticals.concat(holes.map((item) => item.x));
  if (!nearAny(r, hiddenXs)) zeros.push(r);

  const title = hasHole ? 'R(x)=A(x-r)(x-h)/[(x-a)(x-h)]' : 'R(x)=A(x-r)/(x-a)';
  const simplified = t(
    `約簡後：R(x)=${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
    `After cancellation: R(x)=${fmt(A)}(x-${fmt(r)})/(x-${fmt(a)})`,
    locale,
  );

  return {
    family: hasHole ? t('洞', 'Hole', locale) : t('因式', 'Factors', locale),
    title,
    simplified,
    far: { type: 'horizontal', label: `y=${fmt(A)}`, value: A },
    verticals,
    holes,
    zeros,
    warning,
    f: (x) => evalFactor(A, r, a, x),
    split: `R(x)=${fmt(A)} + ${fmt(A * (a - r))}/(x-${fmt(a)})`,
  };
}

function buildReciprocalModel(params: RationalParams, locale?: 'en'): RationalModel {
  const A = safeNonzero(params.A, 0.12);
  const a = params.a;
  const b = params.b;
  const zeros = [];
  if (Math.abs(b) > 1e-8) {
    const z = a - A / b;
    if (Number.isFinite(z) && !nearlyEqual(z, a)) zeros.push(z);
  }

  return {
    family: t('水平', 'Horizontal', locale),
    title: 'R(x)=b+A/(x-a)',
    simplified: `R(x)=${fmt(b)} + ${fmt(A)}/(x-${fmt(a)})`,
    far: { type: 'horizontal', label: `y=${fmt(b)}`, value: b },
    verticals: [a],
    holes: [],
    zeros,
    warning: '',
    f: (x) => b + A / (x - a),
    split: `R(x)-${fmt(b)}=${fmt(A)}/(x-${fmt(a)}) → 0`,
  };
}

function buildObliqueModel(params: RationalParams, locale?: 'en'): RationalModel {
  const m = params.m;
  const b = params.b;
  const c = safeNonzero(params.c, 0.12);
  const a = params.a;

  const zeros = quadraticRoots(m, b - m * a, c - a * b).filter((z) => !nearlyEqual(z, a));

  return {
    family: t('斜漸近線', 'Oblique asymptote', locale),
    title: 'R(x)=mx+b+c/(x-a)',
    simplified: `R(x)=(${fmt(m)})x+${fmt(b)}+${fmt(c)}/(x-${fmt(a)})`,
    far: { type: 'oblique', label: `y=${fmt(m)}x+${fmt(b)}`, m, b },
    verticals: [a],
    holes: [],
    zeros,
    warning: '',
    f: (x) => m * x + b + c / (x - a),
    split: `R(x)-S(x)=${fmt(c)}/(x-${fmt(a)}) → 0`,
  };
}

function evalFactor(A: number, r: number, a: number, x: number): number {
  return (A * (x - r)) / (x - a);
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
  return Math.abs(a - b) < RATIONAL_COLLISION_TOL;
}

function nearAny(x: number, xs: number[]): boolean {
  return xs.some((v) => nearlyEqual(x, v));
}
