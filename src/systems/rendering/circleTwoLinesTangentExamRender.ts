import type p5 from 'p5';
import {
  L1,
  L2,
  footOnLine,
  minDistances,
  nearCirclePointToward,
  radiusForRatio,
  ratioIsThreeToOne,
  tangentSlopesFromOrigin,
} from '../../exam/ast-115-circle-two-lines-tangent/geometry';
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
  a: number;
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

function drawLineThroughOrigin(p: p5, plot: Plot, slope: number, color: readonly [number, number, number], weight: number, alpha: number): void {
  const y1 = slope * plot.xMin;
  const y2 = slope * plot.xMax;
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.line(sx(plot.xMin, plot), sy(y1, plot), sx(plot.xMax, plot), sy(y2, plot));
}

export function renderCircleTwoLinesTangentExamScene(p: p5, snap: Snap): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  const extent = Math.max(4.5, Math.abs(snap.a) + radiusForRatio(snap.a) + 1.5);
  const plot: Plot = {
    x: 42,
    y: 28,
    w: snap.width - 76,
    h: snap.height - 66,
    xMin: -extent,
    xMax: extent,
    yMin: -extent * 0.72,
    yMax: extent * 0.72,
  };

  p.noFill();
  p.stroke(...WHITE, 18);
  p.rect(plot.x, plot.y, plot.w, plot.h, 8);
  p.stroke(...WHITE, 42);
  p.line(plot.x, sy(0, plot), plot.x + plot.w, sy(0, plot));
  p.line(sx(0, plot), plot.y, sx(0, plot), plot.y + plot.h);

  drawLineThroughOrigin(p, plot, 4 / 3, BLUE, 2.2, 210);
  drawLineThroughOrigin(p, plot, -3 / 4, PURPLE, 2.2, 210);

  const center = { x: snap.a, y: 0 };
  const radius = radiusForRatio(snap.a);
  const feasible = ratioIsThreeToOne(snap.a, radius);
  const { d1, d2 } = minDistances(snap.a, radius);

  p.noFill();
  p.stroke(...GOLD, feasible ? 230 : 120);
  p.strokeWeight(feasible ? 2.6 : 1.8);
  p.circle(sx(center.x, plot), sy(center.y, plot), 2 * (sx(center.x + radius, plot) - sx(center.x, plot)));

  for (const [line, color, label] of [
    [L1, BLUE, 'd₁'],
    [L2, PURPLE, 'd₂'],
  ] as const) {
    const foot = footOnLine(center, line);
    const rim = nearCirclePointToward(center, foot, radius);
    p.stroke(color[0], color[1], color[2], 200);
    p.strokeWeight(2);
    p.line(sx(rim.x, plot), sy(rim.y, plot), sx(foot.x, plot), sy(foot.y, plot));
    p.noStroke();
    p.fill(color[0], color[1], color[2], 230);
    p.circle(sx(foot.x, plot), sy(foot.y, plot), 6);
    p.textSize(11);
    p.text(label, sx((rim.x + foot.x) / 2, plot) + 6, sy((rim.y + foot.y) / 2, plot) - 6);
  }

  const slopes = tangentSlopesFromOrigin(snap.a);
  if (slopes) {
    for (const m of slopes) {
      withDash(p, [7, 6], () => {
        drawLineThroughOrigin(p, plot, m, GOLD, 1.8, 200);
      });
    }
  }

  p.noStroke();
  p.fill(...GOLD, 240);
  p.circle(sx(center.x, plot), sy(center.y, plot), 8);
  p.fill(...WHITE, 220);
  p.circle(sx(0, plot), sy(0, plot), 6);
  p.textSize(11);
  p.text('C', sx(center.x, plot) + 8, sy(center.y, plot) - 8);
  p.text('O', sx(0, plot) + 8, sy(0, plot) - 8);
  p.fill(...WHITE, 120);
  p.textSize(10.5);
  p.text(`d₁:d₂≈${(d1 / Math.max(d2, 1e-9)).toFixed(2)}:1`, plot.x + 10, plot.y + 16);
  p.text('L₁', sx(plot.xMax * 0.55, plot), sy((4 / 3) * plot.xMax * 0.55, plot) - 8);
  p.text('L₂', sx(plot.xMax * 0.55, plot), sy((-3 / 4) * plot.xMax * 0.55, plot) + 14);
}
