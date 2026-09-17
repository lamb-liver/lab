import type p5 from 'p5';
import {
  DIR_PARALLEL,
  DIR_PERP,
  PQ,
  sideVectors,
  solveSideScales,
  verticesFromCenter,
  type SideScales,
} from '../../exam/ast-114-parallelogram-direction-area/geometry';
import { withDash, type PlotRectLike } from './p5PlotHelpers';

type Plot = PlotRectLike & {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type Snap = {
  width: number;
  height: number;
  mode: SideScales['mode'];
  sign: 1 | -1;
};

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const PURPLE = [198, 166, 235] as const;
const WHITE = [232, 232, 232] as const;

function sx(x: number, plot: Plot): number {
  return plot.x + ((x - plot.xMin) / (plot.xMax - plot.xMin)) * plot.w;
}

function sy(y: number, plot: Plot): number {
  return plot.y + plot.h - ((y - plot.yMin) / (plot.yMax - plot.yMin)) * plot.h;
}

function drawRailFamily(
  p: p5,
  plot: Plot,
  direction: { x: number; y: number },
  color: readonly [number, number, number],
): void {
  const nx = -direction.y;
  const ny = direction.x;
  const nLen = Math.hypot(nx, ny) || 1;
  const ux = nx / nLen;
  const uy = ny / nLen;
  withDash(p, [5, 8], () => {
    p.stroke(color[0], color[1], color[2], 55);
    p.strokeWeight(1.1);
    for (let k = -6; k <= 6; k += 1) {
      const ox = ux * k * 3.2;
      const oy = uy * k * 3.2;
      const dx = direction.x * 40;
      const dy = direction.y * 40;
      p.line(sx(ox - dx, plot), sy(oy - dy, plot), sx(ox + dx, plot), sy(oy + dy, plot));
    }
  });
}

export function renderParallelogramDirectionAreaExamScene(p: p5, snap: Snap): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const plot: Plot = {
    x: 42,
    y: 28,
    w: snap.width - 76,
    h: snap.height - 66,
    xMin: -24,
    xMax: 24,
    yMin: -18,
    yMax: 18,
  };

  p.noFill();
  p.stroke(...WHITE, 18);
  p.rect(plot.x, plot.y, plot.w, plot.h, 8);
  p.stroke(...WHITE, 40);
  p.line(plot.x, sy(0, plot), plot.x + plot.w, sy(0, plot));
  p.line(sx(0, plot), plot.y, sx(0, plot), plot.y + plot.h);

  drawRailFamily(p, plot, DIR_PARALLEL, BLUE);
  drawRailFamily(p, plot, DIR_PERP, PURPLE);

  const scales = solveSideScales(snap.mode, snap.sign);
  const verts = verticesFromCenter({ x: 0, y: 0 }, scales);
  const { u, v } = sideVectors(scales);

  p.noFill();
  p.stroke(...GOLD, 230);
  p.strokeWeight(2.6);
  p.beginShape();
  for (const pt of verts) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape(p.CLOSE);

  const origin = { x: sx(0, plot), y: sy(0, plot) };
  const pScreen = { x: sx(verts[0].x, plot), y: sy(verts[0].y, plot) };
  p.stroke(...WHITE, 160);
  p.strokeWeight(1.6);
  p.line(origin.x, origin.y, pScreen.x, pScreen.y);

  p.stroke(...BLUE, 200);
  p.line(pScreen.x, pScreen.y, sx(verts[0].x - u.x, plot), sy(verts[0].y - u.y, plot));
  p.stroke(...PURPLE, 200);
  p.line(pScreen.x, pScreen.y, sx(verts[0].x - v.x, plot), sy(verts[0].y - v.y, plot));

  p.noStroke();
  p.fill(...GOLD, 240);
  p.circle(pScreen.x, pScreen.y, 8);
  p.fill(...WHITE, 230);
  p.circle(origin.x, origin.y, 7);
  p.textSize(11);
  p.fill(...GOLD, 230);
  p.text('P', pScreen.x + 8, pScreen.y - 8);
  p.fill(...WHITE, 200);
  p.text('Q', origin.x + 8, origin.y - 8);
  p.fill(...WHITE, 120);
  p.textSize(10.5);
  p.text(`PQ=(${PQ.x},${PQ.y})`, plot.x + 10, plot.y + 16);
  p.text('∥ 5x−y=0', plot.x + 10, plot.y + 32);
  p.text('⊥ 3x−2y=0', plot.x + 10, plot.y + 48);
}
