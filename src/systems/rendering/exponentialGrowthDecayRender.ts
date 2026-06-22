import type p5 from 'p5';
import {
  EXP_PLOT,
  EXP_VIEW,
  type ExponentialPlotPoint,
  type ExponentialState,
  buildExponentialCurvePoints,
  deriveExponentialState,
  mapExponentialT,
  mapExponentialY,
} from '../../curve/modules/exponential-growth-decay/geometry';
import type { ParamValues } from '../../curve/types';

type ExponentialGrowthDecaySnap = {
  width: number;
  height: number;
  params: ParamValues;
  reveal: number;
};

const GOLD = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

function withPlotClip(p: p5, plot: typeof EXP_PLOT, draw: () => void): void {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(plot.x, plot.y, plot.w, plot.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

export function renderExponentialGrowthDecayScene(
  p: p5,
  snap: ExponentialGrowthDecaySnap,
): void {
  const data = deriveExponentialState(snap.params);
  p.background(10, 10, 10);

  const scale = Math.min(snap.width / EXP_VIEW.width, snap.height / EXP_VIEW.height);
  const ox = (snap.width - EXP_VIEW.width * scale) / 2;
  const oy = (snap.height - EXP_VIEW.height * scale) / 2;

  p.push();
  p.translate(ox, oy);
  p.scale(scale);

  drawPlotFrame(p, data);
  drawTimeMarkers(p, data);
  withPlotClip(p, EXP_PLOT, () => {
    drawCurve(p, data, snap.reveal);

    if (data.tangentMode) {
      drawTangent(p, data);
      drawPoint(p, data);
    }
  });

  drawPlotCaption(p, data);
  p.pop();
}

function drawPlotFrame(p: p5, data: ExponentialState): void {
  const plot = EXP_PLOT;

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  for (let i = 1; i < 6; i += 1) {
    const x = plot.x + (plot.w * i) / 6;
    const y = plot.y + (plot.h * i) / 6;
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 8);
    p.line(x, plot.y, x, plot.y + plot.h);
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 26);
  p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);

  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 55);
  p.textSize(11);
  p.text('t', plot.x + plot.w + 10, plot.y + plot.h + 4);
  p.text(data.logScale ? 'ln y' : 'y', plot.x - 8, plot.y - 12);
}

function drawPlotCaption(p: p5, data: ExponentialState): void {
  const plot = EXP_PLOT;
  const label = data.logScale
    ? '對數尺度：ln y = ln C + kt'
    : data.mode === 'growth'
      ? '指數成長'
      : '指數衰減';

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 155);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, plot.x + plot.w * 0.5, plot.y + plot.h + 34);
  p.textAlign(p.LEFT, p.BASELINE);
  p.textStyle(p.NORMAL);
}

function drawTimeMarkers(p: p5, data: ExponentialState): void {
  const plot = EXP_PLOT;
  const period = data.timeScale;

  for (let t = period; t < data.tMax; t += period) {
    const x = mapExponentialT(t, data);
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 13);
    p.strokeWeight(1);
    p.line(x, plot.y, x, plot.y + plot.h);

    p.noStroke();
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 42);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(data.mode === 'growth' ? '2×' : '1/2', x, plot.y + plot.h + 8);
    p.textAlign(p.LEFT, p.BASELINE);
  }
}

function drawCurve(p: p5, data: ExponentialState, reveal: number): void {
  const allPts = buildExponentialCurvePoints(data);
  const count = Math.max(2, Math.floor(allPts.length * reveal));
  const pts = allPts.slice(0, count);
  drawGlowPolyline(p, pts, 8, 16);
  drawGlowPolyline(p, pts, 4, 42);
  drawGlowPolyline(p, pts, 1.6, 235);
}

function drawTangent(p: p5, data: ExponentialState): void {
  const t0 = data.t0;
  const y0 = data.y0;
  const span = data.tMax * 0.15;
  const tA = Math.max(0, Math.min(data.tMax, t0 - span));
  const tB = Math.max(0, Math.min(data.tMax, t0 + span));

  let yA: number;
  let yB: number;

  if (data.logScale) {
    const lnY0 = Math.log(y0);
    yA = Math.exp(lnY0 + data.k * (tA - t0));
    yB = Math.exp(lnY0 + data.k * (tB - t0));
  } else {
    const slope = data.k * y0;
    yA = Math.max(0.0001, y0 + slope * (tA - t0));
    yB = Math.max(0.0001, y0 + slope * (tB - t0));
  }

  const x1 = mapExponentialT(tA, data);
  const y1 = mapExponentialY(yA, data);
  const x2 = mapExponentialT(tB, data);
  const y2 = mapExponentialY(yB, data);

  p.stroke(GOLD.r, GOLD.g, GOLD.b, 52);
  p.strokeWeight(7);
  p.line(x1, y1, x2, y2);
  p.stroke(GOLD.r, GOLD.g, GOLD.b, 215);
  p.strokeWeight(1.6);
  p.line(x1, y1, x2, y2);
}

function drawPoint(p: p5, data: ExponentialState): void {
  const x = mapExponentialT(data.t0, data);
  const y = mapExponentialY(data.y0, data);

  p.stroke(GOLD.r, GOLD.g, GOLD.b, 35);
  p.strokeWeight(12);
  p.point(x, y);
  p.stroke(GOLD.r, GOLD.g, GOLD.b, 240);
  p.strokeWeight(4);
  p.point(x, y);

  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 70);
  p.textSize(11);
  p.text('P', x + 10, y - 10);
}

function drawGlowPolyline(
  p: p5,
  points: ReadonlyArray<ExponentialPlotPoint>,
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
