import type p5 from 'p5';
import {
  EIGENVECTOR_GRID_RADIUS,
  EIGENVECTOR_WORLD_RADIUS,
  eigenData,
  eigenStatusText,
  fmt,
  matVec,
  scaleVec,
  type EigenData,
  type Matrix2,
  type Vector2,
} from '../../curve/modules/eigenvector-geometry';

type EigenvectorGeometrySnap = {
  width: number;
  height: number;
  matrix: Matrix2;
  u: Vector2;
  activeDrag: boolean;
  presetNote?: string;
};

type Color = readonly [number, number, number];

type SceneGeometry = {
  cx: number;
  cy: number;
  scale: number;
  width: number;
  height: number;
};

const PALETTE = {
  bg: [10, 10, 10] as Color,
  text: [232, 232, 232] as Color,
  muted: [140, 140, 140] as Color,
  guide: [216, 216, 216] as Color,
  gold: [212, 184, 122] as Color,
  blue: [93, 173, 226] as Color,
  green: [139, 204, 151] as Color,
  red: [231, 111, 81] as Color,
};

export function createEigenvectorSceneGeometry(width: number, height: number): SceneGeometry {
  const pad = Math.max(26, Math.min(54, Math.min(width, height) * 0.08));
  const scale = Math.min(width - pad * 2, height - pad * 2) / (2 * EIGENVECTOR_WORLD_RADIUS);
  return {
    cx: width / 2,
    cy: height / 2,
    scale,
    width,
    height,
  };
}

export function worldToScreen(geo: SceneGeometry, v: Vector2): Vector2 {
  return {
    x: geo.cx + v.x * geo.scale,
    y: geo.cy - v.y * geo.scale,
  };
}

export function screenToWorld(geo: SceneGeometry, p: Vector2): Vector2 {
  return {
    x: (p.x - geo.cx) / geo.scale,
    y: -(p.y - geo.cy) / geo.scale,
  };
}

export function renderEigenvectorGeometryScene(
  p: p5,
  snap: EigenvectorGeometrySnap,
): void {
  p.background(...PALETTE.bg);
  const geo = createEigenvectorSceneGeometry(snap.width, snap.height);
  const eigen = eigenData(snap.matrix);

  drawGrid(p, geo, snap.matrix);
  drawEigenDirections(p, geo, eigen);
  drawGeneralVector(p, geo, snap.matrix, snap.u, snap.activeDrag);
  drawAxes(p, geo);
  drawHud(p, snap, eigen);
}

function drawGrid(p: p5, geo: SceneGeometry, matrix: Matrix2): void {
  const r = EIGENVECTOR_GRID_RADIUS;
  p.strokeWeight(1);

  for (let i = -r; i <= r; i += 1) {
    p.stroke(...PALETTE.guide, i === 0 ? 48 : 20);
    drawWorldLine(p, geo, { x: -r, y: i }, { x: r, y: i });
    drawWorldLine(p, geo, { x: i, y: -r }, { x: i, y: r });
  }

  for (let i = -r; i <= r; i += 1) {
    const major = i === 0;
    p.stroke(...PALETTE.gold, major ? 126 : 52);
    drawWorldLine(p, geo, matVec(matrix, { x: -r, y: i }), matVec(matrix, { x: r, y: i }));
    p.stroke(...PALETTE.blue, major ? 108 : 45);
    drawWorldLine(p, geo, matVec(matrix, { x: i, y: -r }), matVec(matrix, { x: i, y: r }));
  }
}

function drawAxes(p: p5, geo: SceneGeometry): void {
  const r = EIGENVECTOR_WORLD_RADIUS;
  p.stroke(...PALETTE.guide, 82);
  p.strokeWeight(1.4);
  drawWorldLine(p, geo, { x: -r, y: 0 }, { x: r, y: 0 });
  drawWorldLine(p, geo, { x: 0, y: -r }, { x: 0, y: r });

  const origin = worldToScreen(geo, { x: 0, y: 0 });
  p.noStroke();
  p.fill(...PALETTE.text, 214);
  p.circle(origin.x, origin.y, 4.5);
}

function drawEigenDirections(p: p5, geo: SceneGeometry, eigen: EigenData): void {
  if (eigen.kind === 'complex') {
    drawNoRealDirectionMark(p, geo);
    return;
  }

  if (eigen.kind === 'all') {
    drawAllDirectionGlow(p, geo, eigen.lambda);
    return;
  }

  eigen.directions.forEach((direction, index) => {
    const color = index === 0 ? PALETTE.gold : PALETTE.green;
    drawDirectionLine(p, geo, direction.v, color, index === 0 ? 235 : 190);

    const baseLen = 1.18;
    drawWorldArrow(p, geo, { x: 0, y: 0 }, scaleVec(direction.v, baseLen), PALETTE.guide, 170, 1.6, `v${index + 1}`);
    drawWorldArrow(
      p,
      geo,
      { x: 0, y: 0 },
      scaleVec(direction.v, clamp(direction.lambda * baseLen, -2.65, 2.65)),
      color,
      245,
      3,
      `Av${index + 1}`,
    );

    const labelPos = scaleVec(direction.v, direction.lambda >= 0 ? 3.3 : -3.3);
    drawWorldLabel(p, geo, labelPos, `λ${index + 1}=${fmt(direction.lambda)}`, color, 12);
  });
}

