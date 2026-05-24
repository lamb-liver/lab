import type { RenderConfig } from './types';

const ROSE_GOLD: RenderConfig['curveStyle'] = {
  ghost: { stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 1 },
  reveal: {
    layers: [
      { stroke: { r: 212, g: 184, b: 122, a: 26 }, weight: 2.4 },
      { stroke: { r: 212, g: 184, b: 122, a: 235 }, weight: 1.2 },
    ],
  },
};

export const roseRenderPreset: RenderConfig = {
  background: [10, 10, 10],
  grid: 'polar',
  curveStyle: ROSE_GOLD,
  revealMode: 'byTheta',
};

const LISSAJOUS_GOLD: RenderConfig['curveStyle'] = {
  ghost: { stroke: { r: 212, g: 184, b: 122, a: 18 }, weight: 1.6 },
  reveal: {
    layers: [
      { stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 7 },
      { stroke: { r: 212, g: 184, b: 122, a: 42 }, weight: 3.5 },
      { stroke: { r: 212, g: 184, b: 122, a: 230 }, weight: 1.5 },
    ],
  },
};

export const lissajousRenderPreset: RenderConfig = {
  background: [10, 10, 10],
  grid: 'cartesian',
  curveStyle: LISSAJOUS_GOLD,
  revealMode: 'byArcLength',
};

export const harmonographRenderPreset: RenderConfig = {
  background: [10, 10, 10],
  grid: 'harmonograph',
  curveStyle: LISSAJOUS_GOLD,
  revealMode: 'byArcLength',
};

export const spirographRenderPreset: RenderConfig = {
  background: [10, 10, 10],
  grid: 'spirograph',
  curveStyle: LISSAJOUS_GOLD,
  revealMode: 'byArcLength',
};
