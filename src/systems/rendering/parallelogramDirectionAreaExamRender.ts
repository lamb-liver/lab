import type p5 from 'p5';
import {
  DIR_PARALLEL,
  DIR_PERP,
  PQ,
  arrowTips,
  ghostTips,
  solveSideScales,
  vertexP,
  verticesFromCenter,
  type SideScales,
} from '../../exam/ast-114-parallelogram-direction-area/geometry';
import { withDash, type PlotRectLike } from './p5PlotHelpers';

export type ParallelogramExamPlot = PlotRectLike & {
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
  locale?: 'en';
};

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const PURPLE = [198, 166, 235] as const;
const WHITE = [232, 232, 232] as const;

export function parallelogramExamPlot(width: number, height: number): ParallelogramExamPlot {
  return {
    x: 42,
    y: 28,
    w: width - 76,
    h: height - 66,
    xMin: -32,
    xMax: 20,
    yMin: -18,
    yMax: 18,
  };
}

export function sx(x: number, plot: ParallelogramExamPlot): number {
  return plot.x + ((x - plot.xMin) / (plot.xMax - plot.xMin)) * plot.w;
}

export function sy(y: number, plot: ParallelogramExamPlot): number {
  return plot.y + plot.h - ((y - plot.yMin) / (plot.yMax - plot.yMin)) * plot.h;
}

export function worldFromScreen(
  screenX: number,
  screenY: number,
  plot: ParallelogramExamPlot,
): { x: number; y: number } {
  return {
    x: plot.xMin + ((screenX - plot.x) / plot.w) * (plot.xMax - plot.xMin),
    y: plot.yMax - ((screenY - plot.y) / plot.h) * (plot.yMax - plot.yMin),
  };
}

function drawRailFamily(
  p: p5,
  plot: ParallelogramExamPlot,
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
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  const plot = parallelogramExamPlot(snap.width, snap.height);
  p.noFill();
  p.stroke(...WHITE, 18);
  p.rect(plot.x, plot.y, plot.w, plot.h, 8);
  p.stroke(...WHITE, 40);
  p.line(plot.x, sy(0, plot), plot.x + plot.w, sy(0, plot));
  p.line(sx(0, plot), plot.y, sx(0, plot), plot.y + plot.h);

  drawRailFamily(p, plot, DIR_PARALLEL, BLUE);
  drawRailFamily(p, plot, DIR_PERP, PURPLE);

  const q = { x: 0, y: 0 };
  const scales = solveSideScales(snap.mode, snap.sign);
  const verts = verticesFromCenter(q, scales, snap.sign);
  const pWorld = vertexP(q);
  const { uTip, vTip } = arrowTips(q, scales);

  // Ghost handles: the opposite-sign tips of αu₀ and βv₀ (drag targets).
  for (const tip of ghostTips(q, scales)) {
    p.noStroke();
    p.fill(...WHITE, 55);
    p.circle(sx(tip.x, plot), sy(tip.y, plot), 9);
  }

  // The parallelogram itself is the same for all four sign choices.
  p.noFill();
  p.stroke(...GOLD, 230);
  p.strokeWeight(2.6);
  p.beginShape();
  for (const pt of verts) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape(p.CLOSE);

  const origin = { x: sx(q.x, plot), y: sy(q.y, plot) };
  const pScreen = { x: sx(pWorld.x, plot), y: sy(pWorld.y, plot) };

  // PQ: from P to the centre Q.
  drawArrow(p, pScreen, origin, WHITE, 170);
  drawArrow(p, pScreen, { x: sx(uTip.x, plot), y: sy(uTip.y, plot) }, BLUE, 220);
  drawArrow(p, pScreen, { x: sx(vTip.x, plot), y: sy(vTip.y, plot) }, PURPLE, 220);

  p.noStroke();
  p.fill(...GOLD, 240);
  p.circle(pScreen.x, pScreen.y, 8);
  p.fill(...WHITE, 230);
  p.circle(origin.x, origin.y, 7);

  // Active arrow tips as drag handles.
  for (const tip of [uTip, vTip]) {
    p.stroke(...GOLD, 220);
    p.strokeWeight(2);
    p.fill(10, 10, 10, 220);
    p.circle(sx(tip.x, plot), sy(tip.y, plot), 12);
  }

  p.noStroke();
  p.textSize(11);
  p.fill(...GOLD, 230);
  p.text('P', pScreen.x - 16, pScreen.y - 8);
  p.fill(...WHITE, 200);
  p.text('Q', origin.x + 8, origin.y - 8);
  p.fill(...BLUE, 230);
  p.text('u=αu₀', sx(uTip.x, plot) + 9, sy(uTip.y, plot) + 4);
  p.fill(...PURPLE, 230);
  p.text('v=βv₀', sx(vTip.x, plot) + 9, sy(vTip.y, plot) + 4);
  p.fill(...WHITE, 120);
  p.textSize(10.5);
  p.textAlign(p.RIGHT, p.BASELINE);
  const right = plot.x + plot.w - 10;
  p.text(`PQ=(${PQ.x},${PQ.y})`, right, plot.y + 16);
  p.text('∥ 5x−y=0', right, plot.y + 32);
  p.text('⊥ 3x−2y=0', right, plot.y + 48);
  p.textAlign(p.LEFT, p.BASELINE);
  p.fill(...WHITE, 90);
  p.text(
    snap.locale === 'en' ? 'Drag an arrow tip → flip the sign of α or β' : '拖箭頭尖端 → 翻轉 α 或 β 的正負',
    plot.x + 10,
    plot.y + plot.h - 10,
  );
}

function drawArrow(
  p: p5,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: readonly [number, number, number],
  alpha: number,
): void {
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(1.8);
  p.line(from.x, from.y, to.x, to.y);
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const head = 8;
  p.line(to.x, to.y, to.x - head * Math.cos(ang - 0.4), to.y - head * Math.sin(ang - 0.4));
  p.line(to.x, to.y, to.x - head * Math.cos(ang + 0.4), to.y - head * Math.sin(ang + 0.4));
}
