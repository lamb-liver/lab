import type p5 from 'p5';
import {
  type CircleLayout,
  type TrigFunctionGraphLayout,
  type TrigFunctionGraphParams,
  TAU,
  computeTrigFunctionGraphLayout,
  equivalentAngle,
  fmt,
  formatDeg,
  formatRad,
  graphX,
  graphY,
  pointOnCircle,
  transformedSin,
} from '../../explore/trig-function-graphs/geometry';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const GUIDE = [255, 255, 255] as const;

function withDash(p: p5, pattern: number[], draw: () => void) {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  p.push();
  try {
    ctx.setLineDash(pattern);
    draw();
  } finally {
    ctx.setLineDash([]);
    p.pop();
  }
}

function drawSignedArc(
  p: p5,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  alpha = 190,
  weight = 3,
) {
  const delta = endAngle - startAngle;
  if (Math.abs(delta) < 0.001) return;

  const steps = Math.min(360, Math.max(8, Math.ceil(Math.abs(delta) / 0.035)));

  p.noFill();
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], alpha);
  p.strokeWeight(weight);
  p.beginShape();
  for (let i = 0; i <= steps; i += 1) {
    const t = startAngle + delta * (i / steps);
    p.vertex(cx + Math.cos(t) * r, cy - Math.sin(t) * r);
  }
  p.endShape();

  const dir = delta >= 0 ? 1 : -1;
  const tipX = cx + Math.cos(endAngle) * r;
  const tipY = cy - Math.sin(endAngle) * r;
  const tangent = endAngle + dir * Math.PI / 2;
  const arrowSize = Math.max(4, weight * 2);

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

function drawThetaLabel(p: p5, circle: CircleLayout, theta: number) {
  const labelTheta = equivalentAngle(theta);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 155);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text(
    'θ',
    circle.cx + Math.cos(labelTheta / 2) * circle.r * 0.32,
    circle.cy - Math.sin(labelTheta / 2) * circle.r * 0.32 + 8,
  );
}

function drawUnitCircle(p: p5, layout: TrigFunctionGraphLayout, params: TrigFunctionGraphParams) {
  const { circle } = layout;
  const point = pointOnCircle(params.theta, circle);

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 24);
  p.strokeWeight(1);
  p.circle(circle.cx, circle.cy, circle.r * 2);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 18);
  p.line(circle.cx - circle.r - 16, circle.cy, circle.cx + circle.r + 16, circle.cy);
  p.line(circle.cx, circle.cy - circle.r - 16, circle.cx, circle.cy + circle.r + 16);

  drawSignedArc(p, circle.cx, circle.cy, circle.r * 0.78, 0, params.theta, 205, 3);

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 235);
  p.strokeWeight(2);
  p.line(circle.cx, circle.cy, point.x, point.y);

  if (params.mode === 'unfold') {
    withDash(p, [4, 6], () => {
      p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 45);
      p.strokeWeight(1);
      p.line(point.x, point.y, point.x, circle.cy);
      p.line(point.x, point.y, circle.cx, point.y);
    });
  }

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 55);
  p.circle(point.x, point.y, 22);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 235);
  p.circle(point.x, point.y, 8);

  drawThetaLabel(p, circle, params.theta);

  if (params.mode === 'radian') {
    drawRadianLabels(p, circle, point, params.theta);
  } else {
    p.fill(230, 230, 230, 145);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text('P(θ)', point.x + 9, point.y - 8);
  }
}

function drawRadianLabels(
  p: p5,
  circle: CircleLayout,
  point: { x: number; y: number },
  theta: number,
) {
  const labelAngle = equivalentAngle(theta);
  const arcLabelX = circle.cx + Math.cos(labelAngle / 2) * circle.r * 0.86;
  const arcLabelY = circle.cy - Math.sin(labelAngle / 2) * circle.r * 0.86;

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 170);
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('s', arcLabelX, arcLabelY);

  p.fill(230, 230, 230, 145);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('r = 1', (circle.cx + point.x) / 2, (circle.cy + point.y) / 2 - 8);

  p.fill(230, 230, 230, 135);
  p.textAlign(p.CENTER, p.TOP);
  p.text('θ = s / r', circle.cx, circle.cy + circle.r + 24);
  p.text('r = 1 ⇒ θ = s', circle.cx, circle.cy + circle.r + 46);
}

