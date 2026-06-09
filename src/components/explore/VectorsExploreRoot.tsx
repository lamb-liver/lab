import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  GUIDE_BASIS,
  getVectorGuideState,
  projectOnto,
  solveBasisCoordinates,
  type Vec2,
  type VectorGuideRole,
} from '../../explore/vectors/geometry';
import '../../styles/components/explore/vectors-explore.css';

type Mode = 'guide' | 'dot' | 'span' | 'normal';

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Params = {
  mode: Mode;
  guideRole: VectorGuideRole;
  guideP: Vec2;
  guideU: Vec2;
  unitCircle: boolean;
  u: Vec2;
  v: Vec2;
  a: Vec2;
  b: Vec2;
  s: number;
  t: number;
  n: Vec2;
  c: number;
};

type DragHandle = {
  type: 'vector' | 'unit';
  id: 'guideP' | 'guideU' | 'u' | 'v' | 'a' | 'b' | 'n';
  x: number;
  y: number;
  r: number;
  plot: Rect;
  scale: number;
};

type P5WithRenderer = p5 & { _renderer?: unknown };

const GOLD = [212, 184, 122] as const;
const CYAN = [126, 210, 203] as const;
const WHITE = [255, 255, 255] as const;
const TEXT = [232, 232, 232] as const;
const MUTED = [140, 140, 140] as const;

const DEFAULT_PARAMS: Params = {
  mode: 'guide',
  guideRole: 'position',
  guideP: { x: 1.8, y: 1.1 },
  guideU: { x: -0.8, y: 2.2 },
  unitCircle: false,
  u: { x: 2.6, y: 1.3 },
  v: { x: 1.2, y: 2.4 },
  a: { x: 2.2, y: 0.8 },
  b: { x: -0.7, y: 2.1 },
  s: 1.1,
  t: 0.8,
  n: { x: 1.8, y: 1.1 },
  c: 2.4,
};

const MODE_OPTIONS: Array<{ id: Mode; label: string; sidebarTitle: string }> = [
  { id: 'guide', label: '導覽', sidebarTitle: '位置、方向與座標' },
  { id: 'dot', label: '方向 / 投影', sidebarTitle: '方向分量與投影' },
  { id: 'span', label: '座標 / 基底', sidebarTitle: '座標讀數與基底' },
  { id: 'normal', label: '法向 / 直線', sidebarTitle: '法向條件與直線' },
];

const GUIDE_ROLE_OPTIONS: Array<{ id: VectorGuideRole; label: string }> = [
  { id: 'position', label: '位置' },
  { id: 'direction', label: '方向' },
  { id: 'coordinate', label: '座標' },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mapNumber(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 1e-12) return '0';

  return value.toFixed(digits).replace(/\.?0+$/, '');
}

