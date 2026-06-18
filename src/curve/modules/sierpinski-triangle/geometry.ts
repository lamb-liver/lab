import { mulberry32 } from '../../prng';
import type { CurvePoint, ThumbnailSpec } from '../../types';

export const SIERPINSKI_VIEW = {
  width: 900,
  height: 900,
  padding: 34,
  top: 56,
  bottom: 844,
};

export const MODE_RECURSIVE = 0;
export const MODE_CHAOS = 1;
export const MODE_COMPARE = 2;
export const MAX_DEPTH = 8;

export type SierpinskiMode = 'recursive' | 'chaos' | 'compare';

export type Point = {
  x: number;
  y: number;
};

export type Triangle = {
  a: Point;
  b: Point;
  c: Point;
};

export type TopologyTriangle = Triangle & {
  type: 'solid' | 'void';
  depth: number;
  spawn: number;
};

export type ChaosStep = {
  point: Point;
  from: Point;
  target: Point;
};

export function sierpinskiModeFromValue(value: number | undefined): SierpinskiMode {
  const mode = Math.round(value ?? MODE_COMPARE);
  if (mode === MODE_RECURSIVE) return 'recursive';
  if (mode === MODE_CHAOS) return 'chaos';
  return 'compare';
}

export function buildRootTriangle(offsetX: number, panelWidth: number): Triangle {
  return {
    a: {
      x: offsetX + panelWidth * 0.5,
      y: SIERPINSKI_VIEW.top,
    },
    b: {
      x: offsetX + SIERPINSKI_VIEW.padding,
      y: SIERPINSKI_VIEW.bottom,
    },
    c: {
      x: offsetX + panelWidth - SIERPINSKI_VIEW.padding,
      y: SIERPINSKI_VIEW.bottom,
    },
  };
}

export function buildRecursiveTopology(root: Triangle, depth: number): TopologyTriangle[] {
  const topology: TopologyTriangle[] = [
    {
      ...root,
      type: 'solid',
      depth: 0,
      spawn: 0,
    },
  ];

  recursiveSubdivision(root, 0, Math.max(1, Math.round(depth)), topology);
  return topology;
}

export function buildChaosSteps(root: Triangle, count: number, seed = 20260528): ChaosStep[] {
  const random = mulberry32(seed);
  const vertices = [root.a, root.b, root.c];
  let current = centroid(root);
  const steps: ChaosStep[] = [];

  for (let i = 0; i < count; i += 1) {
    const target = vertices[Math.floor(random() * vertices.length)]!;
    const from = current;
    current = midpoint(current, target);
    steps.push({
      from,
      target,
      point: current,
    });
  }

  return steps;
}

export function chaosPointCountForDepth(depth: number): number {
  return 500 + Math.round(Math.pow(3, Math.max(1, Math.round(depth))) * 0.7);
}

export function buildSierpinskiThumbnail(depth: number): ThumbnailSpec {
  const root = buildRootTriangle(0, SIERPINSKI_VIEW.width);
  const topology = buildRecursiveTopology(root, Math.min(6, depth));
  const visibleSolids = topology.filter((tri) => tri.type === 'solid' && tri.depth === Math.min(6, depth));
  const fallbackSolids = topology.filter((tri) => tri.type === 'solid');
  const solids = visibleSolids.length > 0 ? visibleSolids : fallbackSolids;

  return {
    paths: [
      {
        points: triangleToCurvePoints(root),
        closed: true,
        opacity: 0.35,
        strokeWidth: 0.8,
        excludeFromBbox: true,
      },
      ...solids.map((tri) => ({
        points: triangleToCurvePoints(tri),
        closed: true,
        opacity: 0.7,
        strokeWidth: 0.65,
      })),
    ],
  };
}

function recursiveSubdivision(
  tri: Triangle,
  depth: number,
  maxDepth: number,
  topology: TopologyTriangle[],
): void {
  if (depth >= maxDepth) return;

  const ab = midpoint(tri.a, tri.b);
  const bc = midpoint(tri.b, tri.c);
  const ca = midpoint(tri.c, tri.a);
  const spawn = depth + 1;

  topology.push({
    type: 'void',
    a: ab,
    b: bc,
    c: ca,
    depth,
    spawn,
  });

  const children: TopologyTriangle[] = [
    {
      type: 'solid',
      a: tri.a,
      b: ab,
      c: ca,
      depth: depth + 1,
      spawn,
    },
    {
      type: 'solid',
      a: ab,
      b: tri.b,
      c: bc,
      depth: depth + 1,
      spawn,
    },
    {
      type: 'solid',
      a: ca,
      b: bc,
      c: tri.c,
      depth: depth + 1,
      spawn,
    },
  ];

  topology.push(...children);
  for (const child of children) {
    recursiveSubdivision(child, depth + 1, maxDepth, topology);
  }
}

function midpoint(v1: Point, v2: Point): Point {
  return {
    x: (v1.x + v2.x) * 0.5,
    y: (v1.y + v2.y) * 0.5,
  };
}

function centroid(tri: Triangle): Point {
  return {
    x: (tri.a.x + tri.b.x + tri.c.x) / 3,
    y: (tri.a.y + tri.b.y + tri.c.y) / 3,
  };
}

function triangleToCurvePoints(tri: Triangle): CurvePoint[] {
  const raw = [tri.a, tri.b, tri.c];
  let cumulative = 0;
  let prev = raw[0]!;
  return raw.map((point, index) => {
    if (index > 0) {
      cumulative += Math.hypot(point.x - prev.x, point.y - prev.y);
    }
    prev = point;
    return {
      x: point.x,
      y: point.y,
      theta: index,
      arcLength: cumulative,
    };
  });
}
