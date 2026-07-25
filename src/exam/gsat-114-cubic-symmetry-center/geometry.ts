export type Point2 = { x: number; y: number };

export const DIVISOR_ROOT = -6;
export const REMAINDER = 3;
export const QUOTIENT_MAXIMUM = 8;
export const DEFAULT_CUBIC_COEFFICIENT = -0.25;
export const CUBIC_SYMMETRY_CENTER: Point2 = {
  x: DIVISOR_ROOT,
  y: REMAINDER,
};

export function quotientValue(
  x: number,
  coefficient = DEFAULT_CUBIC_COEFFICIENT,
): number {
  return coefficient * (x - DIVISOR_ROOT) ** 2 + QUOTIENT_MAXIMUM;
}

export function cubicValue(
  x: number,
  coefficient = DEFAULT_CUBIC_COEFFICIENT,
): number {
  return (x - DIVISOR_ROOT) * quotientValue(x, coefficient) + REMAINDER;
}

export function symmetrySample(
  distance: number,
  coefficient = DEFAULT_CUBIC_COEFFICIENT,
) {
  const left = {
    x: DIVISOR_ROOT - distance,
    y: cubicValue(DIVISOR_ROOT - distance, coefficient),
  };
  const right = {
    x: DIVISOR_ROOT + distance,
    y: cubicValue(DIVISOR_ROOT + distance, coefficient),
  };

  return {
    left,
    right,
    quotientY: quotientValue(left.x, coefficient),
    midpoint: {
      x: (left.x + right.x) / 2,
      y: (left.y + right.y) / 2,
    },
  };
}
