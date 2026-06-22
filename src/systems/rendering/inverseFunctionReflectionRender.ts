import type p5 from 'p5';
import {
  buildCaption,
  computeWorkPlotRect,
  niceYStep,
  quadraticHorizontalHits,
  sampleXs,
  worldToScreen,
  type PlotRect,
  type InverseFunctionReflectionParams,
  type InverseSceneCache,
  type ViewSmoothState,
} from '../../curve/modules/inverse-function-reflection/geometry';
import { PLOT_X_MAX, PLOT_X_MIN } from '../../curve/modules/inverse-function-reflection/constants';

type InverseFunctionReflectionSnap = {
  size: number;
  params: InverseFunctionReflectionParams;
  scene: InverseSceneCache;
  smooth: ViewSmoothState;
};

const GOLD: [number, number, number] = [212, 184, 122];
const MUTED: [number, number, number] = [136, 136, 136];

function withPlotClip(p: p5, plot: PlotRect, draw: () => void) {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(plot.x, plot.y, plot.w, plot.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

function drawDashed(p: p5, draw: () => void) {
  p.push();
  p.drawingContext.save();
  p.drawingContext.setLineDash([4, 6]);
  draw();
  p.drawingContext.restore();
  p.pop();
}

function drawGridAndAxes(p: p5, plot: PlotRect, viewHalfY: number) {
  p.noFill();
  p.strokeWeight(1);
  p.stroke(255, 255, 255, 8);

  for (let x = PLOT_X_MIN; x <= PLOT_X_MAX; x += 1) {
    const sx = worldToScreen(plot, viewHalfY, x, 0).x;
    p.line(sx, plot.y, sx, plot.y + plot.h);
  }

  const yStep = niceYStep(viewHalfY);
  for (let y = -viewHalfY; y <= viewHalfY + 0.001; y += yStep) {
    const sy = worldToScreen(plot, viewHalfY, 0, y).y;
    p.line(plot.x, sy, plot.x + plot.w, sy);
  }

  p.stroke(255, 255, 255, 30);
  const origin = worldToScreen(plot, viewHalfY, 0, 0);
  p.line(plot.x, origin.y, plot.x + plot.w, origin.y);
  p.line(origin.x, plot.y, origin.x, plot.y + plot.h);
}

function drawSegmentedPolyline(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
) {
  let inShape = false;

  for (const pt of points) {
    if (!Number.isFinite(pt.y) || !Number.isFinite(pt.x)) {
      if (inShape) {
        p.endShape();
        inShape = false;
      }
      continue;
    }

    const s = worldToScreen(plot, viewHalfY, pt.x, pt.y);
    if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) {
      if (inShape) {
        p.endShape();
        inShape = false;
      }
      continue;
    }

    if (!inShape) {
      p.beginShape();
      inShape = true;
    }
    p.vertex(s.x, s.y);
  }

  if (inShape) p.endShape();
}

function drawMirrorLine(p: p5, plot: PlotRect, viewHalfY: number) {
  const points = sampleXs(PLOT_X_MIN, PLOT_X_MAX, 0.04).map((x) => ({ x, y: x }));

  drawDashed(p, () => {
    p.noFill();
    p.stroke(255, 255, 255, 28);
    p.strokeWeight(1);
    drawSegmentedPolyline(p, plot, viewHalfY, points);
  });

  const label = worldToScreen(plot, viewHalfY, 3.35, 3.35);
  p.noStroke();
  p.fill(...MUTED, 165);
  p.textSize(11);
  p.text('y=x', label.x + 8, label.y - 8);
}

function drawOriginalCurve(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
) {
  const layers = [
    { w: 8, a: 15 },
    { w: 4, a: 42 },
    { w: 1.65, a: 235 },
  ];

  p.noFill();
  for (const layer of layers) {
    p.stroke(...GOLD, layer.a);
    p.strokeWeight(layer.w);
    drawSegmentedPolyline(p, plot, viewHalfY, points);
  }
}

function drawReflectedCurve(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
  passHlt: boolean,
) {
  const layers = passHlt
    ? [
        { w: 5, a: 18 },
        { w: 1.25, a: 92 },
      ]
    : [
        { w: 4, a: 12 },
        { w: 1.1, a: 48 },
      ];

  p.noFill();
  for (const layer of layers) {
    p.stroke(...GOLD, layer.a);
    p.strokeWeight(layer.w);
    drawSegmentedPolyline(p, plot, viewHalfY, points);
  }
}

function drawGlowPoint(p: p5, x: number, y: number, r: number, alpha: number) {
  p.noStroke();
  p.fill(...GOLD, 30);
  p.circle(x, y, r * 5.0);
  p.fill(...GOLD, 85);
  p.circle(x, y, r * 2.35);
  p.fill(...GOLD, alpha);
  p.circle(x, y, r * 1.2);
}

function drawPointGuides(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: InverseSceneCache['meta'],
) {
  const pScreen = worldToScreen(plot, viewHalfY, meta.p.x, meta.p.y);
  const pm = worldToScreen(plot, viewHalfY, meta.pMirror.x, meta.pMirror.y);
  const mid = worldToScreen(
    plot,
    viewHalfY,
    (meta.p.x + meta.pMirror.x) / 2,
    (meta.p.y + meta.pMirror.y) / 2,
  );

  drawDashed(p, () => {
    p.stroke(255, 255, 255, 16);
    p.strokeWeight(1);
    p.line(pScreen.x, pScreen.y, pm.x, pm.y);

    const pxAxis = worldToScreen(plot, viewHalfY, meta.p.x, 0);
    const pyAxis = worldToScreen(plot, viewHalfY, 0, meta.p.y);
    p.line(pScreen.x, pScreen.y, pxAxis.x, pxAxis.y);
    p.line(pScreen.x, pScreen.y, pyAxis.x, pyAxis.y);
  });

  p.noStroke();
  p.fill(...MUTED, 155);
  p.textSize(10);
  p.text('swap', mid.x + 8, mid.y - 8);
}

function drawHorizontalLineTest(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: InverseSceneCache['meta'],
) {
  const y = meta.p.y;
  const s0 = worldToScreen(plot, viewHalfY, PLOT_X_MIN, y);
  const s1 = worldToScreen(plot, viewHalfY, PLOT_X_MAX, y);

  drawDashed(p, () => {
    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);
    p.line(s0.x, s0.y, s1.x, s1.y);
  });

  const hits = quadraticHorizontalHits(y);
  for (const x of hits) {
    if (x < PLOT_X_MIN || x > PLOT_X_MAX) continue;
    const s = worldToScreen(plot, viewHalfY, x, y);
    drawGlowPoint(p, s.x, s.y, 3.6, 150);
  }

  p.noStroke();
  p.fill(...MUTED, 170);
  p.textSize(10);
  p.text(`水平線交 ${hits.length} 點`, s0.x + 10, s0.y - 8);
}

