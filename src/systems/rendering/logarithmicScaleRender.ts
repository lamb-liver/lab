import type p5 from 'p5';
import {
  LOG_LEFT_PLOT,
  LOG_RIGHT_PLOT,
  LOG_VIEW,
  type AxisMode,
  type LogPlotPoint,
  type LogarithmicState,
  type PlotBox,
  buildLogCurvePoints,
  deriveLogarithmicState,
  mapLinearY,
  mapLogY,
} from '../../curve/modules/logarithmic-scale/geometry';
import type { ParamValues } from '../../curve/types';

export type LogarithmicScaleSnap = {
  width: number;
  height: number;
  params: ParamValues;
  reveal: number;
};

const GOLD = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

function withPlotClip(p: p5, box: PlotBox, draw: () => void): void {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(box.x, box.y, box.w, box.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

export function renderLogarithmicScaleScene(p: p5, snap: LogarithmicScaleSnap): void {
  const data = deriveLogarithmicState(snap.params);
  p.background(10, 10, 10);

  const scale = Math.min(snap.width / LOG_VIEW.width, snap.height / LOG_VIEW.height);
  const ox = (snap.width - LOG_VIEW.width * scale) / 2;
  const oy = (snap.height - LOG_VIEW.height * scale) / 2;

  p.push();
  p.translate(ox, oy);
  p.scale(scale);

  drawPlot(p, LOG_LEFT_PLOT, data, 'linear', '線性軸 y', snap.reveal);
  drawPlot(p, LOG_RIGHT_PLOT, data, 'log', '對數軸 log₁₀ y', snap.reveal);

  p.pop();
}

function drawPlot(
  p: p5,
  box: PlotBox,
  data: LogarithmicState,
  axisMode: AxisMode,
  label: string,
  reveal: number,
): void {
  drawFrame(p, box, axisMode);
  drawGrid(p, box, data, axisMode);
  withPlotClip(p, box, () => drawCurves(p, box, data, axisMode, reveal));
  drawPlotCaption(p, box, label);
}

function drawFrame(p: p5, box: PlotBox, axisMode: AxisMode): void {
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.rect(box.x, box.y, box.w, box.h);

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 28);
  p.line(box.x, box.y + box.h, box.x + box.w, box.y + box.h);
  p.line(box.x, box.y, box.x, box.y + box.h);

  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 55);
  p.textSize(11);
  p.text('x', box.x + box.w + 8, box.y + box.h + 4);
  p.text(axisMode === 'log' ? 'log₁₀ y' : 'y', box.x - 8, box.y - 12);
}

function drawPlotCaption(p: p5, box: PlotBox, label: string): void {
  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 155);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, box.x + box.w * 0.5, box.y + box.h + 28);
  p.textAlign(p.LEFT, p.BASELINE);
  p.textStyle(p.NORMAL);
}

function drawGrid(p: p5, box: PlotBox, data: LogarithmicState, axisMode: AxisMode): void {
  for (let i = 0; i <= 4; i += 1) {
    const x = p.map(i, 0, 4, box.x, box.x + box.w);
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 9);
    p.line(x, box.y, x, box.y + box.h);

    p.noStroke();
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 42);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(String(i), x, box.y + box.h + 8);
    p.textAlign(p.LEFT, p.BASELINE);
  }

  if (axisMode === 'log') {
    for (let decade = 0; decade <= 4; decade += 1) {
      const y = mapLogY(Math.pow(10, decade), box, data);
      p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 22);
      p.line(box.x, y, box.x + box.w, y);

      p.noStroke();
      p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 58);
      p.textSize(10);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(`10^${decade}`, box.x - 8, y);

      if (decade < 4) {
        for (let n = 2; n <= 9; n += 1) {
          const minor = n * Math.pow(10, decade);
          const my = mapLogY(minor, box, data);
          p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 4);
          p.line(box.x, my, box.x + box.w, my);
        }
      }
      p.textAlign(p.LEFT, p.BASELINE);
    }
  } else {
    const marks = [1, 10, 100, 1000, 10000];
    for (const v of marks) {
      const y = mapLinearY(v, box, data);
      p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, v === 1 || v === 10000 ? 18 : 7);
      p.line(box.x, y, box.x + box.w, y);

      p.noStroke();
      p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 40);
      p.textSize(10);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(v >= 1000 ? `${v / 1000}k` : String(v), box.x - 8, y);
      p.textAlign(p.LEFT, p.BASELINE);
    }
  }
}

function drawCurves(
  p: p5,
  box: PlotBox,
  data: LogarithmicState,
  axisMode: AxisMode,
  reveal: number,
): void {
  for (const curve of data.curves) {
    const allPts = buildLogCurvePoints(curve, box, data, axisMode);
    const count = Math.max(2, Math.floor(allPts.length * reveal));
    const pts = allPts.slice(0, count);
    drawGlowPolyline(p, pts, curve.weight + 6, 12);
    drawGlowPolyline(p, pts, curve.weight + 2.5, 34);
    drawGlowPolyline(p, pts, curve.weight, curve.alpha);
  }
}

function drawGlowPolyline(
  p: p5,
  points: ReadonlyArray<LogPlotPoint>,
  weight: number,
  alpha: number,
): void {
  if (points.length < 2) return;

  p.noFill();
  p.stroke(GOLD.r, GOLD.g, GOLD.b, alpha);
  p.strokeWeight(weight);
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
}