function transformScale(layout: TrigFunctionGraphLayout, params: TrigFunctionGraphParams) {
  const { circle } = layout;
  const x = circle.cx + circle.r + 34;
  const midY = circle.cy;
  const ampPx = Math.abs(params.amplitude) / 2 * circle.r * 0.74;
  const ratio = Math.abs(params.amplitude) < 0.001
    ? 0
    : params.amplitude * Math.sin(params.theta) / Math.abs(params.amplitude);

  return {
    x,
    top: circle.cy - circle.r * 0.88,
    bottom: circle.cy + circle.r * 0.88,
    midY,
    topY: midY - ampPx,
    bottomY: midY + ampPx,
    currentY: midY - ratio * ampPx,
    ampPx,
  };
}

function drawTransformControl(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  const { circle } = layout;
  const point = pointOnCircle(params.theta, circle);
  const scale = transformScale(layout, params);

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 13);
  p.strokeWeight(1);
  p.circle(circle.cx, circle.cy, circle.r * 2);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 10);
  p.line(circle.cx - circle.r - 12, circle.cy, circle.cx + circle.r + 12, circle.cy);
  p.line(circle.cx, circle.cy - circle.r - 12, circle.cx, circle.cy + circle.r + 12);

  drawSignedArc(p, circle.cx, circle.cy, circle.r * 0.66, 0, params.theta, 70, 1.4);

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 95);
  p.strokeWeight(1.4);
  p.line(circle.cx, circle.cy, point.x, point.y);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 90);
  p.circle(point.x, point.y, 7);
  p.fill(230, 230, 230, 90);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text('sin θ', circle.cx, circle.cy + circle.r + 14);

  drawAmplitudeScale(p, scale);
}

function drawAmplitudeScale(
  p: p5,
  scale: ReturnType<typeof transformScale>,
) {
  const collapsed = scale.ampPx < 3;

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 20);
  p.strokeWeight(1);
  p.line(scale.x, scale.top, scale.x, scale.bottom);

  if (!collapsed) {
    p.noStroke();
    p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 15);
    p.rect(scale.x - 10, scale.topY, 20, scale.bottomY - scale.topY, 999);

    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 85);
    p.line(scale.x - 16, scale.topY, scale.x + 16, scale.topY);
    p.line(scale.x - 16, scale.bottomY, scale.x + 16, scale.bottomY);
  }

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 46);
  p.line(scale.x - 18, scale.midY, scale.x + 18, scale.midY);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 215);
  p.circle(scale.x, scale.currentY, 8);

  p.fill(230, 230, 230, 115);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(collapsed ? 'k' : 'k + |A|', scale.x + 18, collapsed ? scale.midY : scale.topY);
  if (!collapsed) {
    p.text('k', scale.x + 18, scale.midY);
    p.text('k - |A|', scale.x + 18, scale.bottomY);
  }
}

function drawGraphFrame(p: p5, layout: TrigFunctionGraphLayout) {
  const { graph, graphWorld } = layout;

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 22);
  p.strokeWeight(1);
  p.rect(graph.x, graph.y, graph.w, graph.h);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 9);
  for (const x of [-Math.PI, 0, Math.PI, TAU, Math.PI * 3, Math.PI * 4]) {
    if (x < graphWorld.xmin || x > graphWorld.xmax) continue;
    const px = graphX(x, layout);
    p.line(px, graph.y, px, graph.y + graph.h);
  }
  for (let y = -3; y <= 3; y += 1) {
    const py = graphY(y, layout);
    p.line(graph.x, py, graph.x + graph.w, py);
  }

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 28);
  p.line(graph.x, graphY(0, layout), graph.x + graph.w, graphY(0, layout));
  p.line(graphX(0, layout), graph.y, graphX(0, layout), graph.y + graph.h);
}

function drawRadianModeGraph(p: p5, layout: TrigFunctionGraphLayout) {
  const { graph } = layout;
  if (graph.w < 120 || graph.h < 110) return;

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 7);
  p.strokeWeight(1);
  p.rect(graph.x, graph.y, graph.w, graph.h);

  p.noStroke();
  p.fill(220, 220, 220, 55);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('下一步：把弧長 θ 展開為 x 軸', graph.x + graph.w / 2, graph.y + graph.h / 2);
}

function drawFunctionPath(
  p: p5,
  layout: TrigFunctionGraphLayout,
  fn: (x: number) => number,
) {
  const { graphWorld } = layout;

  p.beginShape();
  for (let i = 0; i <= 520; i += 1) {
    const x = graphWorld.xmin + (graphWorld.xmax - graphWorld.xmin) * (i / 520);
    const y = fn(x);
    if (Number.isFinite(y)) p.vertex(graphX(x, layout), graphY(y, layout));
  }
  p.endShape();
}

