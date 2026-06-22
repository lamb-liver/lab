import type p5 from 'p5';
import {
  BOXPLOT_PLOT,
  boxSummary,
  boxplotViewTransform,
  sortedValuesWithIndex,
  valueToCanvas,
  type BoxplotSummary,
  type PlotRect,
} from '../../curve/modules/percentile-box-plot/geometry';
import { drawBottomLabel as drawPlotBottomLabel, withDash } from './p5PlotHelpers';

type PercentileBoxPlotSnap = {
  width: number;
  height: number;
  values: number[];
  fenceK: number;
  selectedIndex: number;
  showPercentiles: boolean;
  showSortedRanks: boolean;
};

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const RED = [231, 111, 81] as const;

export function renderPercentileBoxPlotScene(p: p5, snap: PercentileBoxPlotSnap): void {
  p.background(...BG);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const t = boxplotViewTransform(snap.width, snap.height);
  p.push();
  p.translate(t.ox, t.oy);
  p.scale(t.scale);
  drawPlot(p, snap);
  p.pop();
}

function drawPlot(p: p5, snap: PercentileBoxPlotSnap) {
  const summary = boxSummary(snap.values, snap.fenceK);

  drawAxis(p, BOXPLOT_PLOT);
  if (snap.showPercentiles) drawPercentileGuides(p, BOXPLOT_PLOT, summary);
  drawBoxplot(p, BOXPLOT_PLOT, summary);
  drawValueDots(p, BOXPLOT_PLOT, snap, summary);
  if (snap.showSortedRanks) drawSortedRanks(p, BOXPLOT_PLOT, snap.values);
  drawBottomLabel(p, BOXPLOT_PLOT);
}

function drawAxis(p: p5, plot: PlotRect) {
  const axisY = plot.y + plot.h * 0.73;

  p.stroke(255, 255, 255, 32);
  p.strokeWeight(1);
  p.line(plot.x, axisY, plot.x + plot.w, axisY);

  for (let v = 0; v <= 10; v += 1) {
    const x = valueToCanvas(plot, v);
    p.stroke(255, 255, 255, v % 2 === 0 ? 22 : 10);
    p.line(x, axisY - 6, x, axisY + 6);

    if (v % 2 === 0) {
      p.noStroke();
      p.fill(255, 255, 255, 62);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(String(v), x, axisY + 12);
    }
  }

  p.noStroke();
  p.fill(255, 255, 255, 58);
  p.textSize(11);
  p.textAlign(p.RIGHT, p.TOP);
  p.text('數值 x', plot.x + plot.w, axisY + 32);
}

function drawPercentileGuides(p: p5, plot: PlotRect, summary: BoxplotSummary) {
  const p10 = valueToCanvas(plot, summary.p10);
  const p90 = valueToCanvas(plot, summary.p90);
  const y0 = plot.y + plot.h * 0.12;
  const y1 = plot.y + plot.h * 0.89;

  withDash(p, [5, 6], () => {
    p.stroke(255, 255, 255, 20);
    p.strokeWeight(1);
    p.line(p10, y0, p10, y1);
    p.line(p90, y0, p90, y1);
  });

  drawSmallMarker(p, p10, y0 - 6, 'P₁₀');
  drawSmallMarker(p, p90, y0 - 6, 'P₉₀');
}

function drawBoxplot(p: p5, plot: PlotRect, summary: BoxplotSummary) {
  const boxY = plot.y + plot.h * 0.36;
  const boxH = 78;
  const xMin = valueToCanvas(plot, summary.whiskerLow);
  const xMax = valueToCanvas(plot, summary.whiskerHigh);
  const xQ1 = valueToCanvas(plot, summary.q1);
  const xQ2 = valueToCanvas(plot, summary.q2);
  const xQ3 = valueToCanvas(plot, summary.q3);

  p.stroke(...ACCENT, 28);
  p.strokeWeight(10);
  p.line(xMin, boxY, xMax, boxY);
  p.stroke(...ACCENT, 215);
  p.strokeWeight(1.6);
  p.line(xMin, boxY, xMax, boxY);
  p.line(xMin, boxY - boxH * 0.34, xMin, boxY + boxH * 0.34);
  p.line(xMax, boxY - boxH * 0.34, xMax, boxY + boxH * 0.34);

  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 18);
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 220);
  p.strokeWeight(1.5);
  p.rect(xQ1, boxY - boxH / 2, xQ3 - xQ1, boxH, 8);

  p.stroke(...ACCENT, 245);
  p.strokeWeight(2);
  p.line(xQ2, boxY - boxH * 0.58, xQ2, boxY + boxH * 0.58);

  drawQuartileLabel(p, xQ1, boxY - boxH / 2 - 21, 'Q₁');
  drawQuartileLabel(p, xQ2, boxY + boxH / 2 + 11, 'Q₂');
  drawQuartileLabel(p, xQ3, boxY - boxH / 2 - 21, 'Q₃');
}

function drawValueDots(
  p: p5,
  plot: PlotRect,
  snap: PercentileBoxPlotSnap,
  summary: BoxplotSummary,
) {
  const axisY = plot.y + plot.h * 0.73;
  const sorted = sortedValuesWithIndex(snap.values);

  sorted.forEach((item, rank) => {
    const selected = item.index === snap.selectedIndex;
    const outlier = item.value < summary.lowerFence || item.value > summary.upperFence;
    const x = valueToCanvas(plot, item.value);
    const y = axisY - 22 + (rank % 3) * 13;
    const color = outlier ? RED : GUIDE;

    p.noStroke();
    p.fill(color[0], color[1], color[2], selected ? 52 : 22);
    p.circle(x, y, selected ? 28 : 20);
    p.fill(color[0], color[1], color[2], selected ? 235 : outlier ? 215 : 135);
    p.circle(x, y, selected ? 11 : 8);

    if (selected) {
      p.noFill();
      p.stroke(...ACCENT, 210);
      p.strokeWeight(1.2);
      p.circle(x, y, 18);
    }
  });
}

function drawSortedRanks(p: p5, plot: PlotRect, values: number[]) {
  const sorted = sortedValuesWithIndex(values);
  const y = plot.y + plot.h * 0.9;

  sorted.forEach((item, i) => {
    const x = valueToCanvas(plot, item.value);
    p.noStroke();
    p.fill(255, 255, 255, 52);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(String(i + 1), x, y + (i % 2) * 12);
  });

  p.noStroke();
  p.fill(255, 255, 255, 58);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text('排序順位', plot.x, y + 30);
}

function drawQuartileLabel(p: p5, x: number, y: number, label: string) {
  p.noStroke();
  p.fill(...ACCENT, 210);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, x, y);
}

function drawSmallMarker(p: p5, x: number, y: number, label: string) {
  p.noStroke();
  p.fill(255, 255, 255, 78);
  p.textSize(11);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(label, x, y);
  p.stroke(255, 255, 255, 78);
  p.strokeWeight(1);
  p.line(x - 5, y + 4, x + 5, y + 4);
}

function drawBottomLabel(p: p5, plot: PlotRect) {
  drawPlotBottomLabel(p, plot, '拖動資料點改變排序；盒身是中間 50%，紅點為超出鬚線門檻的離群值', 26);
}
