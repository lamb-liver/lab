import type p5 from 'p5';
import {
  FUNCTION_DERIVATIVE_SAMPLE_N,
  buildFunctionPoints,
  createFunctionDerivativeLayout,
  fmt,
  fmtAxis,
  nearestZeroInfo,
  screenToX,
  slopeStateText,
  visibleZeros,
  xToScreen,
  yToScreen,
  zeroTypeText,
  type FunctionDerivativePreset,
  type GraphRect,
} from '../../curve/modules/function-derivative-graph/geometry';

export type FunctionDerivativeGraphSnap = {
  size: number;
  preset: FunctionDerivativePreset;
  x0: number;
  showZeros: boolean;
  showMonotonic: boolean;
  activeDrag: boolean;
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

export function xFromFunctionDerivativePointer(
  size: number,
  mouseX: number,
  mouseY: number,
  preset: FunctionDerivativePreset,
): number {
  const graphs = createFunctionDerivativeLayout(size);
  const graph = mouseY <= graphs.bottom.y ? graphs.top : graphs.bottom;
  return screenToX(graph, mouseX, preset);
}

export function isFunctionDerivativePointerInPlot(
  size: number,
  mouseX: number,
  mouseY: number,
): boolean {
  const graphs = createFunctionDerivativeLayout(size);
  return rectContains(graphs.top, mouseX, mouseY, 8) ||
    rectContains(graphs.bottom, mouseX, mouseY, 8);
}

export function renderFunctionDerivativeGraphScene(
  p: p5,
  snap: FunctionDerivativeGraphSnap,
): void {
  p.background(...PALETTE.bg);

  const graphs = createFunctionDerivativeLayout(snap.size);
  drawGraphFrame(p, graphs.top, snap.preset, snap.preset.yMin, snap.preset.yMax, 'y=f(x)');
  drawGraphFrame(p, graphs.bottom, snap.preset, snap.preset.dMin, snap.preset.dMax, "y=f'(x)");

  if (snap.showMonotonic) {
    drawMonotonicBands(p, graphs.top, snap.preset);
    drawMonotonicBands(p, graphs.bottom, snap.preset);
  }

  drawFunctionCurve(p, graphs.top, snap.preset, snap.preset.f, snap.preset.yMin, snap.preset.yMax, PALETTE.gold, 2.7);
  drawFunctionCurve(p, graphs.bottom, snap.preset, snap.preset.df, snap.preset.dMin, snap.preset.dMax, PALETTE.blue, 2.5);

  if (snap.showZeros) drawDerivativeZeros(p, graphs, snap.preset);

  drawCheckerLine(p, graphs, snap.preset, snap.x0);
  drawTangentAtX0(p, graphs.top, snap.preset, snap.x0);
  drawCurrentPoints(p, graphs, snap);
  drawSceneHud(p, snap);
}

function drawGraphFrame(
  p: p5,
  g: GraphRect,
  preset: FunctionDerivativePreset,
  yMin: number,
  yMax: number,
  label: string,
): void {
  p.noFill();
  p.stroke(...PALETTE.faint, 90);
  p.strokeWeight(1);
  p.rect(g.x, g.y, g.w, g.h, 18);

  p.strokeWeight(1);
  for (let i = 0; i <= 6; i += 1) {
    const x = p.lerp(g.x, g.x + g.w, i / 6);
    p.stroke(...PALETTE.guide, i === 3 ? 46 : 20);
    p.line(x, g.y, x, g.y + g.h);
  }

  for (let i = 0; i <= 4; i += 1) {
    const y = p.lerp(g.y, g.y + g.h, i / 4);
    p.stroke(...PALETTE.guide, 20);
    p.line(g.x, y, g.x + g.w, y);
  }

  const zeroY = yToScreen(g, 0, yMin, yMax);
  if (zeroY >= g.y && zeroY <= g.y + g.h) {
    p.stroke(...PALETTE.guide, 82);
    p.strokeWeight(1.2);
    p.line(g.x, zeroY, g.x + g.w, zeroY);
  }

  const zeroX = xToScreen(g, 0, preset);
  if (zeroX >= g.x && zeroX <= g.x + g.w) {
    p.stroke(...PALETTE.guide, 46);
    p.strokeWeight(1.1);
    p.line(zeroX, g.y, zeroX, g.y + g.h);
  }

  p.noStroke();
  p.fill(...PALETTE.text, 224);
  p.textSize(12.5);
  p.textStyle(p.BOLD);
  p.text(label, g.x + 12, g.y + 20);
  p.textStyle(p.NORMAL);

  p.fill(...PALETTE.muted, 190);
  p.textSize(11.5);
  p.text(fmtAxis(preset.xMin), g.x, g.y + g.h + 18);
  p.textAlign(p.RIGHT, p.BASELINE);
  p.text(fmtAxis(preset.xMax), g.x + g.w, g.y + g.h + 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawFunctionCurve(
  p: p5,
  g: GraphRect,
  preset: FunctionDerivativePreset,
  fn: (x: number) => number,
  yMin: number,
  yMax: number,
  color: Color,
  weight: number,
): void {
  p.noFill();
  p.stroke(...color, 245);
  p.strokeWeight(weight);
  p.beginShape();
  for (const point of buildFunctionPoints(preset, fn, FUNCTION_DERIVATIVE_SAMPLE_N)) {
    p.vertex(xToScreen(g, point.x, preset), yToScreen(g, point.y, yMin, yMax));
  }
  p.endShape();
}

function drawMonotonicBands(
  p: p5,
  g: GraphRect,
  preset: FunctionDerivativePreset,
): void {
  const n = 180;
  p.noStroke();

  for (let i = 0; i < n; i += 1) {
    const x1 = p.lerp(preset.xMin, preset.xMax, i / n);
    const x2 = p.lerp(preset.xMin, preset.xMax, (i + 1) / n);
    const xm = (x1 + x2) / 2;
    const color = preset.df(xm) >= 0 ? PALETTE.green : PALETTE.red;
    p.fill(...color, 14);
    const sx1 = xToScreen(g, x1, preset);
    const sx2 = xToScreen(g, x2, preset);
    p.rect(sx1, g.y, sx2 - sx1 + 1, g.h);
  }
}

function drawDerivativeZeros(
  p: p5,
  graphs: ReturnType<typeof createFunctionDerivativeLayout>,
  preset: FunctionDerivativePreset,
): void {
  for (const z of visibleZeros(preset)) {
    const sxTop = xToScreen(graphs.top, z, preset);
    const syTop = yToScreen(graphs.top, preset.f(z), preset.yMin, preset.yMax);
    const sxBot = xToScreen(graphs.bottom, z, preset);
    const syBot = yToScreen(graphs.bottom, 0, preset.dMin, preset.dMax);

    p.stroke(...PALETTE.gold, 82);
    p.strokeWeight(1.2);
    p.line(sxTop, graphs.top.y, sxTop, graphs.top.y + graphs.top.h);
    p.line(sxBot, graphs.bottom.y, sxBot, graphs.bottom.y + graphs.bottom.h);

    p.noStroke();
    p.fill(...PALETTE.gold, 242);
    p.circle(sxTop, syTop, 7);
    p.circle(sxBot, syBot, 7);

    p.stroke(...PALETTE.gold, 158);
    p.strokeWeight(1.5);
    p.line(clamp(sxTop - 28, graphs.top.x, graphs.top.x + graphs.top.w), syTop, clamp(sxTop + 28, graphs.top.x, graphs.top.x + graphs.top.w), syTop);
    drawLabelScreen(p, sxBot + 7, syBot - 7, "f'=0", PALETTE.gold, 11.5);
  }
}

function drawCheckerLine(
  p: p5,
  graphs: ReturnType<typeof createFunctionDerivativeLayout>,
  preset: FunctionDerivativePreset,
  x0: number,
): void {
  const sx = xToScreen(graphs.top, x0, preset);
  p.stroke(...PALETTE.guide, 102);
  p.strokeWeight(1.3);
  p.push();
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.setLineDash([5, 6]);
  p.line(sx, graphs.top.y, sx, graphs.top.y + graphs.top.h);
  p.line(sx, graphs.bottom.y, sx, graphs.bottom.y + graphs.bottom.h);
  ctx.setLineDash([]);
  p.pop();

  p.noStroke();
  p.fill(...PALETTE.text, 235);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text('x₀', sx, graphs.bottom.y + graphs.bottom.h + 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawTangentAtX0(
  p: p5,
  g: GraphRect,
  preset: FunctionDerivativePreset,
  x0: number,
): void {
  const y0 = preset.f(x0);
  const slope = preset.df(x0);
  const dx = (preset.xMax - preset.xMin) * 0.14;
  const x1 = clamp(x0 - dx, preset.xMin, preset.xMax);
  const x2 = clamp(x0 + dx, preset.xMin, preset.xMax);
  const y1 = y0 + slope * (x1 - x0);
  const y2 = y0 + slope * (x2 - x0);

  p.stroke(...PALETTE.green, 210);
  p.strokeWeight(2);
  p.line(
    xToScreen(g, x1, preset),
    yToScreen(g, y1, preset.yMin, preset.yMax),
    xToScreen(g, x2, preset),
    yToScreen(g, y2, preset.yMin, preset.yMax),
  );

  const sx = xToScreen(g, x0, preset);
  const sy = yToScreen(g, y0, preset.yMin, preset.yMax);
  drawLabelScreen(p, sx + 10, sy - 10, `slope=${fmt(slope)}`, PALETTE.green, 11.5);
}

function drawCurrentPoints(
  p: p5,
  graphs: ReturnType<typeof createFunctionDerivativeLayout>,
  snap: FunctionDerivativeGraphSnap,
): void {
  const x0 = snap.x0;
  const y0 = snap.preset.f(x0);
  const d0 = snap.preset.df(x0);
  const top = {
    x: xToScreen(graphs.top, x0, snap.preset),
    y: yToScreen(graphs.top, y0, snap.preset.yMin, snap.preset.yMax),
  };
  const bottom = {
    x: xToScreen(graphs.bottom, x0, snap.preset),
    y: yToScreen(graphs.bottom, d0, snap.preset.dMin, snap.preset.dMax),
  };

  p.noStroke();
  p.fill(...PALETTE.gold, 250);
  p.circle(top.x, top.y, snap.activeDrag ? 13 : 10);
  p.fill(...PALETTE.blue, 250);
  p.circle(bottom.x, bottom.y, snap.activeDrag ? 13 : 10);
}

function drawSceneHud(p: p5, snap: FunctionDerivativeGraphSnap): void {
  const d0 = snap.preset.df(snap.x0);
  const zeroInfo = nearestZeroInfo(snap.preset, snap.x0);
  const status = zeroInfo?.near ? zeroTypeText(snap.preset, zeroInfo.x) : slopeStateText(d0);

  p.noStroke();
  p.fill(...PALETTE.text, 235);
  p.textSize(15);
  p.textStyle(p.BOLD);
  p.text('原函數與導函數圖形對照', 18, 24);

  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.fill(...PALETTE.muted, 230);
  p.text(`${status} · 拖動垂直檢查線 x₀`, 18, 45);

  p.textAlign(p.RIGHT, p.TOP);
  p.fill(...PALETTE.muted, 210);
  p.text(snap.preset.note, snap.size - 18, 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawLabelScreen(
  p: p5,
  x: number,
  y: number,
  label: string,
  color: Color,
  size: number,
): void {
  p.noStroke();
  p.textSize(size);
  p.textStyle(p.NORMAL);
  const textWidth = p.textWidth(label);
  p.fill(...PALETTE.bg, 148);
  p.rect(x - 5, y - size - 3, textWidth + 10, size + 8, 8);
  p.fill(...color, 240);
  p.text(label, x, y);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function rectContains(g: GraphRect, x: number, y: number, pad = 0): boolean {
  return x >= g.x - pad &&
    x <= g.x + g.w + pad &&
    y >= g.y - pad &&
    y <= g.y + g.h + pad;
}
