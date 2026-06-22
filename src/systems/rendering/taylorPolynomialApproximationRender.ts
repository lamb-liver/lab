import type p5 from 'p5';
import {
  TAYLOR_MAX_TERM_CURVES,
  TAYLOR_SAMPLE_N,
  buildFunctionPoints,
  clampY,
  createTaylorPlotRect,
  fmt,
  fmtAxis,
  screenToX,
  taylorTerm,
  taylorValue,
  xToScreen,
  yToScreen,
  yToScreenClamped,
  type TaylorPreset,
} from '../../curve/modules/taylor-polynomial-approximation/geometry';

type TaylorPolynomialApproximationSnap = {
  size: number;
  preset: TaylorPreset;
  a: number;
  n: number;
  showError: boolean;
  showTerms: boolean;
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

export function aFromTaylorPointer(
  size: number,
  mouseX: number,
  preset: TaylorPreset,
): number {
  const plot = createTaylorPlotRect(size);
  return clamp(screenToX(plot, mouseX, preset), preset.aMin, preset.aMax);
}

export function isTaylorPointerInPlot(
  size: number,
  mouseX: number,
  mouseY: number,
): boolean {
  const plot = createTaylorPlotRect(size);
  return mouseX >= plot.x - 8 &&
    mouseX <= plot.x + plot.w + 8 &&
    mouseY >= plot.y - 8 &&
    mouseY <= plot.y + plot.h + 8;
}

export function renderTaylorPolynomialApproximationScene(
  p: p5,
  snap: TaylorPolynomialApproximationSnap,
): void {
  p.background(...PALETTE.bg);

  const plot = createTaylorPlotRect(snap.size);
  drawPlotFrame(p, plot, snap.preset);
  if (snap.showError) drawErrorBand(p, plot, snap);
  drawFunctionGhost(p, plot, snap.preset);
  if (snap.showTerms) drawTermDecomposition(p, plot, snap);
  drawTaylorCurve(p, plot, snap);
  drawCenterLine(p, plot, snap.preset, snap.a);
  drawCenterPoint(p, plot, snap);
  drawSceneHud(p, snap);
}

function drawPlotFrame(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  preset: TaylorPreset,
): void {
  p.noFill();
  p.stroke(...PALETTE.faint, 90);
  p.strokeWeight(1);
  p.rect(g.x, g.y, g.w, g.h, 18);

  p.strokeWeight(1);
  for (let i = 0; i <= 8; i += 1) {
    const x = p.lerp(g.x, g.x + g.w, i / 8);
    p.stroke(...PALETTE.guide, 20);
    p.line(x, g.y, x, g.y + g.h);
  }

  for (let i = 0; i <= 6; i += 1) {
    const y = p.lerp(g.y, g.y + g.h, i / 6);
    p.stroke(...PALETTE.guide, 20);
    p.line(g.x, y, g.x + g.w, y);
  }

  const zeroY = yToScreen(g, 0, preset);
  if (zeroY >= g.y && zeroY <= g.y + g.h) {
    p.stroke(...PALETTE.guide, 82);
    p.strokeWeight(1.2);
    p.line(g.x, zeroY, g.x + g.w, zeroY);
  }

  const zeroX = xToScreen(g, 0, preset);
  if (zeroX >= g.x && zeroX <= g.x + g.w) {
    p.stroke(...PALETTE.guide, 52);
    p.strokeWeight(1.1);
    p.line(zeroX, g.y, zeroX, g.y + g.h);
  }

  p.noStroke();
  p.fill(...PALETTE.text, 224);
  p.textSize(12.5);
  p.textStyle(p.BOLD);
  p.text('原函數 ghost 與 T_n(x)', g.x + 12, g.y + 20);
  p.textStyle(p.NORMAL);

  p.fill(...PALETTE.muted, 190);
  p.textSize(11.5);
  p.text(fmtAxis(preset.xMin), g.x, g.y + g.h + 19);
  p.textAlign(p.RIGHT, p.BASELINE);
  p.text(fmtAxis(preset.xMax), g.x + g.w, g.y + g.h + 19);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawFunctionGhost(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  preset: TaylorPreset,
): void {
  p.noFill();
  p.stroke(...PALETTE.guide, 88);
  p.strokeWeight(2.4);
  p.beginShape();
  for (const point of buildFunctionPoints(preset, preset.f, TAYLOR_SAMPLE_N)) {
    p.vertex(xToScreen(g, point.x, preset), yToScreenClamped(g, point.y, preset));
  }
  p.endShape();
  drawLabelScreen(p, g.x + g.w - 64, g.y + 24, 'f(x)', PALETTE.guide, 12);
}

function drawTaylorCurve(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  snap: TaylorPolynomialApproximationSnap,
): void {
  p.noFill();
  p.stroke(...PALETTE.gold, 248);
  p.strokeWeight(3);
  p.beginShape();
  for (const point of buildFunctionPoints(
    snap.preset,
    (x) => taylorValue(snap.preset, x, snap.a, snap.n),
    TAYLOR_SAMPLE_N,
  )) {
    p.vertex(xToScreen(g, point.x, snap.preset), yToScreenClamped(g, point.y, snap.preset));
  }
  p.endShape();

  const labelX = clamp(xToScreen(g, snap.a, snap.preset) + 16, g.x + 12, g.x + g.w - 74);
  drawLabelScreen(p, labelX, g.y + 48, `T${snap.n}(x)`, PALETTE.gold, 12);
}

function drawErrorBand(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  snap: TaylorPolynomialApproximationSnap,
): void {
  p.noStroke();
  p.fill(...PALETTE.red, 28);
  p.beginShape();

  for (let i = 0; i <= TAYLOR_SAMPLE_N; i += 1) {
    const x = p.lerp(snap.preset.xMin, snap.preset.xMax, i / TAYLOR_SAMPLE_N);
    const y = clampY(snap.preset.f(x), snap.preset);
    p.vertex(xToScreen(g, x, snap.preset), yToScreen(g, y, snap.preset));
  }

  for (let i = TAYLOR_SAMPLE_N; i >= 0; i -= 1) {
    const x = p.lerp(snap.preset.xMin, snap.preset.xMax, i / TAYLOR_SAMPLE_N);
    const y = clampY(taylorValue(snap.preset, x, snap.a, snap.n), snap.preset);
    p.vertex(xToScreen(g, x, snap.preset), yToScreen(g, y, snap.preset));
  }

  p.endShape(p.CLOSE);
}

function drawTermDecomposition(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  snap: TaylorPolynomialApproximationSnap,
): void {
  const maxTerms = Math.min(snap.n, TAYLOR_MAX_TERM_CURVES);

  for (let k = 0; k <= maxTerms; k += 1) {
    const color = k % 2 === 0 ? PALETTE.blue : PALETTE.green;
    p.noFill();
    p.stroke(...color, 58);
    p.strokeWeight(k === snap.n ? 1.7 : 1.1);
    p.beginShape();
    for (const point of buildFunctionPoints(
      snap.preset,
      (x) => taylorTerm(snap.preset, x, snap.a, k),
      TAYLOR_SAMPLE_N,
    )) {
      p.vertex(xToScreen(g, point.x, snap.preset), yToScreenClamped(g, point.y, snap.preset));
    }
    p.endShape();
  }

  const note =
    snap.n > TAYLOR_MAX_TERM_CURVES
      ? `項次分解：顯示 0-${TAYLOR_MAX_TERM_CURVES} 階`
      : `項次分解：0-${snap.n} 階`;
  drawLabelScreen(p, g.x + 12, g.y + g.h - 14, note, PALETTE.blue, 11.5);
}

function drawCenterLine(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  preset: TaylorPreset,
  a: number,
): void {
  const sx = xToScreen(g, a, preset);
  p.stroke(...PALETTE.gold, 108);
  p.strokeWeight(1.4);
  p.push();
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.setLineDash([5, 6]);
  p.line(sx, g.y, sx, g.y + g.h);
  ctx.setLineDash([]);
  p.pop();

  p.noStroke();
  p.fill(...PALETTE.text, 235);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text('a', sx, g.y + g.h + 19);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawCenterPoint(
  p: p5,
  g: ReturnType<typeof createTaylorPlotRect>,
  snap: TaylorPolynomialApproximationSnap,
): void {
  const sx = xToScreen(g, snap.a, snap.preset);
  const sy = yToScreenClamped(g, snap.preset.f(snap.a), snap.preset);
  p.noStroke();
  p.fill(...PALETTE.gold, snap.activeDrag ? 255 : 240);
  p.circle(sx, sy, snap.activeDrag ? 14 : 10);

  const label = `a=${fmt(snap.a)}`;
  p.textSize(11.5);
  const labelW = Math.max(56, p.textWidth(label) + 14);
  const labelH = 22;
  const lx = clamp(sx + 8, g.x + 4, g.x + g.w - labelW - 4);
  const ly = clamp(sy - 25, g.y + 4, g.y + g.h - labelH - 4);
  p.fill(15, 15, 15, 158);
  p.rect(lx, ly, labelW, labelH, 8);
  p.fill(...PALETTE.gold, 242);
  p.text(label, lx + 7, ly + 15);
}

function drawSceneHud(p: p5, snap: TaylorPolynomialApproximationSnap): void {
  p.noStroke();
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.fill(...PALETTE.muted, 230);
  p.text(`${snap.preset.formula} · n=${snap.n} · 拖動展開中心 a`, 18, 24);

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
