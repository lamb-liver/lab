import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import {
  SEQUENCE_VIEW,
  buildArithmeticScene,
  buildGeometricScene,
  sequenceModeFromParams,
  type RectShape,
} from '../../curve/modules/arithmetic-geometric-sequences/geometry';

export type ArithmeticGeometricSequencesSnap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const RECT_GLOW = [
  { weight: 7, alpha: 16 },
  { weight: 3.5, alpha: 42 },
  { weight: 1.2, alpha: 230 },
];

export function renderArithmeticGeometricSequencesScene(
  p: p5,
  snap: ArithmeticGeometricSequencesSnap,
): void {
  p.background(10, 10, 10);

  const scale = Math.min(snap.width / SEQUENCE_VIEW.width, snap.height / SEQUENCE_VIEW.height);
  const offsetX = (snap.width - SEQUENCE_VIEW.width * scale) / 2;
  const offsetY = (snap.height - SEQUENCE_VIEW.height * scale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  renderGuide(p);
  if (sequenceModeFromParams(snap.params) === 'geometric') {
    renderGeometric(p, snap.params, snap.revealProgress);
  } else {
    renderArithmetic(p, snap.params, snap.revealProgress);
  }

  p.pop();
}

function renderGuide(p: p5): void {
  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.line(120, SEQUENCE_VIEW.baseY, SEQUENCE_VIEW.width - 120, SEQUENCE_VIEW.baseY);
  p.pop();
}

function renderArithmetic(p: p5, params: ParamValues, revealProgress: number): void {
  const scene = buildArithmeticScene(params, revealProgress);

  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 8);
  p.rect(
    scene.formulaRect.x,
    scene.formulaRect.y,
    scene.formulaRect.width,
    scene.formulaRect.height,
  );
  p.pop();

  for (const bar of scene.bars) {
    drawFilledGlowRect(p, bar);
  }

  p.push();
  p.noFill();
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 22);
  p.strokeWeight(1);
  for (const bar of scene.mirrorBars) {
    if (bar.height > 0.01) p.rect(bar.x, bar.y, bar.width, bar.height);
  }
  p.pop();

  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 32);
  p.strokeWeight(1);
  p.line(scene.trendLine.x1, scene.trendLine.y1, scene.trendLine.x2, scene.trendLine.y2);
  p.pop();
}

function renderGeometric(p: p5, params: ParamValues, revealProgress: number): void {
  const scene = buildGeometricScene(params, revealProgress);

  for (const rect of scene.rects) {
    drawFilledGlowRect(p, rect);
  }

  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.rect(scene.outline.x, scene.outline.y, scene.outline.width, scene.outline.height);
  p.pop();

  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 16);
  p.strokeWeight(1);
  for (const partition of scene.partitions) {
    p.line(partition.x, partition.y1, partition.x, partition.y2);
  }
  p.pop();

  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 20);
  p.strokeWeight(1);
  const endX = scene.outline.x + scene.outline.width;
  p.line(endX, scene.outline.y, endX, scene.outline.y + scene.outline.height);
  p.pop();
}

function drawFilledGlowRect(p: p5, rect: RectShape): void {
  if (rect.width <= 0.01 || rect.height <= 0.01) return;

  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, Math.round(255 * rect.fillAlpha));
  p.rect(rect.x, rect.y, rect.width, rect.height);

  p.noFill();
  for (const layer of RECT_GLOW) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight);
    p.rect(rect.x, rect.y, rect.width, rect.height);
  }
  p.pop();
}