function add2(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

function scale2(v: Vec2, k: number): Vec2 {
  return { x: v.x * k, y: v.y * k };
}

function dot2(a: Vec2, b: Vec2) {
  return a.x * b.x + a.y * b.y;
}

function cross2(a: Vec2, b: Vec2) {
  return a.x * b.y - a.y * b.x;
}

function mag2(v: Vec2) {
  return Math.hypot(v.x, v.y);
}

function normalize2(v: Vec2): Vec2 {
  const m = mag2(v);
  if (m < 1e-9) return { x: 0, y: 0 };
  return { x: v.x / m, y: v.y / m };
}

function angleBetween(a: Vec2, b: Vec2) {
  const ma = mag2(a);
  const mb = mag2(b);
  if (ma < 1e-9 || mb < 1e-9) return 0;

  return Math.acos(clamp(dot2(a, b) / (ma * mb), -1, 1));
}

function signedAngleBetween(a: Vec2, b: Vec2) {
  let diff = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function clampVector(v: Vec2, maxLen: number) {
  const m = mag2(v);
  if (m <= maxLen) return v;
  return scale2(normalize2(v), maxLen);
}

function clampNormal(v: Vec2) {
  const m = mag2(v);
  if (m < 0.35) {
    const base = m < 1e-9 ? { x: 1, y: 0 } : v;
    return scale2(normalize2(base), 0.35);
  }

  return clampVector(v, 3.7);
}

function measureVectorsCanvas(host: HTMLElement) {
  const width = Math.max(320, Math.floor(host.clientWidth || 680));
  const height =
    width < 560
      ? Math.round(clamp(width * 1.78, 620, 760))
      : width < 760
        ? Math.round(clamp(width * 0.78, 470, 560))
        : Math.round(clamp(width * 0.54, 390, 520));
  return { width, height };
}

function stageRect(p: p5): Rect {
  return {
    x: 22,
    y: 22,
    w: Math.max(260, p.width - 44),
    h: Math.max(300, p.height - 44),
  };
}

function insetRect(rect: Rect, left: number, top: number, right: number, bottom: number): Rect {
  return {
    x: rect.x + left,
    y: rect.y + top,
    w: rect.w - left - right,
    h: rect.h - top - bottom,
  };
}

function plotRect(stage: Rect, compact: boolean) {
  return compact
    ? insetRect(stage, 42, 58, 24, 52)
    : insetRect(stage, 56, 62, 38, 58);
}

function worldToScreen(plot: Rect, point: Vec2, scale: number): Vec2 {
  return {
    x: mapNumber(point.x, -scale, scale, plot.x, plot.x + plot.w),
    y: mapNumber(point.y, -scale, scale, plot.y + plot.h, plot.y),
  };
}

function screenToWorld(plot: Rect, point: Vec2, scale: number): Vec2 {
  return {
    x: mapNumber(point.x, plot.x, plot.x + plot.w, -scale, scale),
    y: mapNumber(point.y, plot.y + plot.h, plot.y, -scale, scale),
  };
}

function withClip(p: p5, rect: Rect, fn: () => void) {
  const ctx = p.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  fn();
  ctx.restore();
}

function drawDashedLine(p: p5, x1: number, y1: number, x2: number, y2: number, pattern: number[]) {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.setLineDash(pattern);
  p.line(x1, y1, x2, y2);
  ctx.restore();
}

function drawFrame(p: p5, title: string, subtitle: string) {
  const stage = stageRect(p);

  p.background(10, 10, 10);
  p.noFill();
  p.stroke(...WHITE, 18);
  p.strokeWeight(1);
  p.rect(stage.x, stage.y, stage.w, stage.h, 14);

  p.noStroke();
  p.fill(...GOLD, 220);
  p.textStyle(p.BOLD);
  p.textSize(13);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text(title, stage.x + 22, stage.y + 32);

  p.fill(...MUTED, 210);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.text(subtitle, stage.x + 22, stage.y + 54);

  return stage;
}

function drawVectorGrid(p: p5, plot: Rect, scale: number, compact: boolean) {
  withClip(p, plot, () => {
    p.strokeWeight(1);

    for (let x = -Math.ceil(scale); x <= Math.ceil(scale); x += 1) {
      const sx = worldToScreen(plot, { x, y: 0 }, scale).x;
      p.stroke(...WHITE, Math.abs(x) < 1e-9 ? 38 : 12);
      p.line(sx, plot.y, sx, plot.y + plot.h);
    }

    for (let y = -Math.ceil(scale); y <= Math.ceil(scale); y += 1) {
      const sy = worldToScreen(plot, { x: 0, y }, scale).y;
      p.stroke(...WHITE, Math.abs(y) < 1e-9 ? 38 : 12);
      p.line(plot.x, sy, plot.x + plot.w, sy);
    }
  });

  p.noFill();
  p.stroke(...WHITE, 20);
  p.rect(plot.x, plot.y, plot.w, plot.h, 10);

  if (!compact) {
    p.noStroke();
    p.fill(...MUTED, 180);
    p.textSize(11);
    p.textAlign(p.RIGHT, p.TOP);
    p.text('x', plot.x + plot.w - 8, plot.y + plot.h + 8);
    p.textAlign(p.LEFT, p.TOP);
    p.text('y', plot.x - 20, plot.y + 8);
  }
}

function drawArrowGlow(
  p: p5,
  from: Vec2,
  to: Vec2,
  alpha: number,
  color: readonly [number, number, number] = GOLD,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return;

  const angle = Math.atan2(dy, dx);
  p.stroke(...color, 16);
  p.strokeWeight(9);
  p.line(from.x, from.y, to.x, to.y);

  p.stroke(...color, 45);
  p.strokeWeight(4);
  p.line(from.x, from.y, to.x, to.y);

  p.stroke(...color, alpha);
  p.strokeWeight(1.8);
  p.line(from.x, from.y, to.x, to.y);

  p.push();
  p.translate(to.x, to.y);
  p.rotate(angle);
  p.noStroke();
  p.fill(...color, alpha);
  p.triangle(0, 0, -11, -5, -11, 5);
  p.pop();
}

function drawPointLabel(p: p5, x: number, y: number, label: string) {
  p.noStroke();
  p.fill(...TEXT, 210);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, x, y);
}

function drawPlotLabel(p: p5, rect: Rect, label: string) {
  p.noStroke();
  p.fill(...TEXT, 230);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(label, rect.x + 18, rect.y + 22);
}

function drawBottomNote(p: p5, stage: Rect, label: string) {
  p.noStroke();
  p.fill(...MUTED, 190);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, stage.x + 24, stage.y + stage.h - 42, stage.w - 48, 34);
}

function guidePanelRects(stage: Rect, compact: boolean) {
  const inner = compact ? insetRect(stage, 16, 72, 16, 66) : insetRect(stage, 22, 72, 22, 66);
  const gap = compact ? 12 : 14;

  if (compact) {
    const h = (inner.h - gap * 2) / 3;
    return {
      position: { x: inner.x, y: inner.y, w: inner.w, h },
      direction: { x: inner.x, y: inner.y + h + gap, w: inner.w, h },
      coordinate: { x: inner.x, y: inner.y + (h + gap) * 2, w: inner.w, h },
    } satisfies Record<VectorGuideRole, Rect>;
  }

  if (inner.w < 720) {
    const topH = (inner.h - gap) * 0.52;
    const topW = (inner.w - gap) / 2;
    return {
      position: { x: inner.x, y: inner.y, w: topW, h: topH },
      direction: { x: inner.x + topW + gap, y: inner.y, w: topW, h: topH },
      coordinate: { x: inner.x, y: inner.y + topH + gap, w: inner.w, h: inner.h - topH - gap },
    } satisfies Record<VectorGuideRole, Rect>;
  }

  const w = (inner.w - gap * 2) / 3;
  return {
    position: { x: inner.x, y: inner.y, w, h: inner.h },
    direction: { x: inner.x + w + gap, y: inner.y, w, h: inner.h },
    coordinate: { x: inner.x + (w + gap) * 2, y: inner.y, w, h: inner.h },
  } satisfies Record<VectorGuideRole, Rect>;
}

