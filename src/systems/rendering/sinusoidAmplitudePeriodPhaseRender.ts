import type p5 from 'p5';
import {
  SINUSOID_WORLD,
  baseSin,
  fmt,
  formatPeakText,
  formatRad,
  hasAmplitude,
  interpretationText,
  peakInfo,
  periodBracketStart,
  transformedSin,
  troughInfo,
  type GraphWorld,
  type SinusoidAmplitudePeriodPhaseParams,
} from '../../curve/modules/sinusoid-amplitude-period-phase/geometry';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GHOST = [255, 255, 255] as const;

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type SceneLayout = {
  visual: Rect;
  graph: Rect;
  graphWorld: GraphWorld;
  compact: boolean;
};

function layoutScene(width: number, height: number): SceneLayout {
  const pad = Math.max(24, Math.min(width, height) * 0.085);
  const visual = {
    x: pad,
    y: pad,
    w: width - pad * 2,
    h: height - pad * 2,
  };
  const graph = {
    x: visual.x,
    y: visual.y + 54,
    w: visual.w,
    h: Math.max(170, visual.h - 122),
  };

  return {
    visual,
    graph,
    graphWorld: SINUSOID_WORLD,
    compact: width < 520,
  };
}

function gx(x: number, layout: SceneLayout) {
  const { graph, graphWorld } = layout;
  return graph.x + ((x - graphWorld.xmin) / (graphWorld.xmax - graphWorld.xmin)) * graph.w;
}

function gy(y: number, layout: SceneLayout) {
  const { graph, graphWorld } = layout;
  return graph.y + graph.h - ((y - graphWorld.ymin) / (graphWorld.ymax - graphWorld.ymin)) * graph.h;
}

function withDash(p: p5, pattern: number[], draw: () => void) {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  p.push();
  ctx.save();
  ctx.setLineDash(pattern);
  draw();
  ctx.restore();
  p.pop();
}

function withGraphClip(p: p5, graph: Rect, draw: () => void) {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  p.push();
  ctx.save();
  ctx.beginPath();
  ctx.rect(graph.x, graph.y, graph.w, graph.h);
  ctx.clip();
  draw();
  ctx.restore();
  p.pop();
}

function drawTitle(p: p5, layout: SceneLayout) {
  const { visual } = layout;

  p.noStroke();
  p.fill(235, 235, 235, 215);
  p.textSize(layout.compact ? 14 : 16);
  p.textAlign(p.LEFT, p.TOP);
  p.text('正弦型函數的振幅、週期與相位', visual.x, visual.y);

  p.fill(235, 235, 235, 90);
  p.textSize(12);
  p.text(
    '比較基本正弦波與 y = A sin((2π/T)(x - φ)) + k 的差異。',
    visual.x,
    visual.y + 24,
    visual.w,
    28,
  );
}

function drawTickLabels(p: p5, layout: SceneLayout) {
  const { graph } = layout;

  p.noStroke();
  p.fill(GHOST[0], GHOST[1], GHOST[2], 95);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);

  const ticks = [
    [-Math.PI, '-π'],
    [0, '0'],
    [Math.PI, 'π'],
    [Math.PI * 2, '2π'],
    [Math.PI * 3, '3π'],
    [Math.PI * 4, '4π'],
  ] as const;

  for (const [x, label] of ticks) {
    p.text(label, gx(x, layout), graph.y + graph.h + 8);
  }

  p.textAlign(p.RIGHT, p.CENTER);
  p.text('1', graph.x - 8, gy(1, layout));
  p.text('0', graph.x - 8, gy(0, layout));
  p.text('-1', graph.x - 8, gy(-1, layout));
}

