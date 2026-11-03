import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';
import { degToRad, project, vec3, type Vec3, type ViewAngles } from '../../projection3d';

/** 再靠近北極，落點就會超出這張固定畫面。 */
export const COLAT_MIN = 36;
export const COLAT_MAX = 180;
export const AZIM_MIN = 0;
export const AZIM_MAX = 360;

export type StereoParams = { colat: number; azim: number };

export const DEFAULT_STEREO_PARAMS: StereoParams = { colat: 50, azim: 40 };

export const STEREO_VIEW: ViewAngles = { yaw: degToRad(38), pitch: degToRad(28) };

export type StereoReading = {
  colat: number;
  azim: number;
  radius: number;
  point: Vec3;
  image: Vec3;
  north: Vec3;
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampStereo(params: Partial<StereoParams> | ParamValues): StereoParams {
  return {
    colat: clamp(Number(params.colat ?? DEFAULT_STEREO_PARAMS.colat), COLAT_MIN, COLAT_MAX),
    azim: clamp(Number(params.azim ?? DEFAULT_STEREO_PARAMS.azim), AZIM_MIN, AZIM_MAX),
  };
}

export function spherePoint(colat: number, azim: number): Vec3 {
  const tilt = degToRad(colat);
  const turn = degToRad(azim);
  return vec3(Math.sin(tilt) * Math.cos(turn), Math.sin(tilt) * Math.sin(turn), Math.cos(tilt));
}

/** 北極沿直線投到赤道平面後，落點離原點的距離。 */
export function imageRadius(colat: number): number {
  return 1 / Math.tan(degToRad(colat) / 2);
}

export function imageOf(colat: number, azim: number): Vec3 {
  const radius = imageRadius(colat);
  const turn = degToRad(azim);
  return vec3(radius * Math.cos(turn), radius * Math.sin(turn), 0);
}

export function readStereo(params: Partial<StereoParams> | ParamValues): StereoReading {
  const { colat, azim } = clampStereo(params);
  return {
    colat,
    azim,
    radius: imageRadius(colat),
    point: spherePoint(colat, azim),
    image: imageOf(colat, azim),
    north: vec3(0, 0, 1),
  };
}

export function ring(radius: number, z: number, steps = 64): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const turn = (i / steps) * Math.PI * 2;
    points.push(vec3(radius * Math.cos(turn), radius * Math.sin(turn), z));
  }
  return points;
}

export function meridian(azim: number, steps = 48): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i <= steps; i += 1) points.push(spherePoint((i / steps) * 180, azim));
  return points;
}

const THUMB_SCALE = 78;

function toCurvePoint(point: Vec3, index: number): CurvePoint {
  const projected = project(point, STEREO_VIEW);
  return { x: projected.x * THUMB_SCALE, y: projected.y * THUMB_SCALE, theta: index, arcLength: index };
}

export function sampleStereoThumbnail(params: StereoParams): ThumbnailSpec {
  const reading = readStereo(params);
  const far = reading.colat <= 90 ? reading.image : reading.point;
  return {
    paths: [
      ...[0, 45, 90, 135].map((azim) => ({
        points: meridian(azim).map(toCurvePoint),
        stroke: '#d4b87a',
        strokeWidth: 1.2,
        opacity: 0.55,
      })),
      {
        points: ring(1, 0).map(toCurvePoint),
        stroke: '#ffffff',
        strokeWidth: 1.4,
        opacity: 0.7,
      },
      {
        points: [reading.north, far].map(toCurvePoint),
        stroke: '#d4b87a',
        strokeWidth: 1.6,
        opacity: 0.95,
      },
    ],
  };
}
