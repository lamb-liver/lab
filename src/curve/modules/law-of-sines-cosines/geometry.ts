import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  clamp,
  circumcircleFromTriangle,
  computeTriangleSidesAngles,
  dist2,
  preventTriangleCollapse,
  safeAcos,
  sub,
  TRIANGLE_EPS,
  type TriangleVerts,
  type Vec2,
} from '../../../lib/trigonometry/triangleGeometry';

export type { TriangleVerts, Vec2 };

export type LawMode = 'sine' | 'cosine';

export type LawOfSinesCosinesParams = {
  mode: LawMode;
  advanced: boolean;
  triangle: TriangleVerts;
};

export type TriangleMetrics = {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  R: number;
  ratioA: number;
  ratioB: number;
  ratioC: number;
};

export type TriangleTransform = {
  cx: number;
  cy: number;
  s: number;
  plot: { x: number; y: number; w: number; h: number };
};

export const EPS = TRIANGLE_EPS;

export const DEFAULT_TRIANGLE: TriangleVerts = {
  A: { x: -1.18, y: -0.78 },
  B: { x: 1.18, y: -0.78 },
  C: { x: -0.18, y: 1.02 },
};

export const DEFAULT_LAW_OF_SINES_COSINES_PARAMS: LawOfSinesCosinesParams = {
  mode: 'sine',
  advanced: true,
  triangle: {
    A: { ...DEFAULT_TRIANGLE.A },
    B: { ...DEFAULT_TRIANGLE.B },
    C: { ...DEFAULT_TRIANGLE.C },
  },
};

export function safeRatio(numerator: number, denominator: number) {
  if (Math.abs(denominator) < EPS) return NaN;
  return numerator / denominator;
}

export { clamp, dist2, sub, preventTriangleCollapse };

export function fmt(v: number, digits = 3) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 0.0005 || Object.is(v, -0)) return '0';
  return v
    .toFixed(digits)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*?)0+$/, '$1');
}

export function deg(v: number) {
  return `${Math.round((v * 180) / Math.PI)}°`;
}

export function modeFromParam(value: number | LawMode | undefined): LawMode {
  if (value === 'cosine' || value === 1) return 'cosine';
  return 'sine';
}

export function asLawParams(params: Partial<LawOfSinesCosinesParams> & Record<string, unknown>): LawOfSinesCosinesParams {
  const triangle = params.triangle ?? DEFAULT_LAW_OF_SINES_COSINES_PARAMS.triangle;
  return {
    mode: modeFromParam(params.mode as number | LawMode | undefined),
    advanced: params.advanced ?? DEFAULT_LAW_OF_SINES_COSINES_PARAMS.advanced,
    triangle: {
      A: triangle.A ?? DEFAULT_TRIANGLE.A,
      B: triangle.B ?? DEFAULT_TRIANGLE.B,
      C: triangle.C ?? DEFAULT_TRIANGLE.C,
    },
  };
}

export function triangleMetrics(triangle: TriangleVerts): TriangleMetrics {
  const g = computeTriangleSidesAngles(triangle);
  return {
    ...g,
    ratioA: safeRatio(g.a, Math.sin(g.A)),
    ratioB: safeRatio(g.b, Math.sin(g.B)),
    ratioC: safeRatio(g.c, Math.sin(g.C)),
  };
}

export function circumcircleWorld(A: Vec2, B: Vec2, C: Vec2) {
  return circumcircleFromTriangle(A, B, C);
}

export function projectPointToLine(P: Vec2, A: Vec2, B: Vec2): Vec2 {
  const AB = { x: B.x - A.x, y: B.y - A.y };
  const AP = { x: P.x - A.x, y: P.y - A.y };
  const denom = AB.x * AB.x + AB.y * AB.y || 1;
  const t = (AP.x * AB.x + AP.y * AB.y) / denom;
  return { x: A.x + AB.x * t, y: A.y + AB.y * t };
}

export function createTriangleTransform(width: number, height: number): TriangleTransform {
  const m = Math.max(28, Math.min(width, height) * 0.1);
  const plot = { x: m, y: m, w: width - m * 2, h: height - m * 2 };
  const s = Math.min(plot.w * 0.28, plot.h * 0.28);
  return {
    cx: plot.x + plot.w * 0.5,
    cy: plot.y + plot.h * 0.5,
    s,
    plot,
  };
}

export function worldToScreen(p: Vec2, T: TriangleTransform): Vec2 {
  return { x: T.cx + p.x * T.s, y: T.cy - p.y * T.s };
}

export function screenToWorld(p: Vec2, T: TriangleTransform): Vec2 {
  return { x: (p.x - T.cx) / T.s, y: -(p.y - T.cy) / T.s };
}

export function resetTriangle(): TriangleVerts {
  return {
    A: { ...DEFAULT_TRIANGLE.A },
    B: { ...DEFAULT_TRIANGLE.B },
    C: { ...DEFAULT_TRIANGLE.C },
  };
}

export function shortestAngleDelta(from: number, to: number) {
  const tau = Math.PI * 2;
  return ((((to - from + Math.PI) % tau) + tau) % tau) - Math.PI;
}

export function getAngleKind(angle: number) {
  const rightEps = (2 * Math.PI) / 180;
  if (Math.abs(angle - Math.PI / 2) < rightEps) return '接近直角';
  if (angle > Math.PI / 2) return '鈍角';
  return '銳角';
}

export function getCosineStatusLabel(angle: number) {
  const rightEps = (2 * Math.PI) / 180;
  if (Math.abs(angle - Math.PI / 2) < rightEps) return '接近直角：c²≈a²+b²';
  if (angle > Math.PI / 2) return '鈍角：cosC<0';
  return '銳角：cosC>0';
}

export function getVisualCaption(mode: LawMode, angleC: number) {
  if (mode === 'sine') {
    return '正弦定理：三個邊角比值相等，且共同等於外接圓直徑 2R。';
  }
  return `餘弦定理：目前 C 為${getAngleKind(angleC)}，c² 由 a²+b² 再加上夾角修正。`;
}

function toCurvePoint(v: Vec2, theta: number, scale = 42): CurvePoint {
  return {
    x: v.x * scale,
    y: -v.y * scale,
    theta,
    arcLength: dist2({ x: 0, y: 0 }, v) * scale,
  };
}

export function sampleLawOfSinesCosinesThumbnail(
  params: LawOfSinesCosinesParams,
): ThumbnailSpec {
  const { A, B, C } = params.triangle;
  const a = toCurvePoint(B, 0);
  const b = toCurvePoint(C, 1);
  const c = toCurvePoint(A, 2);

  return {
    paths: [
      {
        points: [a, b],
        strokeWidth: 1.5,
      },
      {
        points: [b, c],
        opacity: 0.24,
        strokeWidth: 0.9,
      },
      {
        points: [c, a],
        opacity: 0.24,
        strokeWidth: 0.9,
      },
    ],
  };
}
