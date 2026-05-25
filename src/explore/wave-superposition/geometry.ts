export type SuperpositionParams = {
  fA: number;
  aA: number;
  pA: number;
  fB: number;
  aB: number;
  pB: number;
};

export type BeatParams = {
  fA: number;
  fB: number;
};

export type WaveMode = 'superposition' | 'beat';

export function describeSuperposition(params: SuperpositionParams): string {
  const { fA, fB, pA, pB } = params;
  const df = Math.abs(fA - fB);
  const dp = Math.abs(pA - pB);
  if (df < 0.06 && dp < 0.06) return '完全建設性干涉 ✦';
  if (df < 0.06 && Math.abs(dp - 1) < 0.12) return '完全破壞性干涉 ✦';
  if (df < 0.2) return '接近同頻 — 強度調變';
  return '一般疊加';
}

export function describeBeat(params: BeatParams): string {
  const df = Math.abs(params.fA - params.fB);
  return `拍頻 = |f₁ − f₂| = ${df.toFixed(2)} Hz`;
}

export function waveA(
  nx: number,
  t: number,
  params: SuperpositionParams,
): number {
  const { fA, aA, pA } = params;
  return aA * Math.sin(2 * Math.PI * (fA * t - nx * 2) + pA * Math.PI);
}

export function waveB(
  nx: number,
  t: number,
  params: SuperpositionParams,
): number {
  const { fB, aB, pB } = params;
  return aB * Math.sin(2 * Math.PI * (fB * t - nx * 2) + pB * Math.PI);
}

export function waveSum(
  nx: number,
  t: number,
  params: SuperpositionParams,
): number {
  return (waveA(nx, t, params) + waveB(nx, t, params)) / 2;
}

export function beatWaveY(
  nx: number,
  t: number,
  params: BeatParams,
  xSpan: number,
): number {
  const s = nx * xSpan;
  return (
    Math.sin(2 * Math.PI * params.fA * (t + s)) +
    Math.sin(2 * Math.PI * params.fB * (t + s))
  ) / 2;
}

export function beatEnvelopeY(
  nx: number,
  t: number,
  params: BeatParams,
  xSpan: number,
): number {
  const s = nx * xSpan;
  return Math.abs(Math.cos(Math.PI * (params.fA - params.fB) * (t + s)));
}

export function beatXSpan(params: BeatParams): number {
  const beatPeriod = 1 / (Math.abs(params.fA - params.fB) || 0.01);
  return beatPeriod * 3;
}
