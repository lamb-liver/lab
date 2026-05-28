import type p5 from 'p5';
import {
  PASCAL_VIEW,
  cellKey,
  type PascalFrameData,
} from '../../curve/modules/pascals-triangle/geometry';

export type PascalsTriangleSnap = {
  width: number;
  height: number;
  frame: PascalFrameData;
  selectedCell: { n: number; k: number } | null;
  highlightSet: Set<string>;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

export function renderPascalsTriangleScene(p: p5, snap: PascalsTriangleSnap): void {
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / PASCAL_VIEW.width, snap.height / PASCAL_VIEW.height);
  const offsetX = (snap.width - PASCAL_VIEW.width * scale) / 2;
  const offsetY = (snap.height - PASCAL_VIEW.height * scale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  drawGuides(p, snap.frame.rows);
  drawTriangle(p, snap);

  p.pop();
}

function drawGuides(p: p5, rows: number): void {
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 10);
  p.strokeWeight(1);
  p.noFill();
  for (let n = 0; n <= rows; n += 4) {
    const y = 125 + n * ((PASCAL_VIEW.height - 125 - 70) / Math.max(rows, 1)) * 0.88;
    p.line(70, y, PASCAL_VIEW.width - 70, y);
  }
}

function drawTriangle(p: p5, snap: PascalsTriangleSnap): void {
  const activeRows = Math.max(0, Math.floor(snap.frame.rows * snap.revealProgress));
  for (let n = 0; n < snap.frame.cellMap.length; n += 1) {
    const row = snap.frame.cellMap[n]!;
    const rowReveal = n < activeRows ? 1 : Math.max(0, snap.frame.rows * snap.revealProgress - n);

    for (const cell of row) {
      const isSelected = snap.selectedCell?.n === cell.n && snap.selectedCell?.k === cell.k;
      const isHighlighted = snap.highlightSet.has(cellKey(cell.n, cell.k));
      drawCell(p, cell.x, cell.y, cell.r, cell.value, snap.frame.prime, rowReveal, isHighlighted, isSelected);
    }
  }
  drawParentLinks(p, snap);
}

function drawCell(
  p: p5,
  x: number,
  y: number,
  r: number,
  value: number,
  prime: number,
  reveal: number,
  isHighlighted: boolean,
  isSelected: boolean,
): void {
  const alphaMul = Math.max(0.16, Math.min(1, reveal));
  const active = value !== 0;

  if (isHighlighted) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 90 * alphaMul);
    p.strokeWeight(5);
    p.noFill();
    p.circle(x, y, r * 2.8);
  }

  if (active) {
    const alpha = prime <= 2 ? 210 : 90 + ((value - 1) / (prime - 2)) * 140;
    p.noStroke();
    p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha * 0.16 * alphaMul);
    p.circle(x, y, r * 3.2);
    p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha * alphaMul);
    p.circle(x, y, r * 1.65);
  } else {
    p.noFill();
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 26 * alphaMul);
    p.strokeWeight(1);
    p.circle(x, y, r * 1.55);
  }

  if (isSelected) {
    p.noFill();
    p.stroke(255, 235, 180, 230 * alphaMul);
    p.strokeWeight(2);
    p.circle(x, y, r * 3.2);
  }
}

function drawParentLinks(p: p5, snap: PascalsTriangleSnap): void {
  if (!snap.selectedCell) return;
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 120);
  p.strokeWeight(1.4);

  for (let i = 1; i <= snap.selectedCell.n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      if (!snap.highlightSet.has(cellKey(i, j))) continue;
      const curr = snap.frame.cellMap[i]?.[j];
      if (!curr) continue;
      const p1 = snap.frame.cellMap[i - 1]?.[j - 1];
      const p2 = snap.frame.cellMap[i - 1]?.[j];
      if (p1 && snap.highlightSet.has(cellKey(i - 1, j - 1))) p.line(p1.x, p1.y, curr.x, curr.y);
      if (p2 && snap.highlightSet.has(cellKey(i - 1, j))) p.line(p2.x, p2.y, curr.x, curr.y);
    }
  }

  const selected = snap.frame.cellMap[snap.selectedCell.n]?.[snap.selectedCell.k];
  if (!selected) return;
  p.noStroke();
  p.fill(255, 235, 180, 180);
  p.circle(selected.x, selected.y, selected.r * 0.75);
}

