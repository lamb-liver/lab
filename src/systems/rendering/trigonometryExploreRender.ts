import type p5 from 'p5';
import { TAU } from '../../explore/trigonometry/constants';
import {
  circleGeometry,
  clampSignedAngle,
  getVisualCaption,
  normalizeAngle,
  plotRect,
  polarPoint,
  triangleMetrics,
  triangleTransform,
  worldToScreen,
  circumcircleWorld,
} from '../../explore/trigonometry/geometry';
import type { PlotRect, TrigExploreSnap, Vec2 } from '../../explore/trigonometry/types';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const MUTED = [136, 136, 136] as const;

function mid(a: number, b: number) {
  return (a + b) / 2;
}

function withDash(p: p5, pattern: number[], fn: () => void) {
  p.push();
  try {
    p.drawingContext.setLineDash(pattern);
    fn();
  } finally {
    p.drawingContext.setLineDash([]);
    p.pop();
  }
}

function glowLine(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  intensity = 1,
) {
  const layers = [
    { w: 7, a: 16 * intensity },
    { w: 3.5, a: 42 * intensity },
    { w: 1.5, a: 230 * intensity },
  ];

  for (const layer of layers) {
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], layer.a);
    p.strokeWeight(layer.w);
    p.line(x1, y1, x2, y2);
  }
}

function drawPointGlow(p: p5, x: number, y: number, r = 6, intensity = 1) {
  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 34 * intensity);
  p.circle(x, y, r * 4.2);

  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 210 * intensity);
  p.circle(x, y, r * 1.55);

  p.fill(255, 255, 255, 180 * intensity);
  p.circle(x, y, Math.max(2, r * 0.45));
}

function drawTinyLabel(p: p5, label: string, x: number, y: number) {
  p.noStroke();
  p.fill(232, 232, 232, 180);
  p.textSize(11);
  p.text(label, x, y);
}

function drawSoftAxes(p: p5, cx: number, cy: number, r: number) {
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16);
  p.strokeWeight(1);
  p.line(cx - r, cy, cx + r, cy);
  p.line(cx, cy - r, cx, cy + r);
}

function drawGhostCircle(p: p5, cx: number, cy: number, r: number) {
  p.noFill();
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 22);
  p.strokeWeight(1.1);
  p.circle(cx, cy, r * 2);
}

function drawMathArc(
  p: p5,
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
  rgba: readonly [number, number, number, number],
  sw: number,
) {
  const delta = a1 - a0;
  const steps = Math.max(8, Math.ceil(Math.abs(delta) / 0.035));

  p.noFill();
  p.stroke(rgba[0], rgba[1], rgba[2], rgba[3]);
  p.strokeWeight(sw);
  p.beginShape();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a0 + delta * t;
    p.vertex(cx + Math.cos(a) * r, cy - Math.sin(a) * r);
  }
  p.endShape();
}

function drawScreenArc(
  p: p5,
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
  rgba: readonly [number, number, number, number],
  sw: number,
) {
  const delta = a1 - a0;
  const steps = Math.max(8, Math.ceil(Math.abs(delta) / 0.035));

  p.noFill();
  p.stroke(rgba[0], rgba[1], rgba[2], rgba[3]);
  p.strokeWeight(sw);
  p.beginShape();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a0 + delta * t;
    p.vertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  p.endShape();
}

function shortestAngleDeltaScreen(a1: number, a2: number) {
  let delta = a2 - a1;
  while (delta > Math.PI) delta -= TAU;
  while (delta < -Math.PI) delta += TAU;
  return delta;
}

function drawUnitCircleScene(p: p5, plot: PlotRect, snap: TrigExploreSnap) {
  const geo = circleGeometry(plot, snap.smooth.advancedMix);
  const theta = normalizeAngle(snap.smooth.theta);
  const O = { x: geo.cx, y: geo.cy };
  const P = polarPoint(geo.cx, geo.cy, geo.r, theta);
  const X = { x: P.x, y: geo.cy };
  const Y = { x: geo.cx, y: P.y };

  drawSoftAxes(p, geo.cx, geo.cy, geo.r * 1.42);
  drawGhostCircle(p, geo.cx, geo.cy, geo.r);

  withDash(p, [4, 6], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 32);
    p.strokeWeight(1);
    p.line(P.x, P.y, X.x, X.y);
    p.line(P.x, P.y, Y.x, Y.y);
  });

  glowLine(p, O.x, O.y, P.x, P.y, 0.92);
  glowLine(p, geo.cx, geo.cy, X.x, X.y, 0.55);
  glowLine(p, geo.cx, geo.cy, Y.x, Y.y, 0.42);
  drawMathArc(p, geo.cx, geo.cy, geo.r * 0.28, 0, theta, [ACCENT[0], ACCENT[1], ACCENT[2], 180], 1.8);

  if (snap.params.advanced) {
    drawTangentGuide(p, geo, theta);
    drawMiniWaveStrip(p, plot, theta);
  }

  drawPointGlow(p, P.x, P.y, 7);
  drawTinyLabel(p, 'P', P.x + 10, P.y - 8);
  drawTinyLabel(p, 'cos θ', mid(O.x, X.x) - 18, geo.cy + 20);
  drawTinyLabel(p, 'sin θ', geo.cx + 12, mid(O.y, Y.y));
}

