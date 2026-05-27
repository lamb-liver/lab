import type p5 from 'p5';
import {
  AMP_B,
  FREQ_A,
  cameraScale,
  historyBufferPointAt,
  type HistoryBuffer,
} from '../../curve/modules/complex-phase-portrait/geometry';

export type ComplexPhasePortraitSnap = {
  width: number;
  height: number;
  ampA: number;
  freqB: number;
  smoothPhase: number;
  time: number;
  history: HistoryBuffer;
};

const COLORS = {
  BG: [10, 10, 10] as const,
  GOLD: [212, 184, 122] as const,
  GUIDE: [255, 255, 255] as const,
};

const GLOW = {
  TRACK: { CORE_WIDTH: 1.5, GLOW_WIDTH: 4, CORE_ALPHA: 220, GLOW_ALPHA: 35 },
  VECTOR: { CORE_WIDTH: 1.5, GLOW_WIDTH: 4, CORE_ALPHA: 180, GLOW_ALPHA: 30 },
};

type GlowProfile = {
  CORE_WIDTH: number;
  GLOW_WIDTH: number;
  CORE_ALPHA: number;
  GLOW_ALPHA: number;
};

const screenPoints: Array<{ x: number; y: number }> = Array.from({ length: 600 }, () => ({
  x: 0,
  y: 0,
}));

const chainWorld: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }] = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

function worldToScreen(x: number, y: number, scale: number): { x: number; y: number } {
  return { x: x * scale, y: -y * scale };
}

function writeChainWorld(
  t: number,
  ampA: number,
  freqB: number,
  smoothPhase: number,
): void {
  const angleA = t * FREQ_A;
  const angleB = t * freqB + smoothPhase;
  chainWorld[0].x = 0;
  chainWorld[0].y = 0;
  chainWorld[1].x = ampA * Math.cos(angleA);
  chainWorld[1].y = ampA * Math.sin(angleA);
  chainWorld[2].x = chainWorld[1].x + AMP_B * Math.cos(angleB);
  chainWorld[2].y = chainWorld[1].y + AMP_B * Math.sin(angleB);
}

function glowPath(p: p5, profile: GlowProfile, count: number): void {
  if (count < 2) return;
  p.noFill();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.GLOW_ALPHA);
  p.strokeWeight(profile.GLOW_WIDTH);
  p.beginShape();
  for (let i = 0; i < count; i++) p.vertex(screenPoints[i].x, screenPoints[i].y);
  p.endShape();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.CORE_ALPHA);
  p.strokeWeight(profile.CORE_WIDTH);
  p.beginShape();
  for (let i = 0; i < count; i++) p.vertex(screenPoints[i].x, screenPoints[i].y);
  p.endShape();
}

function ghostPath(p: p5, count: number): void {
  if (count < 2) return;
  p.noFill();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], 18);
  p.strokeWeight(1);
  p.beginShape();
  for (let i = 0; i < count; i++) p.vertex(screenPoints[i].x, screenPoints[i].y);
  p.endShape();
}

function node(p: p5, x: number, y: number, size: number, alpha: number): void {
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], alpha);
  p.strokeWeight(size);
  p.point(x, y);
}

function drawGuides(p: p5): void {
  p.stroke(COLORS.GUIDE[0], COLORS.GUIDE[1], COLORS.GUIDE[2], 12);
  p.strokeWeight(1);
  p.line(-p.width, 0, p.width, 0);
  p.line(0, -p.height, 0, p.height);
}

export function renderComplexPhasePortraitScene(
  p: p5,
  snap: ComplexPhasePortraitSnap,
): void {
  p.background(...COLORS.BG);

  const scale = cameraScale(snap.width, snap.height, snap.ampA);

  p.push();
  p.translate(snap.width / 2, snap.height / 2);
  drawGuides(p);

  const historyCount = snap.history.count;
  for (let i = 0; i < historyCount; i++) {
    const point = historyBufferPointAt(snap.history, i);
    const s = worldToScreen(point.x, point.y, scale);
    screenPoints[i].x = s.x;
    screenPoints[i].y = s.y;
  }

  ghostPath(p, historyCount);
  glowPath(p, GLOW.TRACK, historyCount);

  writeChainWorld(snap.time, snap.ampA, snap.freqB, snap.smoothPhase);
  for (let i = 0; i < 3; i++) {
    const s = worldToScreen(chainWorld[i].x, chainWorld[i].y, scale);
    screenPoints[i].x = s.x;
    screenPoints[i].y = s.y;
  }

  glowPath(p, GLOW.VECTOR, 3);
  node(p, screenPoints[0].x, screenPoints[0].y, 4, 50);
  node(p, screenPoints[1].x, screenPoints[1].y, 5, 120);
  node(p, screenPoints[2].x, screenPoints[2].y, 7, 255);

  p.pop();
}
