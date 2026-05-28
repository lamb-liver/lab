import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const BINORMAL_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_X = 0;
export const MODE_Z = 1;
export const MODE_SIM = 2;

export type BinormalMode = 'x' | 'z' | 'sim';

export function modeFromValue(value: number | undefined): BinormalMode {
  const mode = Math.round(value ?? MODE_X);
  if (mode === MODE_Z) return 'z';
  if (mode === MODE_SIM) return 'sim';
  return 'x';
}

export function deriveBinormalData(params: ParamValues) {
  const n = Math.max(5, Math.min(120, Math.round(params.n ?? 24)));
  const p = Math.max(0.05, Math.min(0.95, (params.p ?? 50) / 100));
  const q = 1 - p;
  const mu = n * p;
  const variance = n * p * q;
  const sigma = Math.sqrt(variance);
  const probs: number[] = [];
  for (let k = 0; k <= n; k += 1) probs.push(binomialPMF(n, k, p));
  return { n, p, q, mu, variance, sigma, probs };
}

export function binomialPMF(n: number, k: number, p: number): number {
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  const logP = logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
  return Math.exp(logP);
}

export function normalPDF(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(Math.PI * 2));
}

export function percent(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

export function buildBinormalThumbnail(): ThumbnailSpec {
  const bars: CurvePoint[] = [];
  const curve: CurvePoint[] = [];
  const left = 160;
  const right = 760;
  const baseY = 670;
  const bins = 13;
  for (let i = 0; i < bins; i += 1) {
    const centerT = i / (bins - 1);
    const centerX = left + centerT * (right - left);
    const width = 26;
    const h = Math.exp(-((centerT - 0.5) ** 2) / 0.06) * 220;
    bars.push(
      { x: centerX - width / 2, y: baseY, theta: i, arcLength: i },
      { x: centerX - width / 2, y: baseY - h, theta: i + 0.1, arcLength: i + 0.1 },
      { x: centerX + width / 2, y: baseY - h, theta: i + 0.2, arcLength: i + 0.2 },
      { x: centerX + width / 2, y: baseY, theta: i + 0.3, arcLength: i + 0.3 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.4, arcLength: i + 0.4 },
    );
  }
  for (let i = 0; i <= 140; i += 1) {
    const t = i / 140;
    const x = left + t * (right - left);
    const y = 640 - Math.exp(-((t - 0.5) ** 2) / 0.055) * 250;
    curve.push({ x, y, theta: t, arcLength: t });
  }
  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: bars, opacity: 0.46, strokeWidth: 0.78 },
      { points: curve, opacity: 0.9, strokeWidth: 1.08 },
    ],
  };
}

function logChoose(n: number, k: number): number {
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

function logFactorial(n: number): number {
  let s = 0;
  for (let i = 2; i <= n; i += 1) s += Math.log(i);
  return s;
}
