import type { CurvePoint, ThumbnailPath, ThumbnailSpec } from '../../types';

export type Vector2 = {
  x: number;
  y: number;
};

export type Matrix2 = {
  a: number;
  b: number;
  c: number;
  d: number;
};

type EigenDirection = {
  lambda: number;
  v: Vector2;
};

export type EigenData =
  | {
      kind: 'complex';
      real: number;
      imag: number;
      trace: number;
      det: number;
      disc: number;
    }
  | {
      kind: 'all';
      lambda: number;
      trace: number;
      det: number;
      disc: number;
    }
  | {
      kind: 'one' | 'two';
      directions: EigenDirection[];
      trace: number;
      det: number;
      disc: number;
    };

export type EigenvectorPresetId =
  | 'stretch'
  | 'rotation'
  | 'shear'
  | 'reflection'
  | 'saddle'
  | 'scalar'
  | 'rotstretch'
  | 'singular'
  | 'mixed';

type EigenvectorPreset = {
  id: EigenvectorPresetId;
  label: string;
  note: string;
  advanced: boolean;
  matrix: Matrix2;
};

export const EIGENVECTOR_WORLD_RADIUS = 4.25;
export const EIGENVECTOR_GRID_RADIUS = 4;
export const EIGENVECTOR_MIN_VECTOR = 0.12;
export const EIGENVECTOR_MAX_VECTOR = 3.45;

export const EIGENVECTOR_PRESETS: EigenvectorPreset[] = [
  {
    id: 'stretch',
    label: '伸縮',
    note: '兩條座標軸都是特徵方向',
    advanced: false,
    matrix: { a: 1.8, b: 0, c: 0, d: 0.65 },
  },
  {
    id: 'rotation',
    label: '旋轉',
    note: '非 180 度旋轉無實方向',
    advanced: false,
    matrix: makeRotation(Math.PI / 4),
  },
  {
    id: 'shear',
    label: '剪切',
    note: '重根且只有一條特徵方向',
    advanced: false,
    matrix: { a: 1, b: 1.15, c: 0, d: 1 },
  },
  {
    id: 'reflection',
    label: '反射',
    note: '一條同向，一條反向',
    advanced: false,
    matrix: { a: 1, b: 0, c: 0, d: -1 },
  },
  {
    id: 'saddle',
    label: '鞍點',
    note: '一正一負，方向一伸一反',
    advanced: false,
    matrix: { a: 1.25, b: 0, c: 0, d: -0.82 },
  },
  {
    id: 'scalar',
    label: '純量',
    note: '每個方向都是特徵方向',
    advanced: false,
    matrix: { a: 1.35, b: 0, c: 0, d: 1.35 },
  },
  {
    id: 'rotstretch',
    label: '旋伸',
    note: '旋轉加縮放，仍無實特徵方向',
    advanced: true,
    matrix: { a: 0.95, b: -0.69, c: 0.69, d: 0.95 },
  },
  {
    id: 'singular',
    label: '壓扁',
    note: 'det A = 0，有方向被壓到原點',
    advanced: true,
    matrix: { a: 1.2, b: 0.8, c: 0.6, d: 0.4 },
  },
  {
    id: 'mixed',
    label: '斜向',
    note: '特徵方向不必是座標軸',
    advanced: true,
    matrix: { a: 1.15, b: 0.75, c: 0.45, d: 0.35 },
  },
];

export function presetById(id: string): EigenvectorPreset | undefined {
  return EIGENVECTOR_PRESETS.find((preset) => preset.id === id);
}

function trace(m: Matrix2): number {
  return m.a + m.d;
}

function det2(m: Matrix2): number {
  return m.a * m.d - m.b * m.c;
}

export function matVec(m: Matrix2, v: Vector2): Vector2 {
  return {
    x: m.a * v.x + m.b * v.y,
    y: m.c * v.x + m.d * v.y,
  };
}

export function eigenData(m: Matrix2): EigenData {
  const tr = trace(m);
  const determinant = det2(m);
  const disc = tr * tr - 4 * determinant;
  const eps = 1e-8;

  if (disc < -eps) {
    return {
      kind: 'complex',
      real: tr / 2,
      imag: Math.sqrt(-disc) / 2,
      trace: tr,
      det: determinant,
      disc,
    };
  }

  if (Math.abs(disc) <= eps) {
    const lambda = tr / 2;
    if (isScalarMatrix(m, lambda)) {
      return {
        kind: 'all',
        lambda,
        trace: tr,
        det: determinant,
        disc: 0,
      };
    }

    return {
      kind: 'one',
      directions: [{ lambda, v: eigenvectorFor(m, lambda) }],
      trace: tr,
      det: determinant,
      disc: 0,
    };
  }

  const root = Math.sqrt(disc);
  const l1 = (tr + root) / 2;
  const l2 = (tr - root) / 2;

  return {
    kind: 'two',
    directions: [
      { lambda: l1, v: eigenvectorFor(m, l1) },
      { lambda: l2, v: eigenvectorFor(m, l2) },
    ],
    trace: tr,
    det: determinant,
    disc,
  };
}

