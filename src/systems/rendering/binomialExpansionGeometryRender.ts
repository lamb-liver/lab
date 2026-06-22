import type p5 from 'p5';
import {
  BINOMIAL_VIEW,
  type BinomialMode,
  modeFromValue,
  project3,
} from '../../curve/modules/binomial-expansion-geometry/geometry';

type BinomialSnap = {
  width: number;
  height: number;
  a: number;
  b: number;
  mode: BinomialMode;
};

const ACCENT = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };
const TERM_COLORS = {
  a3: { r: 212, g: 184, b: 122 },
  a2b: { r: 120, g: 190, b: 176 },
  ab2: { r: 130, g: 170, b: 220 },
  b3: { r: 198, g: 142, b: 214 },
};

type ProjectionBasis = {
  origin: { x: number; y: number };
  ex: { x: number; y: number };
  ey: { x: number; y: number };
  ez: { x: number; y: number };
};

type CubePiece = {
  label: string;
  value: number;
  dims: [number, number, number];
  offset: [number, number, number];
  color: { r: number; g: number; b: number };
  alpha: number;
};

export function renderBinomialExpansionGeometryScene(p: p5, snap: BinomialSnap): void {
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / BINOMIAL_VIEW.width, snap.height / BINOMIAL_VIEW.height);
  const offsetX = (snap.width - BINOMIAL_VIEW.width * scale) / 2;
  const offsetY = (snap.height - BINOMIAL_VIEW.height * scale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  if (snap.mode === 'square') drawSquareMode(p, snap.a, snap.b);
  else drawCubeMode(p, snap.a, snap.b);

  p.pop();
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
  const basis: ProjectionBasis = {
    origin: { x: BINOMIAL_VIEW.width / 2 - 15, y: 640 },
    ex: { x: 1, y: 0 },
    ey: { x: -0.58, y: 0.42 },
    ez: { x: 0, y: -1 },
  };
  const unit = 420 / total;
  const ax = a * unit;
  const bx = b * unit;
  const size = ax + bx;

  const pieces: CubePiece[] = [
    {
      label: 'a^3',
      value: a ** 3,
      dims: [ax, ax, ax],
      offset: [0, 0, 0],
      color: TERM_COLORS.a3,
      alpha: 0.95,
    },
    {
      label: 'a^2b',
      value: a ** 2 * b,
      dims: [bx, ax, ax],
      offset: [ax, 0, 0],
      color: TERM_COLORS.a2b,
      alpha: 0.86,
    },
    {
      label: 'a^2b',
      value: a ** 2 * b,
      dims: [ax, bx, ax],
      offset: [0, ax, 0],
      color: TERM_COLORS.a2b,
      alpha: 0.86,
    },
    {
      label: 'a^2b',
      value: a ** 2 * b,
      dims: [ax, ax, bx],
      offset: [0, 0, ax],
      color: TERM_COLORS.a2b,
      alpha: 0.86,
    },
    {
      label: 'ab^2',
      value: a * b ** 2,
      dims: [bx, bx, ax],
      offset: [ax, ax, 0],
      color: TERM_COLORS.ab2,
      alpha: 0.78,
    },
    {
      label: 'ab^2',
      value: a * b ** 2,
      dims: [bx, ax, bx],
      offset: [ax, 0, ax],
      color: TERM_COLORS.ab2,
      alpha: 0.78,
    },
    {
      label: 'ab^2',
      value: a * b ** 2,
      dims: [ax, bx, bx],
      offset: [0, ax, ax],
      color: TERM_COLORS.ab2,
      alpha: 0.78,
    },
    {
      label: 'b^3',
      value: b ** 3,
      dims: [bx, bx, bx],
      offset: [ax, ax, ax],
      color: TERM_COLORS.b3,
      alpha: 0.7,
    },
  ];
  for (const piece of pieces) drawBoxProjection(p, basis, piece);
  drawCubeOutline(p, basis, size, 115, 2.2);
}

function drawBoxProjection(
  p: p5,
  basis: ProjectionBasis,
  piece: CubePiece,
): void {
  const [x0, y0, z0] = piece.offset;
  const [w, d, h] = piece.dims;
  const { origin, ex, ey, ez } = basis;
  const p000 = project3(origin, ex, ey, ez, x0, y0, z0);
  const p100 = project3(origin, ex, ey, ez, x0 + w, y0, z0);
  const p110 = project3(origin, ex, ey, ez, x0 + w, y0 + d, z0);
  const p010 = project3(origin, ex, ey, ez, x0, y0 + d, z0);
  const p001 = project3(origin, ex, ey, ez, x0, y0, z0 + h);
  const p101 = project3(origin, ex, ey, ez, x0 + w, y0, z0 + h);
  const p111 = project3(origin, ex, ey, ez, x0 + w, y0 + d, z0 + h);
  const p011 = project3(origin, ex, ey, ez, x0, y0 + d, z0 + h);

  drawFace(p, [p010, p110, p111, p011], piece.color, 34 * piece.alpha);
  drawFace(p, [p100, p110, p111, p101], piece.color, 48 * piece.alpha);
  drawFace(p, [p000, p100, p101, p001], piece.color, 62 * piece.alpha);
  drawFace(p, [p001, p101, p111, p011], piece.color, 88 * piece.alpha);
  drawBoxEdges(p, [p000, p100, p110, p010, p001, p101, p111, p011], piece.color, piece.alpha);

  const center = project3(origin, ex, ey, ez, x0 + w / 2, y0 + d / 2, z0 + h / 2);
  drawPieceLabel(p, center.x, center.y, piece.label, `${piece.value}`);
}

function drawFace(
  p: p5,
  points: { x: number; y: number }[],
  color: { r: number; g: number; b: number },
  alpha: number,
): void {
  p.noStroke();
  p.fill(color.r, color.g, color.b, alpha);
  p.quad(
    points[0].x,
    points[0].y,
    points[1].x,
    points[1].y,
    points[2].x,
    points[2].y,
    points[3].x,
    points[3].y,
  );
}

function drawBoxEdges(
  p: p5,
  points: { x: number; y: number }[],
  color: { r: number; g: number; b: number },
  alpha: number,
): void {
  const [p000, p100, p110, p010, p001, p101, p111, p011] = points;
  p.noFill();
  p.stroke(color.r, color.g, color.b, 135 * alpha);
  p.strokeWeight(1.25);
  for (const [from, to] of [
    [p000, p100],
    [p100, p110],
    [p110, p010],
    [p010, p000],
    [p001, p101],
    [p101, p111],
    [p111, p011],
    [p011, p001],
    [p000, p001],
    [p100, p101],
    [p110, p111],
    [p010, p011],
  ]) {
    p.line(from.x, from.y, to.x, to.y);
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

function drawPieceLabel(p: p5, x: number, y: number, main: string, _sub: string): void {
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(0, 0, 0, 165);
  p.textSize(16);
  p.text(main, x + 1, y - 7);
  p.fill(255, 235, 180, 220);
  p.textSize(16);
  p.text(main, x, y - 8);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawCubeOutline(
  p: p5,
  basis: ProjectionBasis,
  size: number,
  alpha: number,
  weight: number,
): void {
  const { origin, ex, ey, ez } = basis;
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, alpha);
  p.strokeWeight(weight);
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

function resolveMode(value: number | undefined): BinomialMode {
  return modeFromValue(value);
}
