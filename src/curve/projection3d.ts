/**
 * 3D → 2D 正交投影與向量運算。
 *
 * 站內不引入 three.js：`CurveModule.sample()` 的契約是回傳 2D `CurvePoint[]`，
 * 縮圖管線與 `src/systems/rendering/*` 都建立在這個契約上，加一套 WebGL 場景等於
 * 開第二個渲染世界。空間向量系列改用 p5 2D 加這裡的自寫投影。
 *
 * 純數學，不得引入 p5 或 React。
 */

export type Vec3 = { x: number; y: number; z: number };

/** 投影後的畫面座標 */
export type Projected = { x: number; y: number };

/** 觀察角度，單位為弧度 */
export type ViewAngles = { yaw: number; pitch: number };

export const vec3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

export const addVec3 = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

export const subVec3 = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

export const scaleVec3 = (v: Vec3, k: number): Vec3 => ({
  x: v.x * k,
  y: v.y * k,
  z: v.z * k,
});

export const dotVec3 = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;

/** 右手定則：i, j, k 依序滿足 e₁ × e₂ = e₃ */
export const crossVec3 = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const lengthVec3 = (v: Vec3): number => Math.sqrt(dotVec3(v, v));

export function normalizeVec3(v: Vec3): Vec3 {
  const len = lengthVec3(v);
  if (len < 1e-9) return vec3(0, 0, 0);
  return scaleVec3(v, 1 / len);
}

/**
 * 先繞世界的 z 軸轉 yaw，再繞畫面水平軸抬 pitch，最後取 (x, y) 當畫面座標。
 *
 * 畫面 y 軸向上為正；呼叫端負責換算成 canvas 由上而下的像素座標。
 */
export function project(v: Vec3, view: ViewAngles): Projected {
  const cosYaw = Math.cos(view.yaw);
  const sinYaw = Math.sin(view.yaw);
  const cosPitch = Math.cos(view.pitch);
  const sinPitch = Math.sin(view.pitch);

  // 繞 z 軸旋轉
  const x1 = v.x * cosYaw - v.y * sinYaw;
  const y1 = v.x * sinYaw + v.y * cosYaw;
  const z1 = v.z;

  // 抬高視角：y 與 z 混合
  const y2 = y1 * sinPitch + z1 * cosPitch;

  return { x: x1, y: y2 };
}

export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 用仰角與方位表示單位向量。
 * 兩個角度必然給出單位向量，比三個彼此相關的分量滑桿好維持一致。
 */
export function directionFromAngles(tiltDeg: number, azimuthDeg: number): Vec3 {
  const tilt = degToRad(tiltDeg);
  const azimuth = degToRad(azimuthDeg);
  return vec3(
    Math.cos(tilt) * Math.cos(azimuth),
    Math.cos(tilt) * Math.sin(azimuth),
    Math.sin(tilt),
  );
}

/** 平面上的一組正交單位基；取任一與 n 不平行的向量做外積即可 */
export function planeBasis(n: Vec3): { u: Vec3; v: Vec3 } {
  const seed = Math.abs(n.z) > 0.9 ? vec3(1, 0, 0) : vec3(0, 0, 1);
  const u = normalizeVec3(crossVec3(n, seed));
  return { u, v: normalizeVec3(crossVec3(n, u)) };
}

/** 平面 n̂·r = h 上距離原點最近的點 */
export function planeAnchor(unitNormal: Vec3, h: number): Vec3 {
  return scaleVec3(unitNormal, h);
}

/** 以錨點為中心、邊長 2·half 的正方形，四個角都滿足 n̂·r = h */
export function planeQuad(unitNormal: Vec3, h: number, half: number): Vec3[] {
  const anchor = planeAnchor(unitNormal, h);
  const { u, v } = planeBasis(unitNormal);
  return [
    addVec3(anchor, addVec3(scaleVec3(u, -half), scaleVec3(v, -half))),
    addVec3(anchor, addVec3(scaleVec3(u, half), scaleVec3(v, -half))),
    addVec3(anchor, addVec3(scaleVec3(u, half), scaleVec3(v, half))),
    addVec3(anchor, addVec3(scaleVec3(u, -half), scaleVec3(v, half))),
  ];
}

export function formatVec3(v: Vec3): string {
  return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
}
