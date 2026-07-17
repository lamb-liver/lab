import { FOURIER_1D_X_OFFSET, FOURIER_1D_X_SPAN, SAMPLE_STEP, TAU } from './constants';

export type FourierMode = '1D' | '2D';

type FourierPathPoint = {
  x: number;
  y: number;
  theta: number;
  arcLength: number;
};

export type EpicycleDef = {
  n: number;
  radius: number;
};

export type FourierPathCache = {
  mode: FourierMode;
  N: number;
  points: FourierPathPoint[];
  totalLength: number;
  epicycles: EpicycleDef[];
};

function harmonicRadius(mode: FourierMode, n: number): number {
  const base = mode === '1D' ? 80 : 120;
  return base * (4 / (Math.PI * n));
}

function buildEpicycles(mode: FourierMode, N: number): EpicycleDef[] {
  const epicycles: EpicycleDef[] = [];
  for (let i = 0; i < N; i++) {
    const n = i * 2 + 1;
    epicycles.push({ n, radius: harmonicRadius(mode, n) });
  }
  return epicycles;
}

/** mode + N 變更時預算完整路徑（含 arcLength LUT） */
export function buildFourierPath(mode: FourierMode, N: number): FourierPathCache {
  const nInt = Math.round(N);
  const epicycles = buildEpicycles(mode, nInt);
  const points: FourierPathPoint[] = [];
  let cumulative = 0;
  let prevX: number | null = null;
  let prevY: number | null = null;

  for (let t = 0; t <= TAU + SAMPLE_STEP; t += SAMPLE_STEP) {
    let x = 0;
    let y = 0;

    if (mode === '1D') {
      x = t * (FOURIER_1D_X_SPAN / TAU) - FOURIER_1D_X_OFFSET;
      for (const { n, radius } of epicycles) {
        y += radius * Math.sin(n * t);
      }
    } else {
      for (const { n, radius } of epicycles) {
        x += radius * Math.cos(n * t);
        y += radius * Math.sin(n * t);
      }
    }

    if (prevX !== null && prevY !== null) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta: t, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return {
    mode,
    N: nInt,
    points,
    totalLength: cumulative,
    epicycles,
  };
}

/** arcLength → t（binary search + 線性插值，guide 與 reveal 邊緣同步） */
export function tAtArcLength(
  points: ReadonlyArray<FourierPathPoint>,
  targetLength: number,
): number {
  if (points.length === 0) return 0;
  if (targetLength <= 0) return 0;

  const last = points[points.length - 1]!;
  if (targetLength >= last.arcLength) return last.theta;

  let lo = 1;
  let hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid]!.arcLength < targetLength) lo = mid + 1;
    else hi = mid;
  }

  const prev = points[lo - 1]!;
  const curr = points[lo]!;
  const span = curr.arcLength - prev.arcLength;
  if (span <= 0) return curr.theta;

  const frac = (targetLength - prev.arcLength) / span;
  return prev.theta + frac * (curr.theta - prev.theta);
}
