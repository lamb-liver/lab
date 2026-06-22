import type p5 from 'p5';
import {
  buildAffineMatrix,
  buildBasePattern,
  buildRecursiveTransformSegments,
  buildTranslationVectors,
} from '../../curve/modules/affine-transform-pattern/geometry';

type AffineTransformPatternSnap = {
  width: number;
  height: number;
  currentRotationDeg: number;
  currentTranslation: number;
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

function drawPolygon(p: p5, points: ReturnType<typeof buildBasePattern>): void {
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

function renderGhostPattern(p: p5, pattern: ReturnType<typeof buildBasePattern>): void {
  p.noFill();
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 16);
  p.strokeWeight(1);
  drawPolygon(p, pattern);
}

function renderGlowSegments(
  p: p5,
  segments: ReturnType<typeof buildRecursiveTransformSegments>,
): void {
  for (const layer of GLOW_LAYERS) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight);
    for (const seg of segments) {
      p.line(seg.x1, seg.y1, seg.x2, seg.y2);
    }
  }
}

export function renderAffineTransformPatternScene(
  p: p5,
  snap: AffineTransformPatternSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  p.push();
  p.translate(cx, cy);

  renderGuideLayer(p, snap.width, snap.height);

  const basePattern = buildBasePattern();
  renderGhostPattern(p, basePattern);

  const matrix = buildAffineMatrix(snap.currentRotationDeg, snap.time);
  const translations = buildTranslationVectors(
    snap.currentTranslation,
    snap.revealProgress,
  );
  const segments = buildRecursiveTransformSegments(
    basePattern,
    matrix,
    translations,
  );

  renderGlowSegments(p, segments);

  p.pop();
}
