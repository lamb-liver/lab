import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { SCENE_MIN, clipLineToBox, type Constraint, type Vec2 } from '../../curve/linearProgramming';

/**
 * 線性規劃系列共用的平面繪製骨架。
 *
 * 四個頁面（三件 works + explore）畫的是同一張圖：座標框、幾條約束線、
 * 被切掉的半平面、以及可行域這塊凸多邊形。座標換算與這些元件逐字相同，
 * 所以集中在這裡；各頁仍自己決定強調什麼、疊上什麼。
 */

export type Point2 = { x: number; y: number };
export type LpLayout = { cx: number; cy: number; scale: number; half: number };
export type Rgb = [number, number, number];

export const LP_BG: Rgb = [10, 10, 10];
export const LP_GUIDE: Rgb = [255, 255, 255];
export const LP_ACCENT: Rgb = [212, 184, 122];
export const LP_REGION: Rgb = [164, 225, 176];
export const LP_OBJECTIVE: Rgb = [160, 205, 255];
export const LP_MUTED: Rgb = [255, 187, 122];

/**
 * 場景把世界座標的 [SCENE_MIN, half] 放進畫布。
 *
 * 原點不置中：非負限制讓可行域都落在第一象限，置中會浪費四分之三的畫面。
 */
export function createLpLayout(width: number, height: number, half: number): LpLayout {
  const margin = width < 420 ? 34 : 46;
  const usable = Math.min(width, height) - margin * 2;
  const span = half - SCENE_MIN;
  const scale = usable / span;

  /**
   * 場景是正方形，但 explore 的畫布比 works 寬。靠左貼齊會在右側留下一大塊空白，
   * 所以水平置中；垂直仍貼底，讓第一象限往上長。
   */
  const left = (width - usable) / 2;
  return {
    cx: left - SCENE_MIN * scale,
    cy: height - margin + SCENE_MIN * scale,
    scale,
    half,
  };
}

