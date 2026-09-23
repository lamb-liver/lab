import { BASE_CANVAS_SIZE } from './constants';

export function measureWorkCanvasSize(host: HTMLElement): number {
  const w = host.clientWidth;
  const h = host.clientHeight;
  const fromWidth = w > 0 ? w : BASE_CANVAS_SIZE;
  const fromHeight = h > 0 ? h : fromWidth;
  return Math.max(280, Math.round(Math.min(fromWidth, fromHeight, BASE_CANVAS_SIZE)));
}
