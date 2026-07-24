import { TAU } from '../../curve/modules/sinusoid-amplitude-period-phase/geometry';

export type SinusoidCoefficients = {
  a: number;
  b: number;
};

export const DEFAULT_SINUSOID_COEFFICIENTS: SinusoidCoefficients = {
  a: 1,
  b: Math.sqrt(3),
};

export function sinusoidValue(x: number, { a, b }: SinusoidCoefficients): number {
  return a * Math.sin(x) + b * Math.cos(x);
}

export function sinusoidForm({ a, b }: SinusoidCoefficients) {
  const amplitude = Math.hypot(a, b);
  return {
    amplitude,
    phase: amplitude < 1e-9 ? 0 : Math.atan2(b, a),
  };
}

export function shiftedSineValue(
  x: number,
  coefficients: SinusoidCoefficients,
  progress: number,
): number {
  const { amplitude, phase } = sinusoidForm(coefficients);
  return amplitude * Math.sin(x + phase * Math.min(1, Math.max(0, progress)));
}

export function symmetryAxes(
  coefficients: SinusoidCoefficients,
  min = 0,
  max = TAU,
): number[] {
  const { amplitude, phase } = sinusoidForm(coefficients);
  if (amplitude < 1e-9) return [];

  const base = Math.PI / 2 - phase;
  const first = Math.ceil((min - base) / Math.PI);
  const last = Math.floor((max - base) / Math.PI);
  const axes: number[] = [];

  for (let k = first; k <= last; k += 1) axes.push(base + k * Math.PI);
  return axes;
}
