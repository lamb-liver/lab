import type p5 from 'p5';
import {
  SCATTER_PLOT,
  regression,
  scatterViewTransform,
  worldToCanvas,
  type PlotRect,
  type RegressionFit,
  type ScatterPoint,
} from '../../curve/modules/scatter-correlation-regression/geometry';
import { BASE_POINTS, influenceStats } from '../../curve/modules/regression-outlier-influence/geometry';
import {
  clipRect,
  drawBottomLabel as drawPlotBottomLabel,
  drawUnitPlotFrame,
  withDash,
} from './p5PlotHelpers';

export type RegressionOutlierInfluenceSnap = {
  width: number;
  height: number;
  outlier: ScatterPoint;
  dragging: boolean;
  showLeverage: boolean;
  showResidual: boolean;
  showMean: boolean;
};

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const RED = [231, 111, 81] as const;

export function renderRegressionOutlierInfluenceScene(
  p: p5,
  snap: RegressionOutlierInfluenceSnap,
): void {
  p.background(...BG);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const t = scatterViewTransform(snap.width, snap.height);
  p.push();
  p.translate(t.ox, t.oy);
  p.scale(t.scale);
  drawPlot(p, snap);
  p.pop();
}

function drawPlot(p: p5, snap: RegressionOutlierInfluenceSnap) {
  const baseFit = regression(BASE_POINTS);
  const allFit = regression([...BASE_POINTS, snap.outlier]);
  const stats = influenceStats(snap.outlier, baseFit, allFit);

  drawUnitPlotFrame(p, SCATTER_PLOT);
  if (baseFit && snap.showMean) drawBaseMean(p, SCATTER_PLOT, baseFit);
  if (baseFit && snap.showLeverage) drawLeverageGuide(p, SCATTER_PLOT, baseFit.xbar, snap.outlier.x);
  if (baseFit) drawBaseRegressionLine(p, SCATTER_PLOT, baseFit);
  if (allFit) drawNewRegressionLine(p, SCATTER_PLOT, allFit);
  drawBasePoints(p, SCATTER_PLOT);
  if (baseFit && snap.showResidual) drawBaselineResidual(p, SCATTER_PLOT, snap.outlier, baseFit);
  drawOutlierPoint(p, SCATTER_PLOT, snap.outlier, stats.deltaB, snap.dragging);
  drawBottomLabel(p, SCATTER_PLOT, snap.showResidual);
}

function drawBasePoints(p: p5, plot: PlotRect) {
  for (const point of BASE_POINTS) {
    const s = worldToCanvas(plot, point.x, point.y);
    p.noStroke();
    p.fill(255, 255, 255, 17);
    p.circle(s.x, s.y, 20);
    p.fill(...GUIDE, 125);
    p.circle(s.x, s.y, 8);
  }
}

function drawOutlierPoint(
  p: p5,
  plot: PlotRect,
  outlier: ScatterPoint,
  deltaB: number,
  dragging: boolean,
) {
  const point = worldToCanvas(plot, outlier.x, outlier.y);

  p.noStroke();
  p.fill(RED[0], RED[1], RED[2], dragging ? 62 : 40);
  p.circle(point.x, point.y, dragging ? 38 : 32);
  p.fill(RED[0], RED[1], RED[2], 238);
  p.circle(point.x, point.y, dragging ? 14 : 12);
  p.noFill();
  p.stroke(RED[0], RED[1], RED[2], 190);
  p.strokeWeight(1.25);
  p.circle(point.x, point.y, dragging ? 26 : 22);

  if (Math.abs(deltaB) >= 0.18) {
    p.stroke(RED[0], RED[1], RED[2], 58);
    p.strokeWeight(7);
    p.circle(point.x, point.y, 50);
  }

  p.noStroke();
  p.fill(RED[0], RED[1], RED[2], 220);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('(xₒ, yₒ)', point.x + 11, point.y - 8);
}

