import type p5 from 'p5';
import {
  mapPath,
  updateCameraFromBounds,
  worldToScreen,
} from '../../curve/modules/catenary/camera';
import {
  buildParametricCurve,
  computeTractrixBounds,
  evaluateTractrix,
  mirrorY,
  pullingOscillation,
} from '../../curve/modules/catenary/geometry';
import type { WorldPoint } from '../../curve/modules/catenary/geometry';

type CatenarySnap = {
  width: number;
  height: number;
  smoothRopeLength: number;
  smoothMaxT: number;
  time: number;
  ghostUpper: ReadonlyArray<WorldPoint>;
  ghostLower: ReadonlyArray<WorldPoint>;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const MAIN_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 3.5, alpha: 42 },
  { weight: 1.5, alpha: 230 },
];

const ROPE_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 5, alpha: 25 },
  { weight: 1.5, alpha: 140 },
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

function drawThinPath(
  p: p5,
  points: ReadonlyArray<{ x: number; y: number }>,
  alpha = 16,
): void {
  if (points.length < 2) return;
  p.noFill();
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha);
  p.strokeWeight(1);
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
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

export function renderCatenaryScene(p: p5, snap: CatenarySnap): void {
  p.background(10, 10, 10);

  const oscillation = pullingOscillation(snap.time);
  const dynamicT = snap.smoothMaxT * oscillation;

  const dynamicUpper = buildParametricCurve(
    (t) => evaluateTractrix(t, snap.smoothRopeLength),
    0,
    dynamicT,
  );
  const dynamicLower = mirrorY(dynamicUpper);

  const objectPoint = evaluateTractrix(dynamicT, snap.smoothRopeLength);
  const pullerPoint = { x: snap.smoothRopeLength * dynamicT, y: 0 };

  const ropeUpper: WorldPoint[] = [objectPoint, pullerPoint];
  const ropeLower: WorldPoint[] = [
    { x: objectPoint.x, y: -objectPoint.y },
    pullerPoint,
  ];

  const bounds = computeTractrixBounds(
    snap.smoothRopeLength,
    snap.smoothMaxT,
    dynamicT,
  );
  const camera = updateCameraFromBounds(
    bounds,
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

  drawThinPath(p, mapPath(camera, snap.ghostUpper));
  drawThinPath(p, mapPath(camera, snap.ghostLower));

  drawGlowPolyline(p, mapPath(camera, dynamicUpper), MAIN_GLOW);
  drawGlowPolyline(p, mapPath(camera, dynamicLower), MAIN_GLOW);
  drawGlowPolyline(p, mapPath(camera, ropeUpper), ROPE_GLOW);
  drawGlowPolyline(p, mapPath(camera, ropeLower), ROPE_GLOW);

  const objectUpperScreen = worldToScreen(camera, objectPoint);
  const objectLowerScreen = worldToScreen(camera, {
    x: objectPoint.x,
    y: -objectPoint.y,
  });
  const pullerScreen = worldToScreen(camera, pullerPoint);

  drawNode(p, objectUpperScreen, 6, 42);
  drawNode(p, objectLowerScreen, 6, 42);
  drawNode(p, pullerScreen, 6, 42);
  drawNode(p, objectUpperScreen, 1.5, 230);
  drawNode(p, objectLowerScreen, 1.5, 230);
  drawNode(p, pullerScreen, 1.5, 230);

  p.pop();
}
