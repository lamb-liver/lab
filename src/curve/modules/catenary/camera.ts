import type { Bounds, ScreenPoint, WorldPoint } from './geometry';

export type CameraState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export function createCameraState(): CameraState {
  return { scale: 100, offsetX: 0, offsetY: 0 };
}

export function updateCameraFromBounds(
  camera: CameraState,
  bounds: Bounds,
  canvasWidth: number,
  canvasHeight: number,
): CameraState {
  const widthSpan = bounds.maxX - bounds.minX;
  const heightSpan = bounds.maxY - bounds.minY;

  const scaleX = (canvasWidth * 0.72) / Math.max(widthSpan, 0.01);
  const scaleY = (canvasHeight * 0.5) / Math.max(heightSpan, 0.01);
  const scale = Math.min(scaleX, scaleY);

  const centerX = (bounds.minX + bounds.maxX) * 0.5;
  const centerY = (bounds.minY + bounds.maxY) * 0.5;

  return {
    scale,
    offsetX: -centerX * scale,
    offsetY: centerY * scale,
  };
}

export function worldToScreen(
  camera: CameraState,
  pt: WorldPoint,
): ScreenPoint {
  return {
    x: pt.x * camera.scale + camera.offsetX,
    y: -pt.y * camera.scale + camera.offsetY,
  };
}

export function mapPath(
  camera: CameraState,
  points: ReadonlyArray<WorldPoint>,
): ScreenPoint[] {
  return points.map((pt) => worldToScreen(camera, pt));
}
