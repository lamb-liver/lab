import type { CurvePoint, ThumbnailSpec } from '../../types';

export const TAU = Math.PI * 2;

export const AMPLITUDE_MIN = -2;
export const AMPLITUDE_MAX = 2;
export const PERIOD_MIN = Math.PI;
export const PERIOD_MAX = Math.PI * 4;
export const PHASE_MIN = -Math.PI;
export const PHASE_MAX = Math.PI * 2;
export const VERTICAL_SHIFT_MIN = -1.5;
export const VERTICAL_SHIFT_MAX = 1.5;

export type GraphWorld = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

export type SinusoidAmplitudePeriodPhaseParams = {
  amplitude: number;
  period: number;
  phase: number;
  verticalShift: number;
  showGhost: boolean;
  showGuides: boolean;
};

export type ExtremumInfo = {
  x: number;
  y: number;
  visible: boolean;
};

export const SINUSOID_WORLD: GraphWorld = {
  xmin: -Math.PI,
  xmax: Math.PI * 4,
  ymin: -4,
  ymax: 4,
};

export const DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS: SinusoidAmplitudePeriodPhaseParams = {
  amplitude: 1.25,
  period: TAU,
  phase: 0,
  verticalShift: 0,
  showGhost: true,
  showGuides: true,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function numeric(value: unknown, fallback: number, min: number, max: number) {
  const next = Number(value ?? fallback);
  return clamp(Number.isFinite(next) ? next : fallback, min, max);
}

function flag(value: unknown, fallback: boolean) {
  if (value === undefined) return fallback;
  return value === true || value === 1;
}

export function asSinusoidAmplitudePeriodPhaseParams(
  params: Partial<SinusoidAmplitudePeriodPhaseParams> & Record<string, unknown>,
): SinusoidAmplitudePeriodPhaseParams {
  const raw = params as Record<string, unknown>;

  return {
    amplitude: numeric(
      raw.amplitude ?? raw.A,
      DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.amplitude,
      AMPLITUDE_MIN,
      AMPLITUDE_MAX,
    ),
    period: numeric(
      raw.period ?? raw.T,
      DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.period,
      PERIOD_MIN,
      PERIOD_MAX,
    ),
    phase: numeric(
      raw.phase ?? raw.phi,
      DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.phase,
      PHASE_MIN,
      PHASE_MAX,
    ),
    verticalShift: numeric(
      raw.verticalShift ?? raw.k,
      DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.verticalShift,
      VERTICAL_SHIFT_MIN,
      VERTICAL_SHIFT_MAX,
    ),
    showGhost: flag(
      raw.showGhost,
      DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.showGhost,
    ),
    showGuides: flag(
      raw.showGuides,
      DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.showGuides,
    ),
  };
}

export function hasAmplitude(params: SinusoidAmplitudePeriodPhaseParams) {
  return Math.abs(params.amplitude) >= 0.015;
}

export function omega(period: number) {
  return TAU / period;
}

export function baseSin(x: number) {
  return Math.sin(x);
}

export function transformedSin(x: number, params: SinusoidAmplitudePeriodPhaseParams) {
  return (
    params.amplitude * Math.sin(omega(params.period) * (x - params.phase)) +
    params.verticalShift
  );
}

function firstVisibleCycleX(rawX: number, period: number, world: GraphWorld) {
  let x = rawX;

  while (x < world.xmin) x += period;
  while (x - period >= world.xmin) x -= period;
  if (x > world.xmax) x -= period;

  return x;
}

export function peakInfo(
  params: SinusoidAmplitudePeriodPhaseParams,
  world: GraphWorld = SINUSOID_WORLD,
): ExtremumInfo {
  const phase = params.amplitude >= 0 ? Math.PI / 2 : Math.PI * 1.5;
  const x = firstVisibleCycleX(params.phase + (phase / TAU) * params.period, params.period, world);

  return {
    x,
    y: params.verticalShift + Math.abs(params.amplitude),
    visible: x >= world.xmin && x <= world.xmax,
  };
}

export function troughInfo(
  params: SinusoidAmplitudePeriodPhaseParams,
  world: GraphWorld = SINUSOID_WORLD,
): ExtremumInfo {
  const phase = params.amplitude >= 0 ? Math.PI * 1.5 : Math.PI / 2;
  const x = firstVisibleCycleX(params.phase + (phase / TAU) * params.period, params.period, world);

  return {
    x,
    y: params.verticalShift - Math.abs(params.amplitude),
    visible: x >= world.xmin && x <= world.xmax,
  };
}

export function periodBracketStart(
  params: SinusoidAmplitudePeriodPhaseParams,
  world: GraphWorld = SINUSOID_WORLD,
) {
  let start = params.phase;

  while (start < world.xmin) start += params.period;
  while (start + params.period > world.xmax && start - params.period >= world.xmin) {
    start -= params.period;
  }

  return start;
}

export function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 0.005) return '0';
  return Number(value.toFixed(digits)).toString();
}

