import type p5 from 'p5';
import { DET_WARN_THRESHOLD, GRID_SAMPLE_STEP, GRID_STEP, WORLD_EXTENT } from '../../curve/modules/matrix-linear-transform/constants';
import {
  getSpecialFormula,
  getSpecialNote,
  getSpecialParam,
  getSpecialTitle,
  matrixDet,
  matrixDifference,
  matrixRotation,
  matrixShearX,
  matrixText,
  multiplyMatrices,
  transformPoint,
} from '../../curve/modules/matrix-linear-transform/matrix';
import type { Matrix2, MatrixMode, SpecialType } from '../../curve/modules/matrix-linear-transform/types';

export type MatrixLinearTransformSnap = {
  width: number;
  height: number;
  mode: MatrixMode;
  currentMatrix: Matrix2;
  specialType: SpecialType;
  composeAngleDeg: number;
  composeShear: number;
};

const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];

function getSingleWorldScale(width: number, height: number): number {
  return Math.min(width, height) * 0.145;
}

function getPanelWorldScale(width: number, height: number): number {
  return Math.min(width, height) * 0.095;
}

function drawOriginalGrid(p: p5, worldScale: number): void {
  const extent = WORLD_EXTENT;
  const step = GRID_STEP;
  const s = worldScale;

  p.push();

  p.stroke(...GUIDE, 6);
  p.strokeWeight(1 / s);

  for (let x = -extent; x <= extent + 0.001; x += step) {
    p.line(x, -extent, x, extent);
  }

  for (let y = -extent; y <= extent + 0.001; y += step) {
    p.line(-extent, y, extent, y);
  }

  p.stroke(...GUIDE, 13);
  p.strokeWeight(1.1 / s);
  p.line(-extent, 0, extent, 0);
  p.line(0, -extent, 0, extent);

  p.pop();
}

function drawTransformedGrid(p: p5, m: Matrix2, worldScale: number): void {
  const extent = WORLD_EXTENT;
  const step = GRID_STEP;
  const sample = GRID_SAMPLE_STEP;
  const s = worldScale;

  p.push();

  p.stroke(...ACCENT, 32);
  p.strokeWeight(1.15 / s);
  p.noFill();

  for (let x = -extent; x <= extent + 0.001; x += step) {
    p.beginShape();
    for (let y = -extent; y <= extent + 0.001; y += sample) {
      const pt = transformPoint(m, x, y);
      p.vertex(pt.x, pt.y);
    }
    p.endShape();
  }

  for (let y = -extent; y <= extent + 0.001; y += step) {
    p.beginShape();
    for (let x = -extent; x <= extent + 0.001; x += sample) {
      const pt = transformPoint(m, x, y);
      p.vertex(pt.x, pt.y);
    }
    p.endShape();
  }

  p.stroke(...ACCENT, 105);
  p.strokeWeight(1.35 / s);

  const x1 = transformPoint(m, -extent, 0);
  const x2 = transformPoint(m, extent, 0);
  const y1 = transformPoint(m, 0, -extent);
  const y2 = transformPoint(m, 0, extent);

  p.line(x1.x, x1.y, x2.x, x2.y);
  p.line(y1.x, y1.y, y2.x, y2.y);

  p.pop();
}

function drawWorldLabel(
  p: p5,
  str: string,
  x: number,
  y: number,
  rgb: [number, number, number],
  alpha: number,
  worldScale: number,
): void {
  p.push();
  p.scale(1, -1);
  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], alpha);
  p.textSize(11 / worldScale);
  p.text(str, x, -y);
  p.pop();
}

function drawArrow(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rgb: [number, number, number],
  alpha: number,
  label: string,
  worldScale: number,
): void {
  const s = worldScale;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.hypot(x2 - x1, y2 - y1);

  if (len < 0.001) return;

  p.push();

  p.stroke(rgb[0], rgb[1], rgb[2], alpha);
  p.strokeWeight(1.75 / s);
  p.line(x1, y1, x2, y2);

  p.push();
  p.translate(x2, y2);
  p.rotate(angle);

  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], alpha);
  p.triangle(0, 0, -0.12, 0.045, -0.12, -0.045);

  p.pop();

  drawWorldLabel(p, label, x2 + 0.08, y2 + 0.08, rgb, alpha, worldScale);

  p.pop();
}

function drawBasisVectors(p: p5, m: Matrix2, worldScale: number): void {
  drawArrow(p, 0, 0, m.a, m.c, ACCENT, 210, 'î', worldScale);
  drawArrow(p, 0, 0, m.b, m.d, GUIDE, 125, 'ĵ', worldScale);
}

