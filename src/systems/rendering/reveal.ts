import type p5 from 'p5';
import type { CurvePoint } from '../../curve/types';
import type { CurveStyle, RevealMode } from './types';
import { renderGlowStroke } from './polyline';

export function filterRevealed(
  points: ReadonlyArray<CurvePoint>,
  revealProgress: number,
  mode: RevealMode,
): CurvePoint[] {
  if (points.length === 0 || revealProgress <= 0) return [];
  if (revealProgress >= 1) return points as CurvePoint[];

  if (mode === 'byTheta') {
    const maxTheta = points[points.length - 1]?.theta ?? 0;
    if (maxTheta <= 0) return [];

    const revealTheta = maxTheta * revealProgress;
    const out: CurvePoint[] = [];
    for (const pt of points) {
      if (pt.theta <= revealTheta) {
        out.push(pt);
      }
    }
    return out;
  }

  const totalArc = points[points.length - 1]?.arcLength ?? 0;
  if (totalArc <= 0) return [];

  const threshold = totalArc * revealProgress;
  const out: CurvePoint[] = [];
  for (const pt of points) {
    if (pt.arcLength <= threshold) {
      out.push(pt);
    }
  }
  return out;
}

export function renderReveal(
  p: p5,
  points: ReadonlyArray<CurvePoint>,
  revealProgress: number,
  mode: RevealMode,
  style: CurveStyle,
): void {
  if (revealProgress >= 1) {
    renderGlowStroke(p, points, style.reveal.layers);
    return;
  }
  const revealed = filterRevealed(points, revealProgress, mode);
  renderGlowStroke(p, revealed, style.reveal.layers);
}
