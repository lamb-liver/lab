import { boxSummary, type BoxplotSummary } from '../../curve/modules/percentile-box-plot/geometry';
import {
  clamp,
  regression,
  type RegressionFit,
  type ScatterPoint,
} from '../../curve/modules/scatter-correlation-regression/geometry';

export type DataPoint = ScatterPoint;
export type QuartileSummary = BoxplotSummary;
export { clamp, regression, type RegressionFit };

export function createScatterPoints(targetN: number, slope: number, noise: number): DataPoint[] {
  const points: DataPoint[] = [];

  for (let i = 0; i < targetN; i++) {
    const t = (i + 0.5) / targetN;
    const x = 1.1 + 7.8 * t + 0.34 * Math.sin(i * 2.17 + 0.8);
    const wave = 0.72 * Math.sin(i * 3.43 + 1.2) + 0.38 * Math.cos(i * 1.71);
    const y = 5 + slope * (x - 5) + noise * wave;
    points.push({ x: clamp(x, 0.4, 9.6), y: clamp(y, 0.4, 9.6) });
  }

  return points;
}

export function createOutlierBase(): DataPoint[] {
  return [
    { x: 1.0, y: 2.0 },
    { x: 1.7, y: 2.7 },
    { x: 2.4, y: 3.0 },
    { x: 3.0, y: 3.7 },
    { x: 3.7, y: 4.1 },
    { x: 4.3, y: 4.8 },
    { x: 5.1, y: 5.0 },
    { x: 5.8, y: 5.7 },
    { x: 6.4, y: 6.0 },
    { x: 7.1, y: 6.7 },
  ];
}

export function createBoxplotValues(targetN: number): number[] {
  const values: number[] = [];

  for (let i = 0; i < targetN; i++) {
    const t = targetN === 1 ? 0.5 : i / (targetN - 1);
    const v = 2.0 + 5.8 * t + 0.44 * Math.sin(i * 1.67 + 0.5);
    values.push(clamp(v, 0.4, 9.6));
  }

  if (targetN >= 10) {
    values[0] = 0.9;
    values[values.length - 1] = 9.2;
  }

  return values;
}

export function nextScatterPoint(points: DataPoint[], slope: number, noise: number): DataPoint {
  const i = points.length;
  const x = 2.0 + ((i * 2.37) % 6.1);
  const y = clamp(5 + slope * (x - 5) + Math.sin(i * 2.8) * noise, 0.4, 9.6);
  return { x, y };
}

export function nextBoxplotValue(length: number): number {
  return clamp(5 + Math.sin(length * 2.1) * 2.4, 0, 10);
}

export function quartileSummary(values: number[]): QuartileSummary {
  return boxSummary(values, 1.5);
}
