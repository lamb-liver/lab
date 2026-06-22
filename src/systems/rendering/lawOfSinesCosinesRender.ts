import type p5 from 'p5';
import {
  circumcircleWorld,
  createTriangleTransform,
  deg,
  getCosineStatusLabel,
  getVisualCaption,
  projectPointToLine,
  shortestAngleDelta,
  triangleMetrics,
  worldToScreen,
  type LawOfSinesCosinesParams,
  type TriangleMetrics,
  type TriangleTransform,
  type Vec2,
} from '../../curve/modules/law-of-sines-cosines/geometry';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const TEXT = [232, 232, 232] as const;
const MUTED = [136, 136, 136] as const;

type ScreenTriangle = { A: Vec2; B: Vec2; C: Vec2 };

type LawRenderSnap = {
  width: number;
  height: number;
  params: LawOfSinesCosinesParams;
  activeVertex: 'A' | 'B' | 'C' | null;
};

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
  p.fill(TEXT[0], TEXT[1], TEXT[2], 180);
  p.textSize(11);
  p.text(label, x, y);
}

function drawTinyLabelInRect(
  p: p5,
  label: string,
  x: number,
  y: number,
  plot: { x: number; y: number; w: number; h: number },
) {
  p.noStroke();
  p.fill(TEXT[0], TEXT[1], TEXT[2], 180);
  p.textSize(11);
  const tw = p.textWidth(label);
  const safeX = Math.max(plot.x + 12, Math.min(x, plot.x + plot.w - tw - 12));
  const safeY = Math.max(plot.y + 22, Math.min(y, plot.y + plot.h - 42));
  p.text(label, safeX, safeY);
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

function getScreenTriangle(T: TriangleTransform, triangle: LawOfSinesCosinesParams['triangle']): ScreenTriangle {
  return {
    A: worldToScreen(triangle.A, T),
    B: worldToScreen(triangle.B, T),
    C: worldToScreen(triangle.C, T),
  };
}

function drawSoftWorldGrid(p: p5, T: TriangleTransform, advancedMix: number) {
  const { plot } = T;
  const alpha = 8 + 8 * advancedMix;
  const worldLeft = (plot.x - T.cx) / T.s;
  const worldRight = (plot.x + plot.w - T.cx) / T.s;
  const worldYMax = -(plot.y - T.cy) / T.s;
  const worldYMin = -(plot.y + plot.h - T.cy) / T.s;

  p.stroke(255, 255, 255, alpha);
  p.strokeWeight(1);

  for (let gx = Math.ceil(worldLeft); gx <= worldRight; gx++) {
    const p1 = worldToScreen({ x: gx, y: worldYMin }, T);
    const p2 = worldToScreen({ x: gx, y: worldYMax }, T);
    p.line(p1.x, p1.y, p2.x, p2.y);
  }

  for (let gy = Math.ceil(worldYMin); gy <= worldYMax; gy++) {
    const p1 = worldToScreen({ x: worldLeft, y: gy }, T);
    const p2 = worldToScreen({ x: worldRight, y: gy }, T);
    p.line(p1.x, p1.y, p2.x, p2.y);
  }
}

function drawTriangleCore(
  p: p5,
  pts: ScreenTriangle,
  intensity: { sideAB: number; sideBC: number; sideCA: number },
) {
  glowLine(p, pts.A.x, pts.A.y, pts.B.x, pts.B.y, intensity.sideAB);
  glowLine(p, pts.B.x, pts.B.y, pts.C.x, pts.C.y, intensity.sideBC);
  glowLine(p, pts.C.x, pts.C.y, pts.A.x, pts.A.y, intensity.sideCA);
}

function drawSideLabel(
  p: p5,
  label: string,
  P: Vec2,
  Q: Vec2,
  alphaScale = 1,
) {
  const x = (P.x + Q.x) / 2;
  const y = (P.y + Q.y) / 2;
  p.noStroke();
  p.fill(TEXT[0], TEXT[1], TEXT[2], 180 * alphaScale);
  p.textSize(12);
  p.text(label, x + 5, y - 5);
}

function drawVertexHandles(p: p5, pts: ScreenTriangle, active: LawRenderSnap['activeVertex']) {
  const keys: Array<['A' | 'B' | 'C', Vec2, string, number, number]> = [
    ['A', pts.A, 'A', -18, 18],
    ['B', pts.B, 'B', 10, 18],
    ['C', pts.C, 'C', 10, -10],
  ];

  for (const [key, point, label, ox, oy] of keys) {
    const intensity = active === key ? 1.15 : 1;
    drawPointGlow(p, point.x, point.y, 6, intensity);
    drawTinyLabel(p, label, point.x + ox, point.y + oy);
  }
}

function drawAngleArcAt(
  p: p5,
  V: Vec2,
  P1: Vec2,
  P2: Vec2,
  angleValue: number,
  label: string,
  withLabel: boolean,
  radius: number,
  advanced: boolean,
) {
  const a1 = Math.atan2(P1.y - V.y, P1.x - V.x);
  const a2 = Math.atan2(P2.y - V.y, P2.x - V.x);
  const delta = shortestAngleDelta(a1, a2);

  drawScreenArc(p, V.x, V.y, radius, a1, a1 + delta, [255, 255, 255, advanced ? 45 : 26], 1);

  if (withLabel && advanced) {
    const midA = a1 + delta * 0.5;
    drawTinyLabel(
      p,
      `${label}=${deg(angleValue)}`,
      V.x + Math.cos(midA) * (radius + 18),
      V.y + Math.sin(midA) * (radius + 18),
    );
  }
}

function drawDiameterHint(
  p: p5,
  O: Vec2,
  rWorld: number,
  T: TriangleTransform,
) {
  const angle = -Math.PI / 5;
  const r = rWorld * T.s;
  const P1 = { x: O.x + Math.cos(angle) * r, y: O.y + Math.sin(angle) * r };
  const P2 = { x: O.x - Math.cos(angle) * r, y: O.y - Math.sin(angle) * r };

  withDash(p, [3, 7], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16);
    p.strokeWeight(1);
    p.line(P1.x, P1.y, P2.x, P2.y);
  });

  drawTinyLabel(p, '2R', mid(P1.x, P2.x) + 10, mid(P1.y, P2.y) - 10);
}

