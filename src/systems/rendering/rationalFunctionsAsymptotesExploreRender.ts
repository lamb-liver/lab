import type p5 from 'p5';
import {
  RATIONAL_GAP_PX,
  RATIONAL_POLE_EPS_RATIO,
  RATIONAL_SAMPLE_N,
  RATIONAL_X_MAX,
  RATIONAL_X_MIN,
} from '../../explore/rational-functions-asymptotes/constants';
import {
  clamp,
  createRationalPlotRect,
  fmt,
  xToScreen,
  yToScreen,
  yToScreenClamped,
} from '../../explore/rational-functions-asymptotes/geometry';
import type {
  RationalModel,
  RationalPreset,
  Rect,
} from '../../explore/rational-functions-asymptotes/types';

type RationalFunctionsAsymptotesSnap = {
  preset: RationalPreset;
  model: RationalModel;
  showAsymptotes: boolean;
  showHoles: boolean;
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

export function renderRationalFunctionsAsymptotesExploreScene(
  p: p5,
  snap: RationalFunctionsAsymptotesSnap,
): void {
  p.background(...PALETTE.bg);

  const plot = createRationalPlotRect(p.width, p.height);
  drawPlotFrame(p, plot, snap.preset);
  if (snap.showAsymptotes) drawAsymptotes(p, plot, snap.preset, snap.model);
  drawRationalCurve(p, plot, snap.preset, snap.model);
  drawZeros(p, plot, snap.preset, snap.model);
  if (snap.showHoles) drawHoles(p, plot, snap.preset, snap.model);
  drawSceneHud(p, snap);
}

function drawPlotFrame(p: p5, g: Rect, preset: RationalPreset): void {
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

  const zeroX = xToScreen(g, 0);
  if (zeroX >= g.x && zeroX <= g.x + g.w) {
    p.stroke(...PALETTE.guide, 52);
    p.strokeWeight(1.1);
    p.line(zeroX, g.y, zeroX, g.y + g.h);
  }

  p.noStroke();
  p.fill(...PALETTE.text, 224);
  p.textSize(12.5);
  p.textStyle(p.BOLD);
  p.text('R(x) 與圖形骨架', g.x + 12, g.y + 20);
  p.textStyle(p.NORMAL);

  p.fill(...PALETTE.muted, 190);
  p.textSize(11.5);
  p.text(fmt(RATIONAL_X_MIN), g.x, g.y + g.h + 19);
  p.textAlign(p.RIGHT, p.BASELINE);
  p.text(fmt(RATIONAL_X_MAX), g.x + g.w, g.y + g.h + 19);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawAsymptotes(
  p: p5,
  g: Rect,
  preset: RationalPreset,
  model: RationalModel,
): void {
  for (const a of model.verticals) {
    const sx = xToScreen(g, a);
    if (sx < g.x || sx > g.x + g.w) continue;

    p.stroke(...PALETTE.red, 148);
    p.strokeWeight(1.4);
    dashedLine(p, sx, g.y, sx, g.y + g.h, [5, 7]);
    drawLabelScreen(
      p,
      clamp(sx + 8, g.x + 8, g.x + g.w - 70),
      g.y + 42,
      `x=${fmt(a)}`,
      PALETTE.red,
      11.5,
    );
  }

  if (model.far.type === 'horizontal') {
    const sy = yToScreen(g, model.far.value, preset);
    if (sy >= g.y && sy <= g.y + g.h) {
      p.stroke(...PALETTE.blue, 132);
      p.strokeWeight(1.5);
      dashedLine(p, g.x, sy, g.x + g.w, sy, [6, 7]);
      drawLabelScreen(
        p,
        g.x + g.w - 74,
        clamp(sy - 8, g.y + 18, g.y + g.h - 8),
        model.far.label,
        PALETTE.blue,
        11.5,
      );
    }
  }

  if (model.far.type === 'oblique') {
    p.stroke(...PALETTE.blue, 132);
    p.strokeWeight(1.5);
    dashedDataLine(
      p,
      g,
      preset,
      RATIONAL_X_MIN,
      model.far.m * RATIONAL_X_MIN + model.far.b,
      RATIONAL_X_MAX,
      model.far.m * RATIONAL_X_MAX + model.far.b,
      [6, 7],
    );
    drawLabelScreen(p, g.x + g.w - 100, g.y + 36, model.far.label, PALETTE.blue, 11.5);
  }
}

function drawRationalCurve(
  p: p5,
  g: Rect,
  preset: RationalPreset,
  model: RationalModel,
): void {
  const poleEps = (RATIONAL_X_MAX - RATIONAL_X_MIN) * RATIONAL_POLE_EPS_RATIO;

  p.noFill();
  p.stroke(...PALETTE.gold, 248);
  p.strokeWeight(2.9);

  let drawing = false;
  for (let i = 0; i <= RATIONAL_SAMPLE_N; i += 1) {
    const x = p.lerp(RATIONAL_X_MIN, RATIONAL_X_MAX, i / RATIONAL_SAMPLE_N);
    const closeToPole = model.verticals.some((v) => Math.abs(x - v) < poleEps);
    const y = model.f(x);
    const finite = Number.isFinite(y);
    const rawY = finite ? yToScreen(g, y, preset) : NaN;
    const outJump = finite && (rawY < g.y - RATIONAL_GAP_PX || rawY > g.y + g.h + RATIONAL_GAP_PX);

    if (closeToPole || !finite || outJump) {
      if (drawing) {
        p.endShape();
        drawing = false;
      }
      continue;
    }

    if (!drawing) {
      p.beginShape();
      drawing = true;
    }
    p.vertex(xToScreen(g, x), yToScreenClamped(g, y, preset));
  }

  if (drawing) p.endShape();
}

function drawZeros(
  p: p5,
  g: Rect,
  preset: RationalPreset,
  model: RationalModel,
): void {
  for (const z of model.zeros) {
    if (z < RATIONAL_X_MIN || z > RATIONAL_X_MAX) continue;
    const sx = xToScreen(g, z);
    const sy = yToScreen(g, 0, preset);
    if (sy < g.y || sy > g.y + g.h) continue;

    p.noStroke();
    p.fill(...PALETTE.green, 242);
    p.circle(sx, sy, 8);
    drawLabelScreen(
      p,
      clamp(sx + 7, g.x + 8, g.x + g.w - 70),
      sy - 8,
      `零點 ${fmt(z)}`,
      PALETTE.green,
      11.5,
    );
  }
}

function drawHoles(
  p: p5,
  g: Rect,
  preset: RationalPreset,
  model: RationalModel,
): void {
  for (const hole of model.holes) {
    if (hole.x < RATIONAL_X_MIN || hole.x > RATIONAL_X_MAX) continue;
    const sx = xToScreen(g, hole.x);
    const sy = yToScreenClamped(g, hole.y, preset);

    p.stroke(...PALETTE.gold, 242);
    p.strokeWeight(2.2);
    p.fill(...PALETTE.bg, 242);
    p.circle(sx, sy, 12);
    drawLabelScreen(
      p,
      clamp(sx + 8, g.x + 8, g.x + g.w - 72),
      sy - 8,
      `洞 x=${fmt(hole.x)}`,
      PALETTE.gold,
      11.5,
    );
  }
}

function drawSceneHud(p: p5, snap: RationalFunctionsAsymptotesSnap): void {
  p.noStroke();
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.fill(...PALETTE.muted, 230);
  p.text(`${snap.model.family} · ${snap.model.far.label}`, 18, 24);

  p.textAlign(p.RIGHT, p.TOP);
  p.fill(...PALETTE.muted, 210);
  p.text(snap.model.warning || snap.preset.note, p.width - 18, 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function dashedDataLine(
  p: p5,
  g: Rect,
  preset: RationalPreset,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pattern: number[],
): void {
  dashedLine(
    p,
    xToScreen(g, x1),
    yToScreenClamped(g, y1, preset),
    xToScreen(g, x2),
    yToScreenClamped(g, y2, preset),
    pattern,
  );
}

function dashedLine(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pattern: number[],
): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  try {
    ctx.setLineDash(pattern);
    p.line(x1, y1, x2, y2);
  } finally {
    ctx.setLineDash([]);
  }
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
  p.fill(...PALETTE.bg, 158);
  p.rect(x - 5, y - size - 3, textWidth + 10, size + 8, 8);

  p.fill(...color, 240);
  p.text(label, x, y);
}
