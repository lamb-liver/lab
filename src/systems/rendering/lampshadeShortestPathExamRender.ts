import type p5 from 'p5';
import { degToRad, subVec3, type Vec3 } from '../../curve/projection3d';
import {
  BUG,
  BUG_PSI,
  HONEY,
  INNER_RADIUS,
  OUTER_RADIUS,
  PATH_SPAN,
  SECTOR_ANGLE,
  STRAIGHT_LENGTH,
  TANGENT_CONTACT,
  contactPoint,
  paperTo3d,
  paperToXY,
  pathMetrics,
  samplePath,
  type PaperPoint,
  type Point2,
} from '../../exam/amc12b-2023-21-lampshade-shortest-path/geometry';
import { drawLabel, drawReadout, drawRotatingHint, screenOf, setDash, type Rgb } from './scene3d';

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const BLUE: Rgb = [160, 205, 255];
const RED: Rgb = [235, 110, 100];
const GUIDE: Rgb = [255, 255, 255];
const CANVAS_FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans TC CJK", sans-serif';

const HALF_SECTOR = SECTOR_ANGLE / 2;
const RULINGS = 24;

type Scene3dSnap = {
  width: number;
  height: number;
  yaw: number;
  pitch: number;
  rotating: boolean;
  unroll: number;
  contact: number;
};

function surfaceGrid(unroll: number): Vec3[][] {
  const rows: Vec3[][] = [];
  for (let i = 0; i <= RULINGS; i += 1) {
    const psi = -HALF_SECTOR + (SECTOR_ANGLE * i) / RULINGS;
    const row: Vec3[] = [];
    for (let j = 0; j <= 4; j += 1) {
      const rho = INNER_RADIUS + ((OUTER_RADIUS - INNER_RADIUS) * j) / 4;
      row.push(paperTo3d({ rho, psi }, unroll));
    }
    rows.push(row);
  }
  return rows;
}

function centroid(points: Vec3[]): Vec3 {
  const sum = points.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y, z: acc.z + v.z }), {
    x: 0,
    y: 0,
    z: 0,
  });
  return { x: sum.x / points.length, y: sum.y / points.length, z: sum.z / points.length };
}

function strokePolyline(p: p5, points: Point2[], color: Rgb, weight: number, alpha: number): void {
  p.push();
  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.beginShape();
  for (const q of points) p.vertex(q.x, q.y);
  p.endShape();
  p.pop();
}

function drawDot(p: p5, at: Point2, color: Rgb, label: string, size = 9): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], 245);
  p.circle(at.x, at.y, size);
  p.pop();
  drawLabel(p, at, label, color);
}

/** 路徑依「是否在紙上」切成數段；掉進內半徑以內的部分另外標色 */
function splitByValidity(path: PaperPoint[]): Array<{ onPaper: boolean; points: PaperPoint[] }> {
  const pieces: Array<{ onPaper: boolean; points: PaperPoint[] }> = [];
  for (const point of path) {
    const onPaper = point.rho >= INNER_RADIUS - 1e-6;
    const last = pieces[pieces.length - 1];
    if (last && last.onPaper === onPaper) {
      last.points.push(point);
    } else {
      pieces.push({ onPaper, points: last ? [last.points[last.points.length - 1], point] : [point] });
    }
  }
  return pieces;
}

