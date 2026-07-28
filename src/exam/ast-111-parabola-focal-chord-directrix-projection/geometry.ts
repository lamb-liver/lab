export type Point = { x: number; y: number };

export const ORIGINAL_A_HEIGHT = 3.2;
export const OFFICIAL_ANSWERS = [3, 5] as const;

export type ParabolaFocalChordScene = {
  aHeight: number;
  directrixX: number;
  points: Record<'A' | 'B' | 'F' | 'AProjection' | 'FProjection' | 'BProjection', Point>;
  lengths: {
    aProjectionToFocusProjection: number;
    aToDirectrix: number;
    focusProjectionToBProjection: number;
    bToDirectrix: number;
  };
  ratio: number;
  option3: number;
  option5: number;
};

export function buildParabolaFocalChordScene(aHeight: number): ParabolaFocalChordScene {
  const safeHeight = Math.min(4.4, Math.max(2.2, aHeight));
  const t = safeHeight / 2;
  const directrixX = -1;
  const A = { x: t * t, y: 2 * t };
  const B = { x: 1 / (t * t), y: -2 / t };
  const F = { x: 1, y: 0 };
  const AProjection = { x: directrixX, y: A.y };
  const FProjection = { x: directrixX, y: F.y };
  const BProjection = { x: directrixX, y: B.y };

  const aProjectionToFocusProjection = A.y;
  const aToDirectrix = A.x - directrixX;
  const focusProjectionToBProjection = -B.y;
  const bToDirectrix = B.x - directrixX;

  return {
    aHeight: safeHeight,
    directrixX,
    points: { A, B, F, AProjection, FProjection, BProjection },
    lengths: {
      aProjectionToFocusProjection,
      aToDirectrix,
      focusProjectionToBProjection,
      bToDirectrix,
    },
    ratio: aProjectionToFocusProjection / aToDirectrix,
    option3: aProjectionToFocusProjection / distance(A, F),
    option5: focusProjectionToBProjection / bToDirectrix,
  };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