function drawDirectionLine(
  p: p5,
  geo: SceneGeometry,
  v: Vector2,
  color: Color,
  alpha: number,
): void {
  const a = scaleVec(v, -9);
  const b = scaleVec(v, 9);

  p.stroke(...color, alpha);
  p.strokeWeight(2.6);
  drawWorldLine(p, geo, a, b);

  p.stroke(...color, alpha * 0.24);
  p.strokeWeight(9);
  drawWorldLine(p, geo, a, b);
}

function drawAllDirectionGlow(p: p5, geo: SceneGeometry, lambda: number): void {
  for (let i = 0; i < 18; i += 1) {
    const t = (Math.PI * i) / 18;
    const v = { x: Math.cos(t), y: Math.sin(t) };
    p.stroke(...PALETTE.gold, 22);
    p.strokeWeight(1.7);
    drawWorldLine(p, geo, scaleVec(v, -8), scaleVec(v, 8));
  }

  const v = { x: 1.3, y: 0.75 };
  drawWorldArrow(p, geo, { x: 0, y: 0 }, v, PALETTE.guide, 184, 1.6, 'v');
  drawWorldArrow(p, geo, { x: 0, y: 0 }, scaleVec(v, lambda), PALETTE.gold, 242, 3, 'Av');
  drawWorldLabel(p, geo, { x: -3.6, y: 3.6 }, '每個方向', PALETTE.gold, 13);
}

function drawNoRealDirectionMark(p: p5, geo: SceneGeometry): void {
  const center = worldToScreen(geo, { x: 0, y: 0 });
  p.noFill();
  p.stroke(...PALETTE.red, 190);
  p.strokeWeight(2);
  p.circle(center.x, center.y, 2.9 * geo.scale);

  p.stroke(...PALETTE.red, 180);
  p.strokeWeight(2.4);
  drawWorldLine(p, geo, { x: -1, y: -1 }, { x: 1, y: 1 });
  drawWorldLabel(p, geo, { x: -2.45, y: 2.3 }, '無實特徵方向', PALETTE.red, 13);
}

function drawGeneralVector(
  p: p5,
  geo: SceneGeometry,
  matrix: Matrix2,
  u: Vector2,
  activeDrag: boolean,
): void {
  const au = matVec(matrix, u);
  drawWorldArrow(p, geo, { x: 0, y: 0 }, u, PALETTE.blue, 235, 2.4, 'u');
  drawWorldArrow(p, geo, { x: 0, y: 0 }, au, PALETTE.gold, 240, 3.2, 'Au');

  p.stroke(...PALETTE.blue, 62);
  p.strokeWeight(1);
  drawWorldLine(p, geo, u, au);

  const head = worldToScreen(geo, u);
  p.noStroke();
  p.fill(...PALETTE.blue, activeDrag ? 255 : 224);
  p.circle(head.x, head.y, activeDrag ? 13 : 10);
}

function drawHud(p: p5, snap: EigenvectorGeometrySnap, eigen: EigenData): void {
  p.noStroke();
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans TC", sans-serif');
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.fill(...PALETTE.muted, 230);
  p.text(`${eigenStatusText(eigen)} · 拖動藍色 u`, 18, 24);

  if (!snap.presetNote) return;
  p.textAlign(p.RIGHT, p.TOP);
  p.fill(...PALETTE.muted, 210);
  p.text(snap.presetNote, snap.width - 18, 18);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawWorldLine(p: p5, geo: SceneGeometry, a: Vector2, b: Vector2): void {
  const pa = worldToScreen(geo, a);
  const pb = worldToScreen(geo, b);
  p.line(pa.x, pa.y, pb.x, pb.y);
}

function drawWorldArrow(
  p: p5,
  geo: SceneGeometry,
  a: Vector2,
  b: Vector2,
  color: Color,
  alpha: number,
  weight: number,
  label?: string,
): void {
  const pa = worldToScreen(geo, a);
  const pb = worldToScreen(geo, b);
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  p.line(pa.x, pa.y, pb.x, pb.y);

  const angle = Math.atan2(pb.y - pa.y, pb.x - pa.x);
  const size = 7 + weight * 1.5;
  p.noStroke();
  p.fill(...color, alpha);
  p.triangle(
    pb.x,
    pb.y,
    pb.x - Math.cos(angle - 0.45) * size,
    pb.y - Math.sin(angle - 0.45) * size,
    pb.x - Math.cos(angle + 0.45) * size,
    pb.y - Math.sin(angle + 0.45) * size,
  );

  if (label) {
    drawLabelScreen(
      p,
      clamp(pb.x + Math.cos(angle) * 12 + 4, 10, geo.width - 54),
      clamp(pb.y + Math.sin(angle) * 12 - 4, 18, geo.height - 14),
      label,
      color,
      12,
    );
  }
}

function drawWorldLabel(
  p: p5,
  geo: SceneGeometry,
  pos: Vector2,
  label: string,
  color: Color,
  size: number,
): void {
  const screen = worldToScreen(geo, pos);
  drawLabelScreen(
    p,
    clamp(screen.x, 12, geo.width - p.textWidth(label) - 16),
    clamp(screen.y, 20, geo.height - 12),
    label,
    color,
    size,
  );
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