function drawBaseRegressionLine(p: p5, plot: PlotRect, fit: RegressionFit) {
  const p1 = worldToCanvas(plot, 0, fit.a);
  const p2 = worldToCanvas(plot, 10, fit.a + fit.b * 10);

  clipRect(p, plot, () => {
    withDash(p, [8, 7], () => {
      p.stroke(255, 255, 255, 92);
      p.strokeWeight(1.15);
      p.line(p1.x, p1.y, p2.x, p2.y);
    });
  });
}

function drawNewRegressionLine(p: p5, plot: PlotRect, fit: RegressionFit) {
  const p1 = worldToCanvas(plot, 0, fit.a);
  const p2 = worldToCanvas(plot, 10, fit.a + fit.b * 10);

  clipRect(p, plot, () => {
    p.stroke(...ACCENT, 18);
    p.strokeWeight(7);
    p.line(p1.x, p1.y, p2.x, p2.y);
    p.stroke(...ACCENT, 44);
    p.strokeWeight(3.5);
    p.line(p1.x, p1.y, p2.x, p2.y);
    p.stroke(...ACCENT, 235);
    p.strokeWeight(1.55);
    p.line(p1.x, p1.y, p2.x, p2.y);
  });
}

function drawBaselineResidual(p: p5, plot: PlotRect, outlier: ScatterPoint, baseFit: RegressionFit) {
  const yBase = baseFit.a + baseFit.b * outlier.x;
  const a = worldToCanvas(plot, outlier.x, outlier.y);
  const b = worldToCanvas(plot, outlier.x, yBase);

  clipRect(p, plot, () => {
    p.stroke(RED[0], RED[1], RED[2], 34);
    p.strokeWeight(7);
    p.line(a.x, a.y, b.x, b.y);
    p.stroke(RED[0], RED[1], RED[2], 155);
    p.strokeWeight(1.2);
    p.line(a.x, a.y, b.x, b.y);
    p.noStroke();
    p.fill(RED[0], RED[1], RED[2], 220);
    p.circle(b.x, b.y, 5);
  });
}

function drawLeverageGuide(p: p5, plot: PlotRect, xbar: number, xo: number) {
  const xMean = worldToCanvas(plot, xbar, 0).x;
  const xOutlier = worldToCanvas(plot, xo, 0).x;
  const low = Math.min(xMean, xOutlier);
  const high = Math.max(xMean, xOutlier);
  const y = plot.y + plot.h + 36;

  withDash(p, [5, 6], () => {
    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);
    p.line(xMean, plot.y, xMean, plot.y + plot.h);
    p.line(xOutlier, plot.y, xOutlier, plot.y + plot.h);
  });

  p.stroke(255, 255, 255, 42);
  p.strokeWeight(1);
  p.line(low, y, high, y);
  p.line(low, y - 5, low, y + 5);
  p.line(high, y - 5, high, y + 5);
  p.noStroke();
  p.fill(255, 255, 255, 70);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text('|xₒ - x̄₀|', (low + high) / 2, y + 8);
}

function drawBaseMean(p: p5, plot: PlotRect, baseFit: RegressionFit) {
  const point = worldToCanvas(plot, baseFit.xbar, baseFit.ybar);

  withDash(p, [5, 6], () => {
    const top = worldToCanvas(plot, baseFit.xbar, 10);
    const bottom = worldToCanvas(plot, baseFit.xbar, 0);
    const left = worldToCanvas(plot, 0, baseFit.ybar);
    const right = worldToCanvas(plot, 10, baseFit.ybar);
    p.stroke(255, 255, 255, 20);
    p.strokeWeight(1);
    p.line(top.x, top.y, bottom.x, bottom.y);
    p.line(left.x, left.y, right.x, right.y);
  });

  p.noFill();
  p.stroke(...ACCENT, 175);
  p.strokeWeight(1.25);
  p.circle(point.x, point.y, 12);
  p.line(point.x - 6, point.y, point.x + 6, point.y);
  p.line(point.x, point.y - 6, point.x, point.y + 6);
}

function drawBottomLabel(p: p5, plot: PlotRect, showResidual: boolean) {
  drawPlotBottomLabel(
    p,
    plot,
    showResidual ? '紅線：高亮點對基準線的殘差' : '灰線：主體基準線　金線：加入高亮點後的新線',
  );
}
