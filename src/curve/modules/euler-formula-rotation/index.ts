import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { defaultsFromSchema } from '../../defaults';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { PARAM_LERP } from './animation';

const paramSchema: ParamSchema = [
  { key: 'amplitude', label: '振幅 A', min: 0.5, max: 2.2, step: 0.05, default: 1.45 },
  { key: 'frequency', label: '角頻率 ω', min: 0.5, max: 3, step: 0.1, default: 1 },
  { key: 'phase', label: '初相位 δ', min: 0, max: Math.PI * 2, step: 0.01, default: 0 },
];

function sampleEulerFormulaRotationThumbnail(
  amplitude: number,
  phase: number,
): ThumbnailSpec {
  const r = 58 * (amplitude / 1.45);
  const cx = -78;
  const waveX = 18;
  const theta = phase + Math.PI / 3;
  const endpoint = {
    x: cx + Math.cos(theta) * r,
    y: Math.sin(theta) * r,
  };
  const sinWave = buildWavePoints(waveX, 0, 140, r * 0.44, theta, Math.sin);
  const cosWave = buildWavePoints(waveX, 0, 140, r * 0.36, theta, Math.cos);

  return {
    paths: [
      {
        points: circlePoints(cx, 0, r),
        stroke: 'rgba(255, 255, 255, 0.34)',
        strokeWidth: 0.75,
        opacity: 1,
      },
      {
        points: linePoints(cx - r * 1.15, 0, cx + r * 1.15, 0, 10),
        opacity: 0.25,
        strokeWidth: 0.8,
        excludeFromBbox: true,
      },
      {
        points: linePoints(cx, -r * 1.15, cx, r * 1.15, 11),
        opacity: 0.2,
        strokeWidth: 0.65,
        excludeFromBbox: true,
      },
      {
        points: linePoints(cx, 0, endpoint.x, endpoint.y, 20),
        strokeWidth: 1.4,
      },
      {
        points: linePoints(endpoint.x, endpoint.y, waveX, endpoint.y, 30),
        stroke: 'rgba(255, 255, 255, 0.46)',
        strokeWidth: 0.7,
        opacity: 0.9,
      },
      {
        points: linePoints(waveX, 0, waveX, endpoint.y, 31),
        stroke: 'rgba(255, 255, 255, 0.4)',
        strokeWidth: 0.7,
        opacity: 0.8,
      },
      { points: cosWave, stroke: 'rgba(130, 170, 220, 0.58)', strokeWidth: 0.92, opacity: 0.85 },
      { points: sinWave, strokeWidth: 1.2 },
    ],
    circles: [
      { x: cx, y: 0, r: 2.6, fill: 'rgba(255, 255, 255, 0.6)' },
      { x: endpoint.x, y: endpoint.y, r: 5, fill: 'rgb(212, 184, 122)', opacity: 0.95 },
      { x: waveX, y: endpoint.y, r: 3.2, fill: 'rgba(212, 184, 122, 0.72)' },
    ],
  };
}

function circlePoints(cx: number, cy: number, r: number): CurvePoint[] {
  const points: CurvePoint[] = [];
  for (let i = 0; i <= 96; i += 1) {
    const t = (i / 96) * Math.PI * 2;
    points.push({ x: cx + Math.cos(t) * r, y: cy + Math.sin(t) * r, theta: t, arcLength: i });
  }
  return points;
}

function linePoints(x1: number, y1: number, x2: number, y2: number, theta: number): CurvePoint[] {
  return [
    { x: x1, y: y1, theta, arcLength: 0 },
    { x: x2, y: y2, theta: theta + 1, arcLength: Math.hypot(x2 - x1, y2 - y1) },
  ];
}

function buildWavePoints(
  x: number,
  y: number,
  width: number,
  amp: number,
  phase: number,
  fn: (value: number) => number,
): CurvePoint[] {
  const points: CurvePoint[] = [];
  for (let i = 0; i < 88; i += 1) {
    const t = i / 87;
    points.push({
      x: x + t * width,
      y: y + fn(phase + t * Math.PI * 2) * amp,
      theta: t,
      arcLength: t * width,
    });
  }
  return points;
}

export const eulerFormulaRotationModule: CurveModule = {
  id: 'euler-formula-rotation',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      return sampleEulerFormulaRotationThumbnail(params.amplitude, params.phase);
    }
    return sampleEulerFormulaRotationThumbnail(params.amplitude, params.phase).paths[1]?.points ?? [];
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '尤拉公式旋轉',
      formula: 'e^(i(ωt + δ)) = cos(ωt + δ) + i sin(ωt + δ)',
      stats: [
        { key: 'A', label: 'A', value: params.amplitude.toFixed(2) },
        { key: 'omega', label: 'ω', value: params.frequency.toFixed(1) },
        {
          key: 'delta',
          label: 'δ',
          value: `${(smooth.phase / Math.PI).toFixed(2)}π`,
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  animation: { lerp: PARAM_LERP, revealSpeed: 0 },
};

export { PARAM_LERP, TIME_SPEED } from './animation';

export function measureEulerFormulaRotationCanvas(host: HTMLElement): {
  width: number;
  height: number;
} {
  const w = host.clientWidth;
  const width = w > 0 ? Math.min(w, 900) : 900;
  const clamped = Math.max(280, width);
  return { width: clamped, height: Math.round(clamped * 0.72) };
}
