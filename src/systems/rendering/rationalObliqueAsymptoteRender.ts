import type p5 from 'p5';
import {
  RATIONAL_OBLIQUE_CONFIG,
  buildFunctionSegments,
  buildRationalObliqueModel,
  clamp,
  createRationalObliquePlotRect,
  fmt,
  rightEdgeLabelDataPoint,
  xToScreen,
  yToScreen,
  yToScreenClamped,
  type RationalObliqueMode,
  type RationalObliqueParams,
} from '../../curve/modules/rational-oblique-asymptote';

export type RationalObliqueAsymptoteSnap = {
  size: number;
  mode: RationalObliqueMode;
  params: RationalObliqueParams;
  showAsymptotes: boolean;
  showRemainder: boolean;
  advanced: boolean;
};

type Color = readonly [number, number, number];

const PALETTE = {
  bg: [10, 10, 10] as Color,
  text: [232, 232, 232] as Color,
  muted: [140, 140, 140] as Color,
  faint: [82, 82, 82] as Color,
  guide: [216, 216, 216] as Color,
  gold: [212, 184, 122] as Color,
  blue: [93, 173, 226] as Color,
  green: [139, 204, 151] as Color,
  red: [231, 111, 81] as Color,
};

export function renderRationalObliqueAsymptoteScene(p: p5, snap: RationalObliqueAsymptoteSnap): void {
  p.background(...PALETTE.bg);
  const graph = createRationalObliquePlotRect(snap.size);
  const model = buildRationalObliqueModel(snap.mode, snap.params);

  drawPlotFrame(p, graph);
  if (snap.showAsymptotes) drawAsymptotes(p, graph, model);
  if (snap.advanced && snap.showRemainder) drawRemainderCurve(p, graph, model);
  drawFunctionCurve(p, graph, model.f, model.verticals, PALETTE.gold, 8.5, 20);
  drawFunctionCurve(p, graph, model.f, model.verticals, PALETTE.gold, 4.2, 46);
  drawFunctionCurve(p, graph, model.f, model.verticals, PALETTE.gold, 2.2, 245);
  drawZeros(p, graph, model.zeros);
  drawSceneHud(p, snap, model);
}

