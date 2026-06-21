import type p5 from 'p5';

export type PlotRectLike = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function drawUnitPlotFrame(p: p5, plot: PlotRectLike): void {
  p.noFill();
  p.stroke(255, 255, 255, 18);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h, 8);

  for (let i = 0; i <= 10; i += 2) {
    const x = plot.x + (i / 10) * plot.w;
    const y = plot.y + plot.h - (i / 10) * plot.h;
    p.stroke(255, 255, 255, 8);
    p.line(x, plot.y, x, plot.y + plot.h);
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  p.stroke(255, 255, 255, 32);
  p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);
}

export function drawBottomLabel(p: p5, plot: PlotRectLike, label: string, offset = 24): void {
  p.noStroke();
  p.fill(255, 255, 255, 68);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, plot.x + plot.w / 2, plot.y + plot.h + offset);
}

export function withDash(p: p5, pattern: number[], drawFn: () => void): void {
  p.drawingContext.save();
  p.drawingContext.setLineDash(pattern);
  drawFn();
  p.drawingContext.restore();
}

export function clipRect(p: p5, rect: PlotRectLike, drawFn: () => void): void {
  p.drawingContext.save();
  p.drawingContext.beginPath();
  p.drawingContext.rect(rect.x, rect.y, rect.w, rect.h);
  p.drawingContext.clip();
  drawFn();
  p.drawingContext.restore();
}
