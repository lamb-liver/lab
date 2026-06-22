import type p5 from 'p5';

type EulerFormulaRotationSnap = {
  width: number;
  height: number;
  amplitude: number;
  frequency: number;
  smoothPhase: number;
  time: number;
  trackValues: number[];
};

const TRACK_SAMPLES = 420;
const TRACK_STEP = 3;
const PLANE_RADIUS_RATIO = 0.23;

const COLORS = {
  BG: [8, 8, 10] as const,
  GOLD: [212, 184, 122] as const,
  AXIS: [255, 255, 255] as const,
};

const GLOW = {
  VECTOR: { GLOW_WIDTH: 10, CORE_WIDTH: 2.2, GLOW_ALPHA: 26, CORE_ALPHA: 240 },
  TRACK: { GLOW_WIDTH: 6, CORE_WIDTH: 1.8, GLOW_ALPHA: 18, CORE_ALPHA: 130 },
  PROJECTION: { GLOW_WIDTH: 3, CORE_WIDTH: 1, GLOW_ALPHA: 10, CORE_ALPHA: 80 },
  CIRCLE: { GLOW_WIDTH: 2, CORE_WIDTH: 1, GLOW_ALPHA: 4, CORE_ALPHA: 20 },
};

type GlowProfile = {
  GLOW_WIDTH: number;
  CORE_WIDTH: number;
  GLOW_ALPHA: number;
  CORE_ALPHA: number;
};

const wavePoints: Array<{ x: number; y: number }> = Array.from({ length: TRACK_SAMPLES }, () => ({
  x: 0,
  y: 0,
}));

function glowLine(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  profile: GlowProfile,
): void {
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.GLOW_ALPHA);
  p.strokeWeight(profile.GLOW_WIDTH);
  p.line(x1, y1, x2, y2);
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.CORE_ALPHA);
  p.strokeWeight(profile.CORE_WIDTH);
  p.line(x1, y1, x2, y2);
}

function glowCircle(
  p: p5,
  x: number,
  y: number,
  r: number,
  profile: GlowProfile,
): void {
  p.noFill();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.GLOW_ALPHA);
  p.strokeWeight(profile.GLOW_WIDTH);
  p.circle(x, y, r * 2);
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.CORE_ALPHA);
  p.strokeWeight(profile.CORE_WIDTH);
  p.circle(x, y, r * 2);
}

function glowPath(p: p5, profile: GlowProfile, count: number): void {
  if (count < 2) return;
  p.noFill();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.GLOW_ALPHA);
  p.strokeWeight(profile.GLOW_WIDTH);
  p.beginShape();
  for (let i = 0; i < count; i++) p.vertex(wavePoints[i].x, wavePoints[i].y);
  p.endShape();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], profile.CORE_ALPHA);
  p.strokeWeight(profile.CORE_WIDTH);
  p.beginShape();
  for (let i = 0; i < count; i++) p.vertex(wavePoints[i].x, wavePoints[i].y);
  p.endShape();
}

function node(p: p5, x: number, y: number, size: number, alpha: number): void {
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], alpha);
  p.strokeWeight(size);
  p.point(x, y);
}

function pulseNode(p: p5, x: number, y: number): void {
  const pulse = 16 + Math.sin(p.frameCount * 0.08) * 3;
  p.noFill();
  p.stroke(COLORS.GOLD[0], COLORS.GOLD[1], COLORS.GOLD[2], 25);
  p.strokeWeight(2);
  p.circle(x, y, pulse);
  node(p, x, y, 7, 255);
}

export function renderEulerFormulaRotationScene(
  p: p5,
  snap: EulerFormulaRotationSnap,
): void {
  p.background(...COLORS.BG);

  const planeCenterX = snap.width * 0.28;
  const planeCenterY = snap.height * 0.5;
  const planeRadius = snap.width * PLANE_RADIUS_RATIO * (snap.amplitude / 2.2);
  const waveStartX = snap.width * 0.52;

  const theta = snap.time * snap.frequency + snap.smoothPhase;
  const phasorX = snap.amplitude * Math.cos(theta);
  const phasorY = snap.amplitude * Math.sin(theta);

  const endpointX = planeCenterX + phasorX * planeRadius;
  const endpointY = planeCenterY - phasorY * planeRadius;

  p.stroke(COLORS.AXIS[0], COLORS.AXIS[1], COLORS.AXIS[2], 10);
  p.strokeWeight(1);
  p.line(0, planeCenterY, snap.width, planeCenterY);
  p.line(planeCenterX, 0, planeCenterX, snap.height);

  glowCircle(p, planeCenterX, planeCenterY, planeRadius, GLOW.CIRCLE);

  p.drawingContext.setLineDash([5, 5]);
  glowLine(p, endpointX, endpointY, waveStartX, endpointY, GLOW.PROJECTION);
  p.drawingContext.setLineDash([]);

  glowLine(p, planeCenterX, planeCenterY, endpointX, endpointY, GLOW.VECTOR);
  pulseNode(p, endpointX, endpointY);

  const centerY = planeCenterY;
  const values = snap.trackValues;
  for (let i = 0; i < values.length; i++) {
    wavePoints[i].x = waveStartX + i * TRACK_STEP;
    wavePoints[i].y =
      centerY - values[values.length - 1 - i] * planeRadius;
  }

  glowPath(p, GLOW.TRACK, values.length);
  node(p, waveStartX, endpointY, 4, 120);
}

export function pushTrackValue(values: number[], next: number): number[] {
  const out = values.slice(1);
  out.push(next);
  return out;
}

export function createTrackBuffer(): number[] {
  return new Array(TRACK_SAMPLES).fill(0);
}
