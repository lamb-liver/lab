import type p5 from 'p5';
import {
  BINOMIAL_VIEW,
  type BinomialMode,
  modeFromValue,
  project3,
} from '../../curve/modules/binomial-expansion-geometry/geometry';

export type BinomialSnap = {
  width: number;
  height: number;
  a: number;
  b: number;
  mode: BinomialMode;
};

const ACCENT = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

export function renderBinomialExpansionGeometryScene(p: p5, snap: BinomialSnap): void {
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / BINOMIAL_VIEW.width, snap.height / BINOMIAL_VIEW.height);
  const offsetX = (snap.width - BINOMIAL_VIEW.width * scale) / 2;
  const offsetY = (snap.height - BINOMIAL_VIEW.height * scale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  drawHeader(p, snap.a, snap.b, snap.mode);
  if (snap.mode === 'square') drawSquareMode(p, snap.a, snap.b);
  else drawCubeMode(p, snap.a, snap.b);
  drawFooter(p, snap.a, snap.b, snap.mode);

  p.pop();
}

function drawHeader(p: p5, a: number, b: number, mode: BinomialMode): void {
  p.noStroke();
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 230);
  p.textSize(14);
  p.text('BINOMIAL EXPANSION GEOMETRY', 32, 34);
  p.fill(220, 220, 220, 130);
  p.textSize(12);
  p.text(mode === 'square' ? '(a + b)^2 = a^2 + 2ab + b^2' : '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3', 32, 58);
  p.fill(220, 220, 220, 80);
  p.text(`a = ${a}, b = ${b}, a + b = ${a + b}`, 32, 82);
}

function drawSquareMode(p: p5, a: number, b: number): void {
  const total = a + b;
  const size = 430;
  const unit = size / total;
  const x0 = BINOMIAL_VIEW.width / 2 - size / 2;
  const y0 = 140;
  const aw = a * unit;
  const bw = b * unit;

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.rect(x0, y0, size, size);
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 35);
  p.line(x0 + aw, y0, x0 + aw, y0 + size);
  p.line(x0, y0 + aw, x0 + size, y0 + aw);

  drawGlowRect(p, x0, y0, aw, aw, 0.92);
  drawGlowRect(p, x0 + aw, y0, bw, aw, 0.62);
  drawGlowRect(p, x0, y0 + aw, aw, bw, 0.62);
  drawGlowRect(p, x0 + aw, y0 + aw, bw, bw, 0.38);

  drawPieceLabel(p, x0 + aw / 2, y0 + aw / 2, 'a^2', `${a * a}`);
  drawPieceLabel(p, x0 + aw + bw / 2, y0 + aw / 2, 'ab', `${a * b}`);
  drawPieceLabel(p, x0 + aw / 2, y0 + aw + bw / 2, 'ab', `${a * b}`);
  drawPieceLabel(p, x0 + aw + bw / 2, y0 + aw + bw / 2, 'b^2', `${b * b}`);
}

function drawCubeMode(p: p5, a: number, b: number): void {
  const total = a + b;
  const origin = { x: BINOMIAL_VIEW.width / 2 - 30, y: 420 };
  const unit = 270 / total;
  const ax = a * unit;
  const bx = b * unit;
  const ex = { x: 1, y: 0 };
  const ey = { x: -0.58, y: 0.42 };
  const ez = { x: 0, y: -1 };
  const size = ax + bx;

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.noFill();
  drawEdge(p, origin, ex, ey, ez, 0, 0, 0, size, 0, 0);
  drawEdge(p, origin, ex, ey, ez, 0, 0, 0, 0, size, 0);
  drawEdge(p, origin, ex, ey, ez, 0, 0, 0, 0, 0, size);
  drawEdge(p, origin, ex, ey, ez, size, 0, 0, size, size, 0);
  drawEdge(p, origin, ex, ey, ez, size, 0, 0, size, 0, size);
  drawEdge(p, origin, ex, ey, ez, 0, size, 0, size, size, 0);
  drawEdge(p, origin, ex, ey, ez, 0, size, 0, 0, size, size);
  drawEdge(p, origin, ex, ey, ez, 0, 0, size, size, 0, size);
  drawEdge(p, origin, ex, ey, ez, 0, 0, size, 0, size, size);
  drawEdge(p, origin, ex, ey, ez, size, size, 0, size, size, size);
  drawEdge(p, origin, ex, ey, ez, size, 0, size, size, size, size);
  drawEdge(p, origin, ex, ey, ez, 0, size, size, size, size, size);

  const pieces = [
    { label: 'a^3', value: a ** 3, dims: [ax, ax, ax], offset: [0, 0, 0], alpha: 0.92 },
    { label: 'b^3', value: b ** 3, dims: [bx, bx, bx], offset: [ax, ax, ax], alpha: 0.28 },
  ];
  for (const piece of pieces) drawBoxProjection(p, origin, ex, ey, ez, piece);
}

