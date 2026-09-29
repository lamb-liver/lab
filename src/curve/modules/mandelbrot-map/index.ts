import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { clampC, sampleMandelbrotThumbnail } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'cx', label: 'c 實部 Re(c)', min: -2.2, max: 0.8, step: 0.001, default: -0.75 },
  { key: 'cy', label: 'c 虛部 Im(c)', min: -1.25, max: 1.25, step: 0.001, default: 0.1 },
  { key: 'maxIter', label: '最大疊代', min: 40, max: 160, step: 10, default: 80 },
];

export const mandelbrotMapModule: CurveModule = {
  id: 'mandelbrot-map',
  paramSchema,
  defaultParams: {
    cx: -0.75,
    cy: 0.1,
    maxIter: 80,
  },
  sample: (params) => {
    const c = clampC(params.cx, params.cy);
    return sampleMandelbrotThumbnail(Math.round(params.maxIter), c);
  },
  getMetadata: (params) => {
    const c = clampC(params.cx, params.cy);
    return {
      title: '曼德博集合與朱利亞',
      formula: 'z_{n+1} = z_n^2 + c,  z_0 = 0',
      stats: [
        { key: 'cx', label: 'Re(c)', value: c.cx.toFixed(3) },
        { key: 'cy', label: 'Im(c)', value: c.cy.toFixed(3) },
        { key: 'iter', label: 'iter', value: Math.round(params.maxIter) },
      ],
    };
  },
};

export function mandelbrotParams(values: ParamValues) {
  const c = clampC(values.cx, values.cy);
  return { cx: c.cx, cy: c.cy, maxIter: values.maxIter };
}