function drawSineLawScene(
  p: p5,
  T: TriangleTransform,
  pts: ScreenTriangle,
  g: TriangleMetrics,
  triangle: LawOfSinesCosinesParams['triangle'],
  advanced: boolean,
  activeVertex: LawRenderSnap['activeVertex'],
) {
  drawSoftWorldGrid(p, T, advanced ? 1 : 0);

  const cc = circumcircleWorld(triangle.A, triangle.B, triangle.C);
  if (cc && Number.isFinite(cc.r)) {
    const O = worldToScreen(cc.o, T);
    const pixelRadius = cc.r * T.s;
    const maxVisibleRadius = Math.max(T.plot.w, T.plot.h) * 1.35;

    if (pixelRadius < maxVisibleRadius) {
      p.noFill();
      p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 28);
      p.strokeWeight(1.1);
      p.circle(O.x, O.y, pixelRadius * 2);

      if (advanced) {
        withDash(p, [4, 6], () => {
          p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 18);
          p.strokeWeight(1);
          p.line(O.x, O.y, pts.A.x, pts.A.y);
          p.line(O.x, O.y, pts.B.x, pts.B.y);
          p.line(O.x, O.y, pts.C.x, pts.C.y);
        });
        drawTinyLabel(p, 'O', O.x + 8, O.y - 8);
        drawTinyLabel(p, 'R', mid(O.x, pts.A.x) + 5, mid(O.y, pts.A.y) - 5);
        drawDiameterHint(p, O, cc.r, T);
      }
    }
  }

  drawTriangleCore(p, pts, { sideAB: 0.82, sideBC: 0.82, sideCA: 0.82 });
  drawAngleArcAt(p, pts.A, pts.B, pts.C, g.A, 'A', true, 36, advanced);
  drawAngleArcAt(p, pts.B, pts.C, pts.A, g.B, 'B', true, 36, advanced);
  drawAngleArcAt(p, pts.C, pts.A, pts.B, g.C, 'C', true, 36, advanced);
  drawSideLabel(p, 'c', pts.A, pts.B, 0.9);
  drawSideLabel(p, 'a', pts.B, pts.C, 0.9);
  drawSideLabel(p, 'b', pts.C, pts.A, 0.9);
  drawVertexHandles(p, pts, activeVertex);
}

