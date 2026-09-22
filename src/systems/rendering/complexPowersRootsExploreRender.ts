import type p5 from 'p5';
import {
  clampRadius,
  createPlotLayout,
  toScreen,
  type Complex,
  type PlotLayout,
} from '../../curve/modules/demoivre-nth-roots/geometry';
import {
  multiply,
  multiplyViewportRadius,
  type PowersRootsParams,
} from '../../explore/complex-powers-roots/geometry';
import { renderDemoivreNthRootsScene } from './demoivreNthRootsRender';

type Rgb = [number, number, number];
const BG: Rgb = [10, 10, 10];
const ACCENT: Rgb = [212, 184, 122];
const MUTED: Rgb = [160, 205, 255];
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
  p.beginShape();
  for (let i = 0; i <= 96; i += 1) {
    const t = (i / 96) * Math.PI * 2;
    const point = toScreen(layout, { re: Math.cos(t), im: Math.sin(t) });
    p.vertex(point.x, point.y);
  }
  p.endShape();
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

function drawDot(p: p5, layout: PlotLayout, z: Complex, color: Rgb, halo: boolean): void {
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

export function renderComplexPowersRootsExploreScene(
  p: p5,
  snap: {
    width: number;
    height: number;
    params: PowersRootsParams;
    dragging: 'z1' | 'z2' | null;
    layoutRadius?: number;
  },
): void {
  if (snap.params.mode !== 'multiply') {
    renderDemoivreNthRootsScene(p, {
      width: snap.width,
      height: snap.height,
      params: {
        mode: snap.params.mode,
        n: snap.params.n,
        re: snap.params.z1.re,
        im: snap.params.z1.im,
      },
      dragging: snap.dragging === 'z1',
      layoutRadius: snap.layoutRadius,
    });
    return;
  }

  const z1 = clampRadius(snap.params.z1.re, snap.params.z1.im);
  const z2 = clampRadius(snap.params.z2.re, snap.params.z2.im);
  const product = multiply(z1, z2);
  const layout = createPlotLayout(
    snap.width,
    snap.height,
    snap.layoutRadius ?? multiplyViewportRadius(z1, z2),
  );

  p.background(BG[0], BG[1], BG[2]);
  drawGrid(p, layout);
  drawArrow(p, layout, z1, ACCENT, 200, 1.8);
  drawArrow(p, layout, z2, MUTED, 200, 1.7);
  drawArrow(p, layout, product, ACCENT, 230, 2.2);
  drawDot(p, layout, z1, ACCENT, snap.dragging === 'z1');
  drawDot(p, layout, z2, MUTED, snap.dragging === 'z2');
}
