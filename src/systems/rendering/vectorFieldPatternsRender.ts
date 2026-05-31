import type p5 from 'p5';
import {
  ARROW_DOMAIN,
  createVectorFieldLayout,
  getFieldConfig,
  magnitude,
  normalize,
  scaleVec,
  worldToScreen,
  type Vec2,
  type VectorFieldPatternParams,
} from '../../curve/modules/vector-field-patterns/geometry';

export type VectorFieldPatternsSnap = {
  width: number;
  height: number;
  params: VectorFieldPatternParams;
  streamlines: Vec2[][];
};

const BG: [number, number, number] = [10, 10, 10];
const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];

function setDash(p: p5, pattern: number[]): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.setLineDash(pattern);
}

function withPlotClip(p: p5, plotMin: number, plotMax: number, draw: () => void): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  p.push();
  ctx.save();
  ctx.beginPath();
  ctx.rect(plotMin, plotMin, plotMax - plotMin, plotMax - plotMin);
  ctx.clip();
  draw();
  ctx.restore();
  p.pop();
}

function drawLine(
  p: p5,
  a: Vec2,
  b: Vec2,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
  dashed = false,
): void {
  p.push();
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  p.strokeCap(p.ROUND);
  setDash(p, dashed ? [5, 8] : []);
  p.line(a.x, a.y, b.x, b.y);
  setDash(p, []);
  p.pop();
}

function drawArrow(
  p: p5,
  from: Vec2,
  to: Vec2,
  alpha: number,
  weight = 1.15,
): void {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 0.001) return;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  p.push();
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(212,184,122,0.25)';
  p.stroke(...ACCENT, alpha);
  p.strokeWeight(weight);
  p.line(from.x, from.y, to.x, to.y);
  ctx.restore();

  p.translate(to.x, to.y);
  p.rotate(angle);
  p.noStroke();
  p.fill(...ACCENT, alpha);
  p.triangle(0, 0, -7, -3.5, -7, 3.5);
  p.pop();
}

function drawGrid(p: p5, width: number, height: number, origin: Vec2, scale: number, extent: number): void {
  const min = Math.floor(-extent);
  const max = Math.ceil(extent);

  p.push();
  p.noFill();
  p.strokeWeight(1);
  for (let i = min; i <= max; i++) {
    const alpha = i === 0 ? 30 : 8;
    p.stroke(...GUIDE, alpha);
    const x = origin.x + i * scale;
    const y = origin.y - i * scale;
    p.line(x, 0, x, height);
    p.line(0, y, width, y);
  }
  p.pop();
}

function drawPlotLabels(p: p5, origin: Vec2, plotMin: number, plotMax: number): void {
  p.push();
  p.noStroke();
  p.fill(232, 232, 232, 58);
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('x', plotMax - 12, Math.max(plotMin + 14, Math.min(plotMax - 14, origin.y - 10)));
  p.text('y', Math.max(plotMin + 12, Math.min(plotMax - 12, origin.x + 10)), plotMin + 14);
  p.pop();
}

function clampLabel(point: Vec2, width: number, height: number, labelWidth = 0): Vec2 {
  return {
    x: Math.max(24, Math.min(width - 24 - labelWidth, point.x)),
    y: Math.max(22, Math.min(height - 18, point.y)),
  };
}

function drawLabel(
  p: p5,
  label: string,
  point: Vec2,
  width: number,
  height: number,
  alpha = 100,
): void {
  p.push();
  p.textSize(11);
  const clamped = clampLabel(point, width, height, p.textWidth(label));
  p.noStroke();
  p.fill(232, 232, 232, alpha);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, clamped.x, clamped.y);
  p.pop();
}

export function renderVectorFieldPatternsScene(
  p: p5,
  snap: VectorFieldPatternsSnap,
): void {
  p.background(...BG);

  const layout = createVectorFieldLayout(snap.width, snap.height);
  const field = getFieldConfig(snap.params.pattern);
  const density = Math.round(snap.params.density);
  const origin = worldToScreen(layout, { x: 0, y: 0 });

  withPlotClip(p, layout.plotMin, layout.plotMax, () => {
    drawGrid(p, snap.width, snap.height, origin, layout.scale, layout.extent);

    if (snap.params.showStreamlines) {
      for (const path of snap.streamlines) {
        p.push();
        p.noFill();
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(212,184,122,0.28)';
        p.stroke(...ACCENT, 68);
        p.strokeWeight(1.15);
        p.beginShape();
        for (const point of path) {
          const screen = worldToScreen(layout, point);
          p.vertex(screen.x, screen.y);
        }
        p.endShape();
        ctx.restore();
        p.pop();
      }
    }

    const arrowDensity = Math.max(2, density);
    for (let i = 0; i < arrowDensity; i++) {
      for (let j = 0; j < arrowDensity; j++) {
        const x = -ARROW_DOMAIN + (ARROW_DOMAIN * 2 * i) / (arrowDensity - 1);
        const y = -ARROW_DOMAIN + (ARROW_DOMAIN * 2 * j) / (arrowDensity - 1);
        const vec = field.field(x, y);
        const mag = magnitude(vec);
        if (mag < 1e-6) continue;

        const length = snap.params.normalized
          ? 0.42
          : Math.max(0.08, Math.min(0.72, mag * 0.14));
        const dir = scaleVec(normalize(vec), length);
        const from = { x: x - dir.x * 0.5, y: y - dir.y * 0.5 };
        const to = { x: x + dir.x * 0.5, y: y + dir.y * 0.5 };
        const alpha = snap.params.normalized
          ? 82
          : 42 + (Math.min(mag, 6) / 6) * 88;
        drawArrow(p, worldToScreen(layout, from), worldToScreen(layout, to), alpha);
      }
    }

    if (field.singularity) {
      p.noStroke();
      p.fill(...ACCENT, 36);
      p.circle(origin.x, origin.y, 34);
      p.fill(...ACCENT, 230);
      p.circle(origin.x, origin.y, 7);
    } else {
      p.noStroke();
      p.fill(...GUIDE, 48);
      p.circle(origin.x, origin.y, 4);
    }
  });

  drawPlotLabels(p, origin, layout.plotMin, layout.plotMax);

  if (field.singularity) {
    drawLabel(p, '奇點', { x: origin.x + 12, y: origin.y - 10 }, snap.width, snap.height, 96);
    drawLabel(p, field.eigen, { x: origin.x + 12, y: origin.y + 8 }, snap.width, snap.height, 76);
  } else {
    drawLabel(p, '無奇點', { x: origin.x + 12, y: origin.y - 8 }, snap.width, snap.height, 76);
  }
}