function drawGraphFrame(p: p5, layout: SceneLayout) {
  const { graph, graphWorld } = layout;

  p.noFill();
  p.stroke(GHOST[0], GHOST[1], GHOST[2], 22);
  p.strokeWeight(1);
  p.rect(graph.x, graph.y, graph.w, graph.h);

  p.stroke(GHOST[0], GHOST[1], GHOST[2], 10);
  const xTicks = [-Math.PI, 0, Math.PI, Math.PI * 2, Math.PI * 3, Math.PI * 4];
  for (const x of xTicks) {
    if (x < graphWorld.xmin || x > graphWorld.xmax) continue;
    const px = gx(x, layout);
    p.line(px, graph.y, px, graph.y + graph.h);
  }

  for (let y = -4; y <= 4; y += 1) {
    const py = gy(y, layout);
    p.line(graph.x, py, graph.x + graph.w, py);
  }

  p.stroke(GHOST[0], GHOST[1], GHOST[2], 34);
  p.line(graph.x, gy(0, layout), graph.x + graph.w, gy(0, layout));
  p.line(gx(0, layout), graph.y, gx(0, layout), graph.y + graph.h);

  drawTickLabels(p, layout);
}

function drawCenterLine(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  const { graph, graphWorld } = layout;
  if (params.verticalShift < graphWorld.ymin || params.verticalShift > graphWorld.ymax) return;

  const y = gy(params.verticalShift, layout);

  withDash(p, [8, 8], () => {
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 74);
    p.strokeWeight(1.3);
    p.line(graph.x, y, graph.x + graph.w, y);
  });

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 150);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('中心線 y = k', graph.x + 12, y - 6);
}

function drawHorizontalGuide(p: p5, layout: SceneLayout, yValue: number, label: string) {
  const { graph, graphWorld } = layout;
  if (yValue < graphWorld.ymin || yValue > graphWorld.ymax) return;

  const y = gy(yValue, layout);

  withDash(p, [5, 8], () => {
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 48);
    p.strokeWeight(1);
    p.line(graph.x, y, graph.x + graph.w, y);
  });

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 135);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, graph.x + 12, y - 10);
}

function drawAmplitudeBand(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  if (!hasAmplitude(params)) return;

  const { graph, graphWorld } = layout;
  const amp = Math.abs(params.amplitude);
  const upper = params.verticalShift + amp;
  const lower = params.verticalShift - amp;

  if (upper < graphWorld.ymin || lower > graphWorld.ymax) return;

  const yTop = gy(Math.min(upper, graphWorld.ymax), layout);
  const yBottom = gy(Math.max(lower, graphWorld.ymin), layout);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 12);
  p.rect(graph.x, yTop, graph.w, yBottom - yTop);

  drawHorizontalGuide(p, layout, upper, 'k + |A|');
  drawHorizontalGuide(p, layout, lower, 'k - |A|');

  const x = graph.x + graph.w - 42;
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 110);
  p.strokeWeight(1);
  p.line(x, gy(params.verticalShift, layout), x, gy(upper, layout));
  p.line(x - 5, gy(params.verticalShift, layout), x + 5, gy(params.verticalShift, layout));
  p.line(x - 5, gy(upper, layout), x + 5, gy(upper, layout));

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 150);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('|A|', x + 9, (gy(params.verticalShift, layout) + gy(upper, layout)) / 2);
}

function drawPhaseLine(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  const { graph, graphWorld } = layout;
  if (params.phase < graphWorld.xmin || params.phase > graphWorld.xmax) return;

  const x = gx(params.phase, layout);

  withDash(p, [4, 7], () => {
    p.stroke(GHOST[0], GHOST[1], GHOST[2], 40);
    p.strokeWeight(1);
    p.line(x, graph.y, x, graph.y + graph.h);
  });

  p.noStroke();
  p.fill(GHOST[0], GHOST[1], GHOST[2], 105);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text('φ', x, graph.y + graph.h + 8);
}

function drawPeriodBracket(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  const { graph, graphWorld } = layout;
  const start = periodBracketStart(params, graphWorld);

  if (start < graphWorld.xmin || start + params.period > graphWorld.xmax) return;

  const x0 = gx(start, layout);
  const x1 = gx(start + params.period, layout);
  const y = graph.y + graph.h - 20;

  p.stroke(GHOST[0], GHOST[1], GHOST[2], 58);
  p.strokeWeight(1);
  p.line(x0, y, x1, y);
  p.line(x0, y - 5, x0, y + 5);
  p.line(x1, y - 5, x1, y + 5);

  p.noStroke();
  p.fill(GHOST[0], GHOST[1], GHOST[2], 115);
  p.textSize(11);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('週期 T', (x0 + x1) / 2, y - 6);
}

