export const PALETTE: [number, number, number][] = [
  [0, 0, 0],
  [18, 12, 24],
  [52, 28, 68],
  [120, 70, 140],
  [212, 184, 122],
  [255, 245, 220],
];

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function samplePalette(t: number): [number, number, number] {
  const clamped = clamp(t, 0, 1);
  const n = PALETTE.length - 1;
  const s = clamped * n;
  const lo = Math.floor(s);
  const hi = Math.min(lo + 1, n);
  const f = s - lo;
  const a = PALETTE[lo];
  const b = PALETTE[hi];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

export function juliaSmooth(
  zx: number,
  zy: number,
  cx: number,
  cy: number,
  maxIter: number,
): number {
  let x = zx;
  let y = zy;

  for (let i = 0; i < maxIter; i++) {
    const x2 = x * x;
    const y2 = y * y;
    const r2 = x2 + y2;

    if (r2 > 4) {
      const mag = Math.sqrt(r2);
      return i + 1 - Math.log2(Math.log2(mag));
    }

    const nx = x2 - y2 + cx;
    y = 2 * x * y + cy;
    x = nx;
  }

  return maxIter;
}

export function iterToColor(t: number, maxIter: number): [number, number, number] {
  if (t >= maxIter) {
    return [0, 0, 0];
  }

  let v = t / maxIter;
  v = Math.pow(v, 0.42);
  v += Math.sin(v * 10) * 0.01;
  v = clamp(v, 0, 1);
  return samplePalette(v);
}

export function driftPath(t: number): { x: number; y: number } {
  return {
    x: -0.745 + 0.06 * Math.cos(t * 0.7) + 0.02 * Math.cos(t * 2.1),
    y: 0.186 + 0.05 * Math.sin(t * 1.3),
  };
}

export function lerpToward(a: number, b: number, f: number): number {
  return a + (b - a) * f;
}