export function formatRad(value: number) {
  const candidates = [
    [-Math.PI, '-π'],
    [-Math.PI / 2, '-π/2'],
    [0, '0'],
    [Math.PI / 6, 'π/6'],
    [Math.PI / 4, 'π/4'],
    [Math.PI / 3, 'π/3'],
    [Math.PI / 2, 'π/2'],
    [Math.PI, 'π'],
    [Math.PI * 1.5, '3π/2'],
    [TAU, '2π'],
    [Math.PI * 2.5, '5π/2'],
    [Math.PI * 3, '3π'],
    [Math.PI * 4, '4π'],
  ] as const;

  for (const [candidate, label] of candidates) {
    if (Math.abs(value - candidate) < 0.025) return label;
  }

  return fmt(value);
}

export function formatPeakText(
  params: SinusoidAmplitudePeriodPhaseParams,
  world: GraphWorld = SINUSOID_WORLD,
) {
  if (!hasAmplitude(params)) return 'A = 0：退化為中心線，無波峰';

  const peak = peakInfo(params, world);
  return `波峰 = (${formatRad(peak.x)}, ${fmt(peak.y)})`;
}

export function interpretationText(params: SinusoidAmplitudePeriodPhaseParams) {
  if (!hasAmplitude(params)) {
    return 'A = 0：函數退化為中心線 y = k，沒有真正的波峰與波谷。';
  }

  if (params.amplitude < 0) {
    return 'A < 0：圖形相對中心線 y = k 上下翻轉；|A| 控制振幅，T 控制水平重複間距，φ 與 k 控制平移。';
  }

  return 'A 控制垂直尺度，T 控制水平尺度，φ 控制水平平移，k 控制中心線高度。';
}

function toCurvePoint(x: number, y: number, theta: number, scaleX = 26, scaleY = 34): CurvePoint {
  return {
    x: (x - Math.PI * 1.5) * scaleX,
    y: -y * scaleY,
    theta,
    arcLength: Math.hypot((x - SINUSOID_WORLD.xmin) * scaleX, y * scaleY),
  };
}

export function buildSinusoidCurvePoints(
  params: SinusoidAmplitudePeriodPhaseParams,
  steps = 180,
): CurvePoint[] {
  const points: CurvePoint[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const x =
      SINUSOID_WORLD.xmin +
      ((SINUSOID_WORLD.xmax - SINUSOID_WORLD.xmin) * i) / steps;
    points.push(toCurvePoint(x, transformedSin(x, params), x));
  }

  return points;
}

function buildBaseCurvePoints(steps = 180): CurvePoint[] {
  const points: CurvePoint[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const x =
      SINUSOID_WORLD.xmin +
      ((SINUSOID_WORLD.xmax - SINUSOID_WORLD.xmin) * i) / steps;
    points.push(toCurvePoint(x, baseSin(x), x));
  }

  return points;
}

function horizontalLine(y: number): CurvePoint[] {
  return [
    toCurvePoint(SINUSOID_WORLD.xmin, y, SINUSOID_WORLD.xmin),
    toCurvePoint(SINUSOID_WORLD.xmax, y, SINUSOID_WORLD.xmax),
  ];
}

export function sampleSinusoidAmplitudePeriodPhaseThumbnail(
  params = DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS,
): ThumbnailSpec {
  const p = asSinusoidAmplitudePeriodPhaseParams(params);
  const peak = peakInfo(p);
  const trough = troughInfo(p);

  return {
    paths: [
      {
        points: horizontalLine(p.verticalShift),
        opacity: 0.2,
        strokeWidth: 0.8,
        excludeFromBbox: true,
      },
      {
        points: buildBaseCurvePoints(150),
        opacity: 0.28,
        strokeWidth: 0.9,
        excludeFromBbox: true,
      },
      {
        points: buildSinusoidCurvePoints(p, 180),
        strokeWidth: 2,
      },
    ],
    circles: [
      { x: toCurvePoint(peak.x, peak.y, peak.x).x, y: toCurvePoint(peak.x, peak.y, peak.x).y, r: 2.8 },
      {
        x: toCurvePoint(trough.x, trough.y, trough.x).x,
        y: toCurvePoint(trough.x, trough.y, trough.x).y,
        r: 2,
        opacity: 0.5,
      },
    ],
  };
}
