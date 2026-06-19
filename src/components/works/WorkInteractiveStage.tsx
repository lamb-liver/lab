import type { ComponentType } from 'react';
import type { WorkInteractiveSlug } from '../../works/interactiveRegistry';
import { isWorkInteractive, workControlsMountId } from '../../works/interactiveRegistry';
import ChladniFiguresCurveRoot from './ChladniFiguresCurveRoot';
import ConicEnvelopeCurveRoot from './ConicEnvelopeCurveRoot';
import ConicFocusLocusCurveRoot from './ConicFocusLocusCurveRoot';
import HarmonographCurveRoot from './HarmonographCurveRoot';
import InterferenceFringesCurveRoot from './InterferenceFringesCurveRoot';
import LissajousCurveRoot from './LissajousCurveRoot';
import ParabolicReflectionCurveRoot from './ParabolicReflectionCurveRoot';
import RoseCurveRoot from './RoseCurveRoot';
import SpirographCurveRoot from './SpirographCurveRoot';
import AffineIfsFractalCurveRoot from './AffineIfsFractalCurveRoot';
import AffineTransformPatternCurveRoot from './AffineTransformPatternCurveRoot';
import RiemannSumCurveRoot from './RiemannSumCurveRoot';
import RotationScaleCompositionCurveRoot from './RotationScaleCompositionCurveRoot';
import CatenaryCurveRoot from './CatenaryCurveRoot';
import TangentApproximationCurveRoot from './TangentApproximationCurveRoot';
import LinearTransformGridCurveRoot from './LinearTransformGridCurveRoot';
import StandingWaveCurveRoot from './StandingWaveCurveRoot';
import EquiangularSpiralCurveRoot from './EquiangularSpiralCurveRoot';
import VectorFieldPatternsCurveRoot from './VectorFieldPatternsCurveRoot';
import VectorFieldStreamlinesCurveRoot from './VectorFieldStreamlinesCurveRoot';
import VectorAdditionScalarCurveRoot from './VectorAdditionScalarCurveRoot';
import DotProductGeometryCurveRoot from './DotProductGeometryCurveRoot';
import LawOfSinesCosinesCurveRoot from './LawOfSinesCosinesCurveRoot';
import RadianArcLengthCurveRoot from './RadianArcLengthCurveRoot';
import SinusoidAmplitudePeriodPhaseCurveRoot from './SinusoidAmplitudePeriodPhaseCurveRoot';
import UnitCircleTrigDefinitionCurveRoot from './UnitCircleTrigDefinitionCurveRoot';
import TrigAngleIdentitiesCurveRoot from './TrigAngleIdentitiesCurveRoot';
import VectorProjectionCurveRoot from './VectorProjectionCurveRoot';
import ComplexArithmeticGeometryCurveRoot from './ComplexArithmeticGeometryCurveRoot';
import ComplexPolarFormCurveRoot from './ComplexPolarFormCurveRoot';
import EulerFormulaRotationCurveRoot from './EulerFormulaRotationCurveRoot';
import JuliaSetCurveRoot from './JuliaSetCurveRoot';
import ComplexPhasePortraitCurveRoot from './ComplexPhasePortraitCurveRoot';
import ArithmeticGeometricSequencesCurveRoot from './ArithmeticGeometricSequencesCurveRoot';
import FibonacciSpiralCurveRoot from './FibonacciSpiralCurveRoot';
import SierpinskiTriangleCurveRoot from './SierpinskiTriangleCurveRoot';
import BaselProblemCurveRoot from './BaselProblemCurveRoot';
import LogisticBifurcationCurveRoot from './LogisticBifurcationCurveRoot';
import PascalsTriangleCurveRoot from './PascalsTriangleCurveRoot';
import CombinatorialPathCountingCurveRoot from './CombinatorialPathCountingCurveRoot';
import BinomialExpansionGeometryCurveRoot from './BinomialExpansionGeometryCurveRoot';
import CatalanNumbersCurveRoot from './CatalanNumbersCurveRoot';
import ConditionalProbabilityBayesCurveRoot from './ConditionalProbabilityBayesCurveRoot';
import BinomialToNormalCurveRoot from './BinomialToNormalCurveRoot';
import BuffonNeedleCurveRoot from './BuffonNeedleCurveRoot';
import ExponentialGrowthDecayCurveRoot from './ExponentialGrowthDecayCurveRoot';
import LogarithmicScaleCurveRoot from './LogarithmicScaleCurveRoot';
import NaturalLogEGeometryCurveRoot from './NaturalLogEGeometryCurveRoot';
import LogisticCurveCurveRoot from './LogisticCurveCurveRoot';
import FunctionGraphTransformCurveRoot from './FunctionGraphTransformCurveRoot';
import QuadraticCompletingSquareCurveRoot from './QuadraticCompletingSquareCurveRoot';
import PolynomialRootsMultiplicityCurveRoot from './PolynomialRootsMultiplicityCurveRoot';
import InverseFunctionReflectionCurveRoot from './InverseFunctionReflectionCurveRoot';
import EigenvectorGeometryCurveRoot from './EigenvectorGeometryCurveRoot';
import FunctionDerivativeGraphCurveRoot from './FunctionDerivativeGraphCurveRoot';
import TaylorPolynomialApproximationCurveRoot from './TaylorPolynomialApproximationCurveRoot';
import RationalVerticalHorizontalAsymptotesCurveRoot from './RationalVerticalHorizontalAsymptotesCurveRoot';
import RationalObliqueAsymptoteCurveRoot from './RationalObliqueAsymptoteCurveRoot';

