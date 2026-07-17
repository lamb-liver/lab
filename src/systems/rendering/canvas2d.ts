import type p5 from 'p5';

// Every renderer in this repo draws on p5's default 2D renderer, but p5 types
// `drawingContext` as a union with the WebGL contexts. Narrow it once here so
// call sites can use 2D-only APIs (setLineDash, clip, save/restore, ...).
export function canvas2d(p: p5): CanvasRenderingContext2D {
  return p.drawingContext as CanvasRenderingContext2D;
}