export function toScreen(layout: LpLayout, point: Vec2): Point2 {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

export function toWorld(layout: LpLayout, point: Point2): Vec2 {
  return { x: (point.x - layout.cx) / layout.scale, y: (layout.cy - point.y) / layout.scale };
}

export function setDash(p: p5, pattern: number[]): void {
  canvas2d(p).setLineDash(pattern);
}

/** 把繪製限制在座標框內，半平面遮罩才不會蓋滿整張畫布 */
export function withSceneClip(p: p5, layout: LpLayout, draw: () => void): void {
  const ctx = canvas2d(p);
  const topLeft = toScreen(layout, { x: SCENE_MIN, y: layout.half });
  const size = (layout.half - SCENE_MIN) * layout.scale;

  p.push();
  ctx.save();
  ctx.beginPath();
  ctx.rect(topLeft.x, topLeft.y, size, size);
  ctx.clip();
  draw();
  ctx.restore();
  p.pop();
}

export function drawGrid(p: p5, layout: LpLayout, step = 2): void {
  p.push();
  p.strokeWeight(1);

  for (let value = 0; value <= layout.half; value += step) {
    if (value === 0) continue;
    p.stroke(LP_GUIDE[0], LP_GUIDE[1], LP_GUIDE[2], 10);
    const vertical = toScreen(layout, { x: value, y: SCENE_MIN });
    const verticalTop = toScreen(layout, { x: value, y: layout.half });
    p.line(vertical.x, vertical.y, verticalTop.x, verticalTop.y);

    const horizontal = toScreen(layout, { x: SCENE_MIN, y: value });
    const horizontalRight = toScreen(layout, { x: layout.half, y: value });
    p.line(horizontal.x, horizontal.y, horizontalRight.x, horizontalRight.y);
  }

  p.stroke(LP_GUIDE[0], LP_GUIDE[1], LP_GUIDE[2], 46);
  p.strokeWeight(1.3);
  const originLeft = toScreen(layout, { x: SCENE_MIN, y: 0 });
  const originRight = toScreen(layout, { x: layout.half, y: 0 });
  p.line(originLeft.x, originLeft.y, originRight.x, originRight.y);
  const originBottom = toScreen(layout, { x: 0, y: SCENE_MIN });
  const originTop = toScreen(layout, { x: 0, y: layout.half });
  p.line(originBottom.x, originBottom.y, originTop.x, originTop.y);

  /**
   * 軸標記放在軸長的 85% 而不是端點：左上角是讀數區（drawReadout 直接畫在場景上），
   * y 軸的頂端正好被文字蓋住。
   */
  const xLabel = toScreen(layout, { x: layout.half * 0.85, y: 0 });
  const yLabel = toScreen(layout, { x: 0, y: layout.half * 0.85 });
  p.noStroke();
  p.fill(LP_GUIDE[0], LP_GUIDE[1], LP_GUIDE[2], 74);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text('x', xLabel.x, xLabel.y + 8);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('y', yLabel.x + 8, yLabel.y);
  p.pop();
}

/** 一條約束線；`dashed` 用來標示不參與圍出邊界的約束 */
export function drawConstraintLine(
  p: p5,
  layout: LpLayout,
  con: Constraint,
  color: Rgb,
  options: { alpha?: number; weight?: number; dashed?: boolean } = {},
): void {
  const { alpha = 190, weight = 2, dashed = false } = options;
  const segment = clipLineToBox(con.a, con.b, con.c, SCENE_MIN, layout.half);
  if (!segment) return;

  const from = toScreen(layout, segment[0]);
  const to = toScreen(layout, segment[1]);

  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.strokeCap(p.ROUND);
  setDash(p, dashed ? [6, 7] : []);
  p.line(from.x, from.y, to.x, to.y);
  setDash(p, []);
  p.pop();
}

/**
 * 約束切掉的那一側（a·x + b·y > c）鋪上低透明遮罩。
 *
 * 做法是從線段往法向推出一塊夠大的四邊形，再靠 withSceneClip 切回框內；
 * 「夠大」取框的對角線長，任何方向都蓋得滿。
 */
export function drawExcludedSide(
  p: p5,
  layout: LpLayout,
  con: Constraint,
  color: Rgb,
  alpha = 26,
): void {
  const segment = clipLineToBox(con.a, con.b, con.c, SCENE_MIN, layout.half);
  if (!segment) return;

  const norm = Math.hypot(con.a, con.b);
  if (norm < 1e-9) return;
  const reach = (layout.half - SCENE_MIN) * 2 * Math.SQRT2;
  const push = { x: (con.a / norm) * reach, y: (con.b / norm) * reach };

  const a = toScreen(layout, segment[0]);
  const b = toScreen(layout, segment[1]);
  const c = toScreen(layout, { x: segment[1].x + push.x, y: segment[1].y + push.y });
  const d = toScreen(layout, { x: segment[0].x + push.x, y: segment[0].y + push.y });

  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.quad(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
  p.pop();
}

export function drawRegion(
  p: p5,
  layout: LpLayout,
  vertices: Vec2[],
  color: Rgb,
  options: { fillAlpha?: number; strokeAlpha?: number } = {},
): void {
  if (vertices.length < 3) return;
  const { fillAlpha = 34, strokeAlpha = 140 } = options;

  p.push();
  p.fill(color[0], color[1], color[2], fillAlpha);
  p.stroke(color[0], color[1], color[2], strokeAlpha);
  p.strokeWeight(1.8);
  p.beginShape();
  for (const vertex of vertices) {
    const point = toScreen(layout, vertex);
    p.vertex(point.x, point.y);
  }
  p.endShape(p.CLOSE);
  p.pop();
}

export function drawVertexDot(
  p: p5,
  layout: LpLayout,
  vertex: Vec2,
  color: Rgb,
  options: { radius?: number; alpha?: number; halo?: boolean } = {},
): void {
  const { radius = 5, alpha = 235, halo = false } = options;
  const point = toScreen(layout, vertex);

  p.push();
  p.noStroke();
  if (halo) {
    p.fill(color[0], color[1], color[2], 52);
    p.circle(point.x, point.y, radius * 4);
  }
  p.fill(color[0], color[1], color[2], alpha);
  p.circle(point.x, point.y, radius * 2);
  p.pop();
}

export function drawSceneLabel(
  p: p5,
  layout: LpLayout,
  at: Vec2,
  text: string,
  color: Rgb,
  alpha = 220,
): void {
  const point = toScreen(layout, at);
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(text, point.x + 8, point.y - 10);
  p.pop();
}
