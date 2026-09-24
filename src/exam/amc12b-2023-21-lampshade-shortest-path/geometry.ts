import { vec3, type Vec3 } from '../../curve/projection3d';

/**
 * 2023 AMC 12B #21：燈罩（圓台側面）上的最短路徑。
 *
 * 圓台高 3√3、上半徑 3、下半徑 6，母線長 6。補成完整圓錐後，錐頂到下緣 12、到上緣 6，
 * 側面展開成扇環：扇形角 = 2π·6/12 = π，也就是內半徑 6、外半徑 12 的半圓環。
 *
 * 展開圖座標用極座標 (ρ, ψ)，ψ ∈ [−π/2, π/2]。蟲在下緣 ψ=−π/4，蜂蜜在上緣正對面，
 * 立體上相差半圈（π），展開後只差 π·(6/12)=π/2，所以蜂蜜在 ψ=+π/4。
 *
 * 可拖曳的路徑：先走直線到內緣上的點 T（相對蟲的角度 a），再沿內緣圓弧走到蜂蜜。
 * a=π/2 就是「直接連直線」（長 6√5），但那條直線會掉進半徑 6 以內——那一塊不在燈罩上。
 * 直線與內緣相切時 a=π/3，得到真正的最短路徑 6√3+π。
 */

export const FRUSTUM_HEIGHT = 3 * Math.sqrt(3);
export const TOP_RADIUS = 3;
export const BOTTOM_RADIUS = 6;
export const SLANT = Math.hypot(BOTTOM_RADIUS - TOP_RADIUS, FRUSTUM_HEIGHT);
/** 展開圖內、外半徑：錐頂到上緣、到下緣 */
export const INNER_RADIUS = (TOP_RADIUS * SLANT) / (BOTTOM_RADIUS - TOP_RADIUS);
export const OUTER_RADIUS = INNER_RADIUS + SLANT;
/** 扇形角 = 2π × 下緣半徑 / 外半徑 */
export const SECTOR_ANGLE = (2 * Math.PI * BOTTOM_RADIUS) / OUTER_RADIUS;
/** 完整圓錐高（錐頂的 z 坐標；下緣在 z=0） */
export const APEX_HEIGHT = (FRUSTUM_HEIGHT * OUTER_RADIUS) / SLANT;

export const BUG_PSI = -SECTOR_ANGLE / 4;
export const HONEY_PSI = SECTOR_ANGLE / 4;
/** 蟲到蜂蜜在展開圖上的夾角 */
export const PATH_SPAN = HONEY_PSI - BUG_PSI;

/** 直線與內緣相切時的接觸角：cos a = 內半徑 / 外半徑 */
export const TANGENT_CONTACT = Math.acos(INNER_RADIUS / OUTER_RADIUS);

export const OFFICIAL_LENGTH = 6 * Math.sqrt(3) + Math.PI;
export const STRAIGHT_LENGTH = 6 * Math.sqrt(5);

export type PaperPoint = { rho: number; psi: number };
export type Point2 = { x: number; y: number };

export function paperToXY({ rho, psi }: PaperPoint): Point2 {
  return { x: rho * Math.cos(psi), y: rho * Math.sin(psi) };
}

export const BUG: PaperPoint = { rho: OUTER_RADIUS, psi: BUG_PSI };
export const HONEY: PaperPoint = { rho: INNER_RADIUS, psi: HONEY_PSI };

export function clampContact(a: number): number {
  return Math.min(PATH_SPAN, Math.max(0, a));
}

export function contactPoint(a: number): PaperPoint {
  return { rho: INNER_RADIUS, psi: BUG_PSI + clampContact(a) };
}

/** 線段到錐頂（原點）的最近距離 */
export function segmentDistanceToApex(from: Point2, to: Point2): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, -(from.x * dx + from.y * dy) / len2));
  return Math.hypot(from.x + t * dx, from.y + t * dy);
}

export type PathMetrics = {
  contact: number;
  chord: number;
  arc: number;
  length: number;
  /** 直線段離錐頂最近的距離；小於內半徑就代表掉出燈罩 */
  minRadius: number;
  valid: boolean;
};

export function pathMetrics(a: number): PathMetrics {
  const contact = clampContact(a);
  const from = paperToXY(BUG);
  const to = paperToXY(contactPoint(contact));
  const chord = Math.hypot(to.x - from.x, to.y - from.y);
  const arc = INNER_RADIUS * (PATH_SPAN - contact);
  const minRadius = segmentDistanceToApex(from, to);
  return {
    contact,
    chord,
    arc,
    length: chord + arc,
    minRadius,
    valid: minRadius >= INNER_RADIUS - 1e-9,
  };
}

/** 路徑的取樣點（展開圖座標），供展開圖與立體圖共用 */
export function samplePath(a: number, chordSteps = 48, arcSteps = 32): PaperPoint[] {
  const contact = clampContact(a);
  const from = paperToXY(BUG);
  const to = paperToXY(contactPoint(contact));
  const points: PaperPoint[] = [];
  for (let i = 0; i <= chordSteps; i += 1) {
    const t = i / chordSteps;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    points.push({ rho: Math.hypot(x, y), psi: Math.atan2(y, x) });
  }
  const start = BUG_PSI + contact;
  for (let i = 1; i <= arcSteps; i += 1) {
    points.push({ rho: INNER_RADIUS, psi: start + ((HONEY_PSI - start) * i) / arcSteps });
  }
  return points;
}

/**
 * 展開動畫：把同一張扇環紙捲成圓錐，unroll=0 是燈罩、unroll=1 是攤平。
 * 紙覆蓋圓周的比例 f 從 1 降到 SECTOR_ANGLE/2π，錐的半頂角 α 滿足 sin α = (SECTOR_ANGLE/2π)/f。
 * 每個中間狀態都是與紙等距的圓錐，所以路徑長不隨動畫改變。
 */
export function coneShape(unroll: number): { sinAlpha: number; cosAlpha: number; wrap: number } {
  const u = Math.min(1, Math.max(0, unroll));
  const paperFraction = SECTOR_ANGLE / (2 * Math.PI);
  const coverage = 1 - (1 - paperFraction) * u;
  const sinAlpha = Math.min(1, paperFraction / coverage);
  const cosAlpha = Math.sqrt(Math.max(0, 1 - sinAlpha * sinAlpha));
  return { sinAlpha, cosAlpha, wrap: 1 / sinAlpha };
}

export function paperTo3d(point: PaperPoint, unroll: number): Vec3 {
  const { sinAlpha, cosAlpha, wrap } = coneShape(unroll);
  const phi = point.psi * wrap;
  const r = point.rho * sinAlpha;
  return vec3(r * Math.cos(phi), r * Math.sin(phi), APEX_HEIGHT - point.rho * cosAlpha);
}
