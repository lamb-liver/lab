import type { CurvePoint, ThumbnailSpec } from '../../types';

export type Vec2 = { x: number; y: number };
export type VectorFieldPattern = 'source' | 'sink' | 'vortex' | 'saddle' | 'uniform';

export type FieldIntegration = {
  step: number;
  steps: number;
  stopMagnitude: number;
  rings?: number[];
  seedScale: number;
  uniform?: boolean;
};

export type FieldConfig = {
  type: VectorFieldPattern;
  name: string;
  formula: string;
  jacobian: string;
  eigen: string;
  singularity: boolean;
  integration: FieldIntegration;
  field: (x: number, y: number) => Vec2;
};

export type VectorFieldPatternParams = {
  pattern: VectorFieldPattern;
  density: number;
  normalized: boolean;
  showStreamlines: boolean;
};

export type VectorFieldLayout = {
  origin: Vec2;
  scale: number;
  extent: number;
  plotMin: number;
  plotMax: number;
};

export const FIELD_WORLD_EXTENT = 6;
export const ARROW_DOMAIN = FIELD_WORLD_EXTENT * 0.85;
const EPS = 1e-6;

export function magnitude(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

export function normalize(v: Vec2): Vec2 {
  const m = magnitude(v);
  if (m < EPS) return { x: 0, y: 0 };
  return { x: v.x / m, y: v.y / m };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function scaleVec(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function getFieldConfig(type: VectorFieldPattern): FieldConfig {
  if (type === 'source') {
    return {
      type,
      name: '源',
      formula: 'F(x,y) = (x, y)',
      jacobian: 'J = [1 0; 0 1]',
      eigen: 'λ₁ > 0, λ₂ > 0',
      singularity: true,
      integration: {
        step: 0.055,
        steps: 115,
        stopMagnitude: 0.035,
        rings: [0.9, 2.3, 3.8],
        seedScale: 0.7,
      },
      field: (x, y) => ({ x, y }),
    };
  }

  if (type === 'sink') {
    return {
      type,
      name: '匯',
      formula: 'F(x,y) = (-x, -y)',
      jacobian: 'J = [-1 0; 0 -1]',
      eigen: 'λ₁ < 0, λ₂ < 0',
      singularity: true,
      integration: {
        step: 0.055,
        steps: 115,
        stopMagnitude: 0.035,
        rings: [0.9, 2.3, 3.8],
        seedScale: 0.7,
      },
      field: (x, y) => ({ x: -x, y: -y }),
    };
  }

  if (type === 'vortex') {
    return {
      type,
      name: '漩渦',
      formula: 'F(x,y) = (-y, x)',
      jacobian: 'J = [0 -1; 1 0]',
      eigen: 'λ = ±i',
      singularity: true,
      integration: {
        step: 0.055,
        steps: 130,
        stopMagnitude: 0.035,
        rings: [1.5, 3.4],
        seedScale: 0.65,
      },
      field: (x, y) => ({ x: -y, y: x }),
    };
  }

  if (type === 'saddle') {
    return {
      type,
      name: '鞍點',
      formula: 'F(x,y) = (x, -y)',
      jacobian: 'J = [1 0; 0 -1]',
      eigen: 'λ₁ > 0, λ₂ < 0',
      singularity: true,
      integration: {
        step: 0.055,
        steps: 115,
        stopMagnitude: 0.035,
        rings: [0.9, 2.3, 3.8],
        seedScale: 0.7,
      },
      field: (x, y) => ({ x, y: -y }),
    };
  }

  return {
    type: 'uniform',
    name: '均勻流',
    formula: 'F(x,y) = (1, 0.25)',
    jacobian: 'J = [0 0; 0 0]',
    eigen: 'λ₁ = 0, λ₂ = 0',
    singularity: false,
    integration: {
      step: 0.055,
      steps: 115,
      stopMagnitude: 0.035,
      uniform: true,
      seedScale: 0.65,
    },
    field: () => ({ x: 1, y: 0.25 }),
  };
}

export function getSeedCount(field: FieldConfig, density: number): number {
  const n = Math.round(density);
  if (field.integration.uniform) {
    return Math.max(7, Math.round(n * field.integration.seedScale));
  }
  const ringCount = field.integration.rings?.length ?? 0;
  return ringCount * Math.max(6, Math.round(n * field.integration.seedScale));
}

export function makeSeeds(field: FieldConfig, density: number): Vec2[] {
  const seeds: Vec2[] = [];
  const n = Math.round(density);
  const integration = field.integration;

  if (integration.uniform) {
    const count = getSeedCount(field, n);
    const yMin = -4.5;
    const yMax = 4.5;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      seeds.push({ x: -5.2, y: yMin + (yMax - yMin) * t });
    }
    return seeds;
  }

  const count = Math.max(6, Math.round(n * integration.seedScale));
  for (const r of integration.rings ?? []) {
    for (let i = 0; i < count; i++) {
      const t = (Math.PI * 2 * i) / count;
      seeds.push({ x: Math.cos(t) * r, y: Math.sin(t) * r });
    }
  }
  return seeds;
}

export function integrateStreamline(
  seed: Vec2,
  field: FieldConfig,
  direction: -1 | 1,
): Vec2[] {
  const points: Vec2[] = [];
  const integration = field.integration;
  let point = { ...seed };
  points.push(point);

  for (let i = 0; i < integration.steps; i++) {
    const f1 = field.field(point.x, point.y);
    const m1 = magnitude(f1);
    if (m1 < integration.stopMagnitude) break;

    const v1 = scaleVec(normalize(f1), integration.step * direction);
    const mid = add(point, scaleVec(v1, 0.5));
    const f2 = field.field(mid.x, mid.y);
    const m2 = magnitude(f2);
    if (m2 < integration.stopMagnitude) break;

    point = add(point, scaleVec(normalize(f2), integration.step * direction));
    if (Math.abs(point.x) > FIELD_WORLD_EXTENT || Math.abs(point.y) > FIELD_WORLD_EXTENT) break;
    points.push(point);
  }

  return points;
}

export function buildStreamlines(field: FieldConfig, density: number): Vec2[][] {
  return makeSeeds(field, density)
    .map((seed) => {
      const backward = integrateStreamline(seed, field, -1);
      const forward = integrateStreamline(seed, field, 1);
      return backward.reverse().concat(forward.slice(1));
    })
    .filter((path) => path.length > 2);
}

export function createVectorFieldLayout(width: number, height: number): VectorFieldLayout {
  const base = Math.min(width, height);
  const plotMin = Math.max(28, base * 0.08);
  const plotMax = base - plotMin;
  return {
    origin: { x: width * 0.5, y: height * 0.5 },
    scale: (plotMax - plotMin) / (FIELD_WORLD_EXTENT * 2),
    extent: FIELD_WORLD_EXTENT,
    plotMin,
    plotMax,
  };
}

export function worldToScreen(layout: VectorFieldLayout, point: Vec2): Vec2 {
  return {
    x: layout.origin.x + point.x * layout.scale,
    y: layout.origin.y - point.y * layout.scale,
  };
}

function toCurvePoint(v: Vec2, index: number, scale = 42): CurvePoint {
  return {
    x: v.x * scale,
    y: -v.y * scale,
    theta: index,
    arcLength: index,
  };
}

export function sampleVectorFieldPatternThumbnail(pattern: VectorFieldPattern): ThumbnailSpec {
  const field = getFieldConfig(pattern);
  const streamlines = buildStreamlines(field, 13).slice(0, 24);
  return {
    paths: streamlines.map((path) => ({
      points: path.map((point, index) => toCurvePoint(point, index)),
      strokeWidth: 1,
      opacity: 0.75,
    })),
  };
}
