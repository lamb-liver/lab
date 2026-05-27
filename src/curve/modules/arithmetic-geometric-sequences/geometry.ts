import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const MODE_ARITHMETIC = 0;
export const MODE_GEOMETRIC = 1;

export type SequenceMode = 'arithmetic' | 'geometric';

export const SEQUENCE_VIEW = {
  width: 1100,
  height: 760,
  baseY: 500,
  paddingX: 130,
  chartHeight: 280,
  geometricHeight: 220,
};

export type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  fillAlpha: number;
};

export type ArithmeticScene = {
  values: number[];
  bars: RectShape[];
  mirrorBars: RectShape[];
  formulaRect: RectShape;
  trendLine: { x1: number; y1: number; x2: number; y2: number };
  currentSum: number;
  formulaSum: number;
  an: number;
};

export type GeometricScene = {
  values: number[];
  rects: RectShape[];
  outline: { x: number; y: number; width: number; height: number };
  partitions: Array<{ x: number; y1: number; y2: number }>;
  currentSum: number;
  formulaSum: number;
};

export function sequenceModeFromParams(params: ParamValues): SequenceMode {
  return Math.round(params.mode ?? MODE_ARITHMETIC) === MODE_GEOMETRIC
    ? 'geometric'
    : 'arithmetic';
}

export function buildArithmeticScene(params: ParamValues, revealProgress: number): ArithmeticScene {
  const a1 = params.arithmeticA1 ?? 2;
  const d = params.arithmeticD ?? 1;
  const n = Math.max(1, Math.round(params.arithmeticN ?? 8));
  const values = Array.from({ length: n }, (_, i) => a1 + i * d);
  const an = values[values.length - 1] ?? a1;
  const maxValue = Math.max(...values, 1);
  const scaleY = SEQUENCE_VIEW.chartHeight / maxValue;
  const totalWidth = SEQUENCE_VIEW.width - 260;
  const stepWidth = totalWidth / n;
  const bars: RectShape[] = [];
  const mirrorBars: RectShape[] = [];
  let currentSum = 0;

  for (let i = 0; i < n; i += 1) {
    const value = values[i]!;
    const progress = clamp01(revealProgress * n - i);
    const height = value * scaleY * progress;
    const x = SEQUENCE_VIEW.paddingX + i * stepWidth;
    bars.push({
      x,
      y: SEQUENCE_VIEW.baseY - height,
      width: Math.max(0, stepWidth - 4),
      height,
      fillAlpha: 0.12,
    });
    currentSum += value * progress;

    const mirrorValue = values[n - 1 - i]!;
    const mirrorProgress = clamp01(revealProgress * n - i);
    const mirrorHeight = mirrorValue * scaleY * mirrorProgress;
    mirrorBars.push({
      x,
      y: SEQUENCE_VIEW.baseY - mirrorHeight,
      width: Math.max(0, stepWidth - 4),
      height: mirrorHeight,
      fillAlpha: 0,
    });
  }

  const rectHeight = an * scaleY;
  return {
    values,
    bars,
    mirrorBars,
    formulaRect: {
      x: SEQUENCE_VIEW.paddingX,
      y: SEQUENCE_VIEW.baseY - rectHeight,
      width: totalWidth,
      height: rectHeight,
      fillAlpha: 0.03,
    },
    trendLine: {
      x1: SEQUENCE_VIEW.paddingX + stepWidth * 0.5,
      y1: SEQUENCE_VIEW.baseY - a1 * scaleY,
      x2: SEQUENCE_VIEW.paddingX + totalWidth - stepWidth * 0.5,
      y2: SEQUENCE_VIEW.baseY - an * scaleY,
    },
    currentSum,
    formulaSum: (n * (2 * a1 + (n - 1) * d)) / 2,
    an,
  };
}

export function buildGeometricScene(params: ParamValues, revealProgress: number): GeometricScene {
  const a1 = params.geometricA1 ?? 1;
  const r = params.geometricR ?? 0.5;
  const n = Math.max(1, Math.round(params.geometricN ?? 8));
  const values = Array.from({ length: n }, (_, i) => a1 * Math.pow(r, i));
  const totalValue = values.reduce((sum, value) => sum + value, 0) || 1;
  const maxWidth = SEQUENCE_VIEW.width - 260;
  const widthScale = maxWidth / totalValue;
  const rectHeight = SEQUENCE_VIEW.geometricHeight;
  const rects: RectShape[] = [];
  const partitions: Array<{ x: number; y1: number; y2: number }> = [];
  let x = SEQUENCE_VIEW.paddingX;
  let currentSum = 0;

  for (let i = 0; i < n; i += 1) {
    const value = values[i]!;
    const progress = clamp01(revealProgress * n - i);
    const targetWidth = value * widthScale;
    const width = targetWidth * progress;
    rects.push({
      x,
      y: SEQUENCE_VIEW.baseY - rectHeight,
      width,
      height: rectHeight,
      fillAlpha: mapRange(i, 0, n, 0.22, 0.05),
    });
    x += width;
    currentSum += value * progress;
    if (i < n - 1) {
      partitions.push({
        x,
        y1: SEQUENCE_VIEW.baseY - rectHeight,
        y2: SEQUENCE_VIEW.baseY,
      });
    }
  }

  const formulaSum =
    Math.abs(1 - r) < 1e-6 ? a1 * n : a1 * ((1 - Math.pow(r, n)) / (1 - r));

  return {
    values,
    rects,
    outline: {
      x: SEQUENCE_VIEW.paddingX,
      y: SEQUENCE_VIEW.baseY - SEQUENCE_VIEW.geometricHeight,
      width: x - SEQUENCE_VIEW.paddingX,
      height: SEQUENCE_VIEW.geometricHeight,
    },
    partitions,
    currentSum,
    formulaSum,
  };
}

export function buildSequenceThumbnail(params: ParamValues): ThumbnailSpec {
  const mode = sequenceModeFromParams(params);
  if (mode === 'geometric') {
    const scene = buildGeometricScene(params, 1);
    return {
      paths: [
        ...scene.rects.map((rect) => ({
          points: rectToCurvePoints(rect),
          closed: true,
          opacity: 0.9,
          strokeWidth: 1,
        })),
      ],
    };
  }

  const scene = buildArithmeticScene(params, 1);
  return {
    paths: [
      {
        points: rectToCurvePoints(scene.formulaRect),
        closed: true,
        opacity: 0.22,
        strokeWidth: 1,
        excludeFromBbox: true,
      },
      ...scene.bars.map((rect) => ({
        points: rectToCurvePoints(rect),
        closed: true,
        opacity: 0.9,
        strokeWidth: 1,
      })),
      {
        points: lineToCurvePoints(scene.trendLine),
        opacity: 0.42,
        strokeWidth: 0.8,
      },
    ],
  };
}

function rectToCurvePoints(rect: RectShape): CurvePoint[] {
  return pointsToCurvePoints([
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ]);
}

function lineToCurvePoints(line: { x1: number; y1: number; x2: number; y2: number }): CurvePoint[] {
  return pointsToCurvePoints([
    { x: line.x1, y: line.y1 },
    { x: line.x2, y: line.y2 },
  ]);
}

function pointsToCurvePoints(raw: Array<{ x: number; y: number }>): CurvePoint[] {
  let cumulative = 0;
  let prev = raw[0];
  return raw.map((point, index) => {
    if (index > 0 && prev) {
      cumulative += Math.hypot(point.x - prev.x, point.y - prev.y);
    }
    prev = point;
    return {
      x: point.x,
      y: point.y,
      theta: index,
      arcLength: cumulative,
    };
  });
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
