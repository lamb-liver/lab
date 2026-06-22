import type p5 from 'p5';
import {
  FIXED_EULER_START,
  HINT_Y_OFFSET,
  TRACE_STEP,
  TRACE_STEPS,
} from '../../curve/modules/differential-equations-geometry/constants';
import { formatNum, getEquation } from '../../curve/modules/differential-equations-geometry/equations';
import {
  buildEulerPath,
  buildExactPath,
  traceSolution,
} from '../../curve/modules/differential-equations-geometry/math';
import {
  computePlotRect,
  sx,
  sy,
} from '../../curve/modules/differential-equations-geometry/layout';
import type {
  DiffEqMode,
  DiffEqParams,
  EqKey,
  PlotRect,
  Point2,
} from '../../curve/modules/differential-equations-geometry/types';

type DiffEqGeometrySnap = {
  width: number;
  height: number;
  mode: DiffEqMode;
  eqKey: EqKey;
  stepH: number;
  initialPoints: Point2[];
};

const GOLD: [number, number, number] = [212, 184, 122];
const BLUE: [number, number, number] = [130, 185, 230];

function withPlotClip(p: p5, plot: PlotRect, draw: () => void): void {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(plot.x, plot.y, plot.w, plot.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

function drawVisualTitle(p: p5, plot: PlotRect): void {
  p.push();
  p.noStroke();
  p.fill(...GOLD);
  p.textSize(14);
  p.textStyle(p.BOLD);
  p.text('微分方程', plot.x, 56);

  p.fill(155);
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.text('斜率場顯示方向；解曲線順著方向前進', plot.x, 76);
  p.pop();
}

function drawAxesAndGrid(p: p5, plot: PlotRect): void {
  p.push();

  p.noFill();
  p.stroke(255, 255, 255, 20);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  p.stroke(255, 255, 255, 8);
  for (let i = -3; i <= 3; i++) {
    p.line(sx(i, plot), plot.y, sx(i, plot), plot.y + plot.h);
    p.line(plot.x, sy(i, plot), plot.x + plot.w, sy(i, plot));
  }

  p.stroke(255, 255, 255, 32);
  p.line(plot.x, sy(0, plot), plot.x + plot.w, sy(0, plot));
  p.line(sx(0, plot), plot.y, sx(0, plot), plot.y + plot.h);

  p.noStroke();
  p.fill(145);
  p.textSize(11);
  p.text('x', plot.x + plot.w + 10, sy(0, plot) + 4);
  p.text('y', sx(0, plot) + 8, plot.y - 10);

  p.pop();
}

function drawSlopeField(
  p: p5,
  eq: ReturnType<typeof getEquation>,
  plot: PlotRect,
): void {
  p.push();

  p.stroke(255, 255, 255, 34);
  p.strokeWeight(1.1);

  const cols = 21;
  const rows = 15;
  const len = 18;

  for (let i = 0; i < cols; i++) {
    const x = -3 + (i / (cols - 1)) * 6;

    for (let j = 0; j < rows; j++) {
      const y = -3 + (j / (rows - 1)) * 6;
      const m = Math.max(-8, Math.min(8, eq.f(x, y)));

      const angle = Math.atan(m);
      const dx = Math.cos(angle) * len * 0.5;
      const dy = Math.sin(angle) * len * 0.5;

      const px = sx(x, plot);
      const py = sy(y, plot);

      p.line(px - dx, py + dy, px + dx, py - dy);
    }
  }

  p.pop();
}

function drawSolutionCurve(
  p: p5,
  path: Point2[],
  plot: PlotRect,
  weight: number,
  alphaValue: number,
): void {
  p.push();

  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], alphaValue);
  p.strokeWeight(weight);

  p.beginShape();
  for (const pt of path) {
    p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  }
  p.endShape();

  p.pop();
}

function drawExactCurve(p: p5, path: Point2[], plot: PlotRect): void {
  p.push();
  p.noFill();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 16);
  p.strokeWeight(8);
  p.beginShape();
  for (const pt of path) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 56);
  p.strokeWeight(3.5);
  p.beginShape();
  for (const pt of path) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 235);
  p.strokeWeight(1.6);
  p.beginShape();
  for (const pt of path) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape();

  p.pop();
}

