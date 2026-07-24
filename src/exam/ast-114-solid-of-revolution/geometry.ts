export const MIN_A = -0.5;
export const MAX_A = 1;

export function profileY(x: number, a: number): number {
  return 3 * a * x * x + 1 - a;
}

export function exactVolume(a: number): number {
  return Math.PI * (2 + (8 * a * a) / 5);
}

export function midpointDiskVolume(a: number, slices: number): number {
  const count = Math.max(1, Math.floor(slices));
  const dx = 2 / count;
  let sum = 0;

  for (let index = 0; index < count; index += 1) {
    const x = -1 + (index + 0.5) * dx;
    sum += Math.PI * profileY(x, a) ** 2 * dx;
  }

  return sum;
}
