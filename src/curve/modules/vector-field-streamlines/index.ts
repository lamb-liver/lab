import { defaultsFromSchema } from '../../defaults';
import type {
  CurveModule,
  CurvePoint,
  ParamSchema,
  ParamValues,
  ThumbnailSpec,
} from '../../types';
import { INTEGRATION_STEP_SIZE, buildAllStreamlines } from './geometry';

const THUMBNAIL_STREAMLINE_COUNT = 24;
const THUMBNAIL_INTEGRATION_STEPS = 140;

const paramSchema: ParamSchema = [
  {
    key: 'streamlineCount',
    label: '流線數量',
    min: 8,
    max: 120,
    step: 1,
    default: 48,
  },
  {
    key: 'integrationSteps',
    label: '積分步數',
    min: 40,
    max: 400,
    step: 1,
    default: 180,
  },
  {
    key: 'flowSpeed',
    label: '流動速度',
    min: 0.001,
    max: 0.05,
    step: 0.001,
    default: 0.012,
  },
];

function worldPathToCurvePoints(path: Array<{ x: number; y: number }>): CurvePoint[] {
  const points: CurvePoint[] = [];
  let arcLength = 0;
  let prevX = 0;
  let prevY = 0;
  for (let i = 0; i < path.length; i++) {
    const pt = path[i]!;
    if (i > 0) arcLength += Math.hypot(pt.x - prevX, pt.y - prevY);
    points.push({ x: pt.x, y: pt.y, theta: i, arcLength });
    prevX = pt.x;
    prevY = pt.y;
  }
  return points;
}

export const vectorFieldStreamlinesModule: CurveModule = {
  id: 'vector-field-streamlines',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      const streamlines = buildAllStreamlines(
        THUMBNAIL_STREAMLINE_COUNT,
        THUMBNAIL_INTEGRATION_STEPS,
        INTEGRATION_STEP_SIZE,
        0,
      );
      const spec: ThumbnailSpec = {
        paths: streamlines.map((path) => ({
          points: worldPathToCurvePoints(path),
        })),
      };
      return spec;
    }

    const streamlines = buildAllStreamlines(
      params.streamlineCount,
      params.integrationSteps,
      INTEGRATION_STEP_SIZE,
      0,
    );
    if (streamlines.length === 0) return [];
    return worldPathToCurvePoints(streamlines[0]!);
  },
  getMetadata: (params) => ({
    title: '向量場流線',
    formula: 'dp/dt = F(x,y,t)',
    stats: [
      { key: 'count', label: '流線數', value: Math.round(params.streamlineCount) },
      { key: 'steps', label: '步數 N', value: Math.round(params.integrationSteps) },
      { key: 'speed', label: 'speed v', value: params.flowSpeed.toFixed(3) },
    ],
  }),
  sampleStep: 1,
  animation: { lerp: 0, revealSpeed: 0 },
};
