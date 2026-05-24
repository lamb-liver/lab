import type { CurvePoint } from '../../types';

export const CURVE_WIDTH_RATIO = 0.8;
export const DEFAULT_SAMPLE_STEP = 2;
export const BASE_CANVAS = 600;

export type StandingWaveBuildOpts = {
  canvasWidth: number;
  currentAmplitude: number;
  spatialFrequency: number;
  time: number;
  revealProgress: number;
  curveWidthRatio?: number;
  sampleStep?: number;
};

export function standingWaveY(
  kx: number,
  amplitude: number,
  time: number,
): number {
  return 2 * amplitude * Math.sin(kx) * Math.cos(time);
}

export function envelopeY(kx: number, amplitude: number): number {
  return 2 * amplitude * Math.sin(kx);
}

export function buildStandingWavePoints(
  opts: StandingWaveBuildOpts,
): Array<{ x: number; y: number }> {
  const {
    canvasWidth,
    currentAmplitude,
    spatialFrequency,
    time,
    revealProgress,
    curveWidthRatio = CURVE_WIDTH_RATIO,
    sampleStep = DEFAULT_SAMPLE_STEP,
  } = opts;

  const totalWidth = canvasWidth * curveWidthRatio;
  const startX = -totalWidth / 2;
  const maxWidth = totalWidth * Math.max(0, Math.min(1, revealProgress));
  const points: Array<{ x: number; y: number }> = [];

  for (let offset = 0; offset <= maxWidth; offset += sampleStep) {
    const x = startX + offset;
    const kx = (offset / totalWidth) * Math.PI * spatialFrequency;
    const y = standingWaveY(kx, currentAmplitude, time);
    points.push({ x, y });
  }

  return points;
}

export function buildEnvelopePoints(
  opts: Omit<StandingWaveBuildOpts, 'time' | 'revealProgress'>,
  direction: 1 | -1,
): Array<{ x: number; y: number }> {
  const {
    canvasWidth,
    currentAmplitude,
    spatialFrequency,
    curveWidthRatio = CURVE_WIDTH_RATIO,
    sampleStep = DEFAULT_SAMPLE_STEP,
  } = opts;

  const totalWidth = canvasWidth * curveWidthRatio;
  const startX = -totalWidth / 2;
  const points: Array<{ x: number; y: number }> = [];

  for (let offset = 0; offset <= totalWidth; offset += sampleStep) {
    const x = startX + offset;
    const kx = (offset / totalWidth) * Math.PI * spatialFrequency;
    const y = envelopeY(kx, currentAmplitude) * direction;
    points.push({ x, y });
  }

  return points;
}

export function sampleStandingWaveCurve(
  amplitude: number,
  spatialFrequency: number,
  step: number,
  time = 0,
  revealProgress = 1,
): CurvePoint[] {
  const raw = buildStandingWavePoints({
    canvasWidth: BASE_CANVAS,
    currentAmplitude: amplitude,
    spatialFrequency: Math.round(spatialFrequency),
    time,
    revealProgress,
    sampleStep: step,
  });

  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }
    points.push({ x, y, theta: i * step, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}
