import type { CurvePoint, ThumbnailSpec } from '../../types';

export type Vec2 = { x: number; y: number };
export type VectorFieldPattern = 'source' | 'sink' | 'vortex' | 'saddle' | 'uniform';

type FieldIntegration = {
  step: number;
  steps: number;
  stopMagnitude: number;
  rings?: number[];
  seedScale: number;
  uniform?: boolean;
};

type FieldConfig = {
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

type VectorFieldLayout = {
  origin: Vec2;
  scale: number;
  extent: number;
  plotMin: number;
  plotMax: number;
};

const FIELD_WORLD_EXTENT = 6;
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

function add(a: Vec2, b: Vec2): Vec2 {
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

function canvasPoint(x: number, y: number, index: number): CurvePoint {
  return {
    x,
    y,
    theta: index,
    arcLength: index,
  };
}

function previewField(type: VectorFieldPattern, point: Vec2): Vec2 {
  if (type === 'sink') return { x: -point.x, y: -point.y };
  if (type === 'vortex') return { x: -point.y, y: point.x };
  if (type === 'saddle') return { x: point.x, y: -point.y };
  return { x: point.x, y: point.y };
}

function panelPoint(center: Vec2, point: Vec2): Vec2 {
  const scale = 22;
  return {
    x: center.x + point.x * scale,
    y: center.y - point.y * scale,
  };
}

function arrowHead(from: Vec2, to: Vec2, theta: number): CurvePoint[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 7;
  const wing = 4;

  return [
    canvasPoint(to.x, to.y, theta),
    canvasPoint(to.x - ux * size - uy * wing, to.y - uy * size + ux * wing, theta + 0.1),
    canvasPoint(to.x - ux * size + uy * wing, to.y - uy * size - ux * wing, theta + 0.2),
  ];
}

function panelFrame(center: Vec2, index: number): CurvePoint[] {
  const w = 118;
  const h = 64;
  const x0 = center.x - w / 2;
  const x1 = center.x + w / 2;
  const y0 = center.y - h / 2;
  const y1 = center.y + h / 2;
  return [
    canvasPoint(x0, y0, index),
    canvasPoint(x1, y0, index + 0.1),
    canvasPoint(x1, y1, index + 0.2),
    canvasPoint(x0, y1, index + 0.3),
  ];
}

export function sampleVectorFieldPatternThumbnail(_pattern: VectorFieldPattern): ThumbnailSpec {
  const panels: Array<{ type: VectorFieldPattern; center: Vec2; stroke: string }> = [
    { type: 'source', center: { x: 82, y: 60 }, stroke: 'rgba(212, 184, 122, 0.95)' },
    { type: 'sink', center: { x: 238, y: 60 }, stroke: 'rgba(130, 170, 220, 0.9)' },
    { type: 'vortex', center: { x: 82, y: 146 }, stroke: 'rgba(212, 184, 122, 0.82)' },
    { type: 'saddle', center: { x: 238, y: 146 }, stroke: 'rgba(255, 255, 255, 0.72)' },
  ];
  const seeds: Vec2[] = [
    { x: -0.78, y: -0.78 },
    { x: 0, y: -0.82 },
    { x: 0.78, y: -0.78 },
    { x: -0.82, y: 0 },
    { x: 0.82, y: 0 },
    { x: -0.78, y: 0.78 },
    { x: 0, y: 0.82 },
    { x: 0.78, y: 0.78 },
  ];
  const paths: ThumbnailSpec['paths'] = [];
  const circles: NonNullable<ThumbnailSpec['circles']> = [];

  panels.forEach((panel, panelIndex) => {
    paths.push({
      points: panelFrame(panel.center, panelIndex),
      closed: true,
      stroke: 'rgba(255, 255, 255, 0.14)',
      strokeWidth: 0.7,
      opacity: 0.8,
    });

    seeds.forEach((seed, seedIndex) => {
      const direction = normalize(previewField(panel.type, seed));
      const start = panelPoint(panel.center, {
        x: seed.x - direction.x * 0.24,
        y: seed.y - direction.y * 0.24,
      });
      const end = panelPoint(panel.center, {
        x: seed.x + direction.x * 0.24,
        y: seed.y + direction.y * 0.24,
      });
      const theta = panelIndex * 10 + seedIndex;
      paths.push({
        points: [canvasPoint(start.x, start.y, theta), canvasPoint(end.x, end.y, theta + 0.5)],
        stroke: panel.stroke,
        strokeWidth: panel.type === 'saddle' ? 1.25 : 1.45,
        opacity: 0.9,
      });
      paths.push({
        points: arrowHead(start, end, theta + 0.7),
        closed: true,
        fill: panel.stroke,
        opacity: 0.9,
      });
    });

    circles.push({
      x: panel.center.x,
      y: panel.center.y,
      r: panel.type === 'vortex' ? 3.8 : 3,
      fill: panel.type === 'saddle' ? 'rgba(255, 255, 255, 0.7)' : panel.stroke,
      opacity: 0.9,
    });
  });

  return { coordinateSystem: 'canvas', paths, circles };
}
