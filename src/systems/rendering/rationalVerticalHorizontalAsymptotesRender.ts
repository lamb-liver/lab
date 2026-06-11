import type p5 from 'p5';
import {
  RATIONAL_ASYMPTOTE_CONFIG,
  buildCurveSegments,
  buildRationalAsymptoteModel,
  createRationalAsymptotePlotRect,
  fmt,
  xToScreen,
  yToScreen,
  yToScreenClamped,
  type RationalAsymptoteParams,
  type RationalAsymptotePreset,
} from '../../curve/modules/rational-vertical-horizontal-asymptotes';

export type RationalVerticalHorizontalAsymptotesSnap = {
  size: number;
  preset: RationalAsymptotePreset;
  params: RationalAsymptoteParams;
  showAsymptotes: boolean;
  showHoles: boolean;
  showLocal: boolean;
  advanced: boolean;
};

type Color = readonly [number, number, number];

const PALETTE = {
  bg: [10, 10, 10] as Color,
  panel2: [22, 22, 22] as Color,
  text: [232, 232, 232] as Color,
  muted: [140, 140, 140] as Color,
  faint: [82, 82, 82] as Color,
  guide: [216, 216, 216] as Color,
  gold: [212, 184, 122] as Color,
  blue: [93, 173, 226] as Color,
  green: [139, 204, 151] as Color,
  red: [231, 111, 81] as Color,
};

export function renderRationalVerticalHorizontalAsymptotesScene(
  p: p5,
  snap: RationalVerticalHorizontalAsymptotesSnap,
): void {
  p.background(...PALETTE.bg);
  const graph = createRationalAsymptotePlotRect(snap.size);
  const model = buildRationalAsymptoteModel(snap.preset, snap.params);

  drawPlotFrame(p, graph);
  if (snap.showAsymptotes) drawAsymptotes(p, graph, model, snap.advanced);
  drawRationalCurve(p, graph, model);
  drawZeros(p, graph, model.zeros);
  if (snap.showHoles) drawHoles(p, graph, model.holes);
  if (snap.advanced && snap.showLocal) drawLocalWindow(p, graph, model);
  drawSceneHud(p, snap, model);
}

