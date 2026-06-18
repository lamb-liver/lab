import type p5 from 'p5';
import {
  BAYES_AREA,
  BAYES_BARS,
  BAYES_TREE,
  BAYES_TREE_PANEL_AREA,
  BAYES_VIEW,
  type BayesLeafLayout,
  leafLeftAnchor,
} from '../../curve/modules/conditional-probability-bayes/layout';
import {
  type BayesMode,
  deriveData,
  percent,
} from '../../curve/modules/conditional-probability-bayes/geometry';
import type { ParamValues } from '../../curve/types';

export type BayesSnap = {
  width: number;
  height: number;
  params: ParamValues;
  mode: BayesMode;
  reveal: number;
};

const GOLD = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };
const BLUE = { r: 130, g: 170, b: 220 };

export function renderConditionalProbabilityBayesScene(p: p5, snap: BayesSnap): void {
  const data = deriveData(snap.params);
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / BAYES_VIEW.width, snap.height / BAYES_VIEW.height);
  const offsetX = (snap.width - BAYES_VIEW.width * scale) / 2;
  const offsetY = (snap.height - BAYES_VIEW.height * scale) / 2;
  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  if (snap.mode === 'tree') drawTree(p, data, snap.reveal);
  else if (snap.mode === 'area') drawArea(p, data, BAYES_AREA, snap.reveal);
  else drawBars(p, data, snap.reveal);
  p.pop();
}

function drawTree(p: p5, data: ReturnType<typeof deriveData>, reveal: number): void {
  const tree = BAYES_TREE;
  const area = BAYES_TREE_PANEL_AREA;
  const abEnd = leafLeftAnchor(tree.leafAB);
  const notAbEnd = leafLeftAnchor(tree.leafNotAB);

  drawArea(p, data, area, reveal);

  drawBranch(p, tree.root.x, tree.root.y, tree.a.x, tree.a.y, data.pA, GUIDE, reveal, false);
  drawBranch(p, tree.root.x, tree.root.y, tree.notA.x, tree.notA.y, data.pNotA, GUIDE, reveal, false);
  drawBranch(p, tree.a.x, tree.a.y, abEnd.x, abEnd.y, data.pBgA, GOLD, reveal, true);
  drawBranch(
    p,
    tree.notA.x,
    tree.notA.y,
    notAbEnd.x,
    notAbEnd.y,
    data.pBgNotA,
    BLUE,
    reveal,
    false,
  );

  drawNode(p, tree.root.x, tree.root.y, '起點', reveal);
  drawNode(p, tree.a.x, tree.a.y, data.A, reveal);
  drawNode(p, tree.notA.x, tree.notA.y, '¬A', reveal);
  drawLeaf(p, tree.leafAB, `${data.B}`, percent(data.pBgA), GOLD, reveal);
  drawLeaf(p, tree.leafNotAB, `${data.B}`, percent(data.pBgNotA), BLUE, reveal);
}

function drawArea(
  p: p5,
  data: ReturnType<typeof deriveData>,
  box: { x: number; y: number; w: number; h: number },
  reveal: number,
): void {
  const aW = box.w * data.pA;
  const abH = box.h * data.pBgA * reveal;
  const notAbH = box.h * data.pBgNotA * reveal;
  p.noFill();
  p.stroke(255, 255, 255, 32);
  p.strokeWeight(1);
  p.rect(box.x, box.y, box.w, box.h);
  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 28);
  p.rect(box.x, box.y, aW, box.h);
  p.fill(255, 255, 255, 10);
  p.rect(box.x + aW, box.y, box.w - aW, box.h);
  p.fill(GOLD.r, GOLD.g, GOLD.b, 160);
  p.rect(box.x, box.y + box.h - abH, aW, abH);
  p.fill(BLUE.r, BLUE.g, BLUE.b, 130);
  p.rect(box.x + aW, box.y + box.h - notAbH, box.w - aW, notAbH);
  p.stroke(255, 255, 255, 28);
  p.strokeWeight(1);
  p.line(box.x + aW, box.y, box.x + aW, box.y + box.h);
  drawAreaLabels(p, data, box, aW, abH, notAbH, reveal);
  drawEvidenceBar(p, data, box, reveal);
}

function drawAreaLabels(
  p: p5,
  data: ReturnType<typeof deriveData>,
  box: { x: number; y: number; w: number; h: number },
  aW: number,
  abH: number,
  notAbH: number,
  reveal: number,
): void {
  const alpha = Math.min(1, reveal * 1.3);
  drawLabel(p, data.A, box.x + Math.max(18, aW / 2), box.y - 10, GUIDE, 120 * alpha, p.CENTER);
  drawLabel(p, '¬A', box.x + aW + (box.w - aW) / 2, box.y - 10, GUIDE, 95 * alpha, p.CENTER);
  if (aW > 34 && abH > 24) {
    drawLabel(p, `${data.A}∩${data.B}`, box.x + aW / 2, box.y + box.h - abH / 2 + 4, GOLD, 180 * alpha, p.CENTER);
  }
  if (box.w - aW > 76 && notAbH > 24) {
    drawLabel(p, `¬A∩${data.B}`, box.x + aW + (box.w - aW) / 2, box.y + box.h - notAbH / 2 + 4, BLUE, 170 * alpha, p.CENTER);
  }
}

