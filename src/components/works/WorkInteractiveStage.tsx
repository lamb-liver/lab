import { lazy, Suspense, type ComponentType } from 'react';
import type { WorkInteractiveSlug } from '../../works/interactiveRegistry';
import { isWorkInteractive, workControlsMountId } from '../../works/interactiveRegistry';

type RootProps = { controlsMountId: string };

// Each root is code-split per slug so a work page only downloads its own root chunk.

const rootBySlug = {
  'rose-curve': lazy(() => import('./RoseCurveRoot')),
  'lissajous-curve': lazy(() => import('./LissajousCurveRoot')),
  'harmonograph-curve': lazy(() => import('./HarmonographCurveRoot')),
  'spirograph-curve': lazy(() => import('./SpirographCurveRoot')),
  'standing-wave': lazy(() => import('./StandingWaveCurveRoot')),
  'interference-fringes': lazy(() => import('./InterferenceFringesCurveRoot')),
  'chladni-figures': lazy(() => import('./ChladniFiguresCurveRoot')),
  'parabolic-reflection': lazy(() => import('./ParabolicReflectionCurveRoot')),
  'conic-envelope': lazy(() => import('./ConicEnvelopeCurveRoot')),
  'conic-focus-locus': lazy(() => import('./ConicFocusLocusCurveRoot')),
  'linear-transform-grid': lazy(() => import('./LinearTransformGridCurveRoot')),
  'affine-transform-pattern': lazy(() => import('./AffineTransformPatternCurveRoot')),
  'rotation-scale-composition': lazy(() => import('./RotationScaleCompositionCurveRoot')),
  'affine-ifs-fractal': lazy(() => import('./AffineIfsFractalCurveRoot')),
  'riemann-sum': lazy(() => import('./RiemannSumCurveRoot')),
  'tangent-approximation': lazy(() => import('./TangentApproximationCurveRoot')),
  'catenary': lazy(() => import('./CatenaryCurveRoot')),
  'equiangular-spiral': lazy(() => import('./EquiangularSpiralCurveRoot')),
  'vector-field-patterns': lazy(() => import('./VectorFieldPatternsCurveRoot')),
  'vector-field-streamlines': lazy(() => import('./VectorFieldStreamlinesCurveRoot')),
  'vector-addition-scalar': lazy(() => import('./VectorAdditionScalarCurveRoot')),
  'dot-product-geometry': lazy(() => import('./DotProductGeometryCurveRoot')),
  'law-of-sines-cosines': lazy(() => import('./LawOfSinesCosinesCurveRoot')),
  'radian-arc-length': lazy(() => import('./RadianArcLengthCurveRoot')),
  'sinusoid-amplitude-period-phase': lazy(() => import('./SinusoidAmplitudePeriodPhaseCurveRoot')),
  'unit-circle-trig-definition': lazy(() => import('./UnitCircleTrigDefinitionCurveRoot')),
  'trig-angle-identities': lazy(() => import('./TrigAngleIdentitiesCurveRoot')),
  'vector-projection': lazy(() => import('./VectorProjectionCurveRoot')),
  'complex-arithmetic-geometry': lazy(() => import('./ComplexArithmeticGeometryCurveRoot')),
  'complex-polar-form': lazy(() => import('./ComplexPolarFormCurveRoot')),
  'euler-formula-rotation': lazy(() => import('./EulerFormulaRotationCurveRoot')),
  'julia-set': lazy(() => import('./JuliaSetCurveRoot')),
  'complex-phase-portrait': lazy(() => import('./ComplexPhasePortraitCurveRoot')),
  'arithmetic-geometric-sequences': lazy(() => import('./ArithmeticGeometricSequencesCurveRoot')),
  'fibonacci-spiral': lazy(() => import('./FibonacciSpiralCurveRoot')),
  'sierpinski-triangle': lazy(() => import('./SierpinskiTriangleCurveRoot')),
  'basel-problem': lazy(() => import('./BaselProblemCurveRoot')),
  'logistic-bifurcation': lazy(() => import('./LogisticBifurcationCurveRoot')),
  'pascals-triangle': lazy(() => import('./PascalsTriangleCurveRoot')),
  'combinatorial-path-counting': lazy(() => import('./CombinatorialPathCountingCurveRoot')),
  'binomial-expansion-geometry': lazy(() => import('./BinomialExpansionGeometryCurveRoot')),
  'catalan-numbers': lazy(() => import('./CatalanNumbersCurveRoot')),
  'conditional-probability-bayes': lazy(() => import('./ConditionalProbabilityBayesCurveRoot')),
  'binomial-geometric-distribution': lazy(() => import('./BinomialGeometricDistributionCurveRoot')),
  'binomial-to-normal': lazy(() => import('./BinomialToNormalCurveRoot')),
  'buffon-needle': lazy(() => import('./BuffonNeedleCurveRoot')),
  'exponential-growth-decay': lazy(() => import('./ExponentialGrowthDecayCurveRoot')),
  'logarithmic-scale': lazy(() => import('./LogarithmicScaleCurveRoot')),
  'natural-log-e-geometry': lazy(() => import('./NaturalLogEGeometryCurveRoot')),
  'logistic-curve': lazy(() => import('./LogisticCurveCurveRoot')),
  'function-graph-transform': lazy(() => import('./FunctionGraphTransformCurveRoot')),
  'quadratic-completing-square': lazy(() => import('./QuadraticCompletingSquareCurveRoot')),
  'polynomial-roots-multiplicity': lazy(() => import('./PolynomialRootsMultiplicityCurveRoot')),
  'inverse-function-reflection': lazy(() => import('./InverseFunctionReflectionCurveRoot')),
  'eigenvector-geometry': lazy(() => import('./EigenvectorGeometryCurveRoot')),
  'function-derivative-graph': lazy(() => import('./FunctionDerivativeGraphCurveRoot')),
  'taylor-polynomial-approximation': lazy(() => import('./TaylorPolynomialApproximationCurveRoot')),
  'rational-vertical-horizontal-asymptotes': lazy(() => import('./RationalVerticalHorizontalAsymptotesCurveRoot')),
  'rational-oblique-asymptote': lazy(() => import('./RationalObliqueAsymptoteCurveRoot')),
  'scatter-correlation-regression': lazy(() => import('./ScatterCorrelationRegressionCurveRoot')),
  'regression-outlier-influence': lazy(() => import('./RegressionOutlierInfluenceCurveRoot')),
  'percentile-box-plot': lazy(() => import('./PercentileBoxPlotCurveRoot')),
} satisfies Record<WorkInteractiveSlug, ComponentType<RootProps>>;

// Test instrumentation: keeps stage root coverage explicit without changing mounting behavior.
export const workStageRootSlugs = Object.keys(rootBySlug).sort() as WorkInteractiveSlug[];

type Props = {
  slug: string;
};

export default function WorkInteractiveStage({ slug }: Props) {
  if (!isWorkInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return (
    <Suspense
      fallback={
        <div
          className="interactive-loading"
          role="status"
          aria-live="polite"
          aria-label="互動內容載入中"
        >
          <span className="interactive-loading__mark" />
        </div>
      }
    >
      <Root controlsMountId={workControlsMountId(slug)} />
    </Suspense>
  );
}
