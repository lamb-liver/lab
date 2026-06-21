import type { ComponentType } from 'react';
import {
  type ExploreInteractiveSlug,
  isExploreInteractive,
} from '../../explore/interactiveRegistry';
import ConicDynamicGeometryExploreRoot from './ConicDynamicGeometryExploreRoot';
import ComplexEulerFormulaExploreRoot from './ComplexEulerFormulaExploreRoot';
import DataAnalysisExploreRoot from './DataAnalysisExploreRoot';
import DifferentialEquationsGeometryExploreRoot from './DifferentialEquationsGeometryExploreRoot';
import ExponentialLogarithmExploreRoot from './ExponentialLogarithmExploreRoot';
import FunctionEquationsExploreRoot from './FunctionEquationsExploreRoot';
import LimitsRiemannSumExploreRoot from './LimitsRiemannSumExploreRoot';
import MatrixLinearTransformExploreRoot from './MatrixLinearTransformExploreRoot';
import FourierSeriesExploreRoot from './FourierSeriesExploreRoot';
import PermutationsCombinationsExploreRoot from './PermutationsCombinationsExploreRoot';
import ProbabilityStatisticsExploreRoot from './ProbabilityStatisticsExploreRoot';
import RationalFunctionsAsymptotesExploreRoot from './RationalFunctionsAsymptotesExploreRoot';
import SequencesAndSeriesExploreRoot from './SequencesAndSeriesExploreRoot';
import TrigFunctionGraphsExploreRoot from './TrigFunctionGraphsExploreRoot';
import TrigonometryFundamentalsExploreRoot from './TrigonometryFundamentalsExploreRoot';
import VectorsExploreRoot from './VectorsExploreRoot';
import WaveSuperpositionExploreRoot from './WaveSuperpositionExploreRoot';

const rootBySlug = {
  'fourier-series': FourierSeriesExploreRoot,
  'trig-function-graphs': TrigFunctionGraphsExploreRoot,
  'trig-wave-interference': WaveSuperpositionExploreRoot,
  'conic-dynamic-geometry': ConicDynamicGeometryExploreRoot,
  'matrix-linear-transform': MatrixLinearTransformExploreRoot,
  'limits-riemann-sum': LimitsRiemannSumExploreRoot,
  'differential-equations-geometry': DifferentialEquationsGeometryExploreRoot,
  'complex-euler-formula': ComplexEulerFormulaExploreRoot,
  'sequences-and-series': SequencesAndSeriesExploreRoot,
  'permutations-combinations': PermutationsCombinationsExploreRoot,
  'probability-statistics': ProbabilityStatisticsExploreRoot,
  'data-analysis': DataAnalysisExploreRoot,
  'exponential-logarithm': ExponentialLogarithmExploreRoot,
  vectors: VectorsExploreRoot,
  'trigonometry-fundamentals': TrigonometryFundamentalsExploreRoot,
  'function-equations': FunctionEquationsExploreRoot,
  'rational-functions-asymptotes': RationalFunctionsAsymptotesExploreRoot,
} satisfies Record<ExploreInteractiveSlug, ComponentType>;

export const exploreStageRootSlugs = Object.keys(rootBySlug).sort() as ExploreInteractiveSlug[];

type Props = {
  slug: string;
};

export default function ExploreInteractiveStage({ slug }: Props) {
  if (!isExploreInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return <Root />;
}
