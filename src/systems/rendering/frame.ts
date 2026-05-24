import type p5 from 'p5';
import { renderGhostCurve } from './polyline';
import {
  renderCartesianGrid,
  renderHarmonographGrid,
  renderSpirographGrid,
} from './cartesianGrid';
import { renderPolarGrid } from './polarGrid';
import { renderReveal } from './reveal';
import type { RenderConfig, RenderSnap } from './types';

export function renderFrame(
  p: p5,
  snap: RenderSnap,
  config: RenderConfig,
): void {
  const cx = snap.width / 2;
  const cy = snap.height / 2;
  const [bgR, bgG, bgB] = config.background;

  p.background(bgR, bgG, bgB);

  if (config.grid !== 'none') {
    p.push();
    p.translate(cx, cy);
    if (config.grid === 'polar') {
      renderPolarGrid(p, snap.width);
    } else if (config.grid === 'harmonograph') {
      renderHarmonographGrid(p, snap.width);
    } else if (config.grid === 'spirograph') {
      renderSpirographGrid(p, snap.width, snap.params.R);
    } else {
      renderCartesianGrid(p, snap.width);
    }
    p.pop();
  }

  p.push();
  p.translate(cx, cy);
  renderGhostCurve(p, snap.points, config.curveStyle);
  renderReveal(
    p,
    snap.points,
    snap.revealProgress,
    config.revealMode,
    config.curveStyle,
  );
  p.pop();
}
