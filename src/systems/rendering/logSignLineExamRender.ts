import type p5 from 'p5';
import { readLogSign } from '../../exam/gaokao-2024-ii-log-sign-line/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

const A0 = -1.55;
const A1 = 1.05;
const B0 = -0.95;
const B1 = 1.55;
const X0 = -1.15;
const X1 = 2.05;
const Y0 = -0.7;
const Y1 = 1.05;

type Scene = {
  width: number;
  height: number;
  offset: number;
};

type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

function panels(width: number, height: number): { plane: Rect; graph: Rect } {
  const pad = 22;
  const gap = 16;
  if (width < 640) {
    const h = (height - pad * 2 - gap) / 2;
    return {
      plane: { x: pad, y: pad, w: width - pad * 2, h },
      graph: { x: pad, y: pad + h + gap, w: width - pad * 2, h },
    };
  }
  const w = (width - pad * 2 - gap) / 2;
  const h = height - pad * 2;
  return {
    plane: { x: pad, y: pad, w, h },
    graph: { x: pad + w + gap, y: pad, w, h },
  };
}

function fit(rect: Rect, x0: number, x1: number, y0: number, y1: number) {
  const scale = Math.min(rect.w / (x1 - x0), rect.h / (y1 - y0));
  const ox = rect.x + (rect.w - (x1 - x0) * scale) / 2;
  const oy = rect.y + (rect.h - (y1 - y0) * scale) / 2;
  return {
    scale,
    point(x: number, y: number): Point {
      return { x: ox + (x - x0) * scale, y: oy + (y1 - y) * scale };
    },
  };
}

function drawLabel(
  p: p5,
  text: string,
  point: Point,
  color: readonly [number, number, number],
  bounds: Rect,
) {
  p.noStroke();
  p.fill(...color, 230);
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  const half = Math.max(14, p.textWidth(text) / 2 + 4);
  const x = Math.min(bounds.x + bounds.w - half, Math.max(bounds.x + half, point.x));
  const y = Math.min(bounds.y + bounds.h - 12, Math.max(bounds.y + 12, point.y));
  p.text(text, x, y);
}

function strokeCurve(
  p: p5,
  map: (x: number, y: number) => Point,
  samples: Array<{ x: number; y: number } | null>,
  color: readonly [number, number, number],
) {
  p.noFill();
  p.stroke(...color, 230);
  p.strokeWeight(2);
  let pen = false;
  for (const sample of samples) {
    if (!sample) {
      if (pen) p.endShape();
      pen = false;
      continue;
    }
    if (!pen) {
      p.beginShape();
      pen = true;
    }
    const point = map(sample.x, sample.y);
    p.vertex(point.x, point.y);
  }
  if (pen) p.endShape();
}

