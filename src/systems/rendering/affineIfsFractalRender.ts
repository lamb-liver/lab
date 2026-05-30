import type p5 from 'p5';
import {
  MAX_GRAINS,
  ORIGIN_Y_RATIO,
  type GrainPoint,
} from '../../curve/modules/affine-ifs-fractal/geometry';

export type AffineIfsFractalSnap = {
  width: number;
  height: number;
  grains: ReadonlyArray<GrainPoint>;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const GLOW_LAYERS: Array<{ weight: number; alpha: number; stride: number }> = [
  { weight: 5, alpha: 12, stride: 2 },
  { weight: 2.5, alpha: 35, stride: 1 },
  { weight: 1, alpha: 190, stride: 1 },
];

function renderGuideLayer(p: p5, width: number, height: number): void {
  const originY = height * ORIGIN_Y_RATIO;
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-width / 2, 0, width / 2, 0);
  p.line(0, -originY, 0, height * 0.15);
}

function renderGrainGlow(
  p: p5,
  grains: ReadonlyArray<GrainPoint>,
  renderCount: number,
): void {
  for (const layer of GLOW_LAYERS) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight);
    for (let i = 0; i < renderCount; i += layer.stride) {
      const g = grains[i]!;
      p.point(g.x, g.y);
    }
  }
}

export function renderAffineIfsFractalScene(p: p5, snap: AffineIfsFractalSnap): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height * ORIGIN_Y_RATIO;

  p.push();
  p.translate(cx, cy);

  renderGuideLayer(p, snap.width, snap.height);

  const targetCount = Math.floor(MAX_GRAINS * snap.revealProgress);
  const renderCount = Math.min(snap.grains.length, targetCount, MAX_GRAINS);
  renderGrainGlow(p, snap.grains, renderCount);

  p.pop();
}
