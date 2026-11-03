import type p5 from 'p5';
import {
  createParticles,
  PARTICLE_COUNT,
  plateSize,
  resetParticles,
  updateParticle,
  type Particle,
} from '../../curve/modules/chladni-figures/geometry';

type ChladniSnap = {
  width: number;
  height: number;
  currentM: number;
  currentN: number;
  time: number;
  revealProgress: number;
  particles: Particle[];
};

const PARTICLE_STYLE = { r: 212, g: 184, b: 122, a: 180 };

export function renderChladniScene(p: p5, snap: ChladniSnap): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;
  const size = plateSize(snap.width);

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(255, 255, 255, 12);
  p.strokeWeight(1);
  p.rect(-size / 2, -size / 2, size, size);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  const visibleCount = Math.floor(PARTICLE_COUNT * snap.revealProgress);

  p.stroke(PARTICLE_STYLE.r, PARTICLE_STYLE.g, PARTICLE_STYLE.b, PARTICLE_STYLE.a);
  p.strokeWeight(1.5);

  for (let i = 0; i < visibleCount; i++) {
    const particle = snap.particles[i];
    if (!particle) continue;

    updateParticle(particle, size, snap.currentM, snap.currentN, snap.time);
    p.point(particle.x, particle.y);
  }

  p.pop();
}

export function ensureChladniParticles(
  particles: Particle[],
  canvasWidth: number,
): Particle[] {
  const size = plateSize(canvasWidth);
  if (particles.length === PARTICLE_COUNT) {
    return particles;
  }
  return createParticles(size, PARTICLE_COUNT);
}

export function scatterChladniParticles(
  particles: Particle[],
  canvasWidth: number,
): void {
  resetParticles(particles, plateSize(canvasWidth));
}
