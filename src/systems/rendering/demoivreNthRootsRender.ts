import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { drawReadout } from './readout';
import {
  computeDemoivreMetrics,
  createPlotLayout,
  formatComplex,
  toScreen,
  type Complex,
  type DemoivreNthRootsParams,
  type PlotLayout,
} from '../../curve/modules/demoivre-nth-roots/geometry';

type Snapshot = {
  width: number;
  height: number;
  params: DemoivreNthRootsParams;
  dragging: boolean;
  layoutRadius?: number;
};

type Rgb = [number, number, number];

const BG: Rgb = [10, 10, 10];
const ACCENT: Rgb = [212, 184, 122];
const GUIDE: Rgb = [255, 255, 255];

function drawGrid(p: p5, layout: PlotLayout): void {
  const r = layout.radius;
  p.push();
  p.noFill();
  p.strokeWeight(1);
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 8);
  const left = toScreen(layout, { re: -r, im: 0 });
  const right = toScreen(layout, { re: r, im: 0 });
  const bottom = toScreen(layout, { re: 0, im: -r });
  const top = toScreen(layout, { re: 0, im: r });
  p.line(left.x, left.y, right.x, right.y);
  p.line(bottom.x, bottom.y, top.x, top.y);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 14);
  const unit: { x: number; y: number }[] = [];
  for (let i = 0; i <= 96; i += 1) {
    const t = (i / 96) * Math.PI * 2;
    unit.push(toScreen(layout, { re: Math.cos(t), im: Math.sin(t) }));
  }
  p.beginShape();
  for (const point of unit) p.vertex(point.x, point.y);
  p.endShape();

  p.noStroke();
  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 74);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('Re', right.x - 22, right.y + 14);
  p.textAlign(p.CENTER, p.TOP);
  p.text('Im', top.x + 14, top.y + 8);
  p.pop();
}

function drawArrow(
  p: p5,
  layout: PlotLayout,
  tip: Complex,
  color: Rgb,
  alpha: number,
  weight: number,
): void {
  const from = toScreen(layout, { re: 0, im: 0 });
  const to = toScreen(layout, tip);
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 0.5) return;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.line(from.x, from.y, to.x, to.y);
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.translate(to.x, to.y);
  p.rotate(angle);
  p.triangle(0, 0, -8, -3.5, -8, 3.5);
  p.pop();
}

function drawDot(
  p: p5,
  layout: PlotLayout,
  z: Complex,
  color: Rgb,
  halo: boolean,
): void {
  const point = toScreen(layout, z);
  p.push();
  p.noStroke();
  if (halo) {
    p.fill(color[0], color[1], color[2], 52);
    p.circle(point.x, point.y, 22);
  }
  p.fill(color[0], color[1], color[2], 235);
  p.circle(point.x, point.y, 11);
  p.pop();
}

export function renderDemoivreNthRootsScene(p: p5, snap: Snapshot): void {
  const metrics = computeDemoivreMetrics(snap.params);
  const layout = createPlotLayout(
    snap.width,
    snap.height,
    snap.layoutRadius ?? metrics.viewportRadius,
  );

  p.background(BG[0], BG[1], BG[2]);
  drawGrid(p, layout);

  const ctx = canvas2d(p);
  if (snap.params.mode === 'power') {
    metrics.powers.forEach((point, index) => {
      const last = index === metrics.powers.length - 1;
      drawArrow(p, layout, point, ACCENT, last ? 230 : 70 + index * 24, last ? 2.2 : 1.3);
    });
  } else {
    p.push();
    p.noFill();
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 70);
    p.strokeWeight(1.3);
    ctx.setLineDash([5, 7]);
    const radius = Math.hypot(metrics.roots[0]!.re, metrics.roots[0]!.im);
    const circle: { x: number; y: number }[] = [];
    for (let i = 0; i <= 96; i += 1) {
      const t = (i / 96) * Math.PI * 2;
      circle.push(toScreen(layout, { re: radius * Math.cos(t), im: radius * Math.sin(t) }));
    }
    p.beginShape();
    for (const point of circle) p.vertex(point.x, point.y);
    p.endShape();
    ctx.setLineDash([]);
    p.pop();

    drawArrow(p, layout, metrics.z, GUIDE, 120, 1.6);
    for (const root of metrics.roots) {
      drawArrow(p, layout, root, ACCENT, 210, 1.8);
    }
  }

  drawDot(p, layout, metrics.z, ACCENT, snap.dragging);

  const n = metrics.n;
  const powerLines = [
    `(r e^(iθ))^${n} = r^${n} e^(i${n}θ)`,
    `z = ${formatComplex(metrics.z)}`,
    `z^${n} = ${formatComplex(metrics.result)}`,
  ];
  const rootLines = metrics.zero
    ? ['w = 0 只有原點這一個根，幅角沒有定義']
    : [
        `n 次方根均勻分佈，相鄰差 2π/${n}`,
        `w = ${formatComplex(metrics.z)}`,
        `k=0 根 = ${formatComplex(metrics.result)}`,
      ];
  drawReadout(p, snap.width, snap.params.mode === 'power' ? powerLines : rootLines, {
    highlightIndex: 0,
    highlightColor: ACCENT,
  });
}
