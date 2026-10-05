import type { CurvePoint, ThumbnailPath, ThumbnailSpec } from '../../types';
import {
  addVec3,
  crossVec3,
  degToRad,
  lengthVec3,
  normalizeVec3,
  planeQuad,
  project,
  scaleVec3,
  vec3,
  type Vec3,
  type ViewAngles,
} from '../../projection3d';

/** 一列：ax + by + cz = d */
export type Row = { a: number; b: number; c: number; d: number };

export type RowOpParams = {
  /** 0 唯一解、1 一條直線、2 無解 */
  preset: number;
  /** 第三列 ← 第三列 + k × 第一列 */
  k: number;
};

export type Solution =
  | { kind: 'point'; point: Vec3 }
  | { kind: 'line'; point: Vec3; direction: Vec3 }
  | { kind: 'empty' }
  | { kind: 'plane' };

export type PlanePatch = {
  role: 'fixed' | 'moved';
  corners: Vec3[];
};

export type RowOpScene = {
  rows: [Row, Row, Row];
  planes: PlanePatch[];
  /** 前兩式的交線。三組起始方程式的前兩式都是 x=1、y=1。 */
  guide: [Vec3, Vec3];
  /** 第一式與第三式的交線。列運算讓金色平面繞它轉。 */
  hinge: [Vec3, Vec3] | null;
  solution: Solution;
};

export const PRESETS = [
  { id: 0, label: '唯一解' },
  { id: 1, label: '一條直線' },
  { id: 2, label: '無解' },
] as const;

export const DEFAULT_ROW_OP_PARAMS: RowOpParams = { preset: 0, k: 0 };

export const VIEW: ViewAngles = { yaw: degToRad(38), pitch: degToRad(26) };
export const PLANE_HALF = 2.05;
export const LINE_HALF = 2.15;
const EPS = 1e-8;

const GOLD = 'rgb(212, 184, 122)';
const WHITE = 'rgba(255, 255, 255, 0.72)';
const THUMBNAIL_SCALE = 58;

export function clampK(k: number): number {
  if (!Number.isFinite(k)) return 0;
  return Math.min(2, Math.max(-2, k));
}

export function presetId(preset: number): 0 | 1 | 2 {
  if (preset === 1 || preset === 2) return preset;
  return 0;
}

/** 前兩列固定。第三列決定解是點、直線或空集合。 */
function baseRows(preset: 0 | 1 | 2): [Row, Row, Row] {
  const first: Row = { a: 1, b: 0, c: 0, d: 1 };
  const second: Row = { a: 0, b: 1, c: 0, d: 1 };
  if (preset === 1) return [first, second, { a: 1, b: 1, c: 0, d: 2 }];
  if (preset === 2) return [first, second, { a: 1, b: 1, c: 0, d: 0 }];
  return [first, second, { a: 0, b: 0, c: 1, d: 1 }];
}

export function applyRowOp(rows: [Row, Row, Row], k: number): [Row, Row, Row] {
  const [first, second, third] = rows;
  return [
    first,
    second,
    {
      a: third.a + k * first.a,
      b: third.b + k * first.b,
      c: third.c + k * first.c,
      d: third.d + k * first.d,
    },
  ];
}

function residual(row: Row, point: Vec3): number {
  return row.a * point.x + row.b * point.y + row.c * point.z - row.d;
}

export function rowResidual(row: Row, point: Vec3): number {
  return residual(row, point);
}

/**
 * 增廣矩陣列梯形。係數全消、常數還在，就是無解。
 * 秩 3 是一點，秩 2 是一條直線，更低則不只一條直線。
 */
