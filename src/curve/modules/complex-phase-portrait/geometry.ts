import type { CurvePoint, ThumbnailSpec } from '../../types';

export const FREQ_A = 1;
export const AMP_B = 0.8;
export const SAMPLE_STEP = 0.025;
export const HISTORY_DURATION = Math.PI * 4;
export const TIME_SPEED = 0.02;
export const SAFE_VIEWPORT_RATIO = 0.72;
export const PARAM_LERP = 0.08;

export type PhasorSampleParams = {
  ampA: number;
  freqB: number;
  smoothPhase: number;
};

export type HistoryBuffer = {
  points: { x: number; y: number }[];
  start: number;
  count: number;
  capacity: number;
};

export function toPhasorSampleParams(
  ampA: number,
  freqB: number,
  smoothPhase: number,
): PhasorSampleParams {
  return {
    ampA,
    freqB: Math.round(freqB),
    smoothPhase,
  };
}

export function pointAt(t: number, params: PhasorSampleParams): { x: number; y: number } {
  const angleA = t * FREQ_A;
  const angleB = t * params.freqB + params.smoothPhase;
  return {
    x: params.ampA * Math.cos(angleA) + AMP_B * Math.cos(angleB),
    y: params.ampA * Math.sin(angleA) + AMP_B * Math.sin(angleB),
  };
}

export function writeVectorChain(
  t: number,
  params: PhasorSampleParams,
  out: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }],
): void {
  const angleA = t * FREQ_A;
  const angleB = t * params.freqB + params.smoothPhase;
  out[0].x = 0;
  out[0].y = 0;
  out[1].x = params.ampA * Math.cos(angleA);
  out[1].y = params.ampA * Math.sin(angleA);
  out[2].x = out[1].x + AMP_B * Math.cos(angleB);
  out[2].y = out[1].y + AMP_B * Math.sin(angleB);
}

export function historyMaxPoints(): number {
  return Math.floor(HISTORY_DURATION / SAMPLE_STEP);
}

export function createHistoryBuffer(): HistoryBuffer {
  const capacity = historyMaxPoints();
  return {
    points: Array.from({ length: capacity }, () => ({ x: 0, y: 0 })),
    start: 0,
    count: 0,
    capacity,
  };
}

function pushHistoryBuffer(
  buffer: HistoryBuffer,
  point: { x: number; y: number },
): void {
  if (buffer.count < buffer.capacity) {
    const idx = buffer.count;
    buffer.points[idx].x = point.x;
    buffer.points[idx].y = point.y;
    buffer.count++;
    return;
  }

  buffer.points[buffer.start].x = point.x;
  buffer.points[buffer.start].y = point.y;
  buffer.start = (buffer.start + 1) % buffer.capacity;
}

export function rebuildHistoryBuffer(
  buffer: HistoryBuffer,
  params: PhasorSampleParams,
): void {
  buffer.start = 0;
  buffer.count = 0;
  for (let t = 0; t <= HISTORY_DURATION; t += SAMPLE_STEP) {
    pushHistoryBuffer(buffer, pointAt(t, params));
  }
}

export function appendHistoryBuffer(
  buffer: HistoryBuffer,
  t: number,
  params: PhasorSampleParams,
): void {
  pushHistoryBuffer(buffer, pointAt(t, params));
}

export function historyBufferPointAt(
  buffer: HistoryBuffer,
  index: number,
): { x: number; y: number } {
  const idx = (buffer.start + index) % buffer.capacity;
  return buffer.points[idx];
}

export function cameraScale(
  width: number,
  height: number,
  ampA: number,
): number {
  const radius = ampA + AMP_B;
  const span = Math.max(radius * 2, 0.001);
  return (Math.min(width, height) * SAFE_VIEWPORT_RATIO) / span;
}

function toCurvePoint(x: number, y: number, t: number, arcLength: number): CurvePoint {
  return { x, y, theta: t, arcLength };
}

export function sampleComplexPhasePortraitThumbnail(
  ampA: number,
  freqB: number,
  phase: number,
): ThumbnailSpec {
  const params = toPhasorSampleParams(ampA, freqB, phase);
  const buffer = createHistoryBuffer();
  rebuildHistoryBuffer(buffer, params);

  let arc = 0;
  let prevX = 0;
  let prevY = 0;
  const track: CurvePoint[] = [];

  for (let i = 0; i < buffer.count; i++) {
    const p = historyBufferPointAt(buffer, i);
    if (i > 0) arc += Math.hypot(p.x - prevX, p.y - prevY);
    track.push(toCurvePoint(p.x, p.y, i * SAMPLE_STEP, arc));
    prevX = p.x;
    prevY = p.y;
  }

  const chain: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  writeVectorChain(HISTORY_DURATION * 0.65, params, chain);
  const chainPoints: CurvePoint[] = chain.map((p, i) =>
    toCurvePoint(p.x, p.y, i, Math.hypot(p.x, p.y)),
  );

  return {
    paths: [
      { points: track, strokeWidth: 1.2 },
      {
        points: chainPoints,
        strokeWidth: 1,
        opacity: 0.45,
      },
    ],
  };
}
