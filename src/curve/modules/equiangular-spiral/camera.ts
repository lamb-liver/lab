import type { WorldPoint } from './geometry';

export type ScreenPoint = { x: number; y: number };

export type SpiralCamera = {
  zoom: number;
};

export function createSpiralCamera(): SpiralCamera {
  return { zoom: 1 };
}

export function updateSpiralCamera(
  camera: SpiralCamera,
  maxExtent: number,
  canvasWidth: number,
  canvasHeight: number,
): SpiralCamera {
  const zoomX = (canvasWidth * 0.34) / maxExtent;
  const zoomY = (canvasHeight * 0.34) / maxExtent;
  return { zoom: Math.min(zoomX, zoomY) };
}

export function mapSpiralPoint(
  camera: SpiralCamera,
  pt: WorldPoint,
): ScreenPoint {
  return {
    x: pt.x * camera.zoom,
    y: -pt.y * camera.zoom,
  };
}

export function mapSpiralPath(
  camera: SpiralCamera,
  points: ReadonlyArray<WorldPoint>,
): ScreenPoint[] {
  return points.map((pt) => mapSpiralPoint(camera, pt));
}
