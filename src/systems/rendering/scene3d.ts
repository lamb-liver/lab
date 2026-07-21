import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { project, vec3, type Projected, type Vec3, type ViewAngles } from '../../curve/projection3d';

/**
 * 空間向量系列共用的 3D 場景繪製骨架。
 *
 * 站內 renderer 一般各自獨立，但這一組五個頁面共用同一條投影管線
 * （p5 2D + `curve/projection3d` 的正交投影），座標換算與箭頭、標籤、坐標軸
 * 都是逐字相同的，所以集中在這裡。各作品仍自己決定畫什麼、怎麼配色。
 */

export type Point2 = { x: number; y: number };
export type Scene3dLayout = { cx: number; cy: number; scale: number };

export type Rgb = [number, number, number];

export const SCENE_GUIDE: Rgb = [255, 255, 255];

type LayoutOptions = {
  /** 畫布短邊除以此值得到世界單位長度；數字越大場景越小 */
  scaleDivisor?: number;
  /** 中心往下偏移的比例，用來替頂部讀數留白 */
  verticalOffset?: number;
};

export function createScene3dLayout(
  width: number,
  height: number,
  { scaleDivisor = 9, verticalOffset = 0 }: LayoutOptions = {},
): Scene3dLayout {
  const size = Math.min(width, height);
  return {
    cx: width / 2,
    cy: height / 2 + size * verticalOffset,
    scale: size / scaleDivisor,
  };
}

/** 投影座標的 y 軸向上；canvas 由上而下，所以要翻轉 */
export function toScreen(layout: Scene3dLayout, point: Projected): Point2 {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

/** 呼叫端先算好 `view` 再傳進來，避免每個點都重算一次角度轉換 */
export function screenOf(layout: Scene3dLayout, v: Vec3, view: ViewAngles): Point2 {
  return toScreen(layout, project(v, view));
}

export function setDash(p: p5, pattern: number[]): void {
  canvas2d(p).setLineDash(pattern);
}

export function drawArrow(
  p: p5,
  from: Point2,
  to: Point2,
  color: Rgb,
  weight: number,
  alpha = 255,
): void {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return;

  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.line(from.x, from.y, to.x, to.y);

  const head = Math.min(14, len * 0.3);
  const ux = dx / len;
  const uy = dy / len;
  const baseX = to.x - ux * head;
  const baseY = to.y - uy * head;
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.triangle(
    to.x,
    to.y,
    baseX - uy * head * 0.42,
    baseY + ux * head * 0.42,
    baseX + uy * head * 0.42,
    baseY - ux * head * 0.42,
  );
  p.pop();
}

export function drawLabel(
  p: p5,
  at: Point2,
  text: string,
  color: Rgb,
  alpha = 230,
): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(text, at.x + 9, at.y - 9);
  p.pop();
}

/** 三條世界座標軸，提供旋轉時的方位參考 */
export function drawAxes(
  p: p5,
  layout: Scene3dLayout,
  view: ViewAngles,
  length: number,
): void {
  const origin = screenOf(layout, vec3(0, 0, 0), view);
  const axes: Array<{ end: Vec3; label: string }> = [
    { end: vec3(length, 0, 0), label: 'x' },
    { end: vec3(0, length, 0), label: 'y' },
    { end: vec3(0, 0, length), label: 'z' },
  ];

  p.push();
  setDash(p, [4, 6]);
  for (const axis of axes) {
    const end = screenOf(layout, axis.end, view);
    p.stroke(SCENE_GUIDE[0], SCENE_GUIDE[1], SCENE_GUIDE[2], 48);
    p.strokeWeight(1.35);
    p.line(origin.x, origin.y, end.x, end.y);
    drawLabel(p, end, axis.label, SCENE_GUIDE, 74);
  }
  setDash(p, []);
  p.pop();
}

/** 左上角的讀數區；`highlightIndex` 那一行改用強調色 */
export function drawReadout(
  p: p5,
  width: number,
  lines: string[],
  options: { highlightIndex?: number; highlightColor?: Rgb } = {},
): void {
  const { highlightIndex = -1, highlightColor = SCENE_GUIDE } = options;
  p.push();
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  lines.forEach((line, index) => {
    const on = index === highlightIndex;
    const color = on ? highlightColor : SCENE_GUIDE;
    p.fill(color[0], color[1], color[2], on ? 235 : 150);
    p.text(line, 18, 16 + index * 20, width - 36);
  });
  p.pop();
}

/** 拖曳旋轉時的右下角提示 */
export function drawRotatingHint(p: p5, width: number, height: number): void {
  p.push();
  p.noStroke();
  p.fill(SCENE_GUIDE[0], SCENE_GUIDE[1], SCENE_GUIDE[2], 110);
  p.textSize(13);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text('拖動中：旋轉視角', width - 18, height - 16);
  p.pop();
}
