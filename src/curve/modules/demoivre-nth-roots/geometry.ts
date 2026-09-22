import type { CurvePoint, ThumbnailSpec } from '../../types';
import { BASE_CANVAS_SIZE } from '../../constants';

export type Complex = { re: number; im: number };

export type DemoivreMode = 'power' | 'roots';

export type DemoivreNthRootsParams = {
  mode: DemoivreMode;
  n: number;
  re: number;
  im: number;
};

export const DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS: DemoivreNthRootsParams = {
  mode: 'power',
  n: 3,
  re: 1.15,
  im: 0.55,
};

export const N_MIN = 2;
export const N_MAX = 8;
const EPS = 1e-9;
const MAX_RADIUS = 2.4;

export type PlotLayout = {
  origin: Complex;
  scale: number;
  radius: number;
};

export type DemoivreMetrics = {
  z: Complex;
  n: number;
  r: number;
  theta: number;
  powers: Complex[];
  roots: Complex[];
  result: Complex;
  viewportRadius: number;
  zero: boolean;
};

export function clampRadius(re: number, im: number): Complex {
  const r = Math.hypot(re, im);
  if (r <= MAX_RADIUS) return { re, im };
  if (r < EPS) return { re: MAX_RADIUS, im: 0 };
  const s = MAX_RADIUS / r;
  return { re: re * s, im: im * s };
}

export function mag(z: Complex): number {
  return Math.hypot(z.re, z.im);
}

export function arg(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

export function fromPolar(r: number, theta: number): Complex {
  return { re: r * Math.cos(theta), im: r * Math.sin(theta) };
}

export function normalizeAngle(theta: number): number {
  const tau = Math.PI * 2;
  let value = theta % tau;
  if (value <= -Math.PI) value += tau;
  if (value > Math.PI) value -= tau;
  return value;
}

export function integerN(n: number): number {
  return Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
}

export function powerOf(z: Complex, k: number): Complex {
  if (k === 0) return { re: 1, im: 0 };
  const r = mag(z);
  if (r < EPS) return { re: 0, im: 0 };
  return fromPolar(r ** k, arg(z) * k);
}

export function nthRoots(z: Complex, n: number): Complex[] {
  const count = integerN(n);
  const r = mag(z);
  if (r < EPS) return Array.from({ length: count }, () => ({ re: 0, im: 0 }));
  const radius = r ** (1 / count);
  const base = arg(z);
  return Array.from({ length: count }, (_, k) =>
    fromPolar(radius, (base + k * 2 * Math.PI) / count),
  );
}

export function computeDemoivreMetrics(params: DemoivreNthRootsParams): DemoivreMetrics {
  const n = integerN(params.n);
  const z = clampRadius(params.re, params.im);
  const r = mag(z);
  const theta = arg(z);
  const powers = Array.from({ length: n }, (_, index) => powerOf(z, index + 1));
  const roots = nthRoots(z, n);
  const result = params.mode === 'power' ? powers[n - 1]! : roots[0]!;
  const longest = params.mode === 'power' ? mag(result) : Math.max(r, mag(roots[0]!));
  return {
    z,
    n,
    r,
    theta,
    powers,
    roots,
    result,
    viewportRadius: Math.max(1.35, longest * 1.08),
    zero: r < EPS,
  };
}

export function createPlotLayout(
  width: number,
  height: number,
  radius: number,
): PlotLayout {
  const base = Math.min(width, height);
  const margin = Math.max(28, base * 0.08);
  const usable = base - margin * 2;
  return {
    origin: { re: width / 2, im: height / 2 },
    scale: usable / (radius * 2),
    radius,
  };
}

export function toScreen(layout: PlotLayout, z: Complex): { x: number; y: number } {
  return {
    x: layout.origin.re + z.re * layout.scale,
    y: layout.origin.im - z.im * layout.scale,
  };
}

export function toWorld(layout: PlotLayout, point: { x: number; y: number }): Complex {
  return {
    re: (point.x - layout.origin.re) / layout.scale,
    im: (layout.origin.im - point.y) / layout.scale,
  };
}

export function formatComplex(z: Complex, digits = 2): string {
  const im = Math.abs(z.im).toFixed(digits);
  const sign = z.im >= 0 ? '+' : '−';
  return `${z.re.toFixed(digits)} ${sign} ${im}i`;
}

const THUMBNAIL_SCALE = 90;

function toThumb(z: Complex, index: number): CurvePoint {
  const half = BASE_CANVAS_SIZE / 2;
  return {
    x: Math.max(-half, Math.min(half, z.re * THUMBNAIL_SCALE)),
    y: Math.max(-half, Math.min(half, z.im * THUMBNAIL_SCALE)),
    theta: index,
    arcLength: index,
  };
}

export function sampleDemoivreThumbnail(params: DemoivreNthRootsParams): ThumbnailSpec {
  const metrics = computeDemoivreMetrics({ ...params, mode: 'power' });
  const unit: CurvePoint[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    unit.push(toThumb({ re: Math.cos(t), im: Math.sin(t) }, i));
  }

  const paths: ThumbnailSpec['paths'] = [
    { points: unit, opacity: 0.35, strokeWidth: 0.8, excludeFromBbox: true },
  ];
  for (const point of metrics.powers) {
    paths.push({
      points: [toThumb({ re: 0, im: 0 }, 0), toThumb(point, 1)],
    });
  }

  return {
    paths,
    circles: metrics.powers.map((point, index) => {
      const thumb = toThumb(point, index);
      return { x: thumb.x, y: thumb.y, r: 4 };
    }),
  };
}
