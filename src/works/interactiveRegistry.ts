/** 互動作品 slug（與 `workCurveBySlug`、`WorkInteractiveStage` 同步） */
export const workInteractiveSlugs = [
  'rose-curve',
  'lissajous-curve',
  'harmonograph-curve',
  'spirograph-curve',
  'standing-wave',
  'interference-fringes',
  'chladni-figures',
  'parabolic-reflection',
  'conic-envelope',
  'conic-focus-locus',
  'linear-transform-grid',
  'affine-transform-pattern',
  'rotation-scale-composition',
  'affine-ifs-fractal',
  'riemann-sum',
  'tangent-approximation',
  'catenary',
  'equiangular-spiral',
  'vector-field-streamlines',
  'complex-arithmetic-geometry',
  'complex-polar-form',
  'euler-formula-rotation',
  'julia-set',
  'complex-phase-portrait',
] as const;

export type WorkInteractiveSlug = (typeof workInteractiveSlugs)[number];

export function isWorkInteractive(slug: string): slug is WorkInteractiveSlug {
  return (workInteractiveSlugs as readonly string[]).includes(slug);
}

export function workControlsMountId(slug: WorkInteractiveSlug): string {
  return `${slug}-controls`;
}