function drawCosineProjectionGuide(
  p: p5,
  plot: { x: number; y: number; w: number; h: number },
  pts: ScreenTriangle,
  g: TriangleMetrics,
) {
  const foot = projectPointToLine(pts.A, pts.C, pts.B);
  const projectionMid = { x: mid(pts.C.x, foot.x), y: mid(pts.C.y, foot.y) };
  const heightMid = { x: mid(pts.A.x, foot.x), y: mid(pts.A.y, foot.y) };

  withDash(p, [4, 6], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 22);
    p.strokeWeight(1);
    p.line(pts.A.x, pts.A.y, foot.x, foot.y);
  });

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 125);
  p.strokeWeight(2.2);
  p.line(pts.C.x, pts.C.y, foot.x, foot.y);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 135);
  p.circle(foot.x, foot.y, 4.5);

  drawTinyLabelInRect(p, 'b cosC', projectionMid.x + 8, projectionMid.y - 8, plot);
  drawTinyLabelInRect(p, '高', heightMid.x + 8, heightMid.y - 8, plot);

  const correction = -2 * g.a * g.b * Math.cos(g.C);
  const label = correction >= 0 ? '修正項 +：c 變長' : '修正項 −：c 變短';
  drawTinyLabelInRect(p, label, foot.x + 8, foot.y + 16, plot);
}

function drawCosineLawScene(
  p: p5,
  T: TriangleTransform,
  pts: ScreenTriangle,
  g: TriangleMetrics,
  advanced: boolean,
  activeVertex: LawRenderSnap['activeVertex'],
) {
  drawSoftWorldGrid(p, T, advanced ? 1 : 0);
  drawTriangleCore(p, pts, { sideAB: 1, sideBC: 0.82, sideCA: 0.82 });

  if (advanced) {
    drawCosineProjectionGuide(p, T.plot, pts, g);
  }

  drawAngleArcAt(p, pts.C, pts.A, pts.B, g.C, 'C', true, 52, advanced);
  drawSideLabel(p, 'c', pts.A, pts.B, 1);
  drawSideLabel(p, 'a', pts.B, pts.C, 0.78);
  drawSideLabel(p, 'b', pts.C, pts.A, 0.78);
  drawVertexHandles(p, pts, activeVertex);

  if (advanced) {
    drawTinyLabelInRect(p, getCosineStatusLabel(g.C), pts.C.x + 14, pts.C.y - 18, T.plot);
  }
}

export function renderLawOfSinesCosinesScene(p: p5, snap: LawRenderSnap) {
  p.background(BG[0], BG[1], BG[2]);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, sans-serif');
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  const T = createTriangleTransform(snap.width, snap.height);
  const pts = getScreenTriangle(T, snap.params.triangle);
  const g = triangleMetrics(snap.params.triangle);
  const advanced = snap.params.advanced;

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 12);
  p.strokeWeight(1);
  p.rect(T.plot.x - 8, T.plot.y - 8, T.plot.w + 16, T.plot.h + 16, 14);

  if (snap.params.mode === 'sine') {
    drawSineLawScene(p, T, pts, g, snap.params.triangle, advanced, snap.activeVertex);
  } else {
    drawCosineLawScene(p, T, pts, g, advanced, snap.activeVertex);
  }

  p.noStroke();
  p.fill(MUTED[0], MUTED[1], MUTED[2], 210);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(getVisualCaption(snap.params.mode, g.C), T.plot.x + T.plot.w / 2, T.plot.y + T.plot.h - 10);
  p.textAlign(p.LEFT, p.BASELINE);
}
