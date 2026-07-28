import {
  multiply,
  polar,
  type Vec2,
} from '../../curve/modules/complex-arithmetic-geometry/geometry';

export const FIXED_POINT = { x: -3 / 5, y: 4 / 5 } as const;
export const OFFICIAL_THETA_DEGREES = (Math.atan2(2, 1) * 180) / Math.PI;
export const OFFICIAL_SOLUTION = {
  a: Math.sqrt(5) / 5,
  b: (2 * Math.sqrt(5)) / 5,
} as const;

export type ComplexUnitCircleScene = {
  thetaDegrees: number;
  z: Vec2;
  zSquared: Vec2;
  zCubed: Vec2;
  distanceToZ: number;
  distanceToZCubed: number;
  distanceGap: number;
};

export function buildComplexUnitCircleScene(thetaDegrees: number): ComplexUnitCircleScene {
  const safeTheta = Math.max(5, Math.min(85, thetaDegrees));
  const z = polar(1, (safeTheta * Math.PI) / 180);
  const zSquared = multiply(z, z);
  const zCubed = multiply(zSquared, z);
  const distanceToZ = distance(FIXED_POINT, z);
  const distanceToZCubed = distance(FIXED_POINT, zCubed);

  return {
    thetaDegrees: safeTheta,
    z,
    zSquared,
    zCubed,
    distanceToZ,
    distanceToZCubed,
    distanceGap: Math.abs(distanceToZ - distanceToZCubed),
  };
}

function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