function drawGuidePanelFrame(
  p: p5,
  rect: Rect,
  title: string,
  subtitle: string,
  active: boolean,
) {
  p.noFill();
  p.stroke(...(active ? GOLD : WHITE), active ? 135 : 26);
  p.strokeWeight(active ? 1.6 : 1);
  p.rect(rect.x, rect.y, rect.w, rect.h, 12);

  p.noStroke();
  p.fill(...(active ? GOLD : TEXT), active ? 235 : 205);
  p.textStyle(p.BOLD);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(title, rect.x + 12, rect.y + 10);

  p.textStyle(p.NORMAL);
  p.fill(...MUTED, 190);
  p.textSize(10.5);
  p.text(subtitle, rect.x + 12, rect.y + 28, rect.w - 24, 28);
}

function drawVectorHandle(
  p: p5,
  handles: DragHandle[],
  id: DragHandle['id'],
  pos: Vec2,
  plot: Rect,
  scale: number,
) {
  handles.push({ type: 'vector', id, x: pos.x, y: pos.y, r: 13, plot, scale });

  p.noStroke();
  p.fill(...GOLD, 235);
  p.circle(pos.x, pos.y, 9);

  p.noFill();
  p.stroke(...GOLD, 72);
  p.strokeWeight(1);
  p.circle(pos.x, pos.y, 23);
}

function drawUnitHandle(
  p: p5,
  handles: DragHandle[],
  id: 'u' | 'v',
  pos: Vec2,
  plot: Rect,
  scale: number,
) {
  handles.push({ type: 'unit', id, x: pos.x, y: pos.y, r: 13, plot, scale });

  p.noStroke();
  p.fill(...GOLD, 235);
  p.circle(pos.x, pos.y, 9);

  p.noFill();
  p.stroke(...GOLD, 72);
  p.strokeWeight(1);
  p.circle(pos.x, pos.y, 23);
}

function drawProjection(p: p5, plot: Rect, base: Vec2, vec: Vec2, scale: number) {
  const baseLen2 = dot2(base, base);
  if (baseLen2 < 1e-9) return;

  const k = dot2(vec, base) / baseLen2;
  const foot = scale2(base, k);
  const vecEnd = worldToScreen(plot, vec, scale);
  const footEnd = worldToScreen(plot, foot, scale);
  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);

  p.stroke(...WHITE, 38);
  p.strokeWeight(1);
  drawDashedLine(p, vecEnd.x, vecEnd.y, footEnd.x, footEnd.y, [4, 5]);

  p.stroke(...GOLD, 105);
  p.strokeWeight(3);
  p.line(origin.x, origin.y, footEnd.x, footEnd.y);

  p.noStroke();
  p.fill(...TEXT, 175);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text('proj_a b', footEnd.x + 7, footEnd.y + 7);
}

function drawAngleArc(p: p5, plot: Rect, a: Vec2, b: Vec2, scale: number, radius: number) {
  if (mag2(a) < 1e-9 || mag2(b) < 1e-9) return;

  const aa = Math.atan2(a.y, a.x);
  let diff = Math.atan2(b.y, b.x) - aa;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  const center = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const edge = worldToScreen(plot, { x: radius, y: 0 }, scale);
  const r = Math.abs(edge.x - center.x);

  p.noFill();
  p.stroke(...GOLD, 115);
  p.strokeWeight(1.5);
  p.arc(center.x, center.y, r * 2, r * 2, -(aa + diff), -aa);

  const mid = aa + diff * 0.5;
  const label = worldToScreen(
    plot,
    { x: Math.cos(mid) * radius * 1.18, y: Math.sin(mid) * radius * 1.18 },
    scale,
  );

  p.noStroke();
  p.fill(...TEXT, 190);
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('theta', label.x, label.y);
}

function drawPerpendicularMark(p: p5, plot: Rect, a: Vec2, b: Vec2, scale: number) {
  const ua = normalize2(a);
  const ub = normalize2(b);
  if (mag2(ua) < 1e-9 || mag2(ub) < 1e-9) return;

  const p1 = scale2(ua, 0.34);
  const p2 = add2(p1, scale2(ub, 0.34));
  const p3 = scale2(ub, 0.34);
  const s1 = worldToScreen(plot, p1, scale);
  const s2 = worldToScreen(plot, p2, scale);
  const s3 = worldToScreen(plot, p3, scale);

  p.stroke(...GOLD, 170);
  p.strokeWeight(1.5);
  p.noFill();
  p.beginShape();
  p.vertex(s1.x, s1.y);
  p.vertex(s2.x, s2.y);
  p.vertex(s3.x, s3.y);
  p.endShape();
}

