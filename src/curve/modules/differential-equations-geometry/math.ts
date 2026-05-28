import { DOMAIN } from './constants';
import type { EquationDef, Point2 } from './types';

function rk4Step(
  eq: EquationDef,
  x: number,
  y: number,
  h: number,
): Point2 {
  const k1 = eq.f(x, y);
  const k2 = eq.f(x + h * 0.5, y + h * k1 * 0.5);
  const k3 = eq.f(x + h * 0.5, y + h * k2 * 0.5);
  const k4 = eq.f(x + h, y + h * k3);

  return {
    x: x + h,
    y: y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4),
  };
}

export function traceSolution(
  eq: EquationDef,
  x0: number,
  y0: number,
  h: number,
  steps: number,
): Point2[] {
  const path: Point2[] = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;

  for (let i = 0; i < steps; i++) {
    const next = rk4Step(eq, x, y, h);
    x = next.x;
    y = next.y;

    if (
      x < DOMAIN.xMin ||
      x > DOMAIN.xMax ||
      y < DOMAIN.yMin ||
      y > DOMAIN.yMax ||
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) {
      break;
    }

    path.push({ x, y });
  }

  return path;
}

export function buildExactPath(
  eq: EquationDef,
  x0: number,
  y0: number,
): Point2[] {
  const path: Point2[] = [];

  for (let i = 0; i <= 360; i++) {
    const x = x0 + (i / 360) * (DOMAIN.xMax - x0);
    const y = eq.exact(x, x0, y0);

    if (y >= DOMAIN.yMin && y <= DOMAIN.yMax && Number.isFinite(y)) {
      path.push({ x, y });
    }
  }

  return path;
}

export function buildEulerPath(
  eq: EquationDef,
  x0: number,
  y0: number,
  h: number,
): Point2[] {
  const path: Point2[] = [{ x: x0, y: y0 }];

  let x = x0;
  let y = y0;

  while (x + h <= DOMAIN.xMax + 0.0001) {
    const slope = eq.f(x, y);

    y = y + h * slope;
    x = x + h;

    if (!Number.isFinite(y) || y < DOMAIN.yMin - 2 || y > DOMAIN.yMax + 2) {
      break;
    }

    path.push({ x, y });
  }

  return path;
}