function drawMirrorPoints(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: InverseSceneCache['meta'],
) {
  const pScreen = worldToScreen(plot, viewHalfY, meta.p.x, meta.p.y);
  const pm = worldToScreen(plot, viewHalfY, meta.pMirror.x, meta.pMirror.y);

  drawGlowPoint(p, pScreen.x, pScreen.y, 5.8, 230);
  drawGlowPoint(p, pm.x, pm.y, 5.2, meta.passHlt ? 205 : 135);

  p.noFill();
  p.stroke(...GOLD, 65);
  p.strokeWeight(1);
  p.circle(pScreen.x, pScreen.y, 17);

  p.stroke(255, 255, 255, meta.passHlt ? 32 : 18);
  p.circle(pm.x, pm.y, 15);

  p.noStroke();
  p.fill(...GOLD, 225);
  p.textSize(11);
  p.text('P', pScreen.x + 9, pScreen.y - 9);

  p.fill(...MUTED, meta.passHlt ? 190 : 145);
  p.text('P′', pm.x + 9, pm.y - 9);
}

function drawCaption(p: p5, size: number, text: string) {
  p.noStroke();
  p.fill(...MUTED, 175);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(text, size / 2, size - 12);
  p.textAlign(p.LEFT, p.BASELINE);
}

export function renderInverseFunctionReflectionScene(
  p: p5,
  snap: InverseFunctionReflectionSnap,
): number {
  const plot = computeWorkPlotRect(snap.size);
  const { meta, original, reflected, targetViewHalfY } = snap.scene;
  const viewHalfY = snap.smooth.viewHalfY;

  p.background(10, 10, 10);

  withPlotClip(p, plot, () => {
    drawGridAndAxes(p, plot, viewHalfY);
    drawMirrorLine(p, plot, viewHalfY);
    drawReflectedCurve(p, plot, viewHalfY, reflected, meta.passHlt);
    drawOriginalCurve(p, plot, viewHalfY, original);

    if (snap.params.advanced) {
      drawPointGuides(p, plot, viewHalfY, meta);
    }

    if (!meta.passHlt) {
      drawHorizontalLineTest(p, plot, viewHalfY, meta);
    }

    drawMirrorPoints(p, plot, viewHalfY, meta);
  });

  drawCaption(p, snap.size, buildCaption(meta));

  return targetViewHalfY;
}
