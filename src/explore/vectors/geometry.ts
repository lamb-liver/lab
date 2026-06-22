export type Vec2 = {
  x: number;
  y: number;
};

export type VectorGuideRole = 'position' | 'direction' | 'coordinate';

export const GUIDE_BASIS = {
  e1: { x: 1.6, y: 0.2 },
  e2: { x: 0.45, y: 1.35 },
} as const satisfies { e1: Vec2; e2: Vec2 };

type VectorGuideParams = {
  guideRole: VectorGuideRole;
  guideP: Vec2;
  guideU: Vec2;
};

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 1e-12) return '0';

  return value.toFixed(digits).replace(/\.?0+$/, '');
}

function dot(a: Vec2, b: Vec2) {
  return a.x * b.x + a.y * b.y;
}

export function projectOnto(direction: Vec2, vector: Vec2) {
  const len2 = dot(direction, direction);
  if (len2 < 1e-9) {
    return { scalar: 0, vector: { x: 0, y: 0 }, viable: false };
  }

  const scalar = dot(vector, direction) / len2;
  return {
    scalar,
    vector: { x: direction.x * scalar, y: direction.y * scalar },
    viable: true,
  };
}

export function solveBasisCoordinates(point: Vec2, e1: Vec2, e2: Vec2) {
  const det = e1.x * e2.y - e1.y * e2.x;
  if (Math.abs(det) < 1e-9) {
    return { s: 0, t: 0, det, viable: false };
  }

  return {
    s: (point.x * e2.y - point.y * e2.x) / det,
    t: (e1.x * point.y - e1.y * point.x) / det,
    det,
    viable: true,
  };
}

export function getVectorGuideState(params: VectorGuideParams) {
  const projection = projectOnto(params.guideP, params.guideU);
  const basis = solveBasisCoordinates(params.guideP, GUIDE_BASIS.e1, GUIDE_BASIS.e2);

  if (params.guideRole === 'position') {
    return {
      role: params.guideRole,
      summary: '位置讀法：同一支箭頭的端點就是平面上的點 p。',
      stats: [
        `位置 p = (${fmt(params.guideP.x)}, ${fmt(params.guideP.y)})`,
        `長度 |p| = ${fmt(Math.hypot(params.guideP.x, params.guideP.y))}`,
        '先把箭頭讀成從原點到端點的位置。',
      ],
    };
  }

  if (params.guideRole === 'direction') {
    return {
      role: params.guideRole,
      summary: '方向讀法：p 指定測量方向，u 被拆成沿 p 的投影與垂直殘差。',
      stats: [
        `方向 p = (${fmt(params.guideP.x)}, ${fmt(params.guideP.y)})`,
        projection.viable
          ? `proj_p u = (${fmt(projection.vector.x)}, ${fmt(projection.vector.y)})`
          : 'proj_p u 無法定義',
        '加入 u 是為了觀察它沿 p 方向的投影。',
      ],
    };
  }

  return {
    role: params.guideRole,
    summary: '座標讀法：同一個位置 p 也能改用斜交基底讀成 s、t 兩個座標。',
    stats: [
      basis.viable ? `座標 p = ${fmt(basis.s)} e1 + ${fmt(basis.t)} e2` : '座標讀數無法定義',
      `e1 = (${fmt(GUIDE_BASIS.e1.x)}, ${fmt(GUIDE_BASIS.e1.y)})`,
      `e2 = (${fmt(GUIDE_BASIS.e2.x)}, ${fmt(GUIDE_BASIS.e2.y)})`,
    ],
  };
}