function drawFunctionCurve(
  p: p5,
  layout: TrigFunctionGraphLayout,
  fn: (x: number) => number,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
  glow = false,
) {
  if (glow) {
    p.noFill();
    p.stroke(color[0], color[1], color[2], 24);
    p.strokeWeight(7);
    drawFunctionPath(p, layout, fn);

    p.stroke(color[0], color[1], color[2], 58);
    p.strokeWeight(3.5);
    drawFunctionPath(p, layout, fn);
  }

  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  drawFunctionPath(p, layout, fn);
}

function drawHorizontalGuide(
  p: p5,
  layout: TrigFunctionGraphLayout,
  yValue: number,
  label: string,
  alpha: number,
) {
  const { graph, graphWorld } = layout;
  if (yValue < graphWorld.ymin || yValue > graphWorld.ymax) return;
  const y = graphY(yValue, layout);

  withDash(p, [8, 8], () => {
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], alpha);
    p.strokeWeight(1);
    p.line(graph.x, y, graph.x + graph.w, y);
  });

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], Math.min(145, alpha * 3));
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, graph.x + 10, y - 10);
}

function drawPeriodBracket(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  const { graph, graphWorld } = layout;
  let start = params.phase;
  while (start < graphWorld.xmin) start += params.period;
  while (start + params.period > graphWorld.xmax && start - params.period >= graphWorld.xmin) {
    start -= params.period;
  }
  if (start < graphWorld.xmin || start + params.period > graphWorld.xmax) return;

  const x0 = graphX(start, layout);
  const x1 = graphX(start + params.period, layout);
  const y = graph.y + graph.h - 18;

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 54);
  p.strokeWeight(1);
  p.line(x0, y, x1, y);
  p.line(x0, y - 5, x0, y + 5);
  p.line(x1, y - 5, x1, y + 5);

  p.noStroke();
  p.fill(230, 230, 230, 105);
  p.textSize(11);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('T', (x0 + x1) / 2, y - 6);
}

function drawGraphTickLabels(p: p5, layout: TrigFunctionGraphLayout) {
  const { graph } = layout;
  const ticks = [
    [0, '0'],
    [Math.PI, 'π'],
    [TAU, '2π'],
    [Math.PI * 3, '3π'],
    [Math.PI * 4, '4π'],
  ] as const;

  p.noStroke();
  p.fill(210, 210, 210, 100);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  for (const [x, label] of ticks) {
    p.text(label, graphX(x, layout), graph.y + graph.h + 8);
  }
}

function drawBaseThetaMarker(p: p5, layout: TrigFunctionGraphLayout, theta: number) {
  const { graph, graphWorld } = layout;
  const tx = Math.min(graphWorld.xmax, Math.max(graphWorld.xmin, theta));
  const px = graphX(tx, layout);
  const py = graphY(Math.sin(tx), layout);
  if (px < graph.x || px > graph.x + graph.w) return;

  withDash(p, [4, 6], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 44);
    p.line(px, graph.y, px, graph.y + graph.h);
  });

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 55);
  p.circle(px, py, 22);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 235);
  p.circle(px, py, 7);
}

function drawTransformThetaMarker(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  const { graph, graphWorld } = layout;
  const tx = Math.min(graphWorld.xmax, Math.max(graphWorld.xmin, params.theta));
  const px = graphX(tx, layout);
  if (px < graph.x || px > graph.x + graph.w) return;

  const basePy = graphY(Math.sin(tx), layout);
  const transPy = graphY(transformedSin(tx, params), layout);

  withDash(p, [4, 6], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 42);
    p.line(px, graph.y, px, graph.y + graph.h);
  });

  p.noStroke();
  p.fill(255, 255, 255, 80);
  p.circle(px, basePy, 6);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 60);
  p.circle(px, transPy, 22);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 235);
  p.circle(px, transPy, 7);
}

function drawTransformGraphGuides(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  const amp = Math.abs(params.amplitude);
  drawHorizontalGuide(p, layout, params.verticalShift, 'y = k', 56);
  if (amp >= 0.03) {
    drawHorizontalGuide(p, layout, params.verticalShift + amp, 'k + |A|', 42);
    drawHorizontalGuide(p, layout, params.verticalShift - amp, 'k - |A|', 42);
  }

  const { graph, graphWorld } = layout;
  if (params.phase >= graphWorld.xmin && params.phase <= graphWorld.xmax) {
    const px = graphX(params.phase, layout);
    withDash(p, [4, 6], () => {
      p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 36);
      p.line(px, graph.y, px, graph.y + graph.h);
    });
    p.noStroke();
    p.fill(230, 230, 230, 90);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text('φ', px, graph.y + graph.h + 8);
  }

  drawPeriodBracket(p, layout, params);
}

