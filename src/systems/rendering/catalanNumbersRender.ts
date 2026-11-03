import { canvas2d } from './canvas2d';
import type p5 from 'p5';
import {
  CATALAN_VIEW,
  type CatalanMode,
  matchParentheses,
} from '../../curve/modules/catalan-numbers/geometry';

type CatalanSnap = {
  width: number;
  height: number;
  n: number;
  mode: CatalanMode;
  catalanValue: number;
  objects: Array<string | number[][]>;
  activeIndex: number;
  reveal: number;
};

const ACCENT = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

export function renderCatalanNumbersScene(p: p5, snap: CatalanSnap): void {
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / CATALAN_VIEW.width, snap.height / CATALAN_VIEW.height);
  const offsetX = (snap.width - CATALAN_VIEW.width * scale) / 2;
  const offsetY = (snap.height - CATALAN_VIEW.height * scale) / 2;
  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  if (snap.mode === 'path') drawPathMode(p, snap);
  else if (snap.mode === 'paren') drawParenMode(p, snap);
  else drawTriangulationMode(p, snap);

  p.pop();
}

function drawPathMode(p: p5, snap: CatalanSnap): void {
  const word = (snap.objects[snap.activeIndex] as string) ?? '';
  const n = snap.n;
  const size = 430;
  const x0 = CATALAN_VIEW.width / 2 - size / 2;
  const y0 = 150 + size;
  const step = size / n;

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 16);
  p.strokeWeight(1);
  for (let i = 0; i <= n; i += 1) p.line(x0 + i * step, y0, x0 + i * step, y0 - size);
  for (let j = 0; j <= n; j += 1) p.line(x0, y0 - j * step, x0 + size, y0 - j * step);
  p.stroke(255, 255, 255, 34);
  canvas2d(p).setLineDash([6, 8]);
  p.line(x0, y0, x0 + size, y0 - size);
  canvas2d(p).setLineDash([]);

  const points: Array<{ x: number; y: number }> = [];
  let x = 0;
  let y = 0;
  points.push({ x: x0, y: y0 });
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] === '(') y += 1;
    else x += 1;
    points.push({ x: x0 + x * step, y: y0 - y * step });
  }

  const visible = Math.max(1, Math.min(points.length, Math.floor(snap.reveal)));
  const layers = [
    { weight: 10, alpha: 18 },
    { weight: 5, alpha: 42 },
    { weight: 2, alpha: 230 },
  ];
  for (const layer of layers) {
    p.stroke(ACCENT.r, ACCENT.g, ACCENT.b, layer.alpha);
    p.strokeWeight(layer.weight);
    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < visible; i += 1) p.vertex(points[i]!.x, points[i]!.y);
    p.endShape();
  }
}

function drawParenMode(p: p5, snap: CatalanSnap): void {
  const word = (snap.objects[snap.activeIndex] as string) ?? '';
  p.noStroke();
  p.fill(220, 220, 220, 140);
  p.textSize(22);
  p.text(word, 80, 170);

  const pairs = matchParentheses(word);
  const centerX = CATALAN_VIEW.width / 2 + 80;
  const baseY = 500;
  const unit = 520 / Math.max(word.length, 1);
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(centerX - 260, baseY, centerX + 260, baseY);
  for (const pair of pairs) {
    const x1 = centerX - 260 + pair[0] * unit;
    const x2 = centerX - 260 + pair[1] * unit;
    const h = Math.min(170, (pair[1] - pair[0]) * 18);
    p.noFill();
    p.stroke(ACCENT.r, ACCENT.g, ACCENT.b, 76);
    p.strokeWeight(1.5);
    p.arc((x1 + x2) / 2, baseY, x2 - x1, h, p.PI, p.TWO_PI);
  }
}

function drawTriangulationMode(p: p5, snap: CatalanSnap): void {
  const vertexCount = snap.n + 2;
  const tris = (snap.objects[snap.activeIndex] as number[][]) ?? [];
  const center = { x: CATALAN_VIEW.width / 2 - 60, y: 370 };
  const radius = 220;
  const vertices: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < vertexCount; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / vertexCount;
    vertices.push({ x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius });
  }

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 25);
  p.strokeWeight(1.2);
  p.noFill();
  p.beginShape();
  for (const v of vertices) p.vertex(v.x, v.y);
  p.endShape(p.CLOSE);

  const visible = Math.min(tris.length, Math.max(0, Math.floor(snap.reveal)));
  for (let i = 0; i < visible; i += 1) {
    const tri = tris[i]!;
    const a = vertices[tri[0]!]!;
    const b = vertices[tri[1]!]!;
    const c = vertices[tri[2]!]!;
    p.fill(ACCENT.r, ACCENT.g, ACCENT.b, 12 + i * 2);
    p.stroke(ACCENT.r, ACCENT.g, ACCENT.b, 90);
    p.strokeWeight(1);
    p.triangle(a.x, a.y, b.x, b.y, c.x, c.y);
  }
}

