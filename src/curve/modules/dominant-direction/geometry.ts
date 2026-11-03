import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

/** 主方向離水平軸 28°。沿這條直線拉 1.4 倍，沿垂直方向拉 0.7 倍。 */
export type DominantParams = {
  thetaDeg: number;
  steps: number;
};

export const PHI_DEG = 28;
export const LAMBDA_MAJOR = 1.4;
export const LAMBDA_MINOR = 0.7;
export const THETA_MIN = 0;
export const THETA_MAX = 180;
export const STEPS_MIN = 0;
export const STEPS_MAX = 8;

export const DEFAULT_DOMINANT_PARAMS: DominantParams = {
  thetaDeg: 70,
  steps: 3,
};

/** 單位箭頭、1.4 倍的像，以及直線末端外側的 λ 標籤都留在畫面內。 */
export const VIEW = {
  x0: -1.95,
  x1: 1.95,
  y0: -1.95,
  y1: 1.95,
};

export type Vec = { x: number; y: number };

export type PlotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type DominantReading = {
  u: Vec;
  stretched: Vec;
  stretch: number;
  angleDeg: number;
  trail: Vec[];
  major: Vec;
  minor: Vec;
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function radians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function clampDominant(params: Partial<DominantParams> | ParamValues): DominantParams {
  return {
    thetaDeg: clamp(
      Number(params.thetaDeg ?? DEFAULT_DOMINANT_PARAMS.thetaDeg),
      THETA_MIN,
      THETA_MAX,
    ),
    steps: Math.round(
      clamp(Number(params.steps ?? DEFAULT_DOMINANT_PARAMS.steps), STEPS_MIN, STEPS_MAX),
    ),
  };
}

export function axis(deg: number): Vec {
  const t = radians(deg);
  return { x: Math.cos(t), y: Math.sin(t) };
}

/** 世界座標乘上這張固定的對稱矩陣。 */
export function multiplyA(v: Vec): Vec {
  const major = axis(PHI_DEG);
  const minor = axis(PHI_DEG + 90);
  const c1 = v.x * major.x + v.y * major.y;
  const c2 = v.x * minor.x + v.y * minor.y;
  return {
    x: LAMBDA_MAJOR * c1 * major.x + LAMBDA_MINOR * c2 * minor.x,
    y: LAMBDA_MAJOR * c1 * major.y + LAMBDA_MINOR * c2 * minor.y,
  };
}

export function readDominant(params: Partial<DominantParams> | ParamValues): DominantReading {
  const clamped = clampDominant(params);
  const major = axis(PHI_DEG);
  const minor = axis(PHI_DEG + 90);
  const delta = radians(clamped.thetaDeg - PHI_DEG);
  const base1 = Math.cos(delta);
  const base2 = Math.sin(delta);

  const scaled = (steps: number) => {
    const c1 = base1 * LAMBDA_MAJOR ** steps;
    const c2 = base2 * LAMBDA_MINOR ** steps;
    return { c1, c2, len: Math.hypot(c1, c2) };
  };

  const place = (c1: number, c2: number, len: number): Vec => ({
    x: (c1 * major.x + c2 * minor.x) / len,
    y: (c1 * major.y + c2 * minor.y) / len,
  });

  const current = scaled(clamped.steps);
  const trail: Vec[] = [];
  for (let steps = 0; steps <= clamped.steps; steps += 1) {
    const step = scaled(steps);
    trail.push(place(step.c1, step.c2, step.len));
  }

  return {
    u: place(current.c1, current.c2, current.len),
    stretched: {
      x: (LAMBDA_MAJOR * current.c1 * major.x + LAMBDA_MINOR * current.c2 * minor.x) / current.len,
      y: (LAMBDA_MAJOR * current.c1 * major.y + LAMBDA_MINOR * current.c2 * minor.y) / current.len,
    },
    stretch: Math.hypot(LAMBDA_MAJOR * current.c1, LAMBDA_MINOR * current.c2) / current.len,
    angleDeg: (Math.atan2(Math.abs(current.c2), Math.abs(current.c1)) * 180) / Math.PI,
    trail,
    major,
    minor,
  };
}

export function formatDegrees(value: number): string {
  return `${value.toFixed(1)}°`;
}

export function plotSquare(width: number, height: number): PlotRect {
  const pad = 18;
  const side = Math.max(1, Math.min(width, height) - pad * 2);
  return {
    left: (width - side) / 2,
    top: (height - side) / 2,
    width: side,
    height: side,
  };
}

export function mapX(plot: PlotRect, x: number): number {
  return plot.left + ((x - VIEW.x0) / (VIEW.x1 - VIEW.x0)) * plot.width;
}

export function mapY(plot: PlotRect, y: number): number {
  return plot.top + ((VIEW.y1 - y) / (VIEW.y1 - VIEW.y0)) * plot.height;
}

function point(v: Vec): CurvePoint {
  return { x: v.x, y: v.y, theta: 0, arcLength: 0 };
}

function circlePoints(steps: number): Vec[] {
  const points: Vec[] = [];
  for (let i = 0; i <= steps; i += 1) points.push(axis((360 * i) / steps));
  return points;
}

export function sampleDominantThumbnail(params: DominantParams): ThumbnailSpec {
  const reading = readDominant(params);
  const arm = 1.35;
  return {
    paths: [
      {
        points: circlePoints(96).map(point),
        closed: true,
        stroke: '#ffffff',
        strokeWidth: 1.1,
        opacity: 0.35,
      },
      {
        points: [
          point({ x: -arm * reading.minor.x, y: -arm * reading.minor.y }),
          point({ x: arm * reading.minor.x, y: arm * reading.minor.y }),
        ],
        stroke: '#ffffff',
        strokeWidth: 1.1,
        opacity: 0.45,
      },
      {
        points: [
          point({ x: -arm * reading.major.x, y: -arm * reading.major.y }),
          point({ x: arm * reading.major.x, y: arm * reading.major.y }),
        ],
        stroke: '#d4b87a',
        strokeWidth: 1.5,
        opacity: 0.9,
      },
      {
        points: [point({ x: 0, y: 0 }), point(reading.u)],
        stroke: '#ffffff',
        strokeWidth: 1.4,
        opacity: 0.9,
      },
    ],
    circles: reading.trail.slice(0, -1).map((v) => ({
      x: v.x,
      y: v.y,
      r: 0.035,
      fill: '#d4b87a',
    })),
  };
}
