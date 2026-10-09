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

export type GuideParams = {
  phase: number;
};

export type WaveMode = 'guide' | 'superposition' | 'beat';

type GuideState = {
  zone: 'inPhase' | 'quadrature' | 'antiPhase' | 'mixed';
  summary: string;
  displacementLabel: string;
  standingLabel: string;
  fringeLabel: string;
};

function clampPhase(phase: number): number {
  if (!Number.isFinite(phase)) return 0;
  return Math.max(0, Math.min(1, phase));
}

/** Omitted locale stays Chinese. */
function uiText(zh: string, en: string, locale?: 'en'): string {
  return locale === 'en' ? en : zh;
}

export function getGuideState(params: GuideParams, locale?: 'en'): GuideState {
  const phase = clampPhase(params.phase);

  if (phase <= 0.12) {
    return {
      zone: 'inPhase',
      summary: uiText(
        '同相：位移增強、節點基準、亮紋對齊',
        'In phase: displacement adds, nodes at the reference, bright fringe at the center',
        locale,
      ),
      displacementLabel: uiText('同相增強', 'In phase, adds', locale),
      standingLabel: uiText('節點在基準位置', 'Nodes at the reference', locale),
      fringeLabel: uiText('亮紋對齊中心', 'Bright fringe at the center', locale),
    };
  }

  if (Math.abs(phase - 0.5) <= 0.12) {
    return {
      zone: 'quadrature',
      summary: uiText(
        '正交：位移部分抵消、節點與條紋平移',
        'A quarter cycle apart: displacement partly cancels, nodes and fringes shift',
        locale,
      ),
      displacementLabel: uiText('部分抵消', 'Partly cancels', locale),
      standingLabel: uiText('節點平移', 'Nodes shift', locale),
      fringeLabel: uiText('條紋平移', 'Fringes shift', locale),
    };
  }

  if (phase >= 0.88) {
    return {
      zone: 'antiPhase',
      summary: uiText(
        '反相：位移抵消、節點位移半格、暗紋對齊',
        'Opposite phase: displacement cancels, nodes shift half a spacing, dark fringe at the center',
        locale,
      ),
      displacementLabel: uiText('反相抵消', 'Opposite phase, cancels', locale),
      standingLabel: uiText('節點位移半格', 'Nodes shift half a spacing', locale),
      fringeLabel: uiText('暗紋對齊中心', 'Dark fringe at the center', locale),
    };
  }

  return {
    zone: 'mixed',
    summary: uiText(
      '混合相位：增強與抵消在空間中交錯',
      'Mixed phase: reinforcement and cancellation alternate in space',
      locale,
    ),
    displacementLabel: uiText('混合增減', 'Mixed reinforcement and cancellation', locale),
    standingLabel: uiText('節點連續平移', 'Nodes shift continuously', locale),
    fringeLabel: uiText('亮暗條紋連續平移', 'Bright and dark fringes shift continuously', locale),
  };
}

export function describeSuperposition(params: SuperpositionParams, locale?: 'en'): string {
  const { fA, fB, pA, pB } = params;
  const df = Math.abs(fA - fB);
  const dp = Math.abs(pA - pB);
  if (df < 0.06 && dp < 0.06) {
    return uiText('完全建設性干涉 ✦', 'Fully constructive interference ✦', locale);
  }
  if (df < 0.06 && Math.abs(dp - 1) < 0.12) {
    return uiText('完全破壞性干涉 ✦', 'Fully destructive interference ✦', locale);
  }
  if (df < 0.2) {
    return uiText('接近同頻 — 強度調變', 'Nearly the same frequency — intensity modulates', locale);
  }
  return uiText('一般疊加', 'General superposition', locale);
}

export function describeBeat(params: BeatParams, locale?: 'en'): string {
  const df = Math.abs(params.fA - params.fB);
  const value = `|f₁ − f₂| = ${df.toFixed(2)} Hz`;
  return locale === 'en' ? `Beat frequency = ${value}` : `拍頻 = ${value}`;
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
