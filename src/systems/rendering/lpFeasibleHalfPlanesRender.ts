import type p5 from 'p5';
import {
  ADJUSTABLE_OFFSET,
  AXIS_HALF,
  computeHalfPlanesMetrics,
  type LpFeasibleHalfPlanesParams,
} from '../../curve/modules/lp-feasible-half-planes/geometry';
import { SCENE_MIN, formatPoint, visibleRegionPolygon } from '../../curve/linearProgramming';
import {
  LP_ACCENT,
  LP_BG,
  LP_GUIDE,
  LP_MUTED,
  LP_REGION,
  createLpLayout,
  drawConstraintLine,
  drawExcludedSide,
  drawGrid,
  drawRegion,
  drawSceneLabel,
  drawVertexDot,
  withSceneClip,
} from './lpScene';
import { drawReadout } from './readout';

type Snapshot = {
  width: number;
  height: number;
  params: LpFeasibleHalfPlanesParams;
};

export function renderLpFeasibleHalfPlanesScene(p: p5, snap: Snapshot): void {
  const { width, height, params } = snap;
  const metrics = computeHalfPlanesMetrics(params);
  const layout = createLpLayout(width, height, AXIS_HALF);
  const selectedIndex = ADJUSTABLE_OFFSET + params.selected;

  p.background(LP_BG[0], LP_BG[1], LP_BG[2]);
  drawGrid(p, layout);

  withSceneClip(p, layout, () => {
    if (params.view === 'mask') {
      // 每條約束各鋪一層；重疊處自然變深，被切掉越多次的地方越暗
      for (const [index, con] of metrics.constraints.entries()) {
        const selected = index === selectedIndex;
        drawExcludedSide(p, layout, con, selected ? LP_ACCENT : LP_GUIDE, selected ? 40 : 22);
      }
    }

    // 用裁切後的多邊形而非角點：無界時角點不足三個，但區域在畫面上看得見
    drawRegion(p, layout, visibleRegionPolygon(metrics.constraints, SCENE_MIN, AXIS_HALF), LP_REGION, {
      fillAlpha: params.view === 'mask' ? 20 : 40,
    });

    for (const [index, con] of metrics.constraints.entries()) {
      const selected = index === selectedIndex;
      const redundant = metrics.redundant.includes(index);
      const fixed = index < ADJUSTABLE_OFFSET;

      drawConstraintLine(p, layout, con, selected ? LP_ACCENT : redundant ? LP_MUTED : LP_GUIDE, {
        alpha: selected ? 235 : redundant ? 150 : fixed ? 60 : 130,
        weight: selected ? 2.8 : 1.8,
        dashed: redundant,
      });
    }
  });

  for (const vertex of metrics.region.vertices) {
    drawVertexDot(p, layout, vertex.point, LP_REGION, { radius: 4, alpha: 210 });
  }

  /**
   * 冗餘約束要標出來，否則虛線只是一個沒有說明的視覺差異。
   *
   * 位置沿線段取不同比例，不能用中點：多條約束同時通過原點時（「無界」預設就是），
   * 對稱方框裁出的線段中點全都落在原點，字會疊成一團。
   */
  for (const [order, index] of metrics.redundant.entries()) {
    const con = metrics.constraints[index];
    const segment = metrics.segments[index];
    if (!segment) continue;
    const t = 0.62 + order * 0.09;
    const at = {
      x: segment[0].x + (segment[1].x - segment[0].x) * t,
      y: segment[0].y + (segment[1].y - segment[0].y) * t,
    };
    drawSceneLabel(p, layout, at, `${con.label}（冗餘）`, LP_MUTED, 190);
  }

  const lines = [
    `可行域：${metrics.status}`,
    metrics.region.bounded && !metrics.region.empty
      ? `角點 ${metrics.region.vertices.length} 個，面積 ${metrics.area.toFixed(2)}`
      : '角點不足以描述整個區域',
    metrics.redundant.length > 0
      ? `冗餘約束：${metrics.redundant.map((i) => metrics.constraints[i].label).join('、')}`
      : '沒有冗餘約束',
  ];
  if (metrics.region.vertices.length > 0 && metrics.region.bounded) {
    lines.push(
      `角點 ${metrics.region.vertices.map((v) => formatPoint(v.point, 1)).join(' ')}`,
    );
  }

  drawReadout(p, width, lines, { highlightIndex: 0, highlightColor: LP_ACCENT });
}
