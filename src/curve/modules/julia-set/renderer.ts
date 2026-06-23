import { iterToColor, juliaSmooth } from './math';

type TileRenderParams = {
  target: Uint8ClampedArray;
  width: number;
  height: number;
  startX: number;
  startY: number;
  tileSize: number;
  cx: number;
  cy: number;
  maxIter: number;
  zxTable: Float32Array;
  zyTable: Float32Array;
};

export function renderJuliaTile({
  target,
  width,
  height,
  startX,
  startY,
  tileSize,
  cx,
  cy,
  maxIter,
  zxTable,
  zyTable,
}: TileRenderParams): void {
  const endX = Math.min(startX + tileSize, width);
  const endY = Math.min(startY + tileSize, height);

  for (let py = startY; py < endY; py++) {
    const zy = zyTable[py];
    for (let px = startX; px < endX; px++) {
      const zx = zxTable[px];
      const t = juliaSmooth(zx, zy, cx, cy, maxIter);
      const col = iterToColor(t, maxIter);
      const idx = (py * width + px) * 4;
      target[idx] = col[0];
      target[idx + 1] = col[1];
      target[idx + 2] = col[2];
      target[idx + 3] = 255;
    }
  }
}

export function buildCoordinateTables(
  width: number,
  height: number,
  zoom: number,
): { zxTable: Float32Array; zyTable: Float32Array } {
  const zxTable = new Float32Array(width);
  const zyTable = new Float32Array(height);

  for (let x = 0; x < width; x++) {
    zxTable[x] = (x / width - 0.5) * zoom;
  }
  for (let y = 0; y < height; y++) {
    zyTable[y] = -(y / height - 0.5) * zoom;
  }

  return { zxTable, zyTable };
}
