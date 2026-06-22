import type { CurvePoint } from '../../types';
import { mulberry32 } from '../../prng';

const PLATE_RATIO = 0.75;
export const PARTICLE_COUNT = 8000;
const BASE_CANVAS = 600;
const NODAL_SAMPLE_STEPS = 80;

export type Particle = { x: number; y: number };

export function plateSize(canvasWidth: number): number {
  return canvasWidth * PLATE_RATIO;
}

export function mapToPlatePhase(
  x: number,
  y: number,
  size: number,
): { mappedX: number; mappedY: number } {
  return {
    mappedX: ((x + size / 2) / size) * Math.PI,
    mappedY: ((y + size / 2) / size) * Math.PI,
  };
}

export function chladniAmplitude(
  mappedX: number,
  mappedY: number,
  m: number,
  n: number,
): number {
  return (
    Math.sin(m * mappedX) * Math.sin(n * mappedY) -
    Math.sin(n * mappedX) * Math.sin(m * mappedY)
  );
}

function waveMotion(amplitude: number, time: number): number {
  return amplitude * Math.cos(time);
}

export function createParticles(size: number, count: number): Particle[] {
  const particles: Particle[] = [];
  const half = size / 2;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * size - half,
      y: Math.random() * size - half,
    });
  }

  return particles;
}

export function resetParticles(particles: Particle[], size: number): void {
  const half = size / 2;
  for (const particle of particles) {
    particle.x = Math.random() * size - half;
    particle.y = Math.random() * size - half;
  }
}

function constrainParticle(particle: Particle, size: number): void {
  const half = size / 2;
  particle.x = Math.max(-half, Math.min(half, particle.x));
  particle.y = Math.max(-half, Math.min(half, particle.y));
}

function moveParticleAwayFromAntinode(
  particle: Particle,
  amplitude: number,
  random01: () => number = Math.random,
): void {
  if (Math.abs(amplitude) <= 0.01) return;

  const force = 1.5;
  particle.x += random01() - 0.5;
  particle.y += random01() - 0.5;
  particle.x -= Math.sign(amplitude) * force;
  particle.y -= Math.sign(amplitude) * force;
}

export function updateParticle(
  particle: Particle,
  size: number,
  currentM: number,
  currentN: number,
  time: number,
  random01: () => number = Math.random,
): void {
  const { mappedX, mappedY } = mapToPlatePhase(particle.x, particle.y, size);
  const base = chladniAmplitude(mappedX, mappedY, currentM, currentN);
  const dynamic = waveMotion(base, time);

  moveParticleAwayFromAntinode(particle, dynamic, random01);
  constrainParticle(particle, size);
}

export function sampleChladniParticleCloud(
  m: number,
  n: number,
  particleCount: number,
  iterations: number,
  canvasSize = BASE_CANVAS,
): CurvePoint[] {
  const rand = mulberry32(42);
  const size = plateSize(canvasSize);
  const half = size / 2;
  const particles: Particle[] = Array.from({ length: particleCount }, () => ({
    x: (rand() * 2 - 1) * half,
    y: (rand() * 2 - 1) * half,
  }));

  for (let step = 0; step < iterations; step++) {
    for (const p of particles) {
      updateParticle(p, size, m, n, 0, rand);
    }
  }

  return particles.map((p, i) => ({
    x: p.x,
    y: p.y,
    theta: i,
    arcLength: i,
  }));
}

/** 水平掃描波節線零點，供列表縮圖 SVG 使用 */
export function sampleChladniNodalLines(
  m: number,
  n: number,
  step: number,
  canvasSize = BASE_CANVAS,
): CurvePoint[] {
  const size = plateSize(canvasSize);
  const half = size / 2;
  const rows = Math.max(8, Math.floor(NODAL_SAMPLE_STEPS / step));
  const cols = rows * 2;
  const raw: Array<{ x: number; y: number }> = [];

  for (let row = 0; row <= rows; row++) {
    const y = -half + (row / rows) * size;
    let prevAmp: number | null = null;
    let prevX: number | null = null;

    for (let col = 0; col <= cols; col++) {
      const x = -half + (col / cols) * size;
      const { mappedX, mappedY } = mapToPlatePhase(x, y, size);
      const amp = chladniAmplitude(mappedX, mappedY, m, n);

      if (prevAmp !== null && prevX !== null && prevAmp * amp < 0) {
        const t = prevAmp / (prevAmp - amp);
        raw.push({ x: prevX + t * (x - prevX), y });
      }

      prevAmp = amp;
      prevX = x;
    }
  }

  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevPx = 0;
  let prevPy = 0;

  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) {
      cumulative += Math.hypot(x - prevPx, y - prevPy);
    }
    points.push({ x, y, theta: i * step, arcLength: cumulative });
    prevPx = x;
    prevPy = y;
  }

  return points;
}
