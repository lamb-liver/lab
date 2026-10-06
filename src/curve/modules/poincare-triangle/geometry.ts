import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

/** 曲率 −1 的圓盤。到圓心的距離用這個尺度，內角公式才和畫面上的夾角一致。 */
export type DiskTriangleParams = {
  r: number;
};

export const R_MIN = 0.12;
export const R_MAX = 0.9;

export const DEFAULT_DISK_TRIANGLE_PARAMS: DiskTriangleParams = {
  r: 0.55,
};

/** 外圓是單位圓，留一圈邊。 */
export const VIEW = {
  x0: -1.12,
  x1: 1.12,
  y0: -1.12,
  y1: 1.12,
};

export type Vec = { x: number; y: number };

export type PlotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Circle = { c: Vec; radius: number };

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampDiskTriangle(params: Partial<DiskTriangleParams> | ParamValues): DiskTriangleParams {
  return {
    r: clamp(Number(params.r ?? DEFAULT_DISK_TRIANGLE_PARAMS.r), R_MIN, R_MAX),
  };
}

/** 頂點的畫面距離 r 對應的雙曲距離。 */
export function centerDistance(r: number): number {
  return Math.log((1 + r) / (1 - r));
}

export function vertex(r: number, index: number): Vec {
  const phi = Math.PI / 2 + (2 * Math.PI * index) / 3;
  return { x: r * Math.cos(phi), y: r * Math.sin(phi) };
}

export function vertices(r: number): [Vec, Vec, Vec] {
  return [vertex(r, 0), vertex(r, 1), vertex(r, 2)];
}

/** 正三角形的邊長。兩頂點離圓心同遠，夾角 120°。 */
export function sideLength(r: number): number {
  const rho = centerDistance(r);
  const cosh = Math.cosh(rho);
  const sinh2 = cosh * cosh - 1;
  return Math.acosh(cosh * cosh + 0.5 * sinh2);
}

/** 內角，弧度。cos θ = cosh s / (cosh s + 1)。 */
export function interiorAngle(r: number): number {
  const cosh = Math.cosh(sideLength(r));
  const cos = Math.min(1, Math.max(-1, cosh / (cosh + 1)));
  return Math.acos(cos);
}

export function angleSumDegrees(r: number): number {
  return (interiorAngle(r) * 180) / Math.PI * 3;
}

export function formatDegrees(radians: number): string {
  return `${((radians * 180) / Math.PI).toFixed(1)}°`;
}

/** 通過兩點、並與單位圓垂直的圓。 */
export function geodesicCircle(a: Vec, b: Vec): Circle {
  const ra = (a.x * a.x + a.y * a.y + 1) / 2;
  const rb = (b.x * b.x + b.y * b.y + 1) / 2;
  const det = a.x * b.y - a.y * b.x;
  const cx = (ra * b.y - rb * a.y) / det;
  const cy = (a.x * rb - b.x * ra) / det;
  return { c: { x: cx, y: cy }, radius: Math.sqrt(cx * cx + cy * cy - 1) };
}

function minorSweep(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

export function arcPoints(circle: Circle, a: Vec, b: Vec, steps: number): Vec[] {
  const a0 = Math.atan2(a.y - circle.c.y, a.x - circle.c.x);
  const a1 = Math.atan2(b.y - circle.c.y, b.x - circle.c.x);
  const sweep = minorSweep(a0, a1);
  const points: Vec[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = a0 + sweep * (i / steps);
    points.push({
      x: circle.c.x + circle.radius * Math.cos(t),
      y: circle.c.y + circle.radius * Math.sin(t),
    });
  }
  return points;
}

/** 從 from 沿測地線走向 to 的單位切向量。 */
export function outgoingTangent(circle: Circle, from: Vec, to: Vec): Vec {
  const rx = from.x - circle.c.x;
  const ry = from.y - circle.c.y;
  const sweep = minorSweep(Math.atan2(ry, rx), Math.atan2(to.y - circle.c.y, to.x - circle.c.x));
  const sign = sweep >= 0 ? 1 : -1;
  const tx = sign * -ry;
  const ty = sign * rx;
  const len = Math.hypot(tx, ty);
  return { x: tx / len, y: ty / len };
}

/** 頂點 0 上，兩條邊的切線夾角。應與 interiorAngle 相同。 */
export function tangentAngle(r: number): number {
  const verts = vertices(r);
  const edge01 = geodesicCircle(verts[0], verts[1]);
  const edge20 = geodesicCircle(verts[2], verts[0]);
  const t1 = outgoingTangent(edge01, verts[0], verts[1]);
  const t2 = outgoingTangent(edge20, verts[0], verts[2]);
  const dot = Math.min(1, Math.max(-1, t1.x * t2.x + t1.y * t2.y));
  return Math.acos(dot);
}

export function plotSquare(width: number, height: number): PlotRect {
  const pad = 18;
  const side = Math.max(1, Math.min(width, height) - pad * 2);
  return {
    left: (width - side) / 2,
    top: (height - side) / 2,
    width: side,
    height: side,
  };
}

export function mapX(plot: PlotRect, x: number): number {
  return plot.left + ((x - VIEW.x0) / (VIEW.x1 - VIEW.x0)) * plot.width;
}

export function mapY(plot: PlotRect, y: number): number {
  return plot.top + ((VIEW.y1 - y) / (VIEW.y1 - VIEW.y0)) * plot.height;
}

function point(x: number, y: number): CurvePoint {
  return { x, y, theta: 0, arcLength: 0 };
}

export function sampleDiskTriangleThumbnail(params: DiskTriangleParams): ThumbnailSpec {
  const boundary: CurvePoint[] = [];
  for (let i = 0; i <= 72; i += 1) {
    const t = (2 * Math.PI * i) / 72;
    boundary.push(point(Math.cos(t), Math.sin(t)));
  }

  const verts = vertices(params.r);
  const region: CurvePoint[] = [];
  for (let i = 0; i < 3; i += 1) {
    const a = verts[i]!;
    const b = verts[(i + 1) % 3]!;
    const arc = arcPoints(geodesicCircle(a, b), a, b, 24);
    region.push(...arc.slice(i === 0 ? 0 : 1).map((p) => point(p.x, p.y)));
  }

  return {
    paths: [
      { points: boundary, closed: true, stroke: '#ffffff', strokeWidth: 1, opacity: 0.35 },
      {
        points: region,
        closed: true,
        fill: '#d4b87a',
        opacity: 0.34,
        stroke: '#d4b87a',
        strokeWidth: 1.4,
      },
    ],
  };
}