function drawSpanField(p: p5, plot: Rect, params: Params, scale: number) {
  const det = cross2(params.a, params.b);

  if (Math.abs(det) < 0.08) {
    const dir = mag2(params.a) > mag2(params.b) ? normalize2(params.a) : normalize2(params.b);
    if (mag2(dir) < 1e-9) return;

    const p1 = worldToScreen(plot, scale2(dir, -10), scale);
    const p2 = worldToScreen(plot, scale2(dir, 10), scale);
    p.stroke(...GOLD, 42);
    p.strokeWeight(6);
    p.line(p1.x, p1.y, p2.x, p2.y);
    return;
  }

  withClip(p, plot, () => {
    p.strokeWeight(1);

    for (let i = -5; i <= 5; i += 1) {
      const p1 = add2(scale2(params.a, i), scale2(params.b, -8));
      const p2 = add2(scale2(params.a, i), scale2(params.b, 8));
      const s1 = worldToScreen(plot, p1, scale);
      const s2 = worldToScreen(plot, p2, scale);
      p.stroke(...GOLD, i === 0 ? 32 : 16);
      p.line(s1.x, s1.y, s2.x, s2.y);
    }

    for (let j = -5; j <= 5; j += 1) {
      const p1 = add2(scale2(params.b, j), scale2(params.a, -8));
      const p2 = add2(scale2(params.b, j), scale2(params.a, 8));
      const s1 = worldToScreen(plot, p1, scale);
      const s2 = worldToScreen(plot, p2, scale);
      p.stroke(...GOLD, j === 0 ? 32 : 16);
      p.line(s1.x, s1.y, s2.x, s2.y);
    }
  });
}

function drawNormalLine(p: p5, plot: Rect, params: Params, scale: number) {
  const len2 = dot2(params.n, params.n);
  if (len2 < 1e-9) return;

  const foot = scale2(params.n, params.c / len2);
  const dir = normalize2({ x: -params.n.y, y: params.n.x });
  const p1 = add2(foot, scale2(dir, -10));
  const p2 = add2(foot, scale2(dir, 10));
  const s1 = worldToScreen(plot, p1, scale);
  const s2 = worldToScreen(plot, p2, scale);
  const sf = worldToScreen(plot, foot, scale);
  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);

  withClip(p, plot, () => {
    p.stroke(...GOLD, 50);
    p.strokeWeight(8);
    p.line(s1.x, s1.y, s2.x, s2.y);

    p.stroke(...GOLD, 215);
    p.strokeWeight(1.8);
    p.line(s1.x, s1.y, s2.x, s2.y);

    p.stroke(...WHITE, 38);
    p.strokeWeight(1);
    drawDashedLine(p, origin.x, origin.y, sf.x, sf.y, [5, 6]);
  });

  p.noStroke();
  p.fill(...TEXT, 180);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text('closest point', sf.x + 8, sf.y + 8);
}

function drawObliqueBasisGrid(p: p5, plot: Rect, scale: number) {
  withClip(p, plot, () => {
    p.strokeWeight(1);

    for (let i = -4; i <= 4; i += 1) {
      const a1 = add2(scale2(GUIDE_BASIS.e1, i), scale2(GUIDE_BASIS.e2, -6));
      const a2 = add2(scale2(GUIDE_BASIS.e1, i), scale2(GUIDE_BASIS.e2, 6));
      const b1 = add2(scale2(GUIDE_BASIS.e2, i), scale2(GUIDE_BASIS.e1, -6));
      const b2 = add2(scale2(GUIDE_BASIS.e2, i), scale2(GUIDE_BASIS.e1, 6));
      const sa1 = worldToScreen(plot, a1, scale);
      const sa2 = worldToScreen(plot, a2, scale);
      const sb1 = worldToScreen(plot, b1, scale);
      const sb2 = worldToScreen(plot, b2, scale);

      p.stroke(...CYAN, i === 0 ? 48 : 18);
      p.line(sa1.x, sa1.y, sa2.x, sa2.y);
      p.stroke(...GOLD, i === 0 ? 48 : 18);
      p.line(sb1.x, sb1.y, sb2.x, sb2.y);
    }
  });
}

function drawGuidePositionPanel(
  p: p5,
  rect: Rect,
  params: Params,
  handles: DragHandle[],
  active: boolean,
) {
  drawGuidePanelFrame(p, rect, '位置', 'p 是平面上的點', active);
  const plot = insetRect(rect, 14, 52, 14, 16);
  const scale = 4;
  drawVectorGrid(p, plot, scale, true);

  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const pEnd = worldToScreen(plot, params.guideP, scale);
  drawArrowGlow(p, origin, pEnd, 235);
  drawVectorHandle(p, handles, 'guideP', pEnd, plot, scale);
  drawPointLabel(p, pEnd.x + 8, pEnd.y - 8, `p (${fmt(params.guideP.x)}, ${fmt(params.guideP.y)})`);
}