function drawEulerPolyline(p: p5, path: Point2[], plot: PlotRect): void {
  p.push();
  p.noFill();

  p.stroke(BLUE[0], BLUE[1], BLUE[2], 36);
  p.strokeWeight(7);
  p.beginShape();
  for (const pt of path) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape();

  p.stroke(BLUE[0], BLUE[1], BLUE[2], 220);
  p.strokeWeight(2);
  p.beginShape();
  for (const pt of path) p.vertex(sx(pt.x, plot), sy(pt.y, plot));
  p.endShape();

  p.noStroke();
  p.fill(BLUE[0], BLUE[1], BLUE[2], 230);
  for (const pt of path) {
    p.circle(sx(pt.x, plot), sy(pt.y, plot), 4.5);
  }

  p.pop();
}

function drawInitialPoint(p: p5, x: number, y: number, plot: PlotRect): void {
  const px = sx(x, plot);
  const py = sy(y, plot);

  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 28);
  p.circle(px, py, 22);

  p.fill(...GOLD);
  p.circle(px, py, 7);
  p.pop();
}

function drawVisualHint(p: p5, plot: PlotRect, label: string): void {
  p.push();
  p.noStroke();
  p.fill(165);
  p.textSize(13);
  p.text(label, plot.x, plot.y + plot.h + HINT_Y_OFFSET);
  p.pop();
}

function drawSlopeFieldScene(
  p: p5,
  snap: DiffEqGeometrySnap,
  plot: PlotRect,
): void {
  const eq = getEquation(snap.eqKey);

  drawAxesAndGrid(p, plot);
  withPlotClip(p, plot, () => {
    drawSlopeField(p, eq, plot);

    for (const pt of snap.initialPoints) {
      const backward = traceSolution(eq, pt.x, pt.y, -TRACE_STEP, TRACE_STEPS);
      const forward = traceSolution(eq, pt.x, pt.y, TRACE_STEP, TRACE_STEPS);

      for (const path of [backward, forward]) {
        drawSolutionCurve(p, path, plot, 7, 14);
        drawSolutionCurve(p, path, plot, 3.5, 42);
        drawSolutionCurve(p, path, plot, 1.5, 225);
      }

      drawInitialPoint(p, pt.x, pt.y, plot);
    }
  });

  drawVisualHint(
    p,
    plot,
    '點擊平面新增初始條件；每條曲線都順著方向場前進',
  );
}

function drawEulerScene(p: p5, snap: DiffEqGeometrySnap, plot: PlotRect): void {
  const eq = getEquation(snap.eqKey);
  const { x: x0, y: y0 } = FIXED_EULER_START;

  drawAxesAndGrid(p, plot);

  const truePath = buildExactPath(eq, x0, y0);
  const eulerPath = buildEulerPath(eq, x0, y0, snap.stepH);

  withPlotClip(p, plot, () => {
    drawSlopeField(p, eq, plot);
    drawExactCurve(p, truePath, plot);
    drawEulerPolyline(p, eulerPath, plot);
    drawInitialPoint(p, x0, y0, plot);
  });

  const last = eulerPath[eulerPath.length - 1]!;
  const trueY = eq.exact(last.x, x0, y0);
  const err = Math.abs(last.y - trueY);

  drawVisualHint(
    p,
    plot,
    `Euler：yₙ₊₁ = yₙ + h f(xₙ,yₙ)    |E| = ${formatNum(err)}`,
  );
}

export function renderDifferentialEquationsGeometryScene(
  p: p5,
  snap: DiffEqGeometrySnap,
): void {
  p.background(10, 10, 10);

  const plot = computePlotRect(snap.width, snap.height);
  drawVisualTitle(p, plot);

  if (snap.mode === 'field') {
    drawSlopeFieldScene(p, snap, plot);
  } else {
    drawEulerScene(p, snap, plot);
  }
}

export type DiffEqSidebarState = {
  statsLines: string[];
  hintLine: string;
};

export function buildDiffEqSidebarState(
  params: DiffEqParams,
): DiffEqSidebarState {
  const eq = getEquation(params.eqKey);

  if (params.mode === 'field') {
    return {
      statsLines: [
        `方程：${eq.label}`,
        `軌跡數：${params.initialPoints.length}`,
        '方向場：dy/dx=f(x,y)',
      ],
      hintLine: `點擊平面新增初始點 · ${eq.note}`,
    };
  }

  const { x: x0, y: y0 } = FIXED_EULER_START;
  const euler = buildEulerPath(eq, x0, y0, params.stepH);
  const last = euler[euler.length - 1]!;
  const trueY = eq.exact(last.x, x0, y0);
  const err = Math.abs(last.y - trueY);

  return {
    statsLines: [
      `方程：${eq.label}`,
      `起點：(${x0}, ${y0})`,
      `步數 N：${euler.length - 1}`,
      `終點 |E|：${formatNum(err)}`,
    ],
    hintLine: 'h 越小，折線越接近真解',
  };
}
