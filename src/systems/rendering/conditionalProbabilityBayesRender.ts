import type p5 from 'p5';
import {
  BAYES_VIEW,
  type BayesMode,
  deriveData,
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
  else if (snap.mode === 'area') drawArea(p, data, snap.reveal);
  else drawBars(p, data, snap.reveal);
  p.pop();
}

function drawTree(p: p5, data: ReturnType<typeof deriveData>, reveal: number): void {
  drawBranch(p, 160, 430, 380, 340, data.pA, GOLD, reveal);
  drawBranch(p, 160, 430, 380, 520, data.pNotA, GUIDE, reveal);
  drawBranch(p, 380, 340, 640, 280, data.pBgA, GOLD, reveal);
  drawBranch(p, 380, 520, 640, 470, data.pBgNotA, BLUE, reveal);
  drawNode(p, 160, 430, 'Start');
  drawNode(p, 380, 340, data.A);
  drawNode(p, 380, 520, `not ${data.A}`);
  drawLeaf(p, 700, 280, GOLD);
  drawLeaf(p, 700, 470, BLUE);
}

function drawArea(p: p5, data: ReturnType<typeof deriveData>, reveal: number): void {
  const x = 180;
  const y = 250;
  const w = 560;
  const h = 280;
  const aW = w * data.pA;
  const abH = h * data.pBgA;
  const notAbH = h * data.pBgNotA;
  p.noFill();
  p.stroke(255, 255, 255, 32);
  p.rect(x, y, w, h);
  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 28);
  p.rect(x, y, aW, h);
  p.fill(BLUE.r, BLUE.g, BLUE.b, 24);
  p.rect(x + aW, y, w - aW, h);
  p.fill(GOLD.r, GOLD.g, GOLD.b, 160);
  p.rect(x, y + h - abH * reveal, aW, abH * reveal);
  p.fill(BLUE.r, BLUE.g, BLUE.b, 130);
  p.rect(x + aW, y + h - notAbH * reveal, w - aW, notAbH * reveal);
}

function drawBars(p: p5, data: ReturnType<typeof deriveData>, reveal: number): void {
  const x = 180;
  const y = 260;
  const w = 560;
  drawBar(p, x, y, w, data.pA * reveal, `Prior P(${data.A})`, GOLD);
  drawBar(p, x, y + 90, w, data.pB * reveal, `Evidence P(${data.B})`, BLUE);
  drawBar(p, x, y + 180, w, data.posterior * reveal, `Posterior P(${data.A}|${data.B})`, GOLD);
}

function drawBar(p: p5, x: number, y: number, w: number, value: number, _label: string, color: typeof GOLD): void {
  p.noStroke();
  p.fill(255, 255, 255, 18);
  p.rect(x, y, w, 38, 8);
  p.fill(color.r, color.g, color.b, 185);
  p.rect(x, y, w * value, 38, 8);
}

function drawBranch(p: p5, x1: number, y1: number, x2: number, y2: number, _prob: number, color: typeof GOLD, reveal: number): void {
  const ex = p.lerp(x1, x2, Math.min(1, reveal));
  const ey = p.lerp(y1, y2, Math.min(1, reveal));
  p.stroke(color.r, color.g, color.b, 40);
  p.strokeWeight(6);
  p.line(x1, y1, ex, ey);
  p.stroke(color.r, color.g, color.b, 210);
  p.strokeWeight(1.5);
  p.line(x1, y1, ex, ey);
}

function drawNode(p: p5, x: number, y: number, label: string): void {
  p.noFill();
  p.stroke(255, 255, 255, 160);
  p.strokeWeight(1.2);
  p.circle(x, y, 48);
  p.noStroke();
  p.fill(220, 220, 220, 180);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(11);
  p.text(label, x, y);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawLeaf(p: p5, x: number, y: number, color: typeof GOLD): void {
  p.fill(color.r, color.g, color.b, 22);
  p.stroke(color.r, color.g, color.b, 150);
  p.rect(x, y - 18, 180, 34, 8);
}