function drawPlotFrame(p: p5, g: ReturnType<typeof createRationalObliquePlotRect>): void {
  p.noFill();
  p.stroke(...PALETTE.faint, 90);
  p.strokeWeight(1);
  p.rect(g.x, g.y, g.w, g.h, 18);

  for (let i = 0; i <= 8; i += 1) {
    const x = p.lerp(g.x, g.x + g.w, i / 8);
    p.stroke(...PALETTE.guide, i === 4 ? 46 : 20);
    p.line(x, g.y, x, g.y + g.h);
  }

  for (let i = 0; i <= 6; i += 1) {
    const y = p.lerp(g.y, g.y + g.h, i / 6);
    p.stroke(...PALETTE.guide, 20);
    p.line(g.x, y, g.x + g.w, y);
  }

  const zeroY = yToScreen(g, 0);
  if (zeroY >= g.y && zeroY <= g.y + g.h) {
    p.stroke(...PALETTE.guide, 82);
    p.strokeWeight(1.2);
    p.line(g.x, zeroY, g.x + g.w, zeroY);
  }

  const zeroX = xToScreen(g, 0);
  if (zeroX >= g.x && zeroX <= g.x + g.w) {
    p.stroke(...PALETTE.guide, 46);
    p.strokeWeight(1.1);
    p.line(zeroX, g.y, zeroX, g.y + g.h);
  }

  p.noStroke();
  p.fill(...PALETTE.muted, 190);
  p.textSize(11.5);
  p.text(fmtAxis(RATIONAL_OBLIQUE_CONFIG.xMin), g.x, g.y + g.h + 19);
  p.textAlign(p.RIGHT, p.BASELINE);
  p.text(fmtAxis(RATIONAL_OBLIQUE_CONFIG.xMax), g.x + g.w, g.y + g.h + 19);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawAsymptotes(
  p: p5,
  g: ReturnType<typeof createRationalObliquePlotRect>,
  model: ReturnType<typeof buildRationalObliqueModel>,
): void {
  for (const c of model.verticals) {
    const sx = xToScreen(g, c);
    if (sx < g.x || sx > g.x + g.w) continue;

    p.stroke(...PALETTE.red, 143);
    p.strokeWeight(1.4);
    dashedLine(p, sx, g.y, sx, g.y + g.h, [5, 7]);
    drawLabelScreen(p, clamp(sx + 8, g.x + 8, g.x + g.w - 72), g.y + 34, `x=${fmt(c)}`, PALETTE.red, 235);
  }

  if (model.guide.type === 'oblique') {
    p.stroke(...PALETTE.blue, 132);
    p.strokeWeight(1.5);
    dashedDataLine(
      p,
      g,
      RATIONAL_OBLIQUE_CONFIG.xMin,
      model.guide.m * RATIONAL_OBLIQUE_CONFIG.xMin + model.guide.b,
      RATIONAL_OBLIQUE_CONFIG.xMax,
      model.guide.m * RATIONAL_OBLIQUE_CONFIG.xMax + model.guide.b,
      [6, 7],
    );
    drawLabelScreen(p, g.x + g.w - 114, g.y + 34, model.guide.label, PALETTE.blue, 230);
  } else {
    const sy = yToScreen(g, model.guide.value);
    if (sy >= g.y && sy <= g.y + g.h) {
      p.stroke(...PALETTE.blue, 132);
      p.strokeWeight(1.5);
      dashedLine(p, g.x, sy, g.x + g.w, sy, [6, 7]);
      drawLabelScreen(p, g.x + g.w - 74, clamp(sy - 8, g.y + 18, g.y + g.h - 8), model.guide.label, PALETTE.blue, 230);
    }
  }
}

function drawFunctionCurve(
  p: p5,
  g: ReturnType<typeof createRationalObliquePlotRect>,
  fn: (x: number) => number,
  verticals: number[],
  color: Color,
  weight: number,
  alpha: number,
): void {
  const screenSegments = buildFunctionSegments(fn, verticals).map((segment) =>
    segment.map((point) => ({ x: xToScreen(g, point.x), y: yToScreenClamped(g, point.y) })),
  );

  p.noFill();
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  for (const segment of screenSegments) {
    p.beginShape();
    for (const point of segment) p.vertex(point.x, point.y);
    p.endShape();
  }
}

function drawRemainderCurve(
  p: p5,
  g: ReturnType<typeof createRationalObliquePlotRect>,
  model: ReturnType<typeof buildRationalObliqueModel>,
): void {
  drawFunctionCurve(p, g, model.e, model.verticals, PALETTE.green, model.remainderEqualsMain ? 1.8 : 2, model.remainderEqualsMain ? 62 : 92);
  const labelPoint = rightEdgeLabelDataPoint(model.e, model.verticals);
  drawLabelScreen(
    p,
    clamp(xToScreen(g, labelPoint.x) - 76, g.x + 10, g.x + g.w - 92),
    clamp(yToScreenClamped(g, labelPoint.y) - 8, g.y + 20, g.y + g.h - 12),
    model.remainderLabel,
    PALETTE.green,
    214,
  );
}

function drawZeros(
  p: p5,
  g: ReturnType<typeof createRationalObliquePlotRect>,
  zeros: number[],
): void {
  for (const z of zeros) {
    if (z < RATIONAL_OBLIQUE_CONFIG.xMin || z > RATIONAL_OBLIQUE_CONFIG.xMax) continue;
    const sx = xToScreen(g, z);
    const sy = yToScreen(g, 0);
    if (sy < g.y || sy > g.y + g.h) continue;

    p.noStroke();
    p.fill(...PALETTE.green, 242);
    p.circle(sx, sy, 8);
    drawLabelScreen(p, clamp(sx + 7, g.x + 8, g.x + g.w - 70), sy - 8, `零點 ${fmt(z)}`, PALETTE.green, 235);
  }
}

function drawSceneHud(
  p: p5,
  snap: RationalObliqueAsymptoteSnap,
  model: ReturnType<typeof buildRationalObliqueModel>,
): void {
  p.noStroke();
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.fill(...PALETTE.muted, 220);
  p.text(`${snap.mode.name} · ${model.guide.label}`, 18, 26);

  p.textAlign(p.RIGHT, p.TOP);
  p.text(model.warning || snap.mode.note, snap.size - 18, 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function dashedDataLine(
  p: p5,
  g: ReturnType<typeof createRationalObliquePlotRect>,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pattern: number[],
): void {
  dashedLine(p, xToScreen(g, x1), yToScreenClamped(g, y1), xToScreen(g, x2), yToScreenClamped(g, y2), pattern);
}

function dashedLine(p: p5, x1: number, y1: number, x2: number, y2: number, pattern: number[]): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.setLineDash(pattern);
  p.line(x1, y1, x2, y2);
  ctx.restore();
}

function drawLabelScreen(
  p: p5,
  x: number,
  y: number,
  label: string,
  color: Color,
  alpha: number,
): void {
  p.noStroke();
  p.textSize(11.5);
  p.textStyle(p.NORMAL);
  const tw = p.textWidth(label);
  p.fill(...PALETTE.bg, 158);
  p.rect(x - 5, y - 14.5, tw + 10, 19.5, 8);
  p.fill(...color, alpha);
  p.text(label, x, y);
}

function fmtAxis(n: number): string {
  if (Math.abs(n) < 0.005) return '0';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