function drawGuideDirectionPanel(
  p: p5,
  rect: Rect,
  params: Params,
  handles: DragHandle[],
  active: boolean,
) {
  drawGuidePanelFrame(p, rect, '方向', 'u 沿 p 方向的投影', active);
  const plot = insetRect(rect, 14, 52, 14, 16);
  const scale = 4;
  drawVectorGrid(p, plot, scale, true);

  const projection = projectOnto(params.guideP, params.guideU);
  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const pEnd = worldToScreen(plot, params.guideP, scale);
  const uEnd = worldToScreen(plot, params.guideU, scale);

  if (projection.viable) {
    const foot = worldToScreen(plot, projection.vector, scale);
    p.stroke(...WHITE, 42);
    p.strokeWeight(1);
    drawDashedLine(p, uEnd.x, uEnd.y, foot.x, foot.y, [4, 5]);

    p.stroke(...GOLD, 130);
    p.strokeWeight(3);
    p.line(origin.x, origin.y, foot.x, foot.y);
    drawPointLabel(p, foot.x + 7, foot.y + 8, 'proj_p u');
  }

  drawArrowGlow(p, origin, pEnd, 230);
  drawArrowGlow(p, origin, uEnd, 200, CYAN);
  drawVectorHandle(p, handles, 'guideP', pEnd, plot, scale);
  drawVectorHandle(p, handles, 'guideU', uEnd, plot, scale);
  drawPointLabel(p, pEnd.x + 8, pEnd.y - 8, 'p');
  drawPointLabel(p, uEnd.x + 8, uEnd.y - 8, 'u');
}

function drawGuideCoordinatePanel(
  p: p5,
  rect: Rect,
  params: Params,
  handles: DragHandle[],
  active: boolean,
) {
  drawGuidePanelFrame(p, rect, '座標', '固定斜交基底讀 p', active);
  const plot = insetRect(rect, 14, 52, 14, 16);
  const scale = 4;
  drawVectorGrid(p, plot, scale, true);
  drawObliqueBasisGrid(p, plot, scale);

  const basis = solveBasisCoordinates(params.guideP, GUIDE_BASIS.e1, GUIDE_BASIS.e2);
  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const e1End = worldToScreen(plot, GUIDE_BASIS.e1, scale);
  const e2End = worldToScreen(plot, GUIDE_BASIS.e2, scale);
  const pEnd = worldToScreen(plot, params.guideP, scale);

  drawArrowGlow(p, origin, e1End, 145, CYAN);
  drawArrowGlow(p, origin, e2End, 145);

  if (basis.viable) {
    const se1 = scale2(GUIDE_BASIS.e1, basis.s);
    const tFromSe1 = add2(se1, scale2(GUIDE_BASIS.e2, basis.t));
    const se1End = worldToScreen(plot, se1, scale);
    const tEnd = worldToScreen(plot, tFromSe1, scale);
    p.stroke(...WHITE, 38);
    p.strokeWeight(1);
    drawDashedLine(p, se1End.x, se1End.y, tEnd.x, tEnd.y, [5, 6]);
    drawDashedLine(p, origin.x, origin.y, se1End.x, se1End.y, [5, 6]);
  }

  drawArrowGlow(p, origin, pEnd, 245);
  drawVectorHandle(p, handles, 'guideP', pEnd, plot, scale);
  drawPointLabel(p, e1End.x + 7, e1End.y + 14, 'e1');
  drawPointLabel(p, e2End.x + 7, e2End.y - 6, 'e2');
  drawPointLabel(p, pEnd.x + 8, pEnd.y - 18, 'p');
}

function drawGuideMode(p: p5, params: Params, handles: DragHandle[]) {
  const compact = p.width < 560;
  const stage = drawFrame(p, 'VECTOR GUIDE', 'one vector, three readings');
  const rects = guidePanelRects(stage, compact);
  const guideState = getVectorGuideState(params);

  drawGuidePositionPanel(p, rects.position, params, handles, params.guideRole === 'position');
  drawGuideDirectionPanel(p, rects.direction, params, handles, params.guideRole === 'direction');
  drawGuideCoordinatePanel(
    p,
    rects.coordinate,
    params,
    handles,
    params.guideRole === 'coordinate',
  );
  drawBottomNote(p, stage, guideState.summary);
}

