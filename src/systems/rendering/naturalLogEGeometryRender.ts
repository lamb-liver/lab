import { canvas2d } from './canvas2d';
import type p5 from 'p5';
import {
  INVERSE_VIEW,
  NAT_LOG_PLOT,
  NAT_LOG_VIEW,
  type NaturalLogPlotPoint,
  type NaturalLogState,
  buildReciprocalCurvePoints,
  deriveNaturalLogState,
  mapAreaX,
  mapAreaY,
  mapInvX,
  mapInvY,
} from '../../curve/modules/natural-log-e-geometry/geometry';
import type { ParamValues } from '../../curve/types';

type NaturalLogEGeometrySnap = {
  width: number;
  height: number;
  params: ParamValues;
  reveal: number;
};

const GOLD = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

export function renderNaturalLogEGeometryScene(
  p: p5,
  snap: NaturalLogEGeometrySnap,
): void {
  const data = deriveNaturalLogState(snap.params);
  p.background(10, 10, 10);

  const scale = Math.min(snap.width / NAT_LOG_VIEW.width, snap.height / NAT_LOG_VIEW.height);
  const ox = (snap.width - NAT_LOG_VIEW.width * scale) / 2;
  const oy = (snap.height - NAT_LOG_VIEW.height * scale) / 2;

  p.push();
  p.translate(ox, oy);
  p.scale(scale);

  if (data.mode === 'area') {
    drawAreaPlot(p, data, snap.reveal);
  } else {
    drawInversePlot(p, data, snap.reveal);
  }

  p.pop();
}

function withPlotClip(p: p5, drawFn: () => void): void {
  const plot = NAT_LOG_PLOT;
  canvas2d(p).save();
  canvas2d(p).beginPath();
  canvas2d(p).rect(plot.x, plot.y, plot.w, plot.h);
  canvas2d(p).clip();
  drawFn();
  canvas2d(p).restore();
}

function drawAreaPlot(p: p5, data: NaturalLogState, reveal: number): void {
  drawAreaFrame(p);
  drawAreaGrid(p);

  withPlotClip(p, () => {
    drawFilledArea(p, data, reveal);
    if (data.riemannMode) {
      drawRiemannRects(p, data, reveal);
    }
    drawReciprocalCurve(p, reveal);
  });

  drawVerticalMarkers(p, data);
  drawAreaCaption(p, data);
}

function drawAreaFrame(p: p5): void {
  const plot = NAT_LOG_PLOT;
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 26);
  p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);

  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 55);
  p.textSize(11);
  p.text('x', plot.x + plot.w + 10, plot.y + plot.h + 4);
  p.text('1/x', plot.x - 14, plot.y - 12);
}

function drawAreaGrid(p: p5): void {
  const plot = NAT_LOG_PLOT;

  for (let x = 1; x <= 5; x += 1) {
    const px = mapAreaX(x);
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, x === 1 ? 20 : 9);
    p.line(px, plot.y, px, plot.y + plot.h);

    p.noStroke();
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 42);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(String(x), px, plot.y + plot.h + 8);
    p.textAlign(p.LEFT, p.BASELINE);
  }

  for (let y = 0.25; y <= 2; y += 0.25) {
    const py = mapAreaY(y);
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, y === 1 ? 18 : 7);
    p.line(plot.x, py, plot.x + plot.w, py);
  }
}

function drawFilledArea(p: p5, data: NaturalLogState, reveal: number): void {
  const a = Math.min(1, data.t);
  const b = Math.max(1, data.t);
  const bReveal = lerp(a, b, reveal);

  p.noFill();
  p.fill(GOLD.r, GOLD.g, GOLD.b, data.t >= 1 ? 38 : 24);
  p.beginShape();
  p.vertex(mapAreaX(a), mapAreaY(0));
  for (let i = 0; i <= 180; i += 1) {
    const x = lerp(a, bReveal, i / 180);
    p.vertex(mapAreaX(x), mapAreaY(1 / x));
  }
  p.vertex(mapAreaX(bReveal), mapAreaY(0));
  p.endShape(p.CLOSE);
}

function drawRiemannRects(p: p5, data: NaturalLogState, reveal: number): void {
  const a = Math.min(1, data.t);
  const b = Math.max(1, data.t);
  const n = data.n;
  const dx = (b - a) / n;
  const visible = Math.max(1, Math.floor(n * reveal));

  for (let i = 0; i < visible; i += 1) {
    const x0 = a + i * dx;
    const sampleX = x0 + dx * 0.5;
    const h = 1 / sampleX;
    const px = mapAreaX(x0);
    const py = mapAreaY(h);
    const pw = mapAreaX(x0 + dx) - mapAreaX(x0);
    const ph = mapAreaY(0) - py;

    p.noFill();
    p.stroke(GOLD.r, GOLD.g, GOLD.b, 42);
    p.strokeWeight(1);
    p.rect(px, py, pw, ph);
  }
}

function drawReciprocalCurve(p: p5, reveal: number): void {
  const allPts = buildReciprocalCurvePoints();
  const count = Math.max(2, Math.floor(allPts.length * reveal));
  const pts = allPts.slice(0, count);
  drawGlowPolyline(p, pts, 8, 14);
  drawGlowPolyline(p, pts, 4, 38);
  drawGlowPolyline(p, pts, 1.6, 235);
}

