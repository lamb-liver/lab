import {
  computeDemoivreMetrics,
  formatComplex,
  fromPolar,
  integerN,
  mag,
  arg,
  type Complex,
} from '../../curve/modules/demoivre-nth-roots/geometry';

export type PowersRootsMode = 'multiply' | 'power' | 'roots';

export type PowersRootsParams = {
  mode: PowersRootsMode;
  n: number;
  z1: Complex;
  z2: Complex;
};

export const DEFAULT_POWERS_ROOTS_PARAMS: PowersRootsParams = {
  mode: 'multiply',
  n: 3,
  z1: { re: 1.15, im: 0.55 },
  z2: { re: 0.85, im: -0.45 },
};

export function multiply(a: Complex, b: Complex): Complex {
  return fromPolar(mag(a) * mag(b), arg(a) + arg(b));
}

export function multiplyViewportRadius(z1: Complex, z2: Complex): number {
  const product = multiply(z1, z2);
  return Math.max(1.35, mag(z1), mag(z2), mag(product) * 1.08);
}

export function modeTitle(mode: PowersRootsMode, locale?: 'en'): string {
  if (locale === 'en') {
    if (mode === 'multiply') return 'Arguments add';
    if (mode === 'power') return 'Argument times n';
    return 'n equal parts';
  }
  if (mode === 'multiply') return '幅角相加';
  if (mode === 'power') return '幅角乘 n';
  return '幅角 n 等分';
}

export function modeVerdict(params: PowersRootsParams, locale?: 'en'): string {
  const n = integerN(params.n);
  if (params.mode === 'multiply') {
    const product = multiply(params.z1, params.z2);
    return locale === 'en'
      ? `Arg(z₁z₂) = Arg z₁ + Arg z₂, product at ${formatComplex(product)}`
      : `Arg(z₁z₂) = Arg z₁ + Arg z₂，乘積在 ${formatComplex(product)}`;
  }
  const metrics = computeDemoivreMetrics({
    mode: params.mode,
    n,
    re: params.z1.re,
    im: params.z1.im,
  });
  if (params.mode === 'power') {
    return locale === 'en'
      ? `Arg(z^${n}) = ${n} Arg z, z^${n} = ${formatComplex(metrics.result)}`
      : `Arg(z^${n}) = ${n} Arg z，z^${n} = ${formatComplex(metrics.result)}`;
  }
  if (metrics.zero) {
    return locale === 'en'
      ? 'w = 0 has only the origin as a root, and the argument is undefined'
      : 'w = 0 只有原點這一個根，幅角沒有定義';
  }
  return locale === 'en'
    ? `${n} roots, neighbors differ by 2π/${n}, k=0 root ${formatComplex(metrics.result)}`
    : `${n} 個方根相鄰差 2π/${n}，k=0 根 ${formatComplex(metrics.result)}`;
}

export function readings(params: PowersRootsParams, locale?: 'en'): Array<[string, string]> {
  const n = integerN(params.n);
  if (params.mode === 'multiply') {
    const product = multiply(params.z1, params.z2);
    return [
      ['z₁', formatComplex(params.z1)],
      ['z₂', formatComplex(params.z2)],
      ['z₁z₂', formatComplex(product)],
    ];
  }
  const metrics = computeDemoivreMetrics({
    mode: params.mode,
    n,
    re: params.z1.re,
    im: params.z1.im,
  });
  if (params.mode === 'roots') {
    const rootLabel = metrics.zero
      ? locale === 'en'
        ? 'Root'
        : '根'
      : locale === 'en'
        ? 'k=0 root'
        : 'k=0 根';
    return [
      ['w', formatComplex(metrics.z)],
      ['|w|', metrics.r.toFixed(2)],
      [rootLabel, formatComplex(metrics.result)],
    ];
  }
  return [
    ['z', formatComplex(metrics.z)],
    ['|z|', metrics.r.toFixed(2)],
    [`z^${n}`, formatComplex(metrics.result)],
  ];
}
