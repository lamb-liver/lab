import type p5 from 'p5';
import {
  STACK_LAYERS,
  buildBaseSquare,
  buildRotationScaleMatrix,
  buildStackedSegments,
} from '../../curve/modules/rotation-scale-composition/geometry';

type RotationScaleCompositionSnap = {
  width: number;
  height: number;
  currentRotationStepDeg: number;
  currentScaleFactor: number;
  time: number;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const GLOW_LAYERS: Array<{ weight: number; alpha: number }> = [
  { weight: 7, alpha: 16 },
  { weight: 3.5, alpha: 42 },
  { weight: 1.5, alpha: 230 },
];

function drawPolygon(p: p5, points: ReturnType<typeof buildBaseSquare>): void {
  if (points.length === 0) return;
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
}

function renderGuideLayer(p: p5, width: number, height: number): void {
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-width / 2, 0, width / 2, 0);
  p.line(0, -height / 2, 0, height / 2);
}

function renderGlowSegments(
  p: p5,
  segments: ReturnType<typeof buildStackedSegments>,
): void {
  for (const layer of GLOW_LAYERS) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight);
    for (const seg of segments) {
      p.line(seg.x1, seg.y1, seg.x2, seg.y2);
    }
  }
}

export function renderRotationScaleCompositionScene(
  p: p5,
  snap: RotationScaleCompositionSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  p.push();
  p.translate(cx, cy);

  const basePattern = buildBaseSquare(snap.width);
  renderGuideLayer(p, snap.width, snap.height);

  p.noFill();
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 16);
  p.strokeWeight(1);
  drawPolygon(p, basePattern);

  const matrix = buildRotationScaleMatrix(
    snap.currentRotationStepDeg,
    snap.currentScaleFactor,
    snap.time,
  );
  const layerCount = Math.floor(STACK_LAYERS * snap.revealProgress);
  const segments = buildStackedSegments(basePattern, matrix, layerCount);

  renderGlowSegments(p, segments);

  p.pop();
}