function drawBoxProjection(
  p: p5,
  origin: { x: number; y: number },
  ex: { x: number; y: number },
  ey: { x: number; y: number },
  ez: { x: number; y: number },
  piece: { label: string; value: number; dims: number[]; offset: number[]; alpha: number },
): void {
  const [x0, y0, z0] = piece.offset;
  const [w, d, h] = piece.dims;
  const p001 = project3(origin, ex, ey, ez, x0, y0, z0 + h);
  const p101 = project3(origin, ex, ey, ez, x0 + w, y0, z0 + h);
  const p111 = project3(origin, ex, ey, ez, x0 + w, y0 + d, z0 + h);
  const p011 = project3(origin, ex, ey, ez, x0, y0 + d, z0 + h);
  p.noStroke();
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 58 * piece.alpha * 0.72);
  p.quad(p001.x, p001.y, p101.x, p101.y, p111.x, p111.y, p011.x, p011.y);
  const center = project3(origin, ex, ey, ez, x0 + w / 2, y0 + d / 2, z0 + h / 2);
  drawPieceLabel(p, center.x, center.y, piece.label, `${piece.value}`);
}

function drawFooter(p: p5, a: number, b: number, mode: BinomialMode): void {
  const x = 32;
  const y = BINOMIAL_VIEW.height - 48;
  p.noStroke();
  p.textSize(12);
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 210);
  if (mode === 'square') {
    p.text(`expanded area: ${(a + b) ** 2}`, x, y);
    p.fill(220, 220, 220, 110);
    p.text(`${a + b}^2 = ${a}^2 + 2*${a}*${b} + ${b}^2 = ${(a + b) ** 2}`, x, y + 22);
  } else {
    p.text(`expanded volume: ${(a + b) ** 3}`, x, y);
    p.fill(220, 220, 220, 110);
    p.text(`${a + b}^3 = ${a}^3 + 3*${a}^2*${b} + 3*${a}*${b}^2 + ${b}^3 = ${(a + b) ** 3}`, x, y + 22);
  }
}

function drawGlowRect(p: p5, x: number, y: number, w: number, h: number, strength: number): void {
  p.noStroke();
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 18 * strength);
  p.rect(x - 3, y - 3, w + 6, h + 6);
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 42 * strength);
  p.rect(x, y, w, h);
  p.noFill();
  p.stroke(ACCENT.r, ACCENT.g, ACCENT.b, 150 * strength);
  p.strokeWeight(1.4);
  p.rect(x, y, w, h);
}

function drawPieceLabel(p: p5, x: number, y: number, main: string, sub: string): void {
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(255, 235, 180, 220);
  p.textSize(14);
  p.text(main, x, y - 8);
  p.fill(220, 220, 220, 100);
  p.textSize(11);
  p.text(sub, x, y + 12);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawEdge(
  p: p5,
  origin: { x: number; y: number },
  ex: { x: number; y: number },
  ey: { x: number; y: number },
  ez: { x: number; y: number },
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): void {
  const a = project3(origin, ex, ey, ez, x1, y1, z1);
  const b = project3(origin, ex, ey, ez, x2, y2, z2);
  p.line(a.x, a.y, b.x, b.y);
}

export function resolveMode(value: number | undefined): BinomialMode {
  return modeFromValue(value);
}
