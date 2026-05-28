import { TAU } from './constants';
import type { Complex, OpKey } from './types';

export function magC(z: Complex): number {
  return Math.hypot(z.re, z.im);
}

export function argC(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

export function normalizeAngle(a: number): number {
  let v = a % TAU;
  if (v < 0) v += TAU;
  return v;
}

export function computeOperation(a: Complex, b: Complex, op: OpKey): Complex {
  if (op === 'add') {
    return { re: a.re + b.re, im: a.im + b.im };
  }

  if (op === 'sub') {
    return { re: a.re - b.re, im: a.im - b.im };
  }

  if (op === 'div') {
    const d = b.re * b.re + b.im * b.im;
    if (d < 0.0001) return { re: 0, im: 0 };
    return {
      re: (a.re * b.re + a.im * b.im) / d,
      im: (a.im * b.re - a.re * b.im) / d,
    };
  }

  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function formatNum(v: number): string {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 0.0005) return '0.000';
  if (Math.abs(v) >= 100) return v.toFixed(2);
  if (Math.abs(v) >= 10) return v.toFixed(3);
  return v.toFixed(3);
}

export function formatComplex(z: Complex): string {
  const re = formatNum(z.re);
  const imAbs = formatNum(Math.abs(z.im));
  const sign = z.im >= 0 ? '+' : '−';
  return `${re} ${sign} ${imAbs}i`;
}

export function formatAngle(a: number): string {
  const ratio = normalizeAngle(a) / Math.PI;

  if (Math.abs(ratio) < 0.005) return '0';
  if (Math.abs(ratio - 0.5) < 0.005) return 'π/2';
  if (Math.abs(ratio - 1) < 0.005) return 'π';
  if (Math.abs(ratio - 1.5) < 0.005) return '3π/2';
  if (Math.abs(ratio - 2) < 0.005) return '2π';

  return `${formatNum(ratio)}π`;
}

export function getOperationHint(op: OpKey): string {
  if (op === 'add') return '加法：把 z₂ 的箭頭接到 z₁ 後方';
  if (op === 'sub') return '減法：z₁ − z₂ 等於從 z₂ 指向 z₁';
  if (op === 'div') return '除法：模相除，角相減';
  return '乘法：模相乘，角相加';
}
