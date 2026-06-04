import type { ComponentType } from 'react';
import {
  type ExploreInteractiveSlug,
  isExploreInteractive,
} from '../../explore/interactiveRegistry';
import ConicDynamicGeometryExploreRoot from './ConicDynamicGeometryExploreRoot';
import ComplexEulerFormulaExploreRoot from './ComplexEulerFormulaExploreRoot';
import DifferentialEquationsGeometryExploreRoot from './DifferentialEquationsGeometryExploreRoot';
import LimitsRiemannSumExploreRoot from './LimitsRiemannSumExploreRoot';
import MatrixLinearTransformExploreRoot from './MatrixLinearTransformExploreRoot';
import FourierSeriesExploreRoot from './FourierSeriesExploreRoot';
import PermutationsCombinationsExploreRoot from './PermutationsCombinationsExploreRoot';
import ProbabilityStatisticsExploreRoot from './ProbabilityStatisticsExploreRoot';
import SequencesAndSeriesExploreRoot from './SequencesAndSeriesExploreRoot';
import WaveSuperpositionExploreRoot from './WaveSuperpositionExploreRoot';

const rootBySlug = {
  'fourier-series': FourierSeriesExploreRoot,
  'trig-wave-interference': WaveSuperpositionExploreRoot,
  'conic-dynamic-geometry': ConicDynamicGeometryExploreRoot,
  'matrix-linear-transform': MatrixLinearTransformExploreRoot,
  'limits-riemann-sum': LimitsRiemannSumExploreRoot,
  'differential-equations-geometry': DifferentialEquationsGeometryExploreRoot,
  'complex-euler-formula': ComplexEulerFormulaExploreRoot,
  'sequences-and-series': SequencesAndSeriesExploreRoot,
  'permutations-combinations': PermutationsCombinationsExploreRoot,
  'probability-statistics': ProbabilityStatisticsExploreRoot,
} satisfies Record<ExploreInteractiveSlug, ComponentType>;

type Props = {
  slug: string;
};

export default function ExploreInteractiveStage({ slug }: Props) {
  if (!isExploreInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return <Root />;
}