function drawDotMode(p: p5, params: Params, handles: DragHandle[]) {
  const compact = p.width < 560;
  const stage = drawFrame(
    p,
    'VECTOR GEOMETRY',
    params.unitCircle ? 'unit vectors and cosine projection' : 'direction and projection',
  );
  const plot = plotRect(stage, compact);

  if (params.unitCircle) {
    const scale = 1.45;
    drawVectorGrid(p, plot, scale, compact);

    const theta = signedAngleBetween(params.u, params.v);
    const ua = { x: 1, y: 0 };
    const ub = { x: Math.cos(theta), y: Math.sin(theta) };
    const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
    const center = worldToScreen(plot, { x: 0, y: 0 }, scale);
    const r = Math.abs(worldToScreen(plot, { x: 1, y: 0 }, scale).x - center.x);
    const aEnd = worldToScreen(plot, ua, scale);
    const bEnd = worldToScreen(plot, ub, scale);
    const foot = worldToScreen(plot, { x: ub.x, y: 0 }, scale);

    p.noFill();
    p.stroke(...WHITE, 24);
    p.strokeWeight(1);
    p.circle(center.x, center.y, r * 2);

    p.stroke(...WHITE, 38);
    p.strokeWeight(1);
    p.line(bEnd.x, bEnd.y, foot.x, foot.y);

    p.stroke(...GOLD, 125);
    p.strokeWeight(3);
    p.line(origin.x, origin.y, foot.x, foot.y);

    drawArrowGlow(p, origin, aEnd, 235);
    drawArrowGlow(p, origin, bEnd, 170);
    drawUnitHandle(p, handles, 'u', aEnd, plot, scale);
    drawUnitHandle(p, handles, 'v', bEnd, plot, scale);
    drawPointLabel(p, aEnd.x + 8, aEnd.y - 8, 'a-hat');
    drawPointLabel(p, bEnd.x + 8, bEnd.y - 8, 'b-hat');
    drawPointLabel(p, foot.x + 6, foot.y + 8, `cos = ${fmt(Math.cos(theta), 3)}`);
    drawAngleArc(p, plot, ua, ub, scale, 0.35);
    drawPlotLabel(p, plot, 'a-hat dot b-hat = cos(theta)');
    drawBottomNote(p, stage, '單位向量時，方向分量只剩 cos(theta)，也就是投影長度');
    return;
  }

  const scale = 4;
  drawVectorGrid(p, plot, scale, compact);
  drawProjection(p, plot, params.u, params.v, scale);
  drawAngleArc(p, plot, params.u, params.v, scale, 0.72);

  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const uEnd = worldToScreen(plot, params.u, scale);
  const vEnd = worldToScreen(plot, params.v, scale);

  drawArrowGlow(p, origin, uEnd, 235);
  drawArrowGlow(p, origin, vEnd, 170);
  drawVectorHandle(p, handles, 'u', uEnd, plot, scale);
  drawVectorHandle(p, handles, 'v', vEnd, plot, scale);
  drawPointLabel(p, uEnd.x + 8, uEnd.y - 8, 'a');
  drawPointLabel(p, vEnd.x + 8, vEnd.y - 8, 'b');

  const dot = dot2(params.u, params.v);
  if (Math.abs(dot) < 0.04) {
    drawPerpendicularMark(p, plot, params.u, params.v, scale);
    drawPlotLabel(p, plot, 'a perpendicular b');
  } else {
    drawPlotLabel(p, plot, dot > 0 ? 'a dot b > 0' : 'a dot b < 0');
  }

  drawBottomNote(p, stage, '拖動兩個向量端點；投影把其中一支向量讀成指定方向的分量');
}

function drawSpanMode(p: p5, params: Params, handles: DragHandle[]) {
  const compact = p.width < 560;
  const stage = drawFrame(p, 'VECTOR GEOMETRY', 'basis coordinates and span');
  const plot = plotRect(stage, compact);
  const scale = 4;

  drawVectorGrid(p, plot, scale, compact);
  drawSpanField(p, plot, params, scale);

  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const aEnd = worldToScreen(plot, params.a, scale);
  const bEnd = worldToScreen(plot, params.b, scale);
  const result = add2(scale2(params.a, params.s), scale2(params.b, params.t));
  const rEnd = worldToScreen(plot, result, scale);
  const scaledA = scale2(params.a, params.s);
  const scaledAEnd = worldToScreen(plot, scaledA, scale);

  p.stroke(...WHITE, 30);
  p.strokeWeight(1);
  drawDashedLine(p, scaledAEnd.x, scaledAEnd.y, rEnd.x, rEnd.y, [5, 6]);
  drawDashedLine(p, origin.x, origin.y, scaledAEnd.x, scaledAEnd.y, [5, 6]);

  drawArrowGlow(p, origin, aEnd, 210);
  drawArrowGlow(p, origin, bEnd, 165);
  drawArrowGlow(p, origin, rEnd, 245);
  drawVectorHandle(p, handles, 'a', aEnd, plot, scale);
  drawVectorHandle(p, handles, 'b', bEnd, plot, scale);
  drawPointLabel(p, aEnd.x + 8, aEnd.y - 8, 'a');
  drawPointLabel(p, bEnd.x + 8, bEnd.y - 8, 'b');
  drawPointLabel(p, rEnd.x + 8, rEnd.y - 8, 'sa + tb');

  const det = cross2(params.a, params.b);
  drawPlotLabel(p, plot, Math.abs(det) < 0.08 ? 'span: line' : 'span: plane');
  drawBottomNote(p, stage, '拖動基底向量 a、b；調整 s、t 觀察同一平面中的座標讀數');
}

