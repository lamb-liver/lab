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
import {
  clipRect,
  drawBottomLabel,
  drawUnitPlotFrame,
  withDash,
} from './p5PlotHelpers';

type ScatterCorrelationSnap = {
  width: number;
  height: number;
  points: ScatterPoint[];
  selectedIndex: number;
  showMeanAxes: boolean;
  showResiduals: boolean;
};

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const RED = [231, 111, 81] as const;

export function renderScatterCorrelationRegressionScene(
  p: p5,
  snap: ScatterCorrelationSnap,
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

function drawPlot(p: p5, snap: ScatterCorrelationSnap) {
  const fit = regression(snap.points);
  drawPlotFrame(p, SCATTER_PLOT);

  if (fit && snap.showMeanAxes) drawMeanAxes(p, SCATTER_PLOT, fit.xbar, fit.ybar);
  if (fit && snap.showResiduals) drawResiduals(p, SCATTER_PLOT, snap.points, fit);
  if (fit) drawRegressionLine(p, SCATTER_PLOT, fit);
  drawPoints(p, SCATTER_PLOT, snap.points, snap.selectedIndex);
  if (fit) drawMeanPoint(p, SCATTER_PLOT, fit.xbar, fit.ybar);

  drawBottomLabel(
    p,
    SCATTER_PLOT,
    snap.showResiduals ? '殘差垂線段：yᵢ - ŷᵢ' : '拖動點雲；雙擊空白新增，雙擊選取點刪除',
  );
}

function drawPlotFrame(p: p5, plot: PlotRect) {
  drawUnitPlotFrame(p, plot);
  p.noStroke();
  p.fill(255, 255, 255, 58);
  p.textSize(11);
  p.textAlign(p.RIGHT, p.TOP);
  p.text('x', plot.x + plot.w, plot.y + plot.h + 10);
  p.textAlign(p.LEFT, p.TOP);
  p.text('y', plot.x - 18, plot.y - 2);
}

function drawMeanAxes(p: p5, plot: PlotRect, xbar: number, ybar: number) {
  const top = worldToCanvas(plot, xbar, 10);
  const bottom = worldToCanvas(plot, xbar, 0);
  const left = worldToCanvas(plot, 0, ybar);
  const right = worldToCanvas(plot, 10, ybar);

  withDash(p, [5, 6], () => {
    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);
    p.line(top.x, top.y, bottom.x, bottom.y);
    p.line(left.x, left.y, right.x, right.y);
  });
}

function drawRegressionLine(p: p5, plot: PlotRect, fit: RegressionFit) {
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

function drawResiduals(p: p5, plot: PlotRect, points: ScatterPoint[], fit: RegressionFit) {
  clipRect(p, plot, () => {
    for (const point of points) {
      const yhat = fit.a + fit.b * point.x;
      const a = worldToCanvas(plot, point.x, point.y);
      const b = worldToCanvas(plot, point.x, yhat);
      p.stroke(RED[0], RED[1], RED[2], 36);
      p.strokeWeight(5.5);
      p.line(a.x, a.y, b.x, b.y);
      p.stroke(RED[0], RED[1], RED[2], 120);
      p.strokeWeight(1.05);
      p.line(a.x, a.y, b.x, b.y);
    }
  });
}

function drawPoints(p: p5, plot: PlotRect, points: ScatterPoint[], selectedIndex: number) {
  points.forEach((point, i) => {
    const s = worldToCanvas(plot, point.x, point.y);
    const selected = i === selectedIndex;
    p.noStroke();
    p.fill(255, 255, 255, selected ? 46 : 22);
    p.circle(s.x, s.y, selected ? 28 : 20);
    p.fill(...GUIDE, selected ? 230 : 150);
    p.circle(s.x, s.y, selected ? 11 : 8);

    if (selected) {
      p.noFill();
      p.stroke(...ACCENT, 205);
      p.strokeWeight(1.2);
      p.circle(s.x, s.y, 18);
    }
  });
}

function drawMeanPoint(p: p5, plot: PlotRect, xbar: number, ybar: number) {
  const point = worldToCanvas(plot, xbar, ybar);
  p.noFill();
  p.stroke(...ACCENT, 225);
  p.strokeWeight(1.5);
  p.circle(point.x, point.y, 14);
  p.line(point.x - 7, point.y, point.x + 7, point.y);
  p.line(point.x, point.y - 7, point.x, point.y + 7);

  p.noStroke();
  p.fill(...ACCENT, 215);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('(x̄, ȳ)', point.x + 10, point.y - 8);
}