function drawTangentGuide(
  p: p5,
  geo: ReturnType<typeof circleGeometry>,
  theta: number,
) {
  const c = Math.cos(theta);
  if (Math.abs(c) < 0.08) return;

  const t = Math.tan(theta);
  if (Math.abs(t) > 2.6) return;

  const x = geo.cx + geo.r;
  const y = geo.cy - geo.r * t;

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16);
  p.strokeWeight(1);
  p.line(x, geo.cy - geo.r * 1.18, x, geo.cy + geo.r * 1.18);

  withDash(p, [3, 7], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 25);
    p.strokeWeight(1);
    p.line(geo.cx, geo.cy, x, y);
  });

  glowLine(p, x, geo.cy, x, y, 0.34);
  drawTinyLabel(p, 'tan θ', x + 10, y);
}

function drawMiniWaveStrip(p: p5, plot: PlotRect, theta: number) {
  const strip = {
    x: plot.x + Math.max(28, plot.w * 0.08),
    y: plot.y + plot.h - 72,
    w: plot.w * 0.84,
    h: 45,
  };

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 12);
  p.strokeWeight(1);
  p.line(strip.x, strip.y + strip.h / 2, strip.x + strip.w, strip.y + strip.h / 2);

  const drawWave = (phase: number, alpha: number, yOffset: number) => {
    p.noFill();
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], alpha);
    p.strokeWeight(1.2);
    p.beginShape();
    for (let i = 0; i <= 160; i++) {
      const u = i / 160;
      const a = u * TAU;
      const y = Math.sin(a + phase) * strip.h * 0.22;
      p.vertex(strip.x + strip.w * u, strip.y + strip.h / 2 - y + yOffset);
    }
    p.endShape();
  };

  drawWave(0, 105, -8);
  drawWave(Math.PI / 2, 55, 10);

  const tx = strip.x + strip.w * (normalizeAngle(theta) / TAU);
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 24);
  p.strokeWeight(1);
  p.line(tx, strip.y, tx, strip.y + strip.h);
}

function drawTriangleScene(p: p5, plot: PlotRect, snap: TrigExploreSnap) {
  const T = triangleTransform(plot);
  const { A, B, C } = snap.params.triangle;
  const sA = worldToScreen(A, T);
  const sB = worldToScreen(B, T);
  const sC = worldToScreen(C, T);
  const g = triangleMetrics(snap.params.triangle);
  const cc = circumcircleWorld(A, B, C);

  if (cc && Number.isFinite(cc.r)) {
    const O = worldToScreen(cc.o, T);
    const pixelRadius = cc.r * T.s;
    const maxVisibleRadius = Math.max(plot.w, plot.h) * 1.35;

    if (pixelRadius < maxVisibleRadius) {
      p.noFill();
      p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], snap.params.advanced ? 28 : 14);
      p.strokeWeight(1);
      p.circle(O.x, O.y, pixelRadius * 2);

      if (snap.params.advanced) {
        withDash(p, [4, 6], () => {
          p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 20);
          p.strokeWeight(1);
          p.line(O.x, O.y, sA.x, sA.y);
          p.line(O.x, O.y, sB.x, sB.y);
          p.line(O.x, O.y, sC.x, sC.y);
        });
        drawTinyLabel(p, 'R', mid(O.x, sA.x) + 5, mid(O.y, sA.y) - 5);
      }
    }
  }

  glowLine(p, sA.x, sA.y, sB.x, sB.y, 0.82);
  glowLine(p, sB.x, sB.y, sC.x, sC.y, 0.82);
  glowLine(p, sC.x, sC.y, sA.x, sA.y, 0.82);

  drawAngleArcAt(p, sA, sB, sC, g.A, 'A', snap.params.advanced);
  drawAngleArcAt(p, sB, sC, sA, g.B, 'B', snap.params.advanced);
  drawAngleArcAt(p, sC, sA, sB, g.C, 'C', snap.params.advanced);

  drawTinyLabel(p, 'c', (sA.x + sB.x) / 2 + 5, (sA.y + sB.y) / 2 - 5);
  drawTinyLabel(p, 'a', (sB.x + sC.x) / 2 + 5, (sB.y + sC.y) / 2 - 5);
  drawTinyLabel(p, 'b', (sC.x + sA.x) / 2 + 5, (sC.y + sA.y) / 2 - 5);

  drawPointGlow(p, sA.x, sA.y, 6);
  drawPointGlow(p, sB.x, sB.y, 6);
  drawPointGlow(p, sC.x, sC.y, 6);
  drawTinyLabel(p, 'A', sA.x - 18, sA.y + 18);
  drawTinyLabel(p, 'B', sB.x + 10, sB.y + 18);
  drawTinyLabel(p, 'C', sC.x + 10, sC.y - 10);
}

