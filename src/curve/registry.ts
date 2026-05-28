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
import { complexArithmeticGeometryModule } from './modules/complex-arithmetic-geometry';
import { complexPolarFormModule } from './modules/complex-polar-form';
import { eulerFormulaRotationModule } from './modules/euler-formula-rotation';
import { juliaSetModule } from './modules/julia-set';
import { complexPhasePortraitModule } from './modules/complex-phase-portrait';
import { arithmeticGeometricSequencesModule } from './modules/arithmetic-geometric-sequences';
import { fibonacciSpiralModule } from './modules/fibonacci-spiral';
import { sierpinskiTriangleModule } from './modules/sierpinski-triangle';
import { baselProblemModule } from './modules/basel-problem';
import { logisticBifurcationModule } from './modules/logistic-bifurcation';
import { pascalsTriangleModule } from './modules/pascals-triangle';
import { combinatorialPathCountingModule } from './modules/combinatorial-path-counting';
import { binomialExpansionGeometryModule } from './modules/binomial-expansion-geometry';
import { catalanNumbersModule } from './modules/catalan-numbers';
import { conditionalProbabilityBayesModule } from './modules/conditional-probability-bayes';
import { binomialToNormalModule } from './modules/binomial-to-normal';
import { buffonNeedleModule } from './modules/buffon-needle';

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
  'complex-arithmetic-geometry': complexArithmeticGeometryModule,
  'complex-polar-form': complexPolarFormModule,
  'euler-formula-rotation': eulerFormulaRotationModule,
  'julia-set': juliaSetModule,
  'complex-phase-portrait': complexPhasePortraitModule,
  'arithmetic-geometric-sequences': arithmeticGeometricSequencesModule,
  'fibonacci-spiral': fibonacciSpiralModule,
  'sierpinski-triangle': sierpinskiTriangleModule,
  'basel-problem': baselProblemModule,
  'logistic-bifurcation': logisticBifurcationModule,
  'pascals-triangle': pascalsTriangleModule,
  'combinatorial-path-counting': combinatorialPathCountingModule,
  'binomial-expansion-geometry': binomialExpansionGeometryModule,
  'catalan-numbers': catalanNumbersModule,
  'conditional-probability-bayes': conditionalProbabilityBayesModule,
  'binomial-to-normal': binomialToNormalModule,
  'buffon-needle': buffonNeedleModule,
};
