import {
  addVec3,
  dotVec3,
  lengthVec3,
  normalizeVec3,
  scaleVec3,
  subVec3,
  vec3,
  type Vec3,
} from '../../curve/projection3d';

export type Line3 = {
  point: Vec3;
  direction: Vec3;
};

export const LINE_1: Line3 = {
  point: vec3(1, 1, 2),
  direction: vec3(1, -1, 1),
};

export const LINE_2: Line3 = {
  point: vec3(2, 5, 6),
  direction: vec3(2, 1, -1),
};

export type SkewLineMetrics = {
  foot1: Vec3;
  foot2: Vec3;
  lineDistance: number;
};

export function closestPointsOnLines(line1: Line3, line2: Line3): SkewLineMetrics {
  const { point: p1, direction: u } = line1;
  const { point: p2, direction: v } = line2;
  const w = subVec3(p1, p2);
  const a = dotVec3(u, u);
  const b = dotVec3(u, v);
  const c = dotVec3(v, v);
  const d = dotVec3(u, w);
  const e = dotVec3(v, w);
  const denominator = a * c - b * b;

  if (Math.abs(denominator) < 1e-9) {
    throw new Error('歪斜線距離需要兩條不平行直線');
  }

  const t = (b * e - c * d) / denominator;
  const s = (a * e - b * d) / denominator;
  const foot1 = addVec3(p1, scaleVec3(u, t));
  const foot2 = addVec3(p2, scaleVec3(v, s));
  const common = subVec3(foot2, foot1);

  return {
    foot1,
    foot2,
    lineDistance: lengthVec3(common),
  };
}

export const SKEW_LINE_METRICS = closestPointsOnLines(LINE_1, LINE_2);

export function offsetPoints(distance: number): { p: Vec3; q: Vec3; distance: number } {
  const p = addVec3(
    SKEW_LINE_METRICS.foot1,
    scaleVec3(normalizeVec3(LINE_1.direction), distance),
  );
  const q = addVec3(
    SKEW_LINE_METRICS.foot2,
    scaleVec3(normalizeVec3(LINE_2.direction), distance),
  );
  return { p, q, distance: lengthVec3(subVec3(q, p)) };
}
