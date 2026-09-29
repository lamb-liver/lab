export type Vec = { x: number; y: number };

export type CircleImage = { kind: 'circle'; center: Vec; radius: number };
export type LineImage = { kind: 'line'; point: Vec; direction: Vec };
export type InversionImage = CircleImage | LineImage;

export type CircleInversionParams = {
  radius: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  rho: number;
};

export const VIEW = 2.4;
const ORIGIN_EPS = 1e-8;
const THROUGH_EPS = 1e-5;

export const DEFAULT_CIRCLE_INVERSION: CircleInversionParams = {
  radius: 1,
  ax: -1.5,
  ay: 0.9,
  bx: 1.25,
  by: 1.15,
  cx: 0.9,
  cy: -0.75,
  rho: 0.45,
};

export function invertPoint(p: Vec, radius: number): Vec | null {
  const d2 = p.x * p.x + p.y * p.y;
  if (d2 < ORIGIN_EPS) return null;
  const k = (radius * radius) / d2;
  return { x: p.x * k, y: p.y * k };
}

export function footFromOrigin(a: Vec, b: Vec): Vec | null {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby;
  if (ab2 < 1e-12) return null;
  const t = -(a.x * abx + a.y * aby) / ab2;
  return { x: a.x + abx * t, y: a.y + aby * t };
}

/** 不過圓心的直線變成通過圓心的圓；過圓心的直線仍是同一條直線。 */
export function invertLine(a: Vec, b: Vec, radius: number): InversionImage | null {
  const foot = footFromOrigin(a, b);
  if (!foot) return null;
  const d2 = foot.x * foot.x + foot.y * foot.y;
  if (d2 < THROUGH_EPS) {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const len = Math.hypot(abx, aby) || 1;
    return { kind: 'line', point: { x: 0, y: 0 }, direction: { x: abx / len, y: aby / len } };
  }
  const image = invertPoint(foot, radius);
  if (!image) return null;
  return {
    kind: 'circle',
    center: { x: image.x / 2, y: image.y / 2 },
    radius: Math.hypot(image.x, image.y) / 2,
  };
}

/**
 * |c|² ≠ ρ² 時圓還是圓，圓心 c' = c R² / (|c|² − ρ²)。
 * 圓經過反演圓心時，像是直線。
 */
export function invertCircle(center: Vec, rho: number, radius: number): InversionImage | null {
  if (rho <= 1e-8) return null;
  const c2 = center.x * center.x + center.y * center.y;
  if (c2 < ORIGIN_EPS) {
    return { kind: 'circle', center: { x: 0, y: 0 }, radius: (radius * radius) / rho };
  }
  const gap = c2 - rho * rho;
  if (Math.abs(gap) < THROUGH_EPS) {
    const len = Math.sqrt(c2);
    const far = {
      x: (center.x / len) * (len + rho),
      y: (center.y / len) * (len + rho),
    };
    const image = invertPoint(far, radius);
    if (!image) return null;
    return {
      kind: 'line',
      point: image,
      direction: { x: -center.y / len, y: center.x / len },
    };
  }
  const k = (radius * radius) / gap;
  return {
    kind: 'circle',
    center: { x: center.x * k, y: center.y * k },
    radius: Math.abs(rho * k),
  };
}

export function paramsFromValues(values: CircleInversionParams): CircleInversionParams {
  return {
    radius: values.radius,
    ax: values.ax,
    ay: values.ay,
    bx: values.bx,
    by: values.by,
    cx: values.cx,
    cy: values.cy,
    rho: values.rho,
  };
}

export type HandleId = 'a' | 'b' | 'center' | 'rim';

const HANDLE_PX = 16;

export function pxScale(size: number): number {
  return size / (VIEW * 2);
}

export function mathToPx(p: Vec, size: number): { x: number; y: number } {
  const scale = pxScale(size);
  return { x: size / 2 + p.x * scale, y: size / 2 - p.y * scale };
}

export function pxToMath(x: number, y: number, size: number): Vec {
  const scale = pxScale(size);
  return { x: (x - size / 2) / scale, y: (size / 2 - y) / scale };
}

function clampCoord(v: number): number {
  const limit = VIEW - 0.2;
  return Math.min(limit, Math.max(-limit, v));
}

export function clampHandlePoint(p: Vec): Vec {
  return { x: clampCoord(p.x), y: clampCoord(p.y) };
}

export function clampRho(rho: number): number {
  return Math.min(1.6, Math.max(0.2, rho));
}

export function rimPoint(params: CircleInversionParams): Vec {
  return { x: params.cx + params.rho, y: params.cy };
}

export function pickHandle(at: Vec, params: CircleInversionParams, size: number): HandleId | null {
  const hit = HANDLE_PX / pxScale(size);
  const points: [HandleId, Vec][] = [
    ['a', { x: params.ax, y: params.ay }],
    ['b', { x: params.bx, y: params.by }],
    ['rim', rimPoint(params)],
    ['center', { x: params.cx, y: params.cy }],
  ];
  let best: HandleId | null = null;
  let bestD = hit;
  for (const [id, p] of points) {
    const d = Math.hypot(at.x - p.x, at.y - p.y);
    if (d <= bestD) {
      best = id;
      bestD = d;
    }
  }
  return best;
}

function handleLimit(): number {
  return VIEW - 0.2;
}

export function moveHandle(params: CircleInversionParams, id: HandleId, at: Vec): CircleInversionParams {
  const p = clampHandlePoint(at);
  if (id === 'a') return { ...params, ax: p.x, ay: p.y };
  if (id === 'b') return { ...params, bx: p.x, by: p.y };
  if (id === 'center') {
    return { ...params, cx: Math.min(p.x, handleLimit() - params.rho), cy: p.y };
  }
  const room = handleLimit() - params.cx;
  return { ...params, rho: Math.min(clampRho(Math.hypot(at.x - params.cx, at.y - params.cy)), room) };
}

/** 直線段裁進視窗，供畫線與縮圖。 */
export function clipToView(a: Vec, b: Vec, limit = VIEW): [Vec, Vec] | null {
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const p = [-dx, dx, -dy, dy];
  const q = [a.x + limit, limit - a.x, a.y + limit, limit - a.y];
  for (let i = 0; i < 4; i += 1) {
    if (Math.abs(p[i]) < 1e-12) {
      if (q[i] < 0) return null;
      continue;
    }
    const r = q[i] / p[i];
    if (p[i] < 0) {
      if (r > t1) return null;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return null;
      if (r < t1) t1 = r;
    }
  }
  return [
    { x: a.x + t0 * dx, y: a.y + t0 * dy },
    { x: a.x + t1 * dx, y: a.y + t1 * dy },
  ];
}

export function lineChord(image: LineImage, span = 8): [Vec, Vec] | null {
  const a = {
    x: image.point.x - image.direction.x * span,
    y: image.point.y - image.direction.y * span,
  };
  const b = {
    x: image.point.x + image.direction.x * span,
    y: image.point.y + image.direction.y * span,
  };
  return clipToView(a, b);
}
