import type p5 from 'p5';
import {
  AXIS_HALF,
  computeObjectiveMetrics,
  type LpObjectiveLevelCurvesParams,
} from '../../curve/modules/lp-objective-level-curves/geometry';
import { formatObjective, formatPoint } from '../../curve/linearProgramming';
import {
  LP_ACCENT,
  LP_BG,
  LP_GUIDE,
  LP_OBJECTIVE,
  createLpLayout,
  drawGrid,
  drawSceneLabel,
  drawVertexDot,
  setDash,
  toScreen,
  withSceneClip,
  type LpLayout,
} from './lpScene';
import { drawReadout } from './readout';

type Snapshot = {
  width: number;
  height: number;
  params: LpObjectiveLevelCurvesParams;
  draggingTestPoint: boolean;
};

function drawSegment(
  p: p5,
  layout: LpLayout,
  segment: [{ x: number; y: number }, { x: number; y: number }],
  color: [number, number, number],
  alpha: number,
  weight: number,
  dashed = false,
): void {
  const from = toScreen(layout, segment[0]);
  const to = toScreen(layout, segment[1]);
  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.strokeCap(p.ROUND);
  setDash(p, dashed ? [5, 7] : []);
  p.line(from.x, from.y, to.x, to.y);
  setDash(p, []);
  p.pop();
}

/**
 * 標籤一律掛在線段較低的那一端。
 *
 * 裁切回傳的端點順序取決於線先碰到方框的哪一邊，跟畫面上下無關；
 * 直接用 segment[1] 會讓陡線的標籤跑到左上角，正好壓在讀數上。
 */
function lowerEnd(segment: [{ x: number; y: number }, { x: number; y: number }]) {
  return segment[0].y <= segment[1].y ? segment[0] : segment[1];
}

export function renderLpObjectiveLevelCurvesScene(p: p5, snap: Snapshot): void {
  const { width, height, params } = snap;
  const metrics = computeObjectiveMetrics(params);
  const layout = createLpLayout(width, height, AXIS_HALF);

  p.background(LP_BG[0], LP_BG[1], LP_BG[2]);
  drawGrid(p, layout);

  withSceneClip(p, layout, () => {
    for (const line of metrics.family) {
      drawSegment(p, layout, line.segment, LP_OBJECTIVE, 70, 1.4, true);
      drawSceneLabel(p, layout, lowerEnd(line.segment), `k = ${line.k.toFixed(0)}`, LP_OBJECTIVE, 100);
    }

    if (metrics.current) {
      drawSegment(p, layout, metrics.current, LP_ACCENT, 235, 2.8);
      drawSceneLabel(
        p,
        layout,
        lowerEnd(metrics.current),
        `k = ${params.k.toFixed(1)}`,
        LP_ACCENT,
        235,
      );
    }

    /**
     * 法向箭頭從原點畫出，長度按 ‖n‖ 縮到場景尺度的一半，
     * 係數大時才不會衝出畫面；方向才是這裡要傳達的事。
     */
    if (!metrics.degenerate) {
      const unit = {
        x: metrics.normal.x / metrics.normalLength,
        y: metrics.normal.y / metrics.normalLength,
      };
      const tip = { x: unit.x * AXIS_HALF * 0.42, y: unit.y * AXIS_HALF * 0.42 };
      const origin = toScreen(layout, { x: 0, y: 0 });
      const end = toScreen(layout, tip);

      p.push();
      p.stroke(LP_GUIDE[0], LP_GUIDE[1], LP_GUIDE[2], 170);
      p.strokeWeight(2);
      p.line(origin.x, origin.y, end.x, end.y);
      const angle = Math.atan2(end.y - origin.y, end.x - origin.x);
      p.noStroke();
      p.fill(LP_GUIDE[0], LP_GUIDE[1], LP_GUIDE[2], 170);
      p.triangle(
        end.x,
        end.y,
        end.x - Math.cos(angle - 0.6) * 12,
        end.y - Math.sin(angle - 0.6) * 12,
        end.x - Math.cos(angle + 0.6) * 12,
        end.y - Math.sin(angle + 0.6) * 12,
      );
      p.pop();

      drawSceneLabel(p, layout, tip, 'n = (p, q)', LP_GUIDE, 190);
    }
  });

  drawVertexDot(p, layout, metrics.testPoint, LP_OBJECTIVE, {
    radius: 6,
    halo: snap.draggingTestPoint,
  });
  drawSceneLabel(
    p,
    layout,
    metrics.testPoint,
    `${formatPoint(metrics.testPoint, 1)}　z = ${metrics.testValue.toFixed(2)}`,
    LP_OBJECTIVE,
  );

  drawReadout(
    p,
    width,
    [
      formatObjective(params.p, params.q),
      metrics.degenerate ? '係數皆為零，整個平面同一個 z' : `目前等值線 k = ${params.k.toFixed(2)}`,
      metrics.degenerate ? '' : `相鄰間距 = Δk / ‖n‖ = ${metrics.spacing.toFixed(3)}`,
      `測試點 z = ${metrics.testValue.toFixed(2)}`,
    ].filter((line) => line.length > 0),
    { highlightIndex: 0, highlightColor: LP_ACCENT },
  );
}
