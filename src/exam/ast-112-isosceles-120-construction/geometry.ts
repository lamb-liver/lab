export type Point = { x: number; y: number };

export const ORIGINAL_APEX_ANGLE = 120;
export const AB = Math.sqrt(7);
export const AC = Math.sqrt(3);
export const BC = 2;

export type IsoscelesConstruction = {
  apexAngle: number;
  baseAngle: number;
  angleBAC: number;
  angleMAN: number;
  AM: number;
  AN: number;
  mnSquared: number;
  points: Record<'A' | 'B' | 'C' | 'M' | 'N', Point>;
};

export function buildIsoscelesConstruction(apexAngle: number): IsoscelesConstruction {
  const safeApexAngle = Math.min(150, Math.max(60, apexAngle));
  const baseAngle = (180 - safeApexAngle) / 2;
  const angleBAC = toDegrees(Math.acos((AB ** 2 + AC ** 2 - BC ** 2) / (2 * AB * AC)));
  const AM = AB / (2 * Math.sin(toRadians(safeApexAngle / 2)));
  const AN = AC / (2 * Math.sin(toRadians(safeApexAngle / 2)));
  const angleMAN = angleBAC + 2 * baseAngle;
  const mnSquared = AM ** 2 + AN ** 2 - 2 * AM * AN * Math.cos(toRadians(angleMAN));

  return {
    apexAngle: safeApexAngle,
    baseAngle,
    angleBAC,
    angleMAN,
    AM,
    AN,
    mnSquared,
    points: {
      A: { x: 0, y: 0 },
      B: { x: AB, y: 0 },
      C: polarPoint(AC, angleBAC),
      M: polarPoint(AM, -baseAngle),
      N: polarPoint(AN, angleBAC + baseAngle),
    },
  };
}

export function distanceSquared(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function polarPoint(length: number, degrees: number): Point {
  const angle = toRadians(degrees);
  return { x: length * Math.cos(angle), y: length * Math.sin(angle) };
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
