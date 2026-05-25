import type { CurveModule } from './types';
import { harmonographModule } from './modules/harmonograph';
import { chladniFiguresModule } from './modules/chladni-figures';
import { conicEnvelopeModule } from './modules/conic-envelope';
import { conicFocusLocusModule } from './modules/conic-focus-locus';
import { interferenceFringesModule } from './modules/interference-fringes';
import { lissajousModule } from './modules/lissajous';
import { parabolicReflectionModule } from './modules/parabolic-reflection';
import { roseModule } from './modules/rose';
import { spirographModule } from './modules/spirograph';
import { catenaryModule } from './modules/catenary';
import { affineIfsFractalModule } from './modules/affine-ifs-fractal';
import { riemannSumModule } from './modules/riemann-sum';
import { tangentApproximationModule } from './modules/tangent-approximation';
import { affineTransformPatternModule } from './modules/affine-transform-pattern';
import { rotationScaleCompositionModule } from './modules/rotation-scale-composition';
import { linearTransformGridModule } from './modules/linear-transform-grid';
import { standingWaveModule } from './modules/standing-wave';
import { equiangularSpiralModule } from './modules/equiangular-spiral';
import { vectorFieldStreamlinesModule } from './modules/vector-field-streamlines';

/** 作品集 slug → 曲線模組（縮圖、靜態預覽用） */
export const workCurveBySlug: Record<string, CurveModule> = {
  'rose-curve': roseModule,
  'lissajous-curve': lissajousModule,
  'harmonograph-curve': harmonographModule,
  'spirograph-curve': spirographModule,
  'standing-wave': standingWaveModule,
  'interference-fringes': interferenceFringesModule,
  'chladni-figures': chladniFiguresModule,
  'parabolic-reflection': parabolicReflectionModule,
  'conic-envelope': conicEnvelopeModule,
  'conic-focus-locus': conicFocusLocusModule,
  'linear-transform-grid': linearTransformGridModule,
  'affine-transform-pattern': affineTransformPatternModule,
  'rotation-scale-composition': rotationScaleCompositionModule,
  'affine-ifs-fractal': affineIfsFractalModule,
  'riemann-sum': riemannSumModule,
  'tangent-approximation': tangentApproximationModule,
  'catenary': catenaryModule,
  'equiangular-spiral': equiangularSpiralModule,
  'vector-field-streamlines': vectorFieldStreamlinesModule,
};
