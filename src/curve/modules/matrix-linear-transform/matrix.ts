import type { Matrix2, MatrixMode, Point2, SpecialType } from './types';

export function matrixIdentity(): Matrix2 {
  return { a: 1, b: 0, c: 0, d: 1 };
}

export function matrixRotation(theta: number): Matrix2 {
  return {
    a: Math.cos(theta),
    b: -Math.sin(theta),
    c: Math.sin(theta),
    d: Math.cos(theta),
  };
}

function matrixScale(s: number): Matrix2 {
  return { a: s, b: 0, c: 0, d: s };
}

export function matrixShearX(k: number): Matrix2 {
  return { a: 1, b: k, c: 0, d: 1 };
}

function matrixReflection(theta: number): Matrix2 {
  return {
    a: Math.cos(2 * theta),
    b: Math.sin(2 * theta),
    c: Math.sin(2 * theta),
    d: -Math.cos(2 * theta),
  };
}

export function matrixFromSpecial(type: SpecialType, value: number): Matrix2 {
  if (type === 'rotation') return matrixRotation(value);
  if (type === 'scale') return matrixScale(value);
  if (type === 'shear') return matrixShearX(value);
  return matrixReflection(value);
}

export function multiplyMatrices(A: Matrix2, B: Matrix2): Matrix2 {
  return {
    a: A.a * B.a + A.b * B.c,
    b: A.a * B.b + A.b * B.d,
    c: A.c * B.a + A.d * B.c,
    d: A.c * B.b + A.d * B.d,
  };
}

export function transformPoint(m: Matrix2, x: number, y: number): Point2 {
  return {
    x: m.a * x + m.b * y,
    y: m.c * x + m.d * y,
  };
}

export function matrixDet(m: Matrix2): number {
  return m.a * m.d - m.b * m.c;
}

export function matrixDifference(A: Matrix2, B: Matrix2): number {
  return (
    Math.abs(A.a - B.a) +
    Math.abs(A.b - B.b) +
    Math.abs(A.c - B.c) +
    Math.abs(A.d - B.d)
  );
}

export function lerpMatrix(from: Matrix2, to: Matrix2, t: number): Matrix2 {
  return {
    a: from.a + (to.a - from.a) * t,
    b: from.b + (to.b - from.b) * t,
    c: from.c + (to.c - from.c) * t,
    d: from.d + (to.d - from.d) * t,
  };
}

export function matrixText(m: Matrix2): string {
  return `[${m.a.toFixed(2)} ${m.b.toFixed(2)}; ${m.c.toFixed(2)} ${m.d.toFixed(2)}]`;
}

type SpecialParam = { value: number; label: string };

export function getSpecialParam(type: SpecialType, raw: number): SpecialParam {
  if (type === 'scale') {
    const s = mapRange(raw, -180, 180, 0.2, 2.4);
    return { value: s, label: s.toFixed(2) };
  }

  if (type === 'shear') {
    const k = mapRange(raw, -180, 180, -1.8, 1.8);
    return { value: k, label: k.toFixed(2) };
  }

  return {
    value: (raw * Math.PI) / 180,
    label: `${raw.toFixed(0)}°`,
  };
}

function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function getSpecialTitle(type: SpecialType): string {
  if (type === 'rotation') return 'rotation';
  if (type === 'scale') return 'scale';
  if (type === 'shear') return 'shear';
  return 'reflection';
}

export function getSpecialNote(type: SpecialType): string {
  if (type === 'rotation') return '旋轉矩陣的元素來自 cosθ 與 sinθ。';
  if (type === 'scale') return '等比例縮放會把面積放大為 s² 倍。';
  if (type === 'shear') return '剪切會傾斜網格，但 det 維持 1。';
  return '反射會翻轉方向，因此 det < 0。';
}

export function getSpecialFormula(type: SpecialType): string {
  if (type === 'rotation') return '[cosθ -sinθ;\n sinθ  cosθ]';
  if (type === 'scale') return '[s 0;\n 0 s]';
  if (type === 'shear') return '[1 k;\n 0 1]';
  return '[cos2θ sin2θ;\n sin2θ -cos2θ]';
}

export function targetMatrixFromParams(params: MatrixLinearTargetInput): Matrix2 {
  if (params.mode === 'free') {
    return { ...params.free };
  }

  if (params.mode === 'special') {
    const { value } = getSpecialParam(params.specialType, params.specialParamRaw);
    return matrixFromSpecial(params.specialType, value);
  }

  return matrixIdentity();
}

export type MatrixLinearTargetInput = {
  mode: MatrixMode;
  free: Matrix2;
  specialType: SpecialType;
  specialParamRaw: number;
};