function drawGraph(p: p5, layout: TrigFunctionGraphLayout, params: TrigFunctionGraphParams) {
  if (params.mode === 'radian') {
    drawRadianModeGraph(p, layout);
    return;
  }

  drawGraphFrame(p, layout);
  if (params.mode === 'transform') {
    drawTransformGraphGuides(p, layout, params);
    drawFunctionCurve(p, layout, Math.sin, GUIDE, 38, 1.1);
    drawFunctionCurve(p, layout, (x) => transformedSin(x, params), ACCENT, 230, 2, true);
    drawTransformThetaMarker(p, layout, params);
  } else {
    drawFunctionCurve(p, layout, Math.sin, ACCENT, 230, 1.8, true);
    if (params.showCos) drawFunctionCurve(p, layout, Math.cos, BLUE, 90, 1.2);
    drawBaseThetaMarker(p, layout, params.theta);
  }
  drawGraphTickLabels(p, layout);
}

function drawUnfoldGuide(p: p5, layout: TrigFunctionGraphLayout, params: TrigFunctionGraphParams) {
  const { circle, graph } = layout;
  const point = pointOnCircle(params.theta, circle);
  const px = graphX(params.theta, layout);
  const py = graphY(Math.sin(params.theta), layout);
  if (px < graph.x || px > graph.x + graph.w) return;

  withDash(p, [4, 7], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 38);
    p.strokeWeight(1);
    p.line(point.x, point.y, px, py);
  });

  p.noStroke();
  p.fill(230, 230, 230, 105);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text('sin θ', (point.x + px) / 2, Math.max(point.y, py) + 10);
}

function drawTransformGuide(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  const { circle, graph, graphWorld } = layout;
  const point = pointOnCircle(params.theta, circle);
  const scale = transformScale(layout, params);
  const tx = Math.min(graphWorld.xmax, Math.max(graphWorld.xmin, params.theta));
  const px = graphX(tx, layout);
  const py = graphY(transformedSin(tx, params), layout);
  if (px < graph.x || px > graph.x + graph.w) return;

  withDash(p, [4, 7], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 30);
    p.strokeWeight(1);
    p.line(point.x, point.y, scale.x, scale.currentY);
    p.line(scale.x, scale.currentY, px, py);
  });
}

function drawBottomLabel(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  const { visual } = layout;
  const label = params.mode === 'radian'
    ? '弧度：θ = s / r；單位圓上 r = 1，所以 θ = s'
    : params.mode === 'unfold'
      ? '展開：P(θ) = (cos θ, sin θ)，縱座標形成 y = sin x'
      : '參數：由 A、T、φ、k 把 sin θ 變成正弦型函數';

  p.noStroke();
  p.fill(220, 220, 220, 120);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(label, visual.x, visual.y + visual.h + 6, visual.w, 30);
}

function drawMobileStats(
  p: p5,
  layout: TrigFunctionGraphLayout,
  params: TrigFunctionGraphParams,
) {
  if (p.width >= 720) return;
  const { visual } = layout;
  const w = Math.min(visual.w, 370);

  p.noStroke();
  p.fill(BG[0], BG[1], BG[2], 190);
  p.rect(visual.x, visual.y, w, 70, 14);

  p.fill(230, 230, 230, 155);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`θ = ${formatRad(params.theta)}   ${formatDeg(params.theta)}`, visual.x + 14, visual.y + 14);

  const second = params.mode === 'transform'
    ? `A=${fmt(params.amplitude)}  T=${formatRad(params.period)}  φ=${formatRad(params.phase)}  k=${fmt(params.verticalShift)}`
    : `sin θ = ${fmt(Math.sin(params.theta))}   cos θ = ${fmt(Math.cos(params.theta))}`;
  p.text(second, visual.x + 14, visual.y + 38);
}

export function renderTrigFunctionGraphsExploreScene(
  p: p5,
  params: TrigFunctionGraphParams,
) {
  const layout = computeTrigFunctionGraphLayout(p.width, p.height, params.mode);

  p.background(BG[0], BG[1], BG[2]);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  if (params.mode === 'transform') {
    drawTransformControl(p, layout, params);
  } else {
    drawUnitCircle(p, layout, params);
  }

  drawGraph(p, layout, params);
  if (params.mode === 'unfold') drawUnfoldGuide(p, layout, params);
  if (params.mode === 'transform') drawTransformGuide(p, layout, params);
  drawBottomLabel(p, layout, params);
  drawMobileStats(p, layout, params);
}
