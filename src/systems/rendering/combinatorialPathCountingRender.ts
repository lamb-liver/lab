import type p5 from 'p5';
import {
  COMBINATORIAL_VIEW,
  type GridLayout,
  type PathMode,
  choose,
  gridToScreen,
  modeFromValue,
} from '../../curve/modules/combinatorial-path-counting/geometry';

export type CombinatorialSnap = {
  width: number;
  height: number;
  m: number;
  n: number;
  mode: PathMode;
  layout: GridLayout;
  pathCounts: number[][];
  allPaths: string[][];
  currentPathPoints: Array<{ x: number; y: number }>;
  pathProgress: number;
};

const ACCENT = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

export function renderCombinatorialPathCountingScene(p: p5, snap: CombinatorialSnap): void {
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / COMBINATORIAL_VIEW.width, snap.height / COMBINATORIAL_VIEW.height);
  const offsetX = (snap.width - COMBINATORIAL_VIEW.width * scale) / 2;
  const offsetY = (snap.height - COMBINATORIAL_VIEW.height * scale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  drawHeader(p, snap.m, snap.n);
  drawGrid(p, snap.layout, snap.m, snap.n);

  if (snap.mode === 'overlay') drawAllPathsOverlay(p, snap.layout, snap.allPaths);
  else if (snap.mode === 'count') drawCountField(p, snap.layout, snap.pathCounts, snap.m, snap.n);
  else drawSinglePath(p, snap.currentPathPoints, snap.pathProgress);

  drawNodes(p, snap.layout, snap.pathCounts, snap.m, snap.n, snap.mode);
  drawFooter(p, snap.m, snap.n, snap.allPaths.length);

  p.pop();
}

function drawHeader(p: p5, m: number, n: number): void {
  p.noStroke();
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 230);
  p.textSize(14);
  p.text('COMBINATORIAL PATH COUNTING', 32, 34);
  p.fill(220, 220, 220, 130);
  p.textSize(12);
  p.text(`grid: ${m} x ${n}`, 32, 58);
  p.text(`N(m,n) = C(${m + n}, ${m}) = ${choose(m + n, m)}`, 145, 58);
  p.fill(220, 220, 220, 80);
  p.text('only right / up moves are allowed', 32, 82);
}

function drawGrid(p: p5, layout: GridLayout, m: number, n: number): void {
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  for (let i = 0; i <= m; i += 1) {
    const a = gridToScreen(layout, i, 0);
    const b = gridToScreen(layout, i, n);
    p.line(a.x, a.y, b.x, b.y);
  }
  for (let j = 0; j <= n; j += 1) {
    const a = gridToScreen(layout, 0, j);
    const b = gridToScreen(layout, m, j);
    p.line(a.x, a.y, b.x, b.y);
  }
  const start = gridToScreen(layout, 0, 0);
  const end = gridToScreen(layout, m, n);
  p.noStroke();
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 210);
  p.circle(start.x, start.y, 10);
  p.circle(end.x, end.y, 10);
}

function drawNodes(
  p: p5,
  layout: GridLayout,
  pathCounts: number[][],
  m: number,
  n: number,
  mode: PathMode,
): void {
  const maxCount = pathCounts[m]![n]!;
  for (let i = 0; i <= m; i += 1) {
    for (let j = 0; j <= n; j += 1) {
      const point = gridToScreen(layout, i, j);
      const count = pathCounts[i]![j]!;
      const alpha = p.map(Math.log(count + 1), 0, Math.log(maxCount + 1), 45, 210);
      p.noStroke();
      p.fill(ACCENT.r, ACCENT.g, ACCENT.b, alpha * 0.18);
      p.circle(point.x, point.y, 20);
      p.fill(ACCENT.r, ACCENT.g, ACCENT.b, alpha);
      p.circle(point.x, point.y, 5.5);
      if (mode === 'count') {
        p.fill(230, 230, 230, 120);
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(String(count), point.x, point.y - 17);
        p.textAlign(p.LEFT, p.BASELINE);
      }
    }
  }
}

function drawSinglePath(p: p5, points: Array<{ x: number; y: number }>, pathProgress: number): void {
  if (points.length < 2) return;
  const visibleCount = Math.floor(pathProgress);
  drawPathGlow(p, points, 0, Math.min(visibleCount + 1, points.length));
  if (visibleCount < points.length - 1) {
    const a = points[visibleCount]!;
    const b = points[visibleCount + 1]!;
    const t = pathProgress - visibleCount;
    const x = p.lerp(a.x, b.x, t);
    const y = p.lerp(a.y, b.y, t);
    p.noStroke();
    p.fill(255, 235, 180, 230);
    p.circle(x, y, 10);
  }
}

function drawAllPathsOverlay(p: p5, layout: GridLayout, allPaths: string[][]): void {
  const maxDraw = Math.min(allPaths.length, 900);
  p.stroke(ACCENT.r, ACCENT.g, ACCENT.b, 13);
  p.strokeWeight(1.2);
  p.noFill();
  for (let idx = 0; idx < maxDraw; idx += 1) {
    let i = 0;
    let j = 0;
    p.beginShape();
    const start = gridToScreen(layout, i, j);
    p.vertex(start.x, start.y);
    for (const step of allPaths[idx]!) {
      if (step === 'R') i += 1;
      if (step === 'U') j += 1;
      const point = gridToScreen(layout, i, j);
      p.vertex(point.x, point.y);
    }
    p.endShape();
  }
}

function drawCountField(p: p5, layout: GridLayout, pathCounts: number[][], m: number, n: number): void {
  const maxCount = pathCounts[m]![n]!;
  for (let i = 0; i <= m; i += 1) {
    for (let j = 0; j <= n; j += 1) {
      const point = gridToScreen(layout, i, j);
      const density = pathCounts[i]![j]! / maxCount;
      const r = p.map(Math.sqrt(density), 0, 1, 8, 34);
      p.noStroke();
      p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 20);
      p.circle(point.x, point.y, r);
    }
  }
}

function drawPathGlow(p: p5, points: Array<{ x: number; y: number }>, startIndex: number, endIndex: number): void {
  const layers = [
    { weight: 10, alpha: 18 },
    { weight: 5, alpha: 42 },
    { weight: 2, alpha: 230 },
  ];
  for (const layer of layers) {
    p.stroke(ACCENT.r, ACCENT.g, ACCENT.b, layer.alpha);
    p.strokeWeight(layer.weight);
    p.strokeJoin(p.ROUND);
    p.strokeCap(p.ROUND);
    p.noFill();
    p.beginShape();
    for (let i = startIndex; i < endIndex; i += 1) p.vertex(points[i]!.x, points[i]!.y);
    p.endShape();
  }
}

function drawFooter(p: p5, m: number, n: number, pathCount: number): void {
  const total = choose(m + n, m);
  const row = m + n;
  p.noStroke();
  p.textSize(12);
  p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 210);
  p.text(`Pascal link: row ${row}, entry ${m}`, 32, COMBINATORIAL_VIEW.height - 48);
  p.fill(220, 220, 220, 110);
  p.text(`C(${row}, ${m}) = ${total}`, 32, COMBINATORIAL_VIEW.height - 28);
  p.fill(220, 220, 220, 78);
  p.text(`paths shown: ${pathCount}${total > pathCount ? ' sampled' : ''}`, 210, COMBINATORIAL_VIEW.height - 28);
}

export function resolveMode(paramsMode: number | undefined): PathMode {
  return modeFromValue(paramsMode);
}
