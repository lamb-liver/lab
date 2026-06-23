import type p5 from 'p5';
import {
  mapSpiralPath,
  mapSpiralPoint,
  updateSpiralCamera,
} from '../../curve/modules/equiangular-spiral/camera';
import { computeSpiralExtent } from '../../curve/modules/equiangular-spiral/geometry';
import type { WorldPoint } from '../../curve/modules/equiangular-spiral/geometry';
import { INITIAL_RADIUS_A } from '../../curve/modules/equiangular-spiral/geometry';

type EquiangularSpiralSnap = {
  width: number;
  height: number;
  smoothGrowthB: number;
  smoothMaxTheta: number;
  time: number;
  ghostPath: ReadonlyArray<WorldPoint>;
  activePath: ReadonlyArray<WorldPoint>;
  headPoint: WorldPoint;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const MAIN_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 4, alpha: 42 },
  { weight: 1.5, alpha: 230 },
];

const GHOST_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 1, alpha: 18 },
];

function drawGlowPolyline(
  p: p5,
  points: ReadonlyArray<{ x: number; y: number }>,
  layers: typeof MAIN_GLOW,
): void {
  if (points.length < 2) return;
  p.noFill();
  for (const layer of layers) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight);
    p.beginShape();
    for (const pt of points) {
      p.vertex(pt.x, pt.y);
    }
    p.endShape();
  }
}

function drawNode(
  p: p5,
  pt: { x: number; y: number },
  size: number,
  alpha: number,
): void {
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha);
  p.strokeWeight(size);
  p.point(pt.x, pt.y);
}

export function renderEquiangularSpiralScene(
  p: p5,
  snap: EquiangularSpiralSnap,
): void {
  p.background(10, 10, 10);

  const extent = computeSpiralExtent(
    INITIAL_RADIUS_A,
    snap.smoothGrowthB,
    snap.smoothMaxTheta,
  );
  const camera = updateSpiralCamera(
    extent,
    snap.width,
    snap.height,
  );

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  p.push();
  p.rotate(snap.time);

  const ghostScreen = mapSpiralPath(camera, snap.ghostPath);
  const activeScreen = mapSpiralPath(camera, snap.activePath);
  const headScreen = mapSpiralPoint(camera, snap.headPoint);

  drawGlowPolyline(p, ghostScreen, GHOST_GLOW);
  drawGlowPolyline(p, activeScreen, MAIN_GLOW);

  drawNode(p, headScreen, 6, 42);
  drawNode(p, headScreen, 2, 230);

  p.pop();
  p.pop();
}