function drawNormalMode(p: p5, params: Params, handles: DragHandle[]) {
  const compact = p.width < 560;
  const stage = drawFrame(p, 'VECTOR GEOMETRY', 'normal direction and line');
  const plot = plotRect(stage, compact);
  const scale = 4;

  drawVectorGrid(p, plot, scale, compact);
  drawNormalLine(p, plot, params, scale);

  const origin = worldToScreen(plot, { x: 0, y: 0 }, scale);
  const nEnd = worldToScreen(plot, params.n, scale);

  drawArrowGlow(p, origin, nEnd, 235);
  drawVectorHandle(p, handles, 'n', nEnd, plot, scale);
  drawPointLabel(p, nEnd.x + 8, nEnd.y - 8, 'n');
  drawPlotLabel(p, plot, `${fmt(params.n.x)}x + ${fmt(params.n.y)}y = ${fmt(params.c)}`);
  drawBottomNote(p, stage, '拖動法向量 n；直線永遠垂直於 n，方程式為 n dot x = c');
}

function buildStats(params: Params) {
  if (params.mode === 'guide') {
    return getVectorGuideState(params).stats;
  }

  if (params.mode === 'dot') {
    const angle = (angleBetween(params.u, params.v) * 180) / Math.PI;

    if (params.unitCircle) {
      const cosTheta = Math.cos(signedAngleBetween(params.u, params.v));
      const relation =
        Math.abs(cosTheta) < 0.04
          ? '單位向量垂直'
          : cosTheta > 0
            ? '銳角：cos(theta) > 0'
            : '鈍角：cos(theta) < 0';

      return [
        `a-hat · b-hat = ${fmt(cosTheta, 3)}`,
        `theta = ${fmt(angle, 1)} deg`,
        `投影長度 = ${fmt(cosTheta, 3)}`,
        relation,
      ];
    }

    const dot = dot2(params.u, params.v);
    const projection = mag2(params.u) < 1e-9 ? 0 : dot / mag2(params.u);
    const relation =
      Math.abs(dot) < 0.04 ? 'a 垂直於 b' : dot > 0 ? '銳角：內積 > 0' : '鈍角：內積 < 0';

    return [
      `a · b = ${fmt(dot, 3)}`,
      `theta = ${fmt(angle, 1)} deg`,
      `投影長度 = ${fmt(projection, 3)}`,
      relation,
    ];
  }

  if (params.mode === 'span') {
    const det = cross2(params.a, params.b);
    const result = add2(scale2(params.a, params.s), scale2(params.b, params.t));

    return [
      'v = s a + t b',
      `v = (${fmt(result.x)}, ${fmt(result.y)})`,
      `det[a b] = ${fmt(det, 3)}`,
      Math.abs(det) < 0.08 ? '張成：一條直線' : '張成：整個平面',
    ];
  }

  return [
    `n = (${fmt(params.n.x)}, ${fmt(params.n.y)})`,
    `${fmt(params.n.x)}x + ${fmt(params.n.y)}y = ${fmt(params.c)}`,
    `方向向量 d = (${fmt(-params.n.y)}, ${fmt(params.n.x)})`,
    'n 垂直於直線',
  ];
}

