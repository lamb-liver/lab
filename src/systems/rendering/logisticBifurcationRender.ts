import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import {
  FEIGENBAUM_MARKERS,
  LOGISTIC_LAYOUT,
  LOGISTIC_VIEW,
  buildBifurcationPoints,
  buildCobwebSteps,
  buildOrbitData,
  logistic,
  logisticModeFromValue,
  mapR,
  mapRange,
} from '../../curve/modules/logistic-bifurcation/geometry';

type LogisticBifurcationSnap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };
const CHAOS = { r: 255, g: 110, b: 110 };
const PERIOD = { r: 120, g: 200, b: 255 };

export function renderLogisticBifurcationScene(p: p5, snap: LogisticBifurcationSnap): void {
  p.background(8, 8, 10);
  const scale = Math.min(snap.width / LOGISTIC_VIEW.width, snap.height / LOGISTIC_VIEW.height);
  const offsetX = (snap.width - LOGISTIC_VIEW.width * scale) / 2;
  const offsetY = (snap.height - LOGISTIC_VIEW.height * scale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(scale);

  const mode = logisticModeFromValue(snap.params.mode);
  drawBifurcation(p, snap.params, snap.revealProgress);
  if (mode === 'orbit') {
    drawOrbitPanel(p, snap.params, LOGISTIC_LAYOUT.chart.x, LOGISTIC_LAYOUT.chart.y + 650, 350, 120);
    drawDivergencePanel(p, snap.params, LOGISTIC_LAYOUT.chart.x + 380, LOGISTIC_LAYOUT.chart.y + 650, 236, 120);
  } else if (mode === 'cobweb') {
    drawCobwebPanel(p, snap.params, LOGISTIC_LAYOUT.orbit.x, LOGISTIC_LAYOUT.orbit.y, 250);
  } else {
    drawOrbitPanel(p, snap.params, LOGISTIC_LAYOUT.orbit.x, LOGISTIC_LAYOUT.orbit.y, LOGISTIC_LAYOUT.orbit.width, LOGISTIC_LAYOUT.orbit.height);
    drawDivergencePanel(p, snap.params, LOGISTIC_LAYOUT.divergence.x, LOGISTIC_LAYOUT.divergence.y, LOGISTIC_LAYOUT.divergence.width, LOGISTIC_LAYOUT.divergence.height);
    if (snap.params.showCobweb !== 0) {
      drawCobwebPanel(p, snap.params, LOGISTIC_LAYOUT.cobweb.x, LOGISTIC_LAYOUT.cobweb.y, LOGISTIC_LAYOUT.cobweb.width);
    }
  }

  drawTitle(p, snap.params);
  p.pop();
}

function drawBifurcation(p: p5, params: ParamValues, revealProgress: number): void {
  const bounds = LOGISTIC_LAYOUT.chart;
  const points = buildBifurcationPoints(params, revealProgress);
  drawAxes(p, params);

  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 58);
  for (const point of points) p.circle(point.x, point.y, 1.05);
  p.pop();

  const r = params.r ?? 3.5;
  const rx = mapR(params, r, bounds);
  p.push();
  p.stroke(CHAOS.r, CHAOS.g, CHAOS.b, 40);
  p.strokeWeight(5);
  p.line(rx, bounds.y, rx, bounds.y + bounds.height);
  p.stroke(CHAOS.r, CHAOS.g, CHAOS.b, 200);
  p.strokeWeight(1.2);
  p.line(rx, bounds.y, rx, bounds.y + bounds.height);
  p.pop();

  if (params.showFeig !== 0) drawFeigenbaumOverlay(p, params);
}

function drawAxes(p: p5, params: ParamValues): void {
  const bounds = LOGISTIC_LAYOUT.chart;
  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 16);
  p.strokeWeight(1);
  p.line(bounds.x, bounds.y + bounds.height, bounds.x + bounds.width, bounds.y + bounds.height);
  p.line(bounds.x, bounds.y, bounds.x, bounds.y + bounds.height);
  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 58);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  const rStep = (params.rMax ?? 4) - (params.rMin ?? 2.5) <= 0.55 ? 0.1 : 0.5;
  for (let r = Math.ceil((params.rMin ?? 2.5) / rStep) * rStep; r <= (params.rMax ?? 4) + 1e-9; r += rStep) {
    const x = mapR(params, r, bounds);
    p.text(r.toFixed(2), x, bounds.y + bounds.height + 8);
  }
  p.textAlign(p.RIGHT, p.CENTER);
  for (let xValue = 0; xValue <= 1.001; xValue += 0.25) {
    const y = mapRange(xValue, params.xMin ?? 0, params.xMax ?? 1, bounds.y + bounds.height, bounds.y);
    p.text(xValue.toFixed(2), bounds.x - 8, y);
  }
  p.pop();
}

