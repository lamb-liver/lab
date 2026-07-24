import type p5 from 'p5';
import {
  type CircleLayout,
  type RadianArcLengthParams,
  SPECIAL_ANGLES,
  arcLength,
  circleLayout,
  equivalentAngle,
  formatArcLength,
  formatRad,
  pointOnCircle,
  radiusFromMode,
} from '../../curve/modules/radian-arc-length/geometry';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;

function withGlowArc(
  p: p5,
  circle: CircleLayout,
  theta: number,
  alpha = 210,
  weight = 3,
) {
  const arcR = circle.r * 0.82;
  const delta = theta;
  if (Math.abs(delta) < 0.001) return;

  const steps = Math.min(480, Math.max(10, Math.ceil(Math.abs(delta) / 0.03)));
  const dir = delta >= 0 ? 1 : -1;

  for (const layer of [
    { w: weight + 8, a: 26 },
    { w: weight + 3, a: 68 },
    { w: weight, a: alpha },
  ]) {
    p.noFill();
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], layer.a);
    p.strokeWeight(layer.w);
    p.beginShape();
    for (let i = 0; i <= steps; i += 1) {
      const a = delta * (i / steps);
      p.vertex(circle.cx + Math.cos(a) * arcR, circle.cy - Math.sin(a) * arcR);
    }
    p.endShape();
  }

  const tipX = circle.cx + Math.cos(theta) * arcR;
  const tipY = circle.cy - Math.sin(theta) * arcR;
  const tangent = theta + dir * Math.PI / 2;
  const arrowSize = 8;

  p.line(
    tipX,
    tipY,
    tipX - Math.cos(tangent - dir * 0.62) * arrowSize,
    tipY + Math.sin(tangent - dir * 0.62) * arrowSize,
  );
  p.line(
    tipX,
    tipY,
    tipX - Math.cos(tangent + dir * 0.62) * arrowSize,
    tipY + Math.sin(tangent + dir * 0.62) * arrowSize,
  );
}

function drawCircleGuide(p: p5, circle: CircleLayout) {
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16);
  p.strokeWeight(1);
  p.line(circle.cx - circle.maxR - 24, circle.cy, circle.cx + circle.maxR + 24, circle.cy);
  p.line(circle.cx, circle.cy - circle.maxR - 24, circle.cx, circle.cy + circle.maxR + 24);

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 28);
  p.circle(circle.cx, circle.cy, circle.r * 2);
}

function drawRadiusGhost(p: p5, circle: CircleLayout, params: RadianArcLengthParams) {
  if (radiusFromMode(params.radiusMode) !== 1) return;

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 10);
  p.strokeWeight(1);
  p.circle(circle.cx, circle.cy, circle.maxR * 2);

  p.noStroke();
  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 45);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text('r = 2 對照', circle.cx, circle.cy + circle.maxR + 12);
}

function drawSpecialAngles(p: p5, circle: CircleLayout, params: RadianArcLengthParams) {
  if (!params.showSpecialAngles) return;

  for (const mark of SPECIAL_ANGLES) {
    const x1 = circle.cx + Math.cos(mark.angle) * circle.r * 0.94;
    const y1 = circle.cy - Math.sin(mark.angle) * circle.r * 0.94;
    const x2 = circle.cx + Math.cos(mark.angle) * circle.r * 1.04;
    const y2 = circle.cy - Math.sin(mark.angle) * circle.r * 1.04;

    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 36);
    p.strokeWeight(1);
    p.line(x1, y1, x2, y2);

    p.noStroke();
    p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 72);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      mark.label,
      circle.cx + Math.cos(mark.angle) * circle.r * 1.18,
      circle.cy - Math.sin(mark.angle) * circle.r * 1.18,
    );
  }
}

function drawGeometry(p: p5, circle: CircleLayout, params: RadianArcLengthParams) {
  const point = pointOnCircle(params.theta, circle);
  const labelTheta = equivalentAngle(params.theta);

  drawRadiusGhost(p, circle, params);
  drawCircleGuide(p, circle);
  drawSpecialAngles(p, circle, params);
  withGlowArc(p, circle, params.theta, 215, 4);

  const mid = params.theta / 2;
  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 180);
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(
    's',
    circle.cx + Math.cos(mid) * (circle.r * 0.82 + 22),
    circle.cy - Math.sin(mid) * (circle.r * 0.82 + 22),
  );

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 230);
  p.strokeWeight(2);
  p.line(circle.cx, circle.cy, point.x, point.y);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 55);
  p.circle(point.x, point.y, 26);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 240);
  p.circle(point.x, point.y, 9);

  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 155);
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(
    'θ',
    circle.cx + Math.cos(labelTheta / 2) * circle.r * 0.34,
    circle.cy - Math.sin(labelTheta / 2) * circle.r * 0.34,
  );

  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 135);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(
    `r = ${radiusFromMode(params.radiusMode)}`,
    (circle.cx + point.x) / 2,
    (circle.cy + point.y) / 2 - 8,
  );

  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 105);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text('(r, 0)', circle.cx + circle.r + 8, circle.cy + 8);

  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 140);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('P(θ)', point.x + 10, point.y - 8);
}

function drawReadout(p: p5, params: RadianArcLengthParams) {
  const x = Math.max(24, p.width * 0.08);
  const y = Math.max(24, p.height * 0.1);
  const radius = radiusFromMode(params.radiusMode);
  const s = arcLength(params.theta, params.radiusMode);

  p.noStroke();
  p.fill(255, 255, 255, 9);
  p.rect(x, y, 178, 98, 16);

  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 180);
  p.textSize(13);
  p.textAlign(p.LEFT, p.TOP);
  p.text('s = rθ', x + 16, y + 16);

  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 145);
  p.textSize(12);
  p.text(`θ = ${formatRad(params.theta)}`, x + 16, y + 42);
  p.text(`s = ${formatArcLength(s)}`, x + 16, y + 64);

  if (radius === 1) {
    p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 88);
    p.text('單位圓：s = θ', x + 16, y + 84);
  }
}

function drawBottomNote(p: p5) {
  p.noStroke();
  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 118);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(
    '弧度把角度與弧長綁在一起；半徑加倍，同一 θ 對應的弧長也加倍。',
    28,
    p.height - 20,
    p.width - 56,
    34,
  );
}

export function renderRadianArcLengthScene(p: p5, params: RadianArcLengthParams) {
  const circle = circleLayout(p.width, p.height, params.radiusMode);

  p.background(BG[0], BG[1], BG[2]);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  drawGeometry(p, circle, params);
  drawReadout(p, params);
  drawBottomNote(p);
}