function drawAngleArcAt(
  p: p5,
  V: Vec2,
  P1: Vec2,
  P2: Vec2,
  angleValue: number,
  label: string,
  advanced: boolean,
) {
  const a1 = Math.atan2(P1.y - V.y, P1.x - V.x);
  const a2 = Math.atan2(P2.y - V.y, P2.x - V.x);
  const delta = shortestAngleDeltaScreen(a1, a2);
  const r = 34;

  drawScreenArc(p, V.x, V.y, r, a1, a1 + delta, [255, 255, 255, advanced ? 45 : 26], 1);

  if (advanced) {
    const midA = a1 + delta * 0.5;
    drawTinyLabel(
      p,
      `${label}=${Math.round((angleValue * 180) / Math.PI)}°`,
      V.x + Math.cos(midA) * (r + 18),
      V.y + Math.sin(midA) * (r + 18),
    );
  }
}

function drawIdentityScene(p: p5, plot: PlotRect, snap: TrigExploreSnap) {
  const geo = circleGeometry(plot, snap.smooth.advancedMix);
  const alpha = normalizeAngle(snap.smooth.alpha);
  const beta = clampSignedAngle(snap.smooth.beta);
  const sum = alpha + beta;
  const A = polarPoint(geo.cx, geo.cy, geo.r, alpha);
  const S = polarPoint(geo.cx, geo.cy, geo.r, sum);
  const O = { x: geo.cx, y: geo.cy };

  drawSoftAxes(p, geo.cx, geo.cy, geo.r * 1.42);
  drawGhostCircle(p, geo.cx, geo.cy, geo.r);

  drawMathArc(p, geo.cx, geo.cy, geo.r * 0.25, 0, alpha, [255, 255, 255, 42], 1.2);
  drawMathArc(p, geo.cx, geo.cy, geo.r * 0.34, alpha, sum, [ACCENT[0], ACCENT[1], ACCENT[2], 135], 1.8);

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 45);
  p.strokeWeight(1.1);
  p.line(O.x, O.y, A.x, A.y);
  drawPointGlow(p, A.x, A.y, 5, 0.55);
  drawTinyLabel(p, 'α', A.x + 9, A.y - 8);

  glowLine(p, O.x, O.y, S.x, S.y, 0.95);
  drawPointGlow(p, S.x, S.y, 7);
  drawTinyLabel(p, 'α+β', S.x + 10, S.y - 8);

  if (snap.params.advanced) {
    const X = { x: S.x, y: geo.cy };
    const Y = { x: geo.cx, y: S.y };

    withDash(p, [4, 6], () => {
      p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 30);
      p.strokeWeight(1);
      p.line(S.x, S.y, X.x, X.y);
      p.line(S.x, S.y, Y.x, Y.y);
    });

    drawTinyLabel(p, 'cos(α+β)', mid(O.x, X.x) - 30, geo.cy + 20);
    drawTinyLabel(p, 'sin(α+β)', geo.cx + 12, mid(O.y, Y.y));
  }

  const bx = geo.cx + Math.cos(alpha + beta * 0.5) * geo.r * 0.42;
  const by = geo.cy - Math.sin(alpha + beta * 0.5) * geo.r * 0.42;
  drawTinyLabel(p, 'β', bx, by);
}

function drawVisualCaption(p: p5, plot: PlotRect, caption: string) {
  p.noStroke();
  p.fill(MUTED[0], MUTED[1], MUTED[2], 210);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(caption, plot.x + plot.w / 2, plot.y + plot.h - 10);
  p.textAlign(p.LEFT, p.BASELINE);
}

export function renderTrigonometryExploreScene(p: p5, snap: TrigExploreSnap) {
  p.background(BG[0], BG[1], BG[2]);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, sans-serif');
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  const plot = plotRect(p.width, p.height);

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 12);
  p.strokeWeight(1);
  p.rect(plot.x - 8, plot.y - 8, plot.w + 16, plot.h + 16, 14);

  if (snap.params.mode === 'circle') drawUnitCircleScene(p, plot, snap);
  if (snap.params.mode === 'triangle') drawTriangleScene(p, plot, snap);
  if (snap.params.mode === 'identity') drawIdentityScene(p, plot, snap);

  drawVisualCaption(p, plot, getVisualCaption(snap.params.mode));
}