export function solveRows(rows: [Row, Row, Row]): Solution {
  const m = rows.map((row) => [row.a, row.b, row.c, row.d]);
  const pivotCol = [-1, -1, -1];
  let rank = 0;

  for (let col = 0; col < 3 && rank < 3; col += 1) {
    let best = rank;
    for (let i = rank + 1; i < 3; i += 1) {
      if (Math.abs(m[i]![col]!) > Math.abs(m[best]![col]!)) best = i;
    }
    if (Math.abs(m[best]![col]!) < EPS) continue;
    if (best !== rank) {
      const swap = m[rank]!;
      m[rank] = m[best]!;
      m[best] = swap;
    }
    const pivot = m[rank]![col]!;
    for (let j = col; j < 4; j += 1) m[rank]![j] = m[rank]![j]! / pivot;
    for (let i = 0; i < 3; i += 1) {
      if (i === rank) continue;
      const factor = m[i]![col]!;
      if (Math.abs(factor) < EPS) continue;
      for (let j = col; j < 4; j += 1) m[i]![j] = m[i]![j]! - factor * m[rank]![j]!;
    }
    pivotCol[rank] = col;
    rank += 1;
  }

  for (const row of m) {
    const coeffsGone = Math.abs(row[0]!) < EPS && Math.abs(row[1]!) < EPS && Math.abs(row[2]!) < EPS;
    if (coeffsGone && Math.abs(row[3]!) > EPS) return { kind: 'empty' };
  }
  if (rank === 3) {
    const x = [0, 0, 0];
    for (let i = 0; i < 3; i += 1) x[pivotCol[i]!] = m[i]![3]!;
    return { kind: 'point', point: vec3(x[0]!, x[1]!, x[2]!) };
  }
  if (rank === 2) {
    const free = [0, 1, 2].find((col) => !pivotCol.includes(col)) ?? 2;
    const point = [0, 0, 0];
    const direction = [0, 0, 0];
    direction[free] = 1;
    for (let i = 0; i < rank; i += 1) {
      const col = pivotCol[i]!;
      point[col] = m[i]![3]!;
      direction[col] = -m[i]![free]!;
    }
    return {
      kind: 'line',
      point: vec3(point[0]!, point[1]!, point[2]!),
      direction: normalizeVec3(vec3(direction[0]!, direction[1]!, direction[2]!)),
    };
  }
  return { kind: 'plane' };
}

/** 兩平面的交線。平行時沒有。 */
function planeMeet(first: Row, second: Row): { point: Vec3; direction: Vec3 } | null {
  const direction = crossVec3(vec3(first.a, first.b, first.c), vec3(second.a, second.b, second.c));
  if (lengthVec3(direction) < EPS) return null;
  const dir = normalizeVec3(direction);
  const abs = [Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z)];
  const free = abs.indexOf(Math.max(...abs));
  const axes = [0, 1, 2].filter((axis) => axis !== free);
  const coef = (row: Row, axis: number) => [row.a, row.b, row.c][axis]!;
  const a11 = coef(first, axes[0]!);
  const a12 = coef(first, axes[1]!);
  const a21 = coef(second, axes[0]!);
  const a22 = coef(second, axes[1]!);
  const det = a11 * a22 - a12 * a21;
  if (Math.abs(det) < EPS) return null;
  const u = (first.d * a22 - a12 * second.d) / det;
  const v = (a11 * second.d - first.d * a21) / det;
  const coords = [0, 0, 0];
  coords[axes[0]!] = u;
  coords[axes[1]!] = v;
  return { point: vec3(coords[0]!, coords[1]!, coords[2]!), direction: dir };
}

function segment(point: Vec3, direction: Vec3): [Vec3, Vec3] {
  const step = scaleVec3(normalizeVec3(direction), LINE_HALF);
  return [addVec3(point, scaleVec3(step, -1)), addVec3(point, step)];
}

function patchFromRow(row: Row, role: PlanePatch['role']): PlanePatch | null {
  const normal = vec3(row.a, row.b, row.c);
  const len = lengthVec3(normal);
  if (len < EPS) return null;
  const unit = scaleVec3(normal, 1 / len);
  return { role, corners: planeQuad(unit, row.d / len, PLANE_HALF) };
}

