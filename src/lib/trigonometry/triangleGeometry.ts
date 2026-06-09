export const TRIANGLE_EPS = 0.0001;

export type Vec2 = { x: number; y: number };

export type TriangleVerts = {
  A: Vec2;
  B: Vec2;
  C: Vec2;
};

export type TriangleSidesAngles = {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  R: number;
};

export type Circumcircle = {
  o: Vec2;
  r: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function safeAcos(v: number) {
  return Math.acos(clamp(v, -1, 1));
}

export function dist2(P: Vec2, Q: Vec2) {
  return Math.hypot(P.x - Q.x, P.y - Q.y);
}

export function sub(P: Vec2, Q: Vec2): Vec2 {
  return { x: P.x - Q.x, y: P.y - Q.y };
}

export function cross(P: Vec2, Q: Vec2) {
  return P.x * Q.y - P.y * Q.x;
}

export function computeTriangleSidesAngles(triangle: TriangleVerts): TriangleSidesAngles {
  const { A, B, C } = triangle;
  const a = dist2(B, C);
  const b = dist2(C, A);
  const c = dist2(A, B);

  const angleA = safeAcos((b * b + c * c - a * a) / (2 * b * c));
  const angleB = safeAcos((c * c + a * a - b * b) / (2 * c * a));
  const angleC = Math.PI - angleA - angleB;

  const area2 = Math.abs(cross(sub(B, A), sub(C, A)));
  const R = area2 < TRIANGLE_EPS ? NaN : (a * b * c) / (2 * area2);

  return { a, b, c, A: angleA, B: angleB, C: angleC, R };
}

export function circumcircleFromTriangle(A: Vec2, B: Vec2, C: Vec2): Circumcircle | null {
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  if (Math.abs(d) < TRIANGLE_EPS) return null;

  const a2 = A.x * A.x + A.y * A.y;
  const b2 = B.x * B.x + B.y * B.y;
  const c2 = C.x * C.x + C.y * C.y;

  const ux = (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d;
  const uy = (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d;
  const o = { x: ux, y: uy };
  return { o, r: dist2(o, A) };
}

export function preventTriangleCollapse(
  triangle: TriangleVerts,
  lastKey: 'A' | 'B' | 'C',
): TriangleVerts {
  const { A, B, C } = triangle;
  const signedArea2 = cross(sub(B, A), sub(C, A));
  if (Math.abs(signedArea2) > 0.1) return triangle;

  const sign = signedArea2 >= 0 ? 1 : -1;
  let grad: Vec2;

  if (lastKey === 'A') grad = { x: B.y - C.y, y: C.x - B.x };
  else if (lastKey === 'B') grad = { x: C.y - A.y, y: A.x - C.x };
  else grad = { x: A.y - B.y, y: B.x - A.x };

  const len = Math.hypot(grad.x, grad.y) || 1;
  const pushAmount = 0.12;
  const point = triangle[lastKey];

  return {
    ...triangle,
    [lastKey]: {
      x: clamp(point.x + (grad.x / len) * pushAmount * sign, -1.75, 1.75),
      y: clamp(point.y + (grad.y / len) * pushAmount * sign, -1.25, 1.35),
    },
  };
}
