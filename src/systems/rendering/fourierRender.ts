import type p5 from 'p5';
import type { EpicycleDef, FourierMode } from '../../explore/fourier/path';
import {
  FOURIER_1D_X_OFFSET,
  FOURIER_1D_X_SPAN,
  FOURIER_BASE_SIZE,
} from '../../explore/fourier/constants';

const TAU = Math.PI * 2;

export function fourierCanvasScale(canvasSize: number): number {
  return canvasSize / FOURIER_BASE_SIZE;
}

export function renderFourierGrid(p: p5, mode: FourierMode, canvasSize: number): void {
  p.noFill();
  p.strokeWeight(1);

  if (mode === '1D') {
    p.stroke(255, 255, 255, 8);
    p.line(-FOURIER_1D_X_OFFSET, 0, FOURIER_1D_X_SPAN - FOURIER_1D_X_OFFSET, 0);
    p.line(-FOURIER_1D_X_OFFSET, -200, -FOURIER_1D_X_OFFSET, 200);
  } else {
    p.stroke(255, 255, 255, 10);
    p.ellipse(0, 0, fourierCanvasScale(canvasSize) * 480);

    p.stroke(255, 255, 255, 8);
    const extent = fourierCanvasScale(canvasSize) * 300;
    p.line(-extent, 0, extent, 0);
    p.line(0, -extent, 0, extent);
  }
}

export function renderFourierEpicycles(
  p: p5,
  mode: FourierMode,
  epicycles: ReadonlyArray<EpicycleDef>,
  t: number,
): void {
  p.push();
  p.noFill();
  p.strokeWeight(1);

  let cx = 0;
  let cy = 0;

  if (mode === '1D') {
    cx = t * (FOURIER_1D_X_SPAN / TAU) - FOURIER_1D_X_OFFSET;
    for (const { n, radius } of epicycles) {
      p.stroke(255, 255, 255, 12);
      p.ellipse(cx, cy, radius * 2);

      const nextCy = cy + radius * Math.sin(n * t);
      p.stroke(255, 255, 255, 20);
      p.line(cx, cy, cx, nextCy);

      cy = nextCy;
    }
  } else {
    for (const { n, radius } of epicycles) {
      p.stroke(255, 255, 255, 12);
      p.ellipse(cx, cy, radius * 2);

      const nextCx = cx + radius * Math.cos(n * t);
      const nextCy = cy + radius * Math.sin(n * t);
      p.stroke(255, 255, 255, 20);
      p.line(cx, cy, nextCx, nextCy);

      cx = nextCx;
      cy = nextCy;
    }
  }

  p.pop();
}

/** 1D：translate 後再 scale，錨點為 logical x = FOURIER_1D_X_OFFSET */
export function applyFourierTransform(p: p5, mode: FourierMode): void {
  p.translate(p.width / 2, p.height / 2);
  if (mode === '1D') {
    p.scale(fourierCanvasScale(p.width));
    p.translate(-FOURIER_1D_X_OFFSET, 0);
  }
}

export function fourierOriginX(mode: FourierMode, canvasWidth: number): number {
  return mode === '1D' ? 0 : canvasWidth / 2;
}

export function fourierOriginY(mode: FourierMode, canvasHeight: number): number {
  return mode === '1D' ? 0 : canvasHeight / 2;
}