function drawEvidenceBar(
  p: p5,
  data: ReturnType<typeof deriveData>,
  box: { x: number; y: number; w: number; h: number },
  reveal: number,
): void {
  if (data.pB <= 0) return;
  const alpha = Math.min(1, reveal * 1.2);
  const x = box.x;
  const y = Math.min(box.y + box.h + 24, BAYES_VIEW.height - 38);
  const w = box.w;
  const h = 18;
  const goldW = w * data.posterior;
  p.noStroke();
  p.fill(255, 255, 255, 16 * alpha);
  p.rect(x, y, w, h, 4);
  p.fill(GOLD.r, GOLD.g, GOLD.b, 170 * alpha);
  p.rect(x, y, goldW, h, 4);
  p.fill(BLUE.r, BLUE.g, BLUE.b, 130 * alpha);
  p.rect(x + goldW, y, w - goldW, h, 4);
  drawLabel(p, `P(${data.B}) = ${percent(data.pB)}`, x, y + h + 15, GUIDE, 110 * alpha, p.LEFT);
  drawLabel(p, `P(A|${data.B})`, x + goldW, y - 5, GOLD, 140 * alpha, p.CENTER);
}

function drawLabel(
  p: p5,
  label: string,
  x: number,
  y: number,
  color: typeof GOLD,
  alpha: number,
  align: typeof p.LEFT | typeof p.CENTER | typeof p.RIGHT,
): void {
  p.noStroke();
  p.fill(color.r, color.g, color.b, alpha);
  p.textAlign(align, p.CENTER);
  p.textSize(10);
  p.text(label, x, y);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawBars(p: p5, data: ReturnType<typeof deriveData>, reveal: number): void {
  const { x, y, w, rowH, gap } = BAYES_BARS;
  drawBar(p, x, y, w, rowH, data.pA * reveal, `P(A)`, GOLD, reveal);
  drawBar(p, x, y + gap, w, rowH, data.pB * reveal, `P(${data.B})`, BLUE, reveal);
  drawBar(
    p,
    x,
    y + gap * 2,
    w,
    rowH,
    data.posterior * reveal,
    `P(A|${data.B})`,
    GOLD,
    reveal,
  );
}

function drawBar(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  value: number,
  label: string,
  color: typeof GOLD,
  reveal: number,
): void {
  const alpha = Math.min(1, reveal * 1.2);
  p.noStroke();
  p.fill(255, 255, 255, 18 * alpha);
  p.rect(x, y, w, h, 8);
  p.fill(color.r, color.g, color.b, 185 * alpha);
  p.rect(x, y, w * value, h, 8);
  if (reveal < 0.35) return;
  p.noStroke();
  p.fill(220, 220, 220, 200 * alpha);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(12);
  p.text(label, x + 10, y + h / 2);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawBranch(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  prob: number,
  color: typeof GOLD,
  reveal: number,
  emphasize: boolean,
): void {
  const t = Math.min(1, reveal);
  const ex = p.lerp(x1, x2, t);
  const ey = p.lerp(y1, y2, t);
  const glow = emphasize ? 50 : 32;
  const core = emphasize ? 230 : 170;
  p.stroke(color.r, color.g, color.b, glow);
  p.strokeWeight(emphasize ? 5 : 4);
  p.line(x1, y1, ex, ey);
  p.stroke(color.r, color.g, color.b, core);
  p.strokeWeight(emphasize ? 2 : 1.4);
  p.line(x1, y1, ex, ey);
  if (t < 0.55) return;
  const mx = (x1 + ex) / 2;
  const my = (y1 + ey) / 2;
  p.noStroke();
  p.fill(200, 200, 200, 170 * t);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(10);
  p.text(percent(prob), mx, my - 6);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawNode(p: p5, x: number, y: number, label: string, reveal: number): void {
  const alpha = Math.min(1, reveal * 1.4);
  p.noFill();
  p.stroke(255, 255, 255, 160 * alpha);
  p.strokeWeight(1.2);
  p.circle(x, y, 40);
  p.noStroke();
  p.fill(220, 220, 220, 200 * alpha);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.text(label, x, y);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawLeaf(
  p: p5,
  leaf: BayesLeafLayout,
  eventLabel: string,
  probLabel: string,
  color: typeof GOLD,
  reveal: number,
): void {
  const alpha = Math.min(1, reveal * 1.2);
  const x = leaf.cx - leaf.w / 2;
  const y = leaf.cy - leaf.h / 2;
  p.fill(color.r, color.g, color.b, 28 * alpha);
  p.stroke(color.r, color.g, color.b, 150 * alpha);
  p.strokeWeight(1);
  p.rect(x, y, leaf.w, leaf.h, 8);
  if (alpha < 0.2) return;
  p.noStroke();
  p.fill(235, 235, 235, 220 * alpha);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(11);
  p.text(`${eventLabel}  ${probLabel}`, leaf.cx, leaf.cy);
  p.textAlign(p.LEFT, p.BASELINE);
}