function drawParameterGuides(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  drawCenterLine(p, layout, params);
  drawAmplitudeBand(p, layout, params);
  drawPhaseLine(p, layout, params);
  drawPeriodBracket(p, layout, params);
}

function drawFunctionPath(p: p5, layout: SceneLayout, fn: (x: number) => number) {
  const { graphWorld } = layout;
  const steps = 720;

  p.beginShape();
  for (let i = 0; i <= steps; i += 1) {
    const x = graphWorld.xmin + ((graphWorld.xmax - graphWorld.xmin) * i) / steps;
    const y = fn(x);
    if (!Number.isFinite(y)) continue;
    p.vertex(gx(x, layout), gy(y, layout));
  }
  p.endShape();
}

function drawFunctionCurve(
  p: p5,
  layout: SceneLayout,
  fn: (x: number) => number,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
  glow = false,
) {
  if (glow) {
    p.noFill();
    p.stroke(color[0], color[1], color[2], 24);
    p.strokeWeight(8);
    drawFunctionPath(p, layout, fn);

    p.stroke(color[0], color[1], color[2], 58);
    p.strokeWeight(4);
    drawFunctionPath(p, layout, fn);
  }

  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  drawFunctionPath(p, layout, fn);
}

function drawPeakAndTrough(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  if (!hasAmplitude(params)) return;

  const peak = peakInfo(params, layout.graphWorld);
  const trough = troughInfo(params, layout.graphWorld);

  if (peak.visible) {
    const px = gx(peak.x, layout);
    const py = gy(peak.y, layout);

    p.noStroke();
    p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 70);
    p.circle(px, py, 24);
    p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 235);
    p.circle(px, py, 8);

    p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 150);
    p.textSize(11);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(`波峰 (${formatRad(peak.x)}, ${fmt(peak.y)})`, px + 10, py - 8);
  }

  if (trough.visible) {
    const tx = gx(trough.x, layout);
    const ty = gy(trough.y, layout);

    p.noStroke();
    p.fill(GHOST[0], GHOST[1], GHOST[2], 48);
    p.circle(tx, ty, 18);
    p.fill(GHOST[0], GHOST[1], GHOST[2], 118);
    p.circle(tx, ty, 6);
  }
}

function drawFormulaCaption(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  const { visual, graph } = layout;

  p.noStroke();
  p.fill(GHOST[0], GHOST[1], GHOST[2], 118);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(interpretationText(params), visual.x, graph.y + graph.h + 34, visual.w, 44);
}

function drawCompactStats(
  p: p5,
  layout: SceneLayout,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  if (!layout.compact) return;

  const { visual } = layout;
  const boxW = Math.min(visual.w, 392);

  p.noStroke();
  p.fill(10, 10, 10, 190);
  p.rect(visual.x, visual.y + 62, boxW, 78, 14);

  p.fill(GHOST[0], GHOST[1], GHOST[2], 155);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(
    `A=${fmt(params.amplitude)}  T=${formatRad(params.period)}  φ=${formatRad(params.phase)}  k=${fmt(params.verticalShift)}`,
    visual.x + 14,
    visual.y + 78,
    boxW - 28,
    20,
  );
  p.text(formatPeakText(params, layout.graphWorld), visual.x + 14, visual.y + 106);
}

export function renderSinusoidAmplitudePeriodPhaseScene(
  p: p5,
  params: SinusoidAmplitudePeriodPhaseParams,
) {
  const layout = layoutScene(p.width, p.height);

  p.background(BG[0], BG[1], BG[2]);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  drawTitle(p, layout);
  drawGraphFrame(p, layout);
  if (params.showGuides) drawParameterGuides(p, layout, params);

  withGraphClip(p, layout.graph, () => {
    if (params.showGhost) {
      drawFunctionCurve(p, layout, baseSin, GHOST, 34, 1.2);
    }
    drawFunctionCurve(p, layout, (x) => transformedSin(x, params), ACCENT, 235, 2.2, true);
    drawPeakAndTrough(p, layout, params);
  });

  drawFormulaCaption(p, layout, params);
  drawCompactStats(p, layout, params);
}