export function sceneFromParams(params: RowOpParams): RowOpScene {
  const rows = applyRowOp(baseRows(presetId(params.preset)), clampK(params.k));
  const guideLine = planeMeet(rows[0], rows[1]);
  const hingeLine = planeMeet(rows[0], rows[2]);
  const planes = [patchFromRow(rows[0], 'fixed'), patchFromRow(rows[1], 'fixed'), patchFromRow(rows[2], 'moved')]
    .filter((patch): patch is PlanePatch => patch !== null);
  return {
    rows,
    planes,
    guide: guideLine ? segment(guideLine.point, guideLine.direction) : [vec3(1, 1, -LINE_HALF), vec3(1, 1, LINE_HALF)],
    hinge: hingeLine ? segment(hingeLine.point, hingeLine.direction) : null,
    solution: solveRows(rows),
  };
}

function trim(n: number): string {
  const rounded = Math.round(n * 1000) / 1000;
  if (Math.abs(rounded) < 5e-4) return '0';
  if (Math.abs(rounded - Math.round(rounded)) < 5e-4) return String(Math.round(rounded));
  return rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

export function formatRow(row: Row): string {
  const parts: string[] = [];
  for (const [coef, name] of [
    [row.a, 'x'],
    [row.b, 'y'],
    [row.c, 'z'],
  ] as const) {
    if (Math.abs(coef) < EPS) continue;
    const body = trim(Math.abs(coef)) === '1' ? name : `${trim(Math.abs(coef))}${name}`;
    if (parts.length === 0) parts.push(coef < 0 ? `−${body}` : body);
    else parts.push(coef < 0 ? `− ${body}` : `+ ${body}`);
  }
  return `${parts.join(' ') || '0'} = ${trim(row.d)}`;
}

export function presetLabel(preset: number): string {
  return PRESETS.find((item) => item.id === presetId(preset))?.label ?? '唯一解';
}

export function solutionLabel(solution: Solution): string {
  if (solution.kind === 'empty') return '無解';
  if (solution.kind === 'plane') return '不只一條直線';
  if (solution.kind === 'point') {
    return `(${trim(solution.point.x)}, ${trim(solution.point.y)}, ${trim(solution.point.z)})`;
  }
  if (Math.abs(solution.direction.x) < 1e-6 && Math.abs(solution.direction.y) < 1e-6) {
    return `x = ${trim(solution.point.x)}, y = ${trim(solution.point.y)}`;
  }
  return `過 (${trim(solution.point.x)}, ${trim(solution.point.y)}, ${trim(solution.point.z)})`;
}

function toCurvePoint(point: Vec3, index: number): CurvePoint {
  const projected = project(point, VIEW);
  return {
    x: projected.x * THUMBNAIL_SCALE,
    y: projected.y * THUMBNAIL_SCALE,
    theta: index,
    arcLength: index,
  };
}

export function sampleRowOpThumbnail(params: RowOpParams): ThumbnailSpec {
  const scene = sceneFromParams(params);
  const paths: ThumbnailPath[] = scene.planes.map((patch) => ({
    points: patch.corners.map(toCurvePoint),
    closed: true,
    stroke: patch.role === 'moved' ? GOLD : WHITE,
    strokeWidth: patch.role === 'moved' ? 2.4 : 1.3,
    fill: patch.role === 'moved' ? 'rgba(212, 184, 122, 0.14)' : 'rgba(255, 255, 255, 0.05)',
  }));
  paths.push({
    points: scene.guide.map((point, index) => toCurvePoint(point, index)),
    closed: false,
    stroke: WHITE,
    strokeWidth: 1.6,
  });
  if (scene.solution.kind === 'line') {
    paths.push({
      points: segment(scene.solution.point, scene.solution.direction).map((point, index) => toCurvePoint(point, index)),
      closed: false,
      stroke: GOLD,
      strokeWidth: 3,
    });
  } else if (scene.hinge) {
    paths.push({
      points: scene.hinge.map((point, index) => toCurvePoint(point, index)),
      closed: false,
      stroke: GOLD,
      strokeWidth: 1.5,
    });
  }
  const circles = scene.solution.kind === 'point'
    ? [{ ...toCurvePoint(scene.solution.point, 0), r: 5, fill: GOLD }]
    : [];
  return { paths, circles };
}

