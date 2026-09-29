import type p5 from 'p5';
import {
  VIEW,
  invertCircle,
  invertLine,
  lineChord,
  mathToPx,
  rimPoint,
  type CircleInversionParams,
  type InversionImage,
  type Vec,
} from '../../curve/modules/circle-inversion/geometry';

const BG: [number, number, number] = [10, 10, 10];
const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];

function drawCircleMath(p: p5, center: Vec, radius: number, size: number) {
  const c = mathToPx(center, size);
  const r = radius * (size / (VIEW * 2));
  p.circle(c.x, c.y, r * 2);
}

function drawLineImage(p: p5, image: InversionImage, size: number) {
  if (image.kind === 'circle') {
    drawCircleMath(p, image.center, image.radius, size);
    return;
  }
  const chord = lineChord(image);
  if (!chord) return;
  const a = mathToPx(chord[0], size);
  const b = mathToPx(chord[1], size);
  p.line(a.x, a.y, b.x, b.y);
}

function drawHandle(p: p5, at: Vec, size: number) {
  const s = mathToPx(at, size);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2]);
  p.stroke(10, 10, 10);
  p.strokeWeight(1);
  p.circle(s.x, s.y, 11);
}

export function renderCircleInversion(p: p5, params: CircleInversionParams) {
  const size = p.width;
  p.background(BG[0], BG[1], BG[2]);
  p.noFill();

  const line = invertLine({ x: params.ax, y: params.ay }, { x: params.bx, y: params.by }, params.radius);
  const circle = invertCircle({ x: params.cx, y: params.cy }, params.rho, params.radius);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 90);
  p.strokeWeight(1.25);
  drawCircleMath(p, { x: 0, y: 0 }, params.radius, size);

  // 像若與原線重合，先畫較粗的白線，金線蓋上去才留得見白邊
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 210);
  p.strokeWeight(line?.kind === 'line' ? 4 : 1.6);
  if (line) drawLineImage(p, line, size);
  p.strokeWeight(circle?.kind === 'line' ? 4 : 1.6);
  if (circle) drawLineImage(p, circle, size);

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 230);
  p.strokeWeight(1.75);
  const dx = params.bx - params.ax;
  const dy = params.by - params.ay;
  if (Math.hypot(dx, dy) > 1e-8) {
    const chord = lineChord({
      kind: 'line',
      point: { x: params.ax, y: params.ay },
      direction: unit(dx, dy),
    });
    if (chord) {
      const a = mathToPx(chord[0], size);
      const b = mathToPx(chord[1], size);
      p.line(a.x, a.y, b.x, b.y);
    }
  }
  drawCircleMath(p, { x: params.cx, y: params.cy }, params.rho, size);

  drawHandle(p, { x: params.ax, y: params.ay }, size);
  drawHandle(p, { x: params.bx, y: params.by }, size);
  drawHandle(p, { x: params.cx, y: params.cy }, size);
  drawHandle(p, rimPoint(params), size);
}

function unit(x: number, y: number): Vec {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}