export default function VectorsExploreRoot() {
  const [params, setParamsState] = useState<Params>(DEFAULT_PARAMS);
  const paramsRef = useRef(params);
  const handlesRef = useRef<DragHandle[]>([]);
  const draggingRef = useRef<DragHandle | null>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  const setParams = useCallback((updater: (prev: Params) => Params) => {
    setParamsState((prev) => {
      const next = updater(prev);
      paramsRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    paramsRef.current = params;
    p5Ref.current?.redraw();
  }, [params]);

  const draw = useCallback((p: p5) => {
    const handles: DragHandle[] = [];
    const current = paramsRef.current;

    if (current.mode === 'guide') drawGuideMode(p, current, handles);
    if (current.mode === 'dot') drawDotMode(p, current, handles);
    if (current.mode === 'span') drawSpanMode(p, current, handles);
    if (current.mode === 'normal') drawNormalMode(p, current, handles);

    handlesRef.current = handles;
  }, []);

  const drawRef = useRef(draw);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        p.setup = () => {
          const { width, height } = measureVectorsCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.textFont('system-ui, -apple-system, BlinkMacSystemFont, sans-serif');
          p.noLoop();
        };

        p.draw = () => drawRef.current(p);

        const startDrag = () => {
          const hit = handlesRef.current
            .slice()
            .reverse()
            .find((handle) => p.dist(p.mouseX, p.mouseY, handle.x, handle.y) <= handle.r);

          draggingRef.current = hit ?? null;
        };

        const updateDrag = () => {
          const dragging = draggingRef.current;
          if (!dragging) return;

          if (dragging.type === 'vector') {
            const point = screenToWorld(
              dragging.plot,
              { x: p.mouseX, y: p.mouseY },
              dragging.scale,
            );
            const clamped = dragging.id === 'n' ? clampNormal(point) : clampVector(point, 3.7);
            setParams((prev) => ({ ...prev, [dragging.id]: clamped }));
            p.redraw();
          }

          if (dragging.type === 'unit') {
            const point = screenToWorld(
              dragging.plot,
              { x: p.mouseX, y: p.mouseY },
              dragging.scale,
            );
            const dir = normalize2(point);
            if (mag2(dir) < 1e-9) return;
            setParams((prev) => ({ ...prev, [dragging.id]: dir }));
            p.redraw();
          }
        };

        const stopDrag = () => {
          draggingRef.current = null;
        };

        p.mousePressed = startDrag;
        p.mouseDragged = updateDrag;
        p.mouseReleased = stopDrag;

        p.touchStarted = () => {
          startDrag();
          return false;
        };

        p.touchMoved = () => {
          updateDrag();
          return false;
        };

        p.touchEnded = () => {
          stopDrag();
          return false;
        };
      };

      const instance = new P5(sketch, host);
      p5Ref.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;

        const { width, height } = measureVectorsCanvas(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        instance.redraw();
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
        if (p5Ref.current === instance) p5Ref.current = null;
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [setParams]);

  const stats = useMemo(() => buildStats(params), [params]);
  const guideState = useMemo(() => getVectorGuideState(params), [params]);
  const activeMode = MODE_OPTIONS.find((mode) => mode.id === params.mode) ?? MODE_OPTIONS[0];

  return (
    <div className="vectors-explore">
      <div className="vectors-explore__stage">
        <div className="vectors-explore__visual">
          <p className="vectors-explore__visual-title">VECTOR GEOMETRY</p>
          <p className="vectors-explore__visual-sub">{activeMode.sidebarTitle}</p>
          <div
            ref={canvasHostRef}
            className="vectors-explore__canvas"
            role="img"
            aria-label="平面向量幾何互動圖"
          />
        </div>

        <aside className="vectors-explore__sidebar">
          <div className="vectors-explore__block">
            <p className="vectors-explore__block-title">切換</p>
            <div className="vectors-explore__mode-list" role="tablist" aria-label="向量模式">
              {MODE_OPTIONS.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={
                    params.mode === mode.id
                      ? 'vectors-explore__mode vectors-explore__mode--active'
                      : 'vectors-explore__mode'
                  }
                  aria-pressed={params.mode === mode.id}
                  onClick={() =>
                    setParams((prev) => ({
                      ...prev,
                      mode: mode.id,
                    }))
                  }
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {params.mode === 'dot' && (
            <div className="vectors-explore__block">
              <p className="vectors-explore__block-title">方向 / 投影</p>
              <label className="vectors-explore__check">
                <input
                  type="checkbox"
                  checked={params.unitCircle}
                  onChange={(event) =>
                    setParams((prev) => ({ ...prev, unitCircle: event.target.checked }))
                  }
                />
                <span>單位圓視角</span>
              </label>
              <p className="vectors-explore__muted">
                拖動向量端點，觀察投影線段、角度與內積正負的關係。
              </p>
            </div>
          )}

          {params.mode === 'guide' && (
            <div className="vectors-explore__block">
              <p className="vectors-explore__block-title">讀圖焦點</p>
              <div
                className="vectors-explore__role-list"
                role="tablist"
                aria-label="讀圖焦點"
              >
                {GUIDE_ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={
                      params.guideRole === role.id
                        ? 'vectors-explore__mode vectors-explore__mode--active'
                        : 'vectors-explore__mode'
                    }
                    aria-pressed={params.guideRole === role.id}
                    onClick={() =>
                      setParams((prev) => ({
                        ...prev,
                        guideRole: role.id,
                      }))
                    }
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <p className="vectors-explore__muted">{guideState.summary}</p>
            </div>
          )}

          {params.mode === 'span' && (
            <div className="vectors-explore__block">
              <p className="vectors-explore__block-title">座標係數</p>
              {(['s', 't'] as const).map((key) => (
                <div key={key} className="control-field">
                  <label htmlFor={`vectors-${key}`}>
                    係數 {key}
                    <span className="vectors-explore__val">{fmt(params[key])}</span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id={`vectors-${key}`}
                      type="range"
                      className="range"
                      min={-2}
                      max={2}
                      step={0.01}
                      value={params[key]}
                      onInput={(event) =>
                        setParams((prev) => ({
                          ...prev,
                          [key]: Number((event.target as HTMLInputElement).value),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {params.mode === 'normal' && (
            <div className="vectors-explore__block">
              <p className="vectors-explore__block-title">法向 / 直線</p>
              <div className="control-field">
                <label htmlFor="vectors-c">
                  常數 c
                  <span className="vectors-explore__val">{fmt(params.c)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="vectors-c"
                    type="range"
                    className="range"
                    min={-5}
                    max={5}
                    step={0.01}
                    value={params.c}
                    onInput={(event) =>
                      setParams((prev) => ({
                        ...prev,
                        c: Number((event.target as HTMLInputElement).value),
                      }))
                    }
                  />
                </div>
              </div>
              <p className="vectors-explore__muted">
                拖動法向量 n；直線隨 c 平移，方向始終與 n 垂直。
              </p>
            </div>
          )}

          <div className="vectors-explore__block vectors-explore__stats">
            <p className="vectors-explore__block-title">統計</p>
            {stats.map((line) => (
              <p key={line} className="vectors-explore__accent">
                {line}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