export function eigenStatusText(eigen: EigenData): string {
  if (eigen.kind === 'two') return '兩方向';
  if (eigen.kind === 'one') return '一方向';
  if (eigen.kind === 'all') return '每個方向';
  return '無實方向';
}

function normalize(v: Vector2): Vector2 {
  const len = mag(v);
  if (len < 1e-12) return { x: 1, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function scaleVec(v: Vector2, s: number): Vector2 {
  return { x: v.x * s, y: v.y * s };
}

function mag(v: Vector2): number {
  return Math.hypot(v.x, v.y);
}

export function clampVectorLength(v: Vector2, fallback: Vector2): Vector2 {
  const len = mag(v);
  if (len < EIGENVECTOR_MIN_VECTOR) {
    return scaleVec(normalize(fallback), EIGENVECTOR_MIN_VECTOR);
  }
  if (len > EIGENVECTOR_MAX_VECTOR) {
    return scaleVec(normalize(v), EIGENVECTOR_MAX_VECTOR);
  }
  return v;
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const next = Math.abs(n) < 0.005 ? 0 : n;
  return next.toFixed(2);
}

export function fmtVec(v: Vector2): string {
  return `(${fmt(v.x)}, ${fmt(v.y)})`;
}

export function matrixFromParams(params: Record<string, number>): Matrix2 {
  return {
    a: params.a,
    b: params.b,
    c: params.c,
    d: params.d,
  };
}

export function vectorFromParams(params: Record<string, number>): Vector2 {
  return {
    x: params.ux,
    y: params.uy,
  };
}

export function paramsFromMatrixVector(m: Matrix2, u: Vector2): Record<string, number> {
  return {
    a: m.a,
    b: m.b,
    c: m.c,
    d: m.d,
    ux: u.x,
    uy: u.y,
  };
}

export function buildEigenvectorThumbnail(params: Record<string, number>): ThumbnailSpec {
  const matrix = matrixFromParams(params);
  const eigen = eigenData(matrix);
  const paths: ThumbnailPath[] = [];
  const gridRadius = 2.8;

  for (let i = -3; i <= 3; i += 1) {
    paths.push({
      points: toCurvePoints([
        matVec(matrix, { x: -gridRadius, y: i }),
        matVec(matrix, { x: gridRadius, y: i }),
      ]),
      opacity: 0.22,
      stroke: '#d4b87a',
      strokeWidth: 1,
    });
    paths.push({
      points: toCurvePoints([
        matVec(matrix, { x: i, y: -gridRadius }),
        matVec(matrix, { x: i, y: gridRadius }),
      ]),
      opacity: 0.18,
      stroke: '#5dade2',
      strokeWidth: 1,
    });
  }

  if (eigen.kind === 'two' || eigen.kind === 'one') {
    for (const direction of eigen.directions) {
      paths.push({
        points: toCurvePoints([
          scaleVec(direction.v, -3.5),
          scaleVec(direction.v, 3.5),
        ]),
        opacity: 0.72,
        stroke: '#5dade2',
        strokeWidth: 1.35,
      });
    }
  }

  const u = vectorFromParams(params);
  paths.push({
    points: toCurvePoints([{ x: 0, y: 0 }, u]),
    stroke: '#5dade2',
    strokeWidth: 2,
  });
  paths.push({
    points: toCurvePoints([{ x: 0, y: 0 }, matVec(matrix, u)]),
    stroke: '#d4b87a',
    strokeWidth: 3,
  });

  return {
    coordinateSystem: 'math',
    paths,
    circles: [{ x: u.x, y: u.y, r: 0.08, fill: '#5dade2', opacity: 0.95 }],
  };
}

function makeRotation(theta: number): Matrix2 {
  return {
    a: Math.cos(theta),
    b: -Math.sin(theta),
    c: Math.sin(theta),
    d: Math.cos(theta),
  };
}

function eigenvectorFor(m: Matrix2, lambda: number): Vector2 {
  const vA = { x: m.b, y: lambda - m.a };
  const vB = { x: lambda - m.d, y: m.c };
  let v = magSq(vA) >= magSq(vB) ? vA : vB;
  if (mag(v) < 1e-8) v = { x: 1, y: 0 };
  v = normalize(v);

  if (v.x < -1e-8 || (Math.abs(v.x) < 1e-8 && v.y < 0)) {
    v = scaleVec(v, -1);
  }

  return v;
}

function isScalarMatrix(m: Matrix2, lambda: number): boolean {
  return (
    Math.abs(m.a - lambda) < 1e-7 &&
    Math.abs(m.d - lambda) < 1e-7 &&
    Math.abs(m.b) < 1e-7 &&
    Math.abs(m.c) < 1e-7
  );
}

function magSq(v: Vector2): number {
  return v.x * v.x + v.y * v.y;
}

function toCurvePoints(points: Vector2[]): CurvePoint[] {
  let arcLength = 0;
  return points.map((point, index) => {
    if (index > 0) {
      const prev = points[index - 1]!;
      arcLength += Math.hypot(point.x - prev.x, point.y - prev.y);
    }
    return {
      x: point.x,
      y: point.y,
      theta: index,
      arcLength,
    };
  });
}