function drawUnitSquare(p: p5, m: Matrix2, worldScale: number): void {
  const p0 = transformPoint(m, 0, 0);
  const p1 = transformPoint(m, 1, 0);
  const p2 = transformPoint(m, 1, 1);
  const p3 = transformPoint(m, 0, 1);

  p.push();

  p.noFill();
  p.stroke(...ACCENT, 58);
  p.strokeWeight(1 / worldScale);

  p.beginShape();
  p.vertex(p0.x, p0.y);
  p.vertex(p1.x, p1.y);
  p.vertex(p2.x, p2.y);
  p.vertex(p3.x, p3.y);
  p.endShape(p.CLOSE);

  p.pop();
}

function drawSinglePanel(
  p: p5,
  cx: number,
  cy: number,
  worldScale: number,
  m: Matrix2,
): void {
  p.push();
  p.translate(cx, cy);
  p.scale(worldScale, -worldScale);

  drawOriginalGrid(p, worldScale);
  drawTransformedGrid(p, m, worldScale);
  drawUnitSquare(p, m, worldScale);
  drawBasisVectors(p, m, worldScale);

  p.pop();
}

function drawPanelLabel(p: p5, str: string, x: number, y: number): void {
  p.push();
  p.noStroke();
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(12);
  p.textStyle(p.BOLD);
  p.fill(212, 184, 122, 145);
  p.text(str, x, y);
  p.pop();
}

function drawFreeOrSpecialScene(p: p5, snap: MatrixLinearTransformSnap): void {
  const worldScale = getSingleWorldScale(snap.width, snap.height);
  const cx = snap.width * 0.5;
  const cy = snap.height * 0.54;

  drawSinglePanel(p, cx, cy, worldScale, snap.currentMatrix);
}

function drawComposeScene(p: p5, snap: MatrixLinearTransformSnap): void {
  const panelScale = getPanelWorldScale(snap.width, snap.height);
  const angleRad = (snap.composeAngleDeg * Math.PI) / 180;

  const A = matrixRotation(angleRad);
  const B = matrixShearX(snap.composeShear);
  const AB = multiplyMatrices(A, B);
  const BA = multiplyMatrices(B, A);

  drawSinglePanel(p, snap.width * 0.29, snap.height * 0.55, panelScale, AB);
  drawSinglePanel(p, snap.width * 0.72, snap.height * 0.55, panelScale, BA);

  drawPanelLabel(p, 'AB', snap.width * 0.29, 38);
  drawPanelLabel(p, 'BA', snap.width * 0.72, 38);
}

export function renderMatrixLinearTransformScene(
  p: p5,
  snap: MatrixLinearTransformSnap,
): void {
  p.background(10, 10, 10);

  if (snap.mode === 'compose') {
    drawComposeScene(p, snap);
  } else {
    drawFreeOrSpecialScene(p, snap);
  }
}

export type MatrixSidebarState = {
  modeLabel: string;
  matrixLabel: string;
  detLabel: string;
  noteLabel: string;
  formulaLabel: string;
  detWarning: boolean;
  subtitle: string;
};

export function buildMatrixSidebarState(
  snap: MatrixLinearTransformSnap,
): MatrixSidebarState {
  if (snap.mode === 'compose') {
    const angleRad = (snap.composeAngleDeg * Math.PI) / 180;
    const A = matrixRotation(angleRad);
    const B = matrixShearX(snap.composeShear);
    const AB = multiplyMatrices(A, B);
    const BA = multiplyMatrices(B, A);
    const diff = matrixDifference(AB, BA);

    return {
      modeLabel: '模式：變換疊加',
      matrixLabel: `差異 ≈ ${diff.toFixed(3)}`,
      detLabel: `det(AB) = ${matrixDet(AB).toFixed(3)} · det(BA) = ${matrixDet(BA).toFixed(3)}`,
      noteLabel: '同樣的 A 與 B，順序不同會產生不同網格。',
      formulaLabel: 'A = 旋轉\nB = 剪切\n\nAB = 先 B 後 A\nBA = 先 A 後 B',
      detWarning: false,
      subtitle: 'AB ≠ BA',
    };
  }

  const m = snap.currentMatrix;
  const det = matrixDet(m);
  const warning = Math.abs(det) < DET_WARN_THRESHOLD;

  if (snap.mode === 'free') {
    return {
      modeLabel: '模式：自由變換',
      matrixLabel: matrixText(m),
      detLabel: `det ≈ ${det.toFixed(3)}`,
      noteLabel: warning
        ? 'det 接近 0，平面被壓縮成一條線。'
        : '欄向量就是 î、ĵ 被送去的位置。',
      formulaLabel: '[a b; c d] · [x; y]\n= [ax + by; cx + dy]',
      detWarning: warning,
      subtitle: '自由變換',
    };
  }

  const title = getSpecialTitle(snap.specialType);

  return {
    modeLabel: `模式：特殊變換 · ${title}`,
    matrixLabel: matrixText(m),
    detLabel: `det ≈ ${det.toFixed(3)}`,
    noteLabel: getSpecialNote(snap.specialType),
    formulaLabel: getSpecialFormula(snap.specialType),
    detWarning: warning,
    subtitle: title,
  };
}