export function renderLogSignExam(p: p5, scene: Scene): void {
  const reading = readLogSign(scene.offset);
  const { plane, graph } = panels(scene.width, scene.height);
  const ab = fit(plane, A0, A1, B0, B1);
  const xy = fit(graph, X0, X1, Y0, Y1);

  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  const origin = ab.point(0, 0);
  const foot = ab.point(-0.5, 0.5);
  const point = ab.point(reading.a, reading.b);
  const lineStart = ab.point(A0, A0 + 1);
  const lineEnd = ab.point(B1 - 1, B1);

  p.stroke(...WHITE, 36);
  p.strokeWeight(1);
  const axisH = ab.point(A1, 0);
  const axisV = ab.point(0, B1);
  p.line(ab.point(A0, 0).x, origin.y, axisH.x, origin.y);
  p.line(origin.x, ab.point(0, B0).y, origin.x, axisV.y);

  p.stroke(...WHITE, 40);
  p.strokeWeight(1);
  const perpStart = ab.point(A0, -A0);
  const perpEnd = ab.point(-B0, B0);
  p.line(perpStart.x, perpStart.y, perpEnd.x, perpEnd.y);

  p.noFill();
  p.stroke(...GOLD, reading.squared < 0.5 - 1e-6 ? 210 : 120);
  p.strokeWeight(1.6);
  p.circle(origin.x, origin.y, Math.SQRT1_2 * 2 * ab.scale);

  p.stroke(...GOLD, 220);
  p.strokeWeight(2);
  p.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);

  p.stroke(...WHITE, 150);
  p.strokeWeight(1.2);
  p.line(origin.x, origin.y, point.x, point.y);

  p.noStroke();
  p.fill(...WHITE, 180);
  p.circle(origin.x, origin.y, 4);
  p.fill(...GOLD, 230);
  p.circle(foot.x, foot.y, 7);
  if (reading.atMinimum) {
    p.noFill();
    p.stroke(...GOLD, 230);
    p.strokeWeight(2);
    p.circle(point.x, point.y, 16);
  }
  p.noStroke();
  p.fill(...WHITE, 235);
  p.circle(point.x, point.y, 8);

  drawLabel(p, 'a', { x: axisH.x - 4, y: origin.y - 14 }, WHITE, plane);
  drawLabel(p, 'b', { x: origin.x + 14, y: axisV.y + 8 }, WHITE, plane);

  const xAxis = xy.point(0, 0);
  p.stroke(...WHITE, 36);
  p.strokeWeight(1);
  p.line(xy.point(X0, 0).x, xAxis.y, xy.point(X1, 0).x, xAxis.y);
  p.line(xAxis.x, xy.point(0, Y0).y, xAxis.x, xy.point(0, Y1).y);

  const samples: Array<{ x: number; y: number } | null> = [];
  const steps = 180;
  for (let i = 0; i <= steps; i += 1) {
    const x = X0 + ((X1 - X0) * i) / steps;
    if (x <= reading.domainLeft + 0.04) {
      samples.push(null);
      continue;
    }
    const y = (x + reading.a) * Math.log(x + reading.b);
    if (!Number.isFinite(y) || y < Y0 || y > Y1) {
      samples.push(null);
      continue;
    }
    samples.push({ x, y });
  }

  p.noStroke();
  for (let i = 0; i < samples.length - 1; i += 1) {
    const left = samples[i];
    const right = samples[i + 1];
    if (!left || !right || left.y >= 0 || right.y >= 0) continue;
    const a = xy.point(left.x, left.y);
    const b = xy.point(right.x, right.y);
    const a0 = xy.point(left.x, 0);
    const b0 = xy.point(right.x, 0);
    p.fill(...GOLD, 90);
    p.quad(a.x, a.y, b.x, b.y, b0.x, b0.y, a0.x, a0.y);
  }

  const positive = samples.map((sample) => (sample && sample.y >= 0 ? sample : null));
  const negative = samples.map((sample) => (sample && sample.y < 0 ? sample : null));
  strokeCurve(p, xy.point, positive, WHITE);
  strokeCurve(p, xy.point, negative, GOLD);

  const gap = Math.abs(reading.zeroGap);
  const zLo = Math.min(reading.linearZero, reading.logZero);
  const zHi = Math.max(reading.linearZero, reading.logZero);
  const loTick = xy.point(zLo, 0);
  const hiTick = xy.point(zHi, 0);
  const loIsLinear = reading.linearZero <= reading.logZero;
  // 兩點近到刻度會疊在一起時合併成一點。等號只在真正重合時出現。
  if (reading.onLine || gap < 0.08) {
    const mid = xy.point((reading.linearZero + reading.logZero) / 2, 0);
    p.noStroke();
    p.fill(...GOLD, 235);
    p.circle(mid.x, mid.y, 8);
    if (reading.onLine) {
      drawLabel(p, '−a = 1−b', { x: mid.x, y: mid.y + 24 }, GOLD, graph);
    }
  } else {
    const apart = Math.abs(hiTick.x - loTick.x);
    const shift = apart < 78 ? 0 : 30;
    const lift = apart < 78 ? 18 : 0;
    const loColor: readonly [number, number, number] = loIsLinear ? WHITE : GOLD;
    const hiColor: readonly [number, number, number] = loIsLinear ? GOLD : WHITE;
    p.strokeWeight(1.5);
    p.stroke(...loColor, loIsLinear ? 220 : 230);
    p.line(loTick.x, loTick.y - 9, loTick.x, loTick.y + 9);
    p.stroke(...hiColor, loIsLinear ? 230 : 220);
    p.line(hiTick.x, hiTick.y - 9, hiTick.x, hiTick.y + 9);
    drawLabel(p, loIsLinear ? '−a' : '1−b', { x: loTick.x - shift, y: loTick.y - 22 - lift }, loColor, graph);
    drawLabel(p, loIsLinear ? '1−b' : '−a', { x: hiTick.x + shift, y: hiTick.y - 22 }, hiColor, graph);
  }

  drawLabel(p, 'x', { x: xy.point(X1, 0).x - 8, y: xAxis.y - 14 }, WHITE, graph);
}
