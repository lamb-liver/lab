import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS,
  computeDemoivreMetrics,
  formatComplex,
  integerN,
  sampleDemoivreThumbnail,
  type DemoivreNthRootsParams,
} from './geometry';

/** 控制項由 DemoivreNthRootsCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asDemoivreNthRootsParams(
  params: ParamValues | DemoivreNthRootsParams,
): DemoivreNthRootsParams {
  const fallback = DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS;
  if ('mode' in params && (params.mode === 'power' || params.mode === 'roots')) {
    return {
      mode: params.mode,
      n: integerN(params.n ?? fallback.n),
      re: params.re ?? fallback.re,
      im: params.im ?? fallback.im,
    };
  }

  const values = params as ParamValues;
  return {
    mode: values.mode === 1 ? 'roots' : 'power',
    n: integerN(values.n ?? fallback.n),
    re: values.re ?? fallback.re,
    im: values.im ?? fallback.im,
  };
}

export function demoivreNthRootsParamsForMetadata(
  params: DemoivreNthRootsParams,
): ParamValues {
  return {
    mode: params.mode === 'roots' ? 1 : 0,
    n: params.n,
    re: params.re,
    im: params.im,
  };
}

export const demoivreNthRootsModule: CurveModule = {
  id: 'demoivre-nth-roots',
  paramSchema,
  defaultParams: demoivreNthRootsParamsForMetadata(DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS),
  sample: (params, { purpose }) => {
    const spec = sampleDemoivreThumbnail(asDemoivreNthRootsParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[1]?.points ?? [];
  },
  getMetadata: (params) => {
    const surface = asDemoivreNthRootsParams(params);
    const metrics = computeDemoivreMetrics(surface);
    const roots = surface.mode === 'roots';
    const label = roots ? 'w' : 'z';
    return {
      title: '棣美弗定理與 n 次方根',
      formula: roots
        ? `w^{1/n} = r^{1/n} e^{i(θ+2πk)/n}`
        : `(r e^(iθ))^n = r^n e^(inθ)`,
      stats: [
        { key: 'z', label, value: formatComplex(metrics.z) },
        { key: 'r', label: `|${label}|`, value: metrics.r.toFixed(2) },
        {
          key: 'theta',
          label: `Arg ${label}`,
          value: metrics.zero ? '未定義' : `${(metrics.theta / Math.PI).toFixed(2)}π`,
        },
        {
          key: 'result',
          label: roots ? 'k=0 根' : `z^${metrics.n}`,
          value: formatComplex(metrics.result),
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export {
  DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS,
  N_MAX,
  N_MIN,
  computeDemoivreMetrics,
  formatComplex,
  type DemoivreMode,
  type DemoivreNthRootsParams,
} from './geometry';
