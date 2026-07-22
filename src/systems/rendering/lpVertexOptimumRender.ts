import type p5 from 'p5';
import {
  AXIS_HALF,
  computeVertexOptimumMetrics,
  objectiveOf,
  type LpVertexOptimumParams,
} from '../../curve/modules/lp-vertex-optimum/geometry';
import {
  SCENE_MIN,
  clipLineToBox,
  formatObjective,
  formatPoint,
} from '../../curve/linearProgramming';
import {
  LP_ACCENT,
  LP_BG,
  LP_GUIDE,
  LP_OBJECTIVE,
  LP_REGION,
  createLpLayout,
  drawConstraintLine,
  drawGrid,
  drawRegion,
  drawSceneLabel,
  drawVertexDot,
  setDash,
  toScreen,
  withSceneClip,
} from './lpScene';
import { drawReadout } from './readout';

type Snapshot = {
  width: number;
  height: number;
  params: LpVertexOptimumParams;
};

export function renderLpVertexOptimumScene(p: p5, snap: Snapshot): void {
  const { width, height, params } = snap;
  const metrics = computeVertexOptimumMetrics(params);
  const layout = createLpLayout(width, height, AXIS_HALF);
  const { p: coefP, q: coefQ } = objectiveOf(params);

  p.background(LP_BG[0], LP_BG[1], LP_BG[2]);
  drawGrid(p, layout);

  withSceneClip(p, layout, () => {
    drawRegion(p, layout, metrics.polygon, LP_REGION, { fillAlpha: 30, strokeAlpha: 120 });

    for (const con of metrics.constraints) {
      drawConstraintLine(p, layout, con, LP_GUIDE, { alpha: 70, weight: 1.5 });
    }

    /**
     * 掃描線畫在「目前正在看的那個頂點」上：走訪中就是被高亮的候選，
     * 否則就是最優那一個。等值線通過該點，讀者才看得出比較的是什麼。
     */
    const focus =
      metrics.visitingIndex !== null
        ? metrics.candidates[metrics.visitingIndex]
        : metrics.candidates.find((candidate) => candidate.optimal);

    if (focus) {
      const line = clipLineToBox(coefP, coefQ, focus.value, SCENE_MIN, AXIS_HALF);
      if (line) {
        const from = toScreen(layout, line[0]);
        const to = toScreen(layout, line[1]);
        p.push();
        p.stroke(LP_ACCENT[0], LP_ACCENT[1], LP_ACCENT[2], 200);
        p.strokeWeight(2.2);
        setDash(p, metrics.visitingIndex !== null ? [6, 6] : []);
        p.line(from.x, from.y, to.x, to.y);
        setDash(p, []);
        p.pop();
      }
    }
  });

  for (const [index, candidate] of metrics.candidates.entries()) {
    const visiting = metrics.visitingIndex === index;
    const color = candidate.optimal ? LP_ACCENT : LP_OBJECTIVE;
    drawVertexDot(p, layout, candidate.point, visiting ? LP_GUIDE : color, {
      radius: candidate.optimal || visiting ? 6 : 4,
      halo: visiting || candidate.optimal,
    });
    drawSceneLabel(
      p,
      layout,
      candidate.point,
      `${formatPoint(candidate.point, 1)}　z = ${candidate.value.toFixed(2)}`,
      visiting ? LP_GUIDE : color,
      visiting || candidate.optimal ? 235 : 130,
    );
  }

  const senseLabel = params.sense === 'max' ? '最大值' : '最小值';
  const lines = [
    formatObjective(coefP, coefQ, 2),
    metrics.best === null
      ? `${senseLabel}不存在`
      : `${senseLabel} z = ${metrics.best.toFixed(3)}`,
    metrics.tiedCount > 1
      ? `並列最優 ${metrics.tiedCount} 個頂點：整段邊都是最優`
      : `候選頂點 ${metrics.candidates.length} 個`,
  ];
  if (metrics.visitingIndex !== null) {
    lines.push(`正在檢查第 ${metrics.visitingIndex + 1} 列`);
  }

  drawReadout(p, width, lines, { highlightIndex: 1, highlightColor: LP_ACCENT });
}