type RootProps = { controlsMountId?: string };

const rootBySlug = {
  'rose-curve': RoseCurveRoot,
  'lissajous-curve': LissajousCurveRoot,
  'harmonograph-curve': HarmonographCurveRoot,
  'spirograph-curve': SpirographCurveRoot,
  'standing-wave': StandingWaveCurveRoot,
  'interference-fringes': InterferenceFringesCurveRoot,
  'chladni-figures': ChladniFiguresCurveRoot,
  'parabolic-reflection': ParabolicReflectionCurveRoot,
  'conic-envelope': ConicEnvelopeCurveRoot,
  'conic-focus-locus': ConicFocusLocusCurveRoot,
  'linear-transform-grid': LinearTransformGridCurveRoot,
  'affine-transform-pattern': AffineTransformPatternCurveRoot,
  'rotation-scale-composition': RotationScaleCompositionCurveRoot,
  'affine-ifs-fractal': AffineIfsFractalCurveRoot,
  'riemann-sum': RiemannSumCurveRoot,
  'tangent-approximation': TangentApproximationCurveRoot,
  'catenary': CatenaryCurveRoot,
  'equiangular-spiral': EquiangularSpiralCurveRoot,
  'vector-field-patterns': VectorFieldPatternsCurveRoot,
  'vector-field-streamlines': VectorFieldStreamlinesCurveRoot,
  'vector-addition-scalar': VectorAdditionScalarCurveRoot,
  'dot-product-geometry': DotProductGeometryCurveRoot,
  'law-of-sines-cosines': LawOfSinesCosinesCurveRoot,
  'radian-arc-length': RadianArcLengthCurveRoot,
  'sinusoid-amplitude-period-phase': SinusoidAmplitudePeriodPhaseCurveRoot,
  'unit-circle-trig-definition': UnitCircleTrigDefinitionCurveRoot,
  'trig-angle-identities': TrigAngleIdentitiesCurveRoot,
  'vector-projection': VectorProjectionCurveRoot,
  'complex-arithmetic-geometry': ComplexArithmeticGeometryCurveRoot,
  'complex-polar-form': ComplexPolarFormCurveRoot,
  'euler-formula-rotation': EulerFormulaRotationCurveRoot,
  'julia-set': JuliaSetCurveRoot,
  'complex-phase-portrait': ComplexPhasePortraitCurveRoot,
  'arithmetic-geometric-sequences': ArithmeticGeometricSequencesCurveRoot,
  'fibonacci-spiral': FibonacciSpiralCurveRoot,
  'sierpinski-triangle': SierpinskiTriangleCurveRoot,
  'basel-problem': BaselProblemCurveRoot,
  'logistic-bifurcation': LogisticBifurcationCurveRoot,
  'pascals-triangle': PascalsTriangleCurveRoot,
  'combinatorial-path-counting': CombinatorialPathCountingCurveRoot,
  'binomial-expansion-geometry': BinomialExpansionGeometryCurveRoot,
  'catalan-numbers': CatalanNumbersCurveRoot,
  'conditional-probability-bayes': ConditionalProbabilityBayesCurveRoot,
  'binomial-to-normal': BinomialToNormalCurveRoot,
  'buffon-needle': BuffonNeedleCurveRoot,
  'exponential-growth-decay': ExponentialGrowthDecayCurveRoot,
  'logarithmic-scale': LogarithmicScaleCurveRoot,
  'natural-log-e-geometry': NaturalLogEGeometryCurveRoot,
  'logistic-curve': LogisticCurveCurveRoot,
  'function-graph-transform': FunctionGraphTransformCurveRoot,
  'quadratic-completing-square': QuadraticCompletingSquareCurveRoot,
  'polynomial-roots-multiplicity': PolynomialRootsMultiplicityCurveRoot,
  'inverse-function-reflection': InverseFunctionReflectionCurveRoot,
  'eigenvector-geometry': EigenvectorGeometryCurveRoot,
  'function-derivative-graph': FunctionDerivativeGraphCurveRoot,
  'taylor-polynomial-approximation': TaylorPolynomialApproximationCurveRoot,
  'rational-vertical-horizontal-asymptotes': RationalVerticalHorizontalAsymptotesCurveRoot,
  'rational-oblique-asymptote': RationalObliqueAsymptoteCurveRoot,
} satisfies Record<WorkInteractiveSlug, ComponentType<RootProps>>;

// Test instrumentation: keeps stage root coverage explicit without changing mounting behavior.
export const workStageRootSlugs = Object.keys(rootBySlug).sort() as WorkInteractiveSlug[];

type Props = {
  slug: string;
};

export default function WorkInteractiveStage({ slug }: Props) {
  if (!isWorkInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return <Root controlsMountId={workControlsMountId(slug)} />;
}
