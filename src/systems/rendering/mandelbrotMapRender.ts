import type p5 from 'p5';
import {
  MANDEL_VIEW,
  insetFrame,
  mapFrame,
  mandelbrotEscape,
  pixelFromC,
  type MapFrame,
} from '../../curve/modules/mandelbrot-map/geometry';
import { iterToColor, juliaSmooth } from '../../curve/modules/julia-set/math';

const BG: [number, number, number] = [10, 10, 10];
const ACCENT: [number, number, number] = [212, 184, 122];
const JULIA_SPAN = 3.2;

type Params = { cx: number; cy: number; maxIter: number };

function paintBlock(
  pixels: number[],
  pw: number,
  ph: number,
  cssX: number,
  cssY: number,
  cssStep: number,
  dens: number,
  rgb: [number, number, number],
) {
  const x0 = Math.max(0, Math.floor(cssX * dens));
  const y0 = Math.max(0, Math.floor(cssY * dens));
  const x1 = Math.min(pw, Math.ceil((cssX + cssStep) * dens));
  const y1 = Math.min(ph, Math.ceil((cssY + cssStep) * dens));
  for (let y = y0; y < y1; y += 1) {
    let i = 4 * (y * pw + x0);
    for (let x = x0; x < x1; x += 1) {
      pixels[i] = rgb[0];
      pixels[i + 1] = rgb[1];
      pixels[i + 2] = rgb[2];
      pixels[i + 3] = 255;
      i += 4;
    }
  }
}

function paintMap(
  p: p5,
  frame: MapFrame,
  maxIter: number,
  stride: number,
  dens: number,
  pw: number,
  ph: number,
) {
  const yEnd = frame.top + frame.h;
  const xEnd = frame.left + frame.w;
  for (let y = frame.top; y < yEnd; y += stride) {
    for (let x = frame.left; x < xEnd; x += stride) {
      const u = (x + stride / 2 - frame.left) / frame.w;
      const v = (y + stride / 2 - frame.top) / frame.h;
      const cx = MANDEL_VIEW.cx0 + u * (MANDEL_VIEW.cx1 - MANDEL_VIEW.cx0);
      const cy = MANDEL_VIEW.cy1 - v * (MANDEL_VIEW.cy1 - MANDEL_VIEW.cy0);
      const t = mandelbrotEscape(cx, cy, maxIter);
      paintBlock(p.pixels, pw, ph, x, y, stride, dens, iterToColor(t, maxIter));
    }
  }
}

export function renderMandelbrotMap(
  p: p5,
  params: Params,
  dragging: boolean,
  locale?: 'en',
) {
  // p5 sizes the pixel buffer with the raw density. Rounding it (1.5 → 2) writes the wrong rows.
  if (p.pixelDensity() !== 1) p.pixelDensity(1);
  p.background(BG[0], BG[1], BG[2]);
  const frame = mapFrame(p.width, p.height);
  const inset = insetFrame(p.width, p.height);
  const dens = p.pixelDensity();
  const stride = dragging ? 2 : 1;
  const maxIter = Math.max(1, Math.round(params.maxIter));
  const pw = p.width * dens;
  const ph = p.height * dens;

  p.loadPixels();
  paintMap(p, frame, maxIter, stride, dens, pw, ph);

  const yEnd = inset.top + inset.h;
  const xEnd = inset.left + inset.w;
  for (let y = inset.top; y < yEnd; y += stride) {
    for (let x = inset.left; x < xEnd; x += stride) {
      const u = (x + stride / 2 - inset.left) / inset.w - 0.5;
      const v = 0.5 - (y + stride / 2 - inset.top) / inset.h;
      const t = juliaSmooth(u * JULIA_SPAN, v * JULIA_SPAN, params.cx, params.cy, maxIter);
      paintBlock(p.pixels, pw, ph, x, y, stride, dens, iterToColor(t, maxIter));
    }
  }
  p.updatePixels();

  const marker = pixelFromC(params.cx, params.cy, frame);
  p.noFill();
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2]);
  p.strokeWeight(1.5);
  p.circle(marker.x, marker.y, 12);
  p.line(marker.x - 7, marker.y, marker.x + 7, marker.y);
  p.line(marker.x, marker.y - 7, marker.x, marker.y + 7);
  p.stroke(BG[0], BG[1], BG[2]);
  p.strokeWeight(6);
  p.rect(inset.left, inset.top, inset.w, inset.h);
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2]);
  p.strokeWeight(1.75);
  p.rect(inset.left, inset.top, inset.w, inset.h);
  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2]);
  p.textAlign(p.RIGHT, p.TOP);
  p.textSize(13);
  p.text(locale === 'en' ? 'This c' : '這個 c', inset.left + inset.w, inset.top + inset.h + 6);
}