function drawFeigenbaumOverlay(p: p5, params: ParamValues): void {
  const bounds = LOGISTIC_LAYOUT.chart;
  p.push();
  p.textSize(9);
  p.textAlign(p.CENTER, p.BOTTOM);
  for (const marker of FEIGENBAUM_MARKERS) {
    if (marker.r < (params.rMin ?? 2.5) || marker.r > (params.rMax ?? 4)) continue;
    const x = mapR(params, marker.r, bounds);
    p.stroke(PERIOD.r, PERIOD.g, PERIOD.b, 52);
    p.strokeWeight(1);
    p.drawingContext.setLineDash([4, 6]);
    p.line(x, bounds.y, x, bounds.y + bounds.height);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.fill(PERIOD.r, PERIOD.g, PERIOD.b, 170);
    p.text(`2^${marker.exp}`, x, bounds.y - 4);
  }
  p.pop();
}

function drawOrbitPanel(p: p5, params: ParamValues, x: number, y: number, width: number, height: number): void {
  const orbit = buildOrbitData(params);
  panelBox(p, x, y, width, height, 'ORBIT xₙ');
  drawValuePolyline(p, orbit.orbit1, x + 8, y + 22, width - 16, height - 30, 0, 1, PRIMARY, 190);
  drawValuePolyline(p, orbit.orbit2, x + 8, y + 22, width - 16, height - 30, 0, 1, CHAOS, 100);
}

function drawDivergencePanel(p: p5, params: ParamValues, x: number, y: number, width: number, height: number): void {
  const orbit = buildOrbitData(params);
  panelBox(p, x, y, width, height, 'log|Δxₙ|');
  const min = Math.min(...orbit.divergence);
  const max = Math.max(...orbit.divergence);
  const span = Math.max(Math.abs(max - min), 1);
  drawValuePolyline(p, orbit.divergence, x + 8, y + 22, width - 16, height - 32, min - span * 0.05, max + span * 0.05, CHAOS, 170);
}

function drawCobwebPanel(p: p5, params: ParamValues, x: number, y: number, size: number): void {
  panelBox(p, x, y, size, size, `COBWEB r=${(params.r ?? 3.5).toFixed(4)}`);
  const top = y + 24;
  const h = size - 30;
  const sx = (value: number) => mapRange(value, 0, 1, x, x + size);
  const sy = (value: number) => mapRange(value, 0, 1, top + h, top);

  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 34);
  p.line(x, top + h, x + size, top);
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 150);
  p.strokeWeight(1.2);
  p.beginShape();
  for (let i = 0; i <= 220; i += 1) {
    const xv = i / 220;
    p.vertex(sx(xv), sy(logistic(params.r ?? 3.5, xv)));
  }
  p.endShape();
  p.stroke(CHAOS.r, CHAOS.g, CHAOS.b, 95);
  p.strokeWeight(1);
  for (const step of buildCobwebSteps(params, 52)) {
    p.line(sx(step.from.x), sy(step.from.y), sx(step.vertical.x), sy(step.vertical.y));
    p.line(sx(step.vertical.x), sy(step.vertical.y), sx(step.next.x), sy(step.next.y));
  }
  p.pop();
}

function panelBox(p: p5, x: number, y: number, width: number, height: number, title: string): void {
  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.rect(x, y, width, height);
  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 58);
  p.textSize(10);
  p.textAlign(p.LEFT, p.TOP);
  p.text(title, x + 7, y + 6);
  p.pop();
}

function drawValuePolyline(
  p: p5,
  values: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  min: number,
  max: number,
  color: typeof PRIMARY,
  alpha: number,
): void {
  if (values.length < 2) return;
  p.push();
  p.noFill();
  p.stroke(color.r, color.g, color.b, alpha);
  p.strokeWeight(1.25);
  p.beginShape();
  for (let i = 0; i < values.length; i += 1) {
    p.vertex(
      mapRange(i, 0, values.length - 1, x, x + width),
      mapRange(values[i]!, min, max, y + height, y),
    );
  }
  p.endShape();
  p.pop();
}

function drawTitle(p: p5, params: ParamValues): void {
  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 220);
  p.textSize(16);
  p.textAlign(p.LEFT, p.TOP);
  p.text('LOGISTIC MAP · BIFURCATION', 56, 28);
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 92);
  p.textSize(11);
  p.text(`xₙ₊₁ = r xₙ(1 − xₙ)    r=${(params.r ?? 3.5).toFixed(5)}    x₀=${(params.x0 ?? 0.2).toFixed(5)}`, 56, 50);
  p.pop();
}
