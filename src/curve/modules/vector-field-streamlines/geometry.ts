export type WorldPoint = { x: number; y: number };
export type Velocity = { x: number; y: number };

export const INTEGRATION_STEP_SIZE = 0.03;
export const BOUND_LIMIT = 5;
export const CAMERA_SCALE = 120;

export function evaluateVectorField(
  x: number,
  y: number,
  time: number,
): Velocity {
  const radiusSq = x * x + y * y + 0.05;
  let vx = -y / radiusSq;
  let vy = x / radiusSq;
  vx += 0.25 * Math.sin(y * 2 + time * 0.8);
  vy += 0.25 * Math.cos(x * 2 + time * 0.8);
  return { x: vx, y: vy };
}

/** RK2 midpoint integration along the field */
export function integrateStreamline(
  seed: WorldPoint,
  steps: number,
  stepSize: number,
  time: number,
): WorldPoint[] {
  const points: WorldPoint[] = [];
  let x = seed.x;
  let y = seed.y;
  points.push({ x, y });

  for (let i = 0; i < steps; i++) {
    const v1 = evaluateVectorField(x, y, time);
    const midX = x + v1.x * stepSize * 0.5;
    const midY = y + v1.y * stepSize * 0.5;
    const v2 = evaluateVectorField(midX, midY, time);
    x += v2.x * stepSize;
    y += v2.y * stepSize;

    if (Math.abs(x) > BOUND_LIMIT || Math.abs(y) > BOUND_LIMIT) break;
    points.push({ x, y });
  }

  return points;
}

export function buildStreamlineSeed(
  index: number,
  count: number,
  time: number,
): WorldPoint {
  const angle = (Math.PI * 2 * index) / count;
  const radius = 1.2 + 0.25 * Math.sin(time * 1.5 + index);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function buildAllStreamlines(
  count: number,
  steps: number,
  stepSize: number,
  time: number,
): WorldPoint[][] {
  const streamlines: WorldPoint[][] = [];
  const n = Math.max(1, Math.round(count));
  for (let i = 0; i < n; i++) {
    const seed = buildStreamlineSeed(i, n, time);
    streamlines.push(integrateStreamline(seed, steps, stepSize, time));
  }
  return streamlines;
}