export function renderLampshadeShortestPath3dScene(p: p5, snap: Scene3dSnap): void {
  p.background(BG[0], BG[1], BG[2]);
  p.textFont(CANVAS_FONT);

  const view = { yaw: degToRad(snap.yaw), pitch: degToRad(snap.pitch) };
  const grid = surfaceGrid(snap.unroll);
  const flat = grid.flat();
  const center = centroid(flat);
  const extent = Math.max(...flat.map((v) => Math.hypot(v.x - center.x, v.y - center.y, v.z - center.z)));
  const size = Math.min(snap.width, snap.height);
  const layout = {
    cx: snap.width / 2,
    cy: snap.height / 2 + size * 0.07,
    scale: (size * 0.4) / Math.max(extent, 1e-6),
  };
  const screen = (v: Vec3) => screenOf(layout, subVec3(v, center), view);

  // 燈罩表面：相鄰母線之間填淡色，再描母線與上下緣
  p.push();
  p.noStroke();
  for (let i = 0; i < grid.length - 1; i += 1) {
    const a0 = screen(grid[i][0]);
    const a1 = screen(grid[i][4]);
    const b1 = screen(grid[i + 1][4]);
    const b0 = screen(grid[i + 1][0]);
    p.fill(BLUE[0], BLUE[1], BLUE[2], 20);
    p.quad(a0.x, a0.y, a1.x, a1.y, b1.x, b1.y, b0.x, b0.y);
  }
  p.pop();

  for (let i = 0; i < grid.length; i += 1) {
    const from = screen(grid[i][0]);
    const to = screen(grid[i][4]);
    p.push();
    p.stroke(BLUE[0], BLUE[1], BLUE[2], i === 0 || i === grid.length - 1 ? 150 : 55);
    p.strokeWeight(i === 0 || i === grid.length - 1 ? 1.6 : 1);
    p.line(from.x, from.y, to.x, to.y);
    p.pop();
  }
  for (const [j, alpha, weight] of [
    [0, 190, 2],
    [2, 45, 1],
    [4, 190, 2],
  ] as const) {
    strokePolyline(
      p,
      grid.map((row) => screen(row[j])),
      BLUE,
      weight,
      alpha,
    );
  }

  const metrics = pathMetrics(snap.contact);
  const path = samplePath(snap.contact);

  // 被切掉的錐頂：只在路徑掉出燈罩時畫出，說明那段直線走在「不存在的紙」上
  if (!metrics.valid) {
    p.push();
    setDash(p, [4, 6]);
    p.stroke(RED[0], RED[1], RED[2], 70);
    p.strokeWeight(1);
    for (let i = 0; i <= RULINGS; i += 4) {
      const psi = -HALF_SECTOR + (SECTOR_ANGLE * i) / RULINGS;
      const from = screen(paperTo3d({ rho: INNER_RADIUS, psi }, snap.unroll));
      const to = screen(paperTo3d({ rho: 0, psi }, snap.unroll));
      p.line(from.x, from.y, to.x, to.y);
    }
    setDash(p, []);
    p.pop();
  }

  for (const piece of splitByValidity(path)) {
    const pts = piece.points.map((q) => screen(paperTo3d(q, snap.unroll)));
    if (piece.onPaper) {
      strokePolyline(p, pts, metrics.valid ? GOLD : RED, 3.4, 240);
    } else {
      p.push();
      setDash(p, [6, 5]);
      strokePolyline(p, pts, RED, 3, 230);
      setDash(p, []);
      p.pop();
    }
  }

  drawDot(p, screen(paperTo3d(BUG, snap.unroll)), GUIDE, '蟲');
  drawDot(p, screen(paperTo3d(HONEY, snap.unroll)), GOLD, '蜂蜜');

  drawReadout(
    p,
    snap.width,
    // 共用 drawReadout 只在空白處換行，窄畫布改用短句避免中文溢出
    snap.width < 520
      ? [
          `展開 ${Math.round(snap.unroll * 100)}%（同一張紙，長度不變）`,
          metrics.valid ? `路徑在燈罩上，長 ${metrics.length.toFixed(4)}` : `紅色虛線落在上緣以上，不能走`,
        ]
      : [
          `展開 ${Math.round(snap.unroll * 100)}%：每個中間狀態都是同一張紙，路徑長不變`,
          metrics.valid
            ? `路徑在燈罩上，長 ${metrics.length.toFixed(4)}`
            : `紅色虛線那段落在燈罩上緣以上（被切掉的錐頂），不能走`,
        ],
    { highlightIndex: 1, highlightColor: metrics.valid ? GOLD : RED },
  );

  if (snap.rotating) drawRotatingHint(p, snap.width, snap.height);
}

/* ------------------------------ 展開圖（2D） ------------------------------ */

export type NetPlot = {
  cx: number;
  cy: number;
  scale: number;
};

/** 展開圖畫成開口朝下的半圓環：紙上角度 ψ 轉 +π/2，蟲在右、蜂蜜在左 */
const DISPLAY_TURN = Math.PI / 2;

export function lampshadeNetPlot(width: number, height: number): NetPlot {
  const pad = 26;
  const scale = Math.min((width - pad * 2) / (2 * OUTER_RADIUS + 2), (height - 70) / (OUTER_RADIUS + 1.6));
  return { cx: width / 2, cy: height - 26 - scale * 0.6, scale };
}

function netScreen(plot: NetPlot, point: Point2): Point2 {
  const c = Math.cos(DISPLAY_TURN);
  const s = Math.sin(DISPLAY_TURN);
  const x = point.x * c - point.y * s;
  const y = point.x * s + point.y * c;
  return { x: plot.cx + x * plot.scale, y: plot.cy - y * plot.scale };
}

function netPaperScreen(plot: NetPlot, point: PaperPoint): Point2 {
  return netScreen(plot, paperToXY(point));
}

/** 從畫布座標反推接觸角 a（相對蟲的位置），供拖曳使用 */
export function contactFromNetScreen(plot: NetPlot, sx: number, sy: number): number {
  const x = (sx - plot.cx) / plot.scale;
  const y = (plot.cy - sy) / plot.scale;
  const psi = Math.atan2(y, x) - DISPLAY_TURN;
  const a = psi - BUG_PSI;
  return Math.min(PATH_SPAN, Math.max(0, a));
}

