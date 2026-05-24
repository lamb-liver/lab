import type { CurvePoint } from '../../types';

export type Point2 = { x: number; y: number };

export type AffineMatrix = {
  a: number;
  b: number;
  c: number;
  d: number;
};

export type Translation = { tx: number; ty: number };

export type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const CORE_RADIUS = 35;
export const SECOND_LAYER_TRANSLATION_SCALE = 0.5;

export function buildBasePattern(): Point2[] {
  const r = CORE_RADIUS;
  return [
    { x: -r, y: -r },
    { x: r, y: -r },
    { x: r, y: r },
    { x: -r, y: r },
    { x: -r, y: -r },
  ];
}

export function buildAffineMatrix(
  rotationDeg: number,
  time: number,
): AffineMatrix {
  const breathAngleOffset = Math.sin(time) * 0.15;
  const rad = (rotationDeg * Math.PI) / 180 + breathAngleOffset;
  const scale = 0.72 + Math.cos(time) * 0.03;

  return {
    a: scale * Math.cos(rad),
    b: -scale * Math.sin(rad),
    c: scale * Math.sin(rad),
    d: scale * Math.cos(rad),
  };
}

export function buildTranslationVectors(
  translationDistance: number,
  revealProgress: number,
): Translation[] {
  const distance = translationDistance * revealProgress;
  return [
    { tx: distance, ty: 0 },
    { tx: -distance, ty: 0 },
    { tx: 0, ty: distance },
    { tx: 0, ty: -distance },
  ];
}

export function applyAffineTransform(
  points: ReadonlyArray<Point2>,
  matrix: AffineMatrix,
  translation: Translation,
): Point2[] {
  const out: Point2[] = [];
  for (const pt of points) {
    out.push({
      x: matrix.a * pt.x + matrix.b * pt.y + translation.tx,
      y: matrix.c * pt.x + matrix.d * pt.y + translation.ty,
    });
  }
  return out;
}

export function appendPolygonSegments(
  points: ReadonlyArray<Point2>,
  segments: LineSegment[],
): void {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  }
}

export function buildRecursiveTransformSegments(
  basePattern: ReadonlyArray<Point2>,
  matrix: AffineMatrix,
  translations: ReadonlyArray<Translation>,
): LineSegment[] {
  const segments: LineSegment[] = [];

  for (const translation of translations) {
    const layer1 = applyAffineTransform(basePattern, matrix, translation);
    appendPolygonSegments(layer1, segments);

    for (const subTranslation of translations) {
      const scaledTranslation = {
        tx: subTranslation.tx * SECOND_LAYER_TRANSLATION_SCALE,
        ty: subTranslation.ty * SECOND_LAYER_TRANSLATION_SCALE,
      };
      const layer2 = applyAffineTransform(layer1, matrix, scaledTranslation);
      appendPolygonSegments(layer2, segments);
    }
  }

  return segments;
}

/** 縮圖：取第一層變換後的多邊形頂點路徑 */
export function sampleAffineTransformPatternCurve(
  rotationDeg: number,
  translationDistance: number,
  time: number,
  step: number,
  revealProgress = 1,
): CurvePoint[] {
  const base = buildBasePattern();
  const matrix = buildAffineMatrix(rotationDeg, time);
  const translations = buildTranslationVectors(translationDistance, revealProgress);
  const first = translations[0]!;
  const transformed = applyAffineTransform(base, matrix, first);

  const points: CurvePoint[] = [];
  let arcLength = 0;

  for (let i = 0; i < transformed.length; i += Math.max(1, Math.round(step))) {
    const pt = transformed[i]!;
    if (points.length > 0) {
      const prev = points[points.length - 1]!;
      arcLength += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    }
    points.push({
      x: pt.x,
      y: pt.y,
      theta: i,
      arcLength,
    });
  }

  return points;
}