function drawVerticalMarkers(p: p5, data: NaturalLogState): void {
  const plot = NAT_LOG_PLOT;
  const x1 = mapAreaX(1);
  const xt = mapAreaX(data.t);
  const xe = mapAreaX(Math.E);

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 20);
  p.line(x1, plot.y, x1, plot.y + plot.h);

  p.stroke(GOLD.r, GOLD.g, GOLD.b, 75);
  p.line(xe, plot.y, xe, plot.y + plot.h);

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 145);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  p.text('e', xe, plot.y + plot.h + 8);

  p.stroke(GOLD.r, GOLD.g, GOLD.b, 150);
  p.strokeWeight(1.5);
  p.line(xt, plot.y, xt, plot.y + plot.h);

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 215);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('t', xt, plot.y - 8);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawAreaCaption(p: p5, data: NaturalLogState): void {
  const plot = NAT_LOG_PLOT;
  const label =
    data.t >= 1 ? '面積：ln t = ∫₁ᵗ 1/x dx' : '反向面積：ln t < 0';

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 155);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, plot.x + plot.w * 0.5, plot.y + plot.h + 34);
  p.textAlign(p.LEFT, p.BASELINE);
  p.textStyle(p.NORMAL);
}

function drawInversePlot(p: p5, data: NaturalLogState, reveal: number): void {
  drawInverseFrame(p);
  drawInverseGrid(p);

  withPlotClip(p, () => {
    drawInverseGuide(p);
    drawExpCurve(p, reveal);
    drawLogCurve(p, reveal);
    drawInversePoint(p, data);
  });

  drawInverseCaption(p);
}

function drawInverseFrame(p: p5): void {
  const plot = NAT_LOG_PLOT;
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 26);
  p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);

  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 55);
  p.textSize(11);
  p.text('x', plot.x + plot.w + 10, plot.y + plot.h + 4);
  p.text('y', plot.x - 10, plot.y - 12);
}

function drawInverseGrid(p: p5): void {
  const plot = NAT_LOG_PLOT;
  const vMin = INVERSE_VIEW.min;
  const vMax = INVERSE_VIEW.max;

  for (let v = vMin; v <= vMax; v += 1) {
    const x = mapInvX(v);
    const y = mapInvY(v);
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, v === 0 ? 20 : 8);
    p.line(x, plot.y, x, plot.y + plot.h);
    p.line(plot.x, y, plot.x + plot.w, y);
  }
}

function drawInverseGuide(p: p5): void {
  const vMin = INVERSE_VIEW.min;
  const vMax = INVERSE_VIEW.max;
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.line(mapInvX(vMin), mapInvY(vMin), mapInvX(vMax), mapInvY(vMax));
}

function drawExpCurve(p: p5, reveal: number): void {
  const pts: NaturalLogPlotPoint[] = [];
  const xMin = INVERSE_VIEW.min;
  const xMax = Math.log(INVERSE_VIEW.max);

  for (let i = 0; i <= 320; i += 1) {
    const x = lerp(xMin, xMax, i / 320);
    const y = Math.exp(x);
    pts.push({ x: mapInvX(x), y: mapInvY(y) });
  }

  const count = Math.max(2, Math.floor(pts.length * reveal));
  const slice = pts.slice(0, count);
  drawGlowPolyline(p, slice, 7, 11);
  drawGlowPolyline(p, slice, 3.5, 32);
  drawGlowPolyline(p, slice, 1.3, 150);
}

function drawLogCurve(p: p5, reveal: number): void {
  const pts: NaturalLogPlotPoint[] = [];
  const xMax = INVERSE_VIEW.max;

  for (let i = 0; i <= 340; i += 1) {
    const x = lerp(0.15, xMax, i / 340);
    const y = Math.log(x);
    pts.push({ x: mapInvX(x), y: mapInvY(y) });
  }

  const count = Math.max(2, Math.floor(pts.length * reveal));
  const slice = pts.slice(0, count);
  drawGlowPolyline(p, slice, 8, 16);
  drawGlowPolyline(p, slice, 4, 42);
  drawGlowPolyline(p, slice, 1.6, 235);
}

function drawInversePoint(p: p5, data: NaturalLogState): void {
  const x = data.t;
  const y = Math.log(data.t);
  const px = mapInvX(x);
  const py = mapInvY(y);

  p.stroke(GOLD.r, GOLD.g, GOLD.b, 38);
  p.strokeWeight(12);
  p.point(px, py);
  p.stroke(GOLD.r, GOLD.g, GOLD.b, 230);
  p.strokeWeight(4);
  p.point(px, py);

  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 65);
  p.textSize(10);
  p.text(`(${x.toFixed(2)}, ${y.toFixed(2)})`, px + 10, py - 10);
}

function drawInverseCaption(p: p5): void {
  const plot = NAT_LOG_PLOT;
  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 155);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.TOP);
  p.text('反函數：y = ln x 與 y = eˣ 對稱於 y = x', plot.x + plot.w * 0.5, plot.y + plot.h + 34);
  p.textAlign(p.LEFT, p.BASELINE);
  p.textStyle(p.NORMAL);
}

function drawGlowPolyline(
  p: p5,
  points: ReadonlyArray<NaturalLogPlotPoint>,
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
