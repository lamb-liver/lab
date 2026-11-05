/**
 * 2024 高考數學新課標 I 卷第 5 題。
 * 圓柱與圓錐底面半徑同為 r、高同為 √3、側面積相等，求圓錐體積。
 * 2πr√3 = πr√(r²+3) ⇒ r = 3 ⇒ V = 3√3 π。
 */

export const HEIGHT = Math.sqrt(3);
export const RADIUS_MIN = 0.5;
export const RADIUS_MAX = 5;
export const DEFAULT_RADIUS = 3;

export type ConeCylinderReading = {
  radius: number;
  height: number;
  slant: number;
  cylinderLateral: number;
  coneLateral: number;
  coneVolume: number;
  /** 漏掉 1/3 時寫下的量：π r² √3。 */
  volumeWithoutThird: number;
  areasMatch: boolean;
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return DEFAULT_RADIUS;
  return Math.min(max, Math.max(min, value));
}

export function clampRadius(radius: number): number {
  return clamp(radius, RADIUS_MIN, RADIUS_MAX);
}

export function readConeCylinder(radius: number): ConeCylinderReading {
  const r = clampRadius(radius);
  const height = HEIGHT;
  const slant = Math.hypot(r, height);
  const cylinderLateral = 2 * Math.PI * r * height;
  const coneLateral = Math.PI * r * slant;
  const volumeWithoutThird = Math.PI * r * r * height;
  const coneVolume = volumeWithoutThird / 3;
  const scale = Math.max(1, cylinderLateral);
  return {
    radius: r,
    height,
    slant,
    cylinderLateral,
    coneLateral,
    coneVolume,
    volumeWithoutThird,
    areasMatch: Math.abs(cylinderLateral - coneLateral) <= 1e-6 * scale,
  };
}