type NetSnap = {
  width: number;
  height: number;
  contact: number;
};

function arcPoints(plot: NetPlot, rho: number, from: number, to: number, steps = 72): Point2[] {
  return Array.from({ length: steps + 1 }, (_, i) =>
    netPaperScreen(plot, { rho, psi: from + ((to - from) * i) / steps }),
  );
}

export function renderLampshadeNetScene(p: p5, snap: NetSnap): void {
  p.background(BG[0], BG[1], BG[2]);
  p.textFont(CANVAS_FONT);
  const plot = lampshadeNetPlot(snap.width, snap.height);

  // 紙：內半徑 6、外半徑 12 的半圓環
  const outer = arcPoints(plot, OUTER_RADIUS, -HALF_SECTOR, HALF_SECTOR);
  const inner = arcPoints(plot, INNER_RADIUS, HALF_SECTOR, -HALF_SECTOR);
  p.push();
  p.noStroke();
  p.fill(BLUE[0], BLUE[1], BLUE[2], 30);
  p.beginShape();
  for (const q of [...outer, ...inner]) p.vertex(q.x, q.y);
  p.endShape(p.CLOSE);
  p.pop();
  strokePolyline(p, outer, BLUE, 1.6, 170);
  strokePolyline(p, inner.slice().reverse(), BLUE, 1.6, 170);

  // 內半徑以內不是紙
  const hole = arcPoints(plot, INNER_RADIUS, -HALF_SECTOR, HALF_SECTOR);
  p.push();
  p.noStroke();
  p.fill(RED[0], RED[1], RED[2], 16);
  p.beginShape();
  const apex = netPaperScreen(plot, { rho: 0, psi: 0 });
  p.vertex(apex.x, apex.y);
  for (const q of hole) p.vertex(q.x, q.y);
  p.endShape(p.CLOSE);
  p.fill(RED[0], RED[1], RED[2], 150);
  const narrowNet = snap.width < 520;
  p.textSize(narrowNet ? 10 : 12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(
    narrowNet ? '不在燈罩上' : '半徑 6 以內：不在燈罩上',
    apex.x,
    apex.y - plot.scale * (narrowNet ? 1.2 : 2.2),
  );
  p.pop();

  const metrics = pathMetrics(snap.contact);
  const bug = netPaperScreen(plot, BUG);
  const honey = netPaperScreen(plot, HONEY);

  // 參考：直接連直線（長 6√5）
  p.push();
  setDash(p, [5, 6]);
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 80);
  p.strokeWeight(1.2);
  p.line(bug.x, bug.y, honey.x, honey.y);
  setDash(p, []);
  p.pop();

  // 切點參考
  const tangent = netPaperScreen(plot, contactPoint(TANGENT_CONTACT));
  p.push();
  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 120);
  p.strokeWeight(1.2);
  p.circle(tangent.x, tangent.y, 16);
  p.pop();

  const path = samplePath(snap.contact);
  for (const piece of splitByValidity(path)) {
    const pts = piece.points.map((q) => netPaperScreen(plot, q));
    if (piece.onPaper) {
      strokePolyline(p, pts, metrics.valid ? GOLD : RED, 3.4, 240);
    } else {
      p.push();
      setDash(p, [6, 5]);
      strokePolyline(p, pts, RED, 3, 230);
      setDash(p, []);
      p.pop();
    }
  }

  const handle = netPaperScreen(plot, contactPoint(snap.contact));
  p.push();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 230);
  p.strokeWeight(2);
  p.fill(BG[0], BG[1], BG[2]);
  p.circle(handle.x, handle.y, 16);
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2]);
  p.circle(handle.x, handle.y, 6);
  p.pop();

  drawDot(p, bug, GUIDE, '蟲');
  drawDot(p, honey, GOLD, '蜂蜜');
  drawLabel(p, tangent, '切點', GOLD, 170);

  const aDeg = (metrics.contact * 180) / Math.PI;
  drawReadout(
    p,
    snap.width,
    [
      `接觸角 a=${aDeg.toFixed(1)}°　直線段 ${metrics.chord.toFixed(3)} + 內緣弧 ${metrics.arc.toFixed(3)}`,
      metrics.valid
        ? `合法路徑　L=${metrics.length.toFixed(4)}（最短 6√3+π≈13.5339）`
        : `直線離錐頂只剩 ${metrics.minRadius.toFixed(3)} < 6，掉出紙外（直連 6√5≈${STRAIGHT_LENGTH.toFixed(4)}）`,
    ],
    { highlightIndex: 1, highlightColor: metrics.valid ? GOLD : RED },
  );
}