function drawPlotFrame(p: p5, g: ReturnType<typeof createRationalAsymptotePlotRect>): void {
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
  p.text(fmtAxis(RATIONAL_ASYMPTOTE_CONFIG.xMin), g.x, g.y + g.h + 19);
  p.textAlign(p.RIGHT, p.BASELINE);
  p.text(fmtAxis(RATIONAL_ASYMPTOTE_CONFIG.xMax), g.x + g.w, g.y + g.h + 19);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawAsymptotes(
  p: p5,
  g: ReturnType<typeof createRationalAsymptotePlotRect>,
  model: ReturnType<typeof buildRationalAsymptoteModel>,
  advanced: boolean,
): void {
  for (const a of model.verticals) {
    const sx = xToScreen(g, a);
    if (sx < g.x || sx > g.x + g.w) continue;

    p.stroke(...PALETTE.red, 148);
    p.strokeWeight(1.4);
    dashedLine(p, sx, g.y, sx, g.y + g.h, [5, 7]);
    drawLabelScreen(p, clamp(sx + 8, g.x + 8, g.x + g.w - 70), g.y + 34, `x=${fmt(a)}`, PALETTE.red, 235);
    drawLimitArrows(p, g, sx);
  }

  if (model.horizontal.exists) {
    const sy = yToScreen(g, model.horizontal.value);
    if (sy >= g.y && sy <= g.y + g.h) {
      p.stroke(...PALETTE.blue, 132);
      p.strokeWeight(1.5);
      dashedLine(p, g.x, sy, g.x + g.w, sy, [6, 7]);
      drawLabelScreen(p, g.x + g.w - 76, clamp(sy - 8, g.y + 18, g.y + g.h - 8), model.horizontal.label, PALETTE.blue, 230);
    }
  } else if (advanced && model.oblique) {
    p.stroke(...PALETTE.blue, 82);
    p.strokeWeight(1.2);
    dashedDataLine(
      p,
      g,
      RATIONAL_ASYMPTOTE_CONFIG.xMin,
      model.oblique.m * RATIONAL_ASYMPTOTE_CONFIG.xMin + model.oblique.b,
      RATIONAL_ASYMPTOTE_CONFIG.xMax,
      model.oblique.m * RATIONAL_ASYMPTOTE_CONFIG.xMax + model.oblique.b,
      [6, 7],
    );
  }
}

function drawLimitArrows(p: p5, g: ReturnType<typeof createRationalAsymptotePlotRect>, sx: number): void {
  const y1 = g.y + g.h * 0.32;
  const y2 = g.y + g.h * 0.68;

  p.stroke(...PALETTE.red, 82);
  p.strokeWeight(1.2);
  p.line(sx - 16, y1, sx - 6, y1);
  p.line(sx + 16, y2, sx + 6, y2);

  p.noStroke();
  p.fill(...PALETTE.red, 110);
  p.triangle(sx - 6, y1, sx - 12, y1 - 4, sx - 12, y1 + 4);
  p.triangle(sx + 6, y2, sx + 12, y2 - 4, sx + 12, y2 + 4);
}

function drawRationalCurve(
  p: p5,
  g: ReturnType<typeof createRationalAsymptotePlotRect>,
  model: ReturnType<typeof buildRationalAsymptoteModel>,
): void {
  const screenSegments = buildCurveSegments(model).map((segment) =>
    segment.map((point) => ({ x: xToScreen(g, point.x), y: yToScreenClamped(g, point.y) })),
  );
  drawCurveSegments(p, screenSegments, 8.5, PALETTE.gold, 20);
  drawCurveSegments(p, screenSegments, 4.2, PALETTE.gold, 46);
  drawCurveSegments(p, screenSegments, 2.2, PALETTE.gold, 245);
}

function drawCurveSegments(
  p: p5,
  segments: Array<Array<{ x: number; y: number }>>,
  weight: number,
  color: Color,
  alpha: number,
): void {
  p.noFill();
  p.stroke(...color, alpha);
  p.strokeWeight(weight);

  for (const segment of segments) {
    p.beginShape();
    for (const point of segment) p.vertex(point.x, point.y);
    p.endShape();
  }
}

function drawZeros(
  p: p5,
  g: ReturnType<typeof createRationalAsymptotePlotRect>,
  zeros: number[],
): void {
  for (const z of zeros) {
    if (z < RATIONAL_ASYMPTOTE_CONFIG.xMin || z > RATIONAL_ASYMPTOTE_CONFIG.xMax) continue;
    const sx = xToScreen(g, z);
    const sy = yToScreen(g, 0);
    if (sy < g.y || sy > g.y + g.h) continue;

    p.noStroke();
    p.fill(...PALETTE.green, 242);
    p.circle(sx, sy, 8);
    drawLabelScreen(p, clamp(sx + 7, g.x + 8, g.x + g.w - 70), sy - 8, `零點 ${fmt(z)}`, PALETTE.green, 235);
  }
}

function drawHoles(
  p: p5,
  g: ReturnType<typeof createRationalAsymptotePlotRect>,
  holes: Array<{ x: number; y: number }>,
): void {
  for (const hole of holes) {
    if (hole.x < RATIONAL_ASYMPTOTE_CONFIG.xMin || hole.x > RATIONAL_ASYMPTOTE_CONFIG.xMax) continue;
    const sx = xToScreen(g, hole.x);
    const sy = yToScreenClamped(g, hole.y);

    p.stroke(...PALETTE.gold, 242);
    p.strokeWeight(2.2);
    p.fill(...PALETTE.bg, 242);
    p.circle(sx, sy, 12);
    drawLabelScreen(p, clamp(sx + 8, g.x + 8, g.x + g.w - 72), sy - 8, `洞 x=${fmt(hole.x)}`, PALETTE.gold, 242);
  }
}

function drawLocalWindow(
  p: p5,
  g: ReturnType<typeof createRationalAsymptotePlotRect>,
  model: ReturnType<typeof buildRationalAsymptoteModel>,
): void {
  if (!model.verticals.length) return;

  const a = model.verticals[0]!;
  const localW = clamp(g.w * 0.36, 128, 172);
  const localH = clamp(g.h * 0.32, 84, 108);
  const local = { x: g.x + g.w - localW - 14, y: g.y + g.h - localH - 14, w: localW, h: localH };
  const lxMin = Math.max(RATIONAL_ASYMPTOTE_CONFIG.xMin, a - RATIONAL_ASYMPTOTE_CONFIG.localHalfWidth);
  const lxMax = Math.min(RATIONAL_ASYMPTOTE_CONFIG.xMax, a + RATIONAL_ASYMPTOTE_CONFIG.localHalfWidth);
  const poleEps = (lxMax - lxMin) * 0.012;

  p.fill(...PALETTE.bg, 224);
  p.stroke(...PALETTE.faint, 150);
  p.strokeWeight(1);
  p.rect(local.x, local.y, local.w, local.h, 14);

  p.stroke(...PALETTE.red, 115);
  dashedLine(p, mapRange(a, lxMin, lxMax, local.x + 8, local.x + local.w - 8), local.y + 8, mapRange(a, lxMin, lxMax, local.x + 8, local.x + local.w - 8), local.y + local.h - 18, [4, 5]);

  p.noFill();
  p.stroke(...PALETTE.gold, 220);
  p.strokeWeight(1.8);
  let drawing = false;
  for (let i = 0; i <= 180; i += 1) {
    const x = p.lerp(lxMin, lxMax, i / 180);
    const y = model.f(x);
    const rawY = Number.isFinite(y)
      ? mapRange(y, RATIONAL_ASYMPTOTE_CONFIG.localYMin, RATIONAL_ASYMPTOTE_CONFIG.localYMax, local.y + local.h - 18, local.y + 8)
      : NaN;
    const shouldBreak = Math.abs(x - a) < poleEps || !Number.isFinite(y) || rawY < local.y - 12 || rawY > local.y + local.h + 12;
    if (shouldBreak) {
      if (drawing) p.endShape();
      drawing = false;
      continue;
    }
    if (!drawing) {
      p.beginShape();
      drawing = true;
    }
    p.vertex(mapRange(x, lxMin, lxMax, local.x + 8, local.x + local.w - 8), clamp(rawY, local.y + 8, local.y + local.h - 18));
  }
  if (drawing) p.endShape();

  p.noStroke();
  p.fill(...PALETTE.muted, 220);
  p.textSize(11);
  p.text('局部窗口', local.x + 10, local.y + local.h - 6);
}

function drawSceneHud(
  p: p5,
  snap: RationalVerticalHorizontalAsymptotesSnap,
  model: ReturnType<typeof buildRationalAsymptoteModel>,
): void {
  p.noStroke();
  p.fill(...PALETTE.text, 235);
  p.textSize(15);
  p.textStyle(p.BOLD);
  p.text('垂直與水平漸近線', 18, 26);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.fill(...PALETTE.muted, 220);
  p.text(`${snap.preset.modeName} · ${model.horizontal.label}`, 18, 47);

  p.textAlign(p.RIGHT, p.TOP);
  p.text(model.warning || snap.preset.note, snap.size - 18, 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function dashedDataLine(
  p: p5,
  g: ReturnType<typeof createRationalAsymptotePlotRect>,
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

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (Math.abs(inMax - inMin) < 1e-12) return (outMin + outMax) / 2;
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
