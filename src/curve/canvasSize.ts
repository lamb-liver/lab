import { BASE_CANVAS_SIZE } from './constants';

export function measureWorkCanvasSize(host: HTMLElement): number {
  const w = host.clientWidth;
  const size = w > 0 ? Math.min(w, BASE_CANVAS_SIZE) : BASE_CANVAS_SIZE;
  return Math.max(280, size);
}
