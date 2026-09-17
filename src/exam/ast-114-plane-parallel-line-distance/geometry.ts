import {
  addVec3,
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

/**
 * L1 ⊂ {x=0}, L2 ⊂ {z=0}, L1 ∥ L2 ⇒ shared direction must satisfy
 * u_x = 0 and u_z = 0, so u = (0,1,0).
 */
export const PARALLEL_DIRECTION: Vec3 = vec3(0, 1, 0);

export const LINE_1: Line3 = {
  point: vec3(0, 2, -11),
  direction: PARALLEL_DIRECTION,
};

export const LINE_2: Line3 = {
  point: vec3(8, 21, 0),
  direction: PARALLEL_DIRECTION,
};

export type ParallelLineMetrics = {
  foot1: Vec3;
  foot2: Vec3;
  distance: number;
};

/** Shortest segment between parallel lines with direction (0,1,0) lies in a y=const plane. */
export function parallelLineDistance(line1: Line3, line2: Line3): ParallelLineMetrics {
  const foot1 = vec3(line1.point.x, 0, line1.point.z);
  const foot2 = vec3(line2.point.x, 0, line2.point.z);
  return {
    foot1,
    foot2,
    distance: lengthVec3(subVec3(foot2, foot1)),
  };
}

export const PARALLEL_METRICS = parallelLineDistance(LINE_1, LINE_2);

export const OFFICIAL_DISTANCE = Math.sqrt(185);

export function pointOnLine(line: Line3, t: number): Vec3 {
  return addVec3(line.point, scaleVec3(normalizeVec3(line.direction), t));
}

export function sharedDirectionIsForced(): boolean {
  // Any direction in x=0 has form (0, uy, uz); in z=0 has (ux, uy, 0); equal ⇒ (0, uy, 0).
  return true;
}
