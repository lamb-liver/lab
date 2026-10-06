import type p5 from 'p5';
import {
  VIEW,
  f,
  mapX,
  mapY,
  plotRect,
  type UpperLimitParams,
} from '../../curve/modules/variable-upper-limit/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

function drawCurve(p: p5, plot: ReturnType<typeof plotRect>): void {
  p.noFill();
  p.stroke(...WHITE, 220);
  p.strokeWeight(1.5);
  p.beginShape();
  const steps = 180;
  for (let i = 0; i <= steps; i += 1) {
    const x = (VIEW.x1 * i) / steps;
    p.vertex(mapX(plot, x), mapY(plot, f(x)));
  }
  p.endShape();
}

function drawArea(p: p5, plot: ReturnType<typeof plotRect>, x: number): void {
  p.noStroke();
  p.fill(...GOLD, 42);
  p.beginShape();
  p.vertex(mapX(plot, 0), mapY(plot, 0));
  const steps = 80;
  for (let i = 0; i <= steps; i += 1) {
    const t = (x * i) / steps;
    p.vertex(mapX(plot, t), mapY(plot, f(t)));
  }
  p.vertex(mapX(plot, x), mapY(plot, 0));
  p.endShape(p.CLOSE);
}

function drawStrip(p: p5, plot: ReturnType<typeof plotRect>, x: number, h: number): void {
  const height = f(x);
  const left = mapX(plot, x);
  const right = mapX(plot, x + h);
  const top = mapY(plot, height);
  const bottom = mapY(plot, 0);
  p.noFill();
  p.stroke(...GOLD, 230);
  p.strokeWeight(1.5);
  p.rect(left, top, right - left, bottom - top);

  p.noStroke();
  p.fill(...GOLD, 230);
  p.circle(left, top, 5);
}

function drawAxes(p: p5, plot: ReturnType<typeof plotRect>): void {
  const y0 = mapY(plot, 0);
  const x0 = mapX(plot, 0);
  p.stroke(...WHITE, 36);
  p.strokeWeight(1);
  p.line(plot.left, y0, plot.left + plot.width, y0);
  p.line(x0, plot.top, x0, plot.top + plot.height);

  p.noStroke();
  p.fill(...WHITE, 70);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  for (const tick of [0, Math.PI, 2 * Math.PI]) {
    if (tick < VIEW.x0 || tick > VIEW.x1) continue;
    const label = tick === 0 ? '0' : tick === Math.PI ? 'π' : '2π';
    p.text(label, mapX(plot, tick), y0 + 6);
  }
  p.textAlign(p.LEFT, p.BASELINE);
  p.text('x', plot.left + plot.width - 4, y0 - 8);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('f', x0 - 8, plot.top + 8);
}

export function renderVariableUpperLimit(p: p5, params: UpperLimitParams): void {
  const plot = plotRect(p.width, p.height);
  p.background(10, 10, 10);
  drawAxes(p, plot);
  drawArea(p, plot, params.x);
  drawCurve(p, plot);
  drawStrip(p, plot, params.x, params.h);
}
