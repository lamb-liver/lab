/**
 * 2025 AMC 12B #25：三個同心圓（半徑 1、2、3）上各取一點構成正三角形，求邊長平方。
 *
 * 關鍵：若 A、B、C 是正三角形，C 就是 B 繞 A 轉 60° 的像。B 在半徑 2 的圓上，
 * 所以 C 必在「半徑 2 的圓繞 A 轉 60°」的像上——圓心 O′ 滿足 |AO′|=|AO|=1、∠OAO′=60°，
 * 故 △OAO′ 正三角形、|OO′|=1。這個像圓半徑 2、圓心離 O 為 1，恰好內切於半徑 3 的圓（3−2=1），
 * 兩者只有一個交點，所以 C 唯一；A 取在 (1,0) 時 C=(3/2, ±3√3/2)（正負對應兩個轉向），s²=|AC|²=7。
 */

export const RADII = [1, 2, 3] as const;
export const OFFICIAL_SIDE_SQUARED = 7;

export type Point2 = { x: number; y: number };

export const ORIGIN: Point2 = { x: 0, y: 0 };

export function polar(r: number, angle: number): Point2 {
  return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
}

/** 繞 center 轉 angle（弧度，逆時針為正） */
export function rotateAbout(point: Point2, center: Point2, angle: number): Point2 {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: center.x + dx * c - dy * s, y: center.y + dx * s + dy * c };
}

export function distance(a: Point2, b: Point2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 60° 的轉向：+1 逆時針、−1 順時針（兩個方向得到互為鏡像的解） */
export type Turn = 1 | -1;

export function rotationAngle(turn: Turn, progress = 1): number {
  return (turn * Math.PI * progress) / 3;
}

export type Configuration = {
  a: Point2;
  /** 半徑 2 的圓繞 A 轉 60° 後的圓心 */
  rotatedCenter: Point2;
  rotatedRadius: number;
  /** 像圓與半徑 3 的圓的切點＝唯一的 C */
  c: Point2;
  /** C 轉回去（繞 A 轉 −60°）得到的 B */
  b: Point2;
  sideSquared: number;
  centerGap: number;
};

export function uniqueConfiguration(aAngle: number, turn: Turn = -1): Configuration {
  const a = polar(RADII[0], aAngle);
  const angle = rotationAngle(turn);
  const rotatedCenter = rotateAbout(ORIGIN, a, angle);
  const centerGap = distance(rotatedCenter, ORIGIN);
  const scale = RADII[2] / centerGap;
  const c = { x: rotatedCenter.x * scale, y: rotatedCenter.y * scale };
  const b = rotateAbout(c, a, -angle);
  const s2 = (c.x - a.x) ** 2 + (c.y - a.y) ** 2;
  return {
    a,
    rotatedCenter,
    rotatedRadius: RADII[1],
    c,
    b,
    sideSquared: s2,
    centerGap,
  };
}

/** 任取 B（半徑 2 的圓上角度 bAngle）時，60° 像 C′ 到圓心的距離；只有等於 3 才落在大圓上 */
export function trialPoint(aAngle: number, bAngle: number, turn: Turn = -1) {
  const a = polar(RADII[0], aAngle);
  const b = polar(RADII[1], bAngle);
  const c = rotateAbout(b, a, rotationAngle(turn));
  return { a, b, c, radius: distance(c, ORIGIN) };
}

/** 讓試探點 B 落在唯一解上的角度 */
export function solutionBAngle(aAngle: number, turn: Turn = -1): number {
  const { b } = uniqueConfiguration(aAngle, turn);
  return Math.atan2(b.y, b.x);
}

/** Pompeiu／Ptolemy 的代數檢查：3(a⁴+b⁴+c⁴+s⁴)=(a²+b²+c²+s²)² 在 a,b,c=1,2,3 時化為 (s²−7)²=0 */
export function equilateralDistanceIdentity(s2: number): number {
  const [p, q, r] = RADII;
  const sumSquares = p * p + q * q + r * r + s2;
  const sumFourth = p ** 4 + q ** 4 + r ** 4 + s2 * s2;
  return 3 * sumFourth - sumSquares * sumSquares;
}
