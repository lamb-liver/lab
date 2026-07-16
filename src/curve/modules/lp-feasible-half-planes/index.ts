import { defaultsFromSchema } from '../../defaults';
import { BASE_POINT_STEP } from '../../constants';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';

const RADIUS = 200;

const paramSchema: ParamSchema = [
  { key: 'n', label: '待命名參數 n', min: 1, max: 8, step: 1, default: 3 },
];

function sampleCurve(params: ParamValues, step: number): CurvePoint[] {
  const n = Math.round(params.n);
  if (n <= 0 || step <= 0) return [];

  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let theta = 0; theta <= 2 * Math.PI; theta += step) {
    // 待替換：佔位幾何 r = R·(0.6 + 0.4·cos(nθ))
    const r = RADIUS * (0.6 + 0.4 * Math.cos(n * theta));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    if (points.length > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export const lpFeasibleHalfPlanesModule: CurveModule = {
  id: 'lp-feasible-half-planes',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    const points = sampleCurve(params, step);
    if (purpose === 'thumbnail') {
      const spec: ThumbnailSpec = {
        paths: [{ points, closed: true }],
      };
      return spec;
    }
    return points;
  },
  getMetadata: (params) => ({
    title: '約束半平面與可行域',
    formula: '待補公式',
    stats: [{ key: 'n', label: 'n', value: Math.round(params.n) }],
  }),
  sampleStep: BASE_POINT_STEP,
};
