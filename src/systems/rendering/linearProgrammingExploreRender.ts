import type p5 from 'p5';
import {
  AXIS_HALF,
  computeLinearProgrammingMetrics,
  type LinearProgrammingParams,
} from '../../explore/linear-programming/geometry';
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
  LP_MUTED,
  LP_OBJECTIVE,
  LP_REGION,
  createLpLayout,
  drawConstraintLine,
  drawExcludedSide,
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
  params: LinearProgrammingParams;
};

/** 目標視角要畫出的掃描線：從最劣的角點掃到最優的角點 */
const SWEEP_COUNT = 5;

export function renderLinearProgrammingExploreScene(p: p5, snap: Snapshot): void {
  const { width, height, params } = snap;
  const metrics = computeLinearProgrammingMetrics(params);
  const layout = createLpLayout(width, height, AXIS_HALF);
  const { p: coefP, q: coefQ } = metrics.objective;

  p.background(LP_BG[0], LP_BG[1], LP_BG[2]);
  drawGrid(p, layout);

  withSceneClip(p, layout, () => {
    // 約束視角才鋪半平面遮罩：另外兩個視角要把注意力留給等值線與角點
    if (params.mode === 'constraints') {
      /**
       * 遮罩要很淡：四條約束疊起來會累積，太亮時「被切掉的部分」反而比可行域顯眼，
       * 讀者會把亮的那塊當成答案。
       */
      for (const con of metrics.constraints) {
        drawExcludedSide(p, layout, con, LP_GUIDE, 9);
      }
    }

    drawRegion(p, layout, metrics.polygon, LP_REGION, {
      fillAlpha: params.mode === 'constraints' ? 58 : 26,
      strokeAlpha: params.mode === 'constraints' ? 160 : 100,
    });

    for (const [index, con] of metrics.constraints.entries()) {
      const redundant = metrics.redundant.includes(index);
      drawConstraintLine(p, layout, con, redundant ? LP_MUTED : LP_GUIDE, {
        alpha: params.mode === 'constraints' ? (redundant ? 150 : 150) : 60,
        weight: params.mode === 'constraints' ? 2 : 1.4,
        dashed: redundant,
      });
    }

    if (params.mode === 'objective' && metrics.values.length > 0 && metrics.best !== null) {
      /**
       * 掃描線從最劣的角點鋪到最優的角點，讀者看得到「往同一個方向平移」
       * 這件事，而不只是最後停在哪。
       */
      const worst = metrics.values[metrics.ranking.at(-1)!];
      for (let step = 0; step < SWEEP_COUNT; step += 1) {
        const t = step / (SWEEP_COUNT - 1);
        const k = worst + (metrics.best - worst) * t;
        const line = clipLineToBox(coefP, coefQ, k, SCENE_MIN, AXIS_HALF);
        if (!line) continue;

        const last = step === SWEEP_COUNT - 1;
        const from = toScreen(layout, line[0]);
        const to = toScreen(layout, line[1]);
        p.push();
        p.stroke(
          last ? LP_ACCENT[0] : LP_OBJECTIVE[0],
          last ? LP_ACCENT[1] : LP_OBJECTIVE[1],
          last ? LP_ACCENT[2] : LP_OBJECTIVE[2],
          last ? 235 : 60 + t * 60,
        );
        p.strokeWeight(last ? 2.6 : 1.4);
        setDash(p, last ? [] : [5, 7]);
        p.line(from.x, from.y, to.x, to.y);
        setDash(p, []);
        p.pop();
      }
    }
  });

  for (const [index, vertex] of metrics.vertices.entries()) {
    const optimal = metrics.optimal.includes(index);
    const rank = metrics.ranking.indexOf(index);

    drawVertexDot(p, layout, vertex, optimal ? LP_ACCENT : LP_OBJECTIVE, {
      radius: optimal ? 6 : 4,
      halo: optimal,
      alpha: params.mode === 'candidates' || optimal ? 235 : 150,
    });

    // 候選視角才逐點標出名次與 z，其餘視角只標最優那個，避免蓋滿畫面
    if (params.mode === 'candidates') {
      drawSceneLabel(
        p,
        layout,
        vertex,
        `${rank + 1}. ${formatPoint(vertex, 1)}　z = ${metrics.values[index].toFixed(2)}`,
        optimal ? LP_ACCENT : LP_OBJECTIVE,
        optimal ? 235 : 150,
      );
    } else if (optimal) {
      drawSceneLabel(
        p,
        layout,
        vertex,
        `${formatPoint(vertex, 1)}　z = ${metrics.values[index].toFixed(2)}`,
        LP_ACCENT,
      );
    }
  }

  const senseLabel = params.sense === 'max' ? '最大值' : '最小值';
  drawReadout(
    p,
    width,
    [
      formatObjective(coefP, coefQ, 2),
      metrics.empty
        ? '可行域為空'
        : metrics.unbounded
          ? `${senseLabel}不存在`
          : `${senseLabel} z = ${metrics.best!.toFixed(3)}`,
      metrics.redundant.length > 0
        ? `冗餘約束 ${metrics.redundant.length} 條（虛線）`
        : `角點 ${metrics.vertices.length} 個`,
    ],
    { highlightIndex: 1, highlightColor: LP_ACCENT },
  );
}
