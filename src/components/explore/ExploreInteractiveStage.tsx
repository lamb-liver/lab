import { lazy, Suspense, type ComponentType } from 'react';
import {
  type ExploreInteractiveSlug,
  isExploreInteractive,
} from '../../explore/interactiveRegistry';

// Each root is code-split per slug so an explore page only downloads its own root chunk.
const rootBySlug = {
  'fourier-series': lazy(() => import('./FourierSeriesExploreRoot')),
  'trig-function-graphs': lazy(() => import('./TrigFunctionGraphsExploreRoot')),
  'trig-wave-interference': lazy(() => import('./WaveSuperpositionExploreRoot')),
  'conic-dynamic-geometry': lazy(() => import('./ConicDynamicGeometryExploreRoot')),
  'matrix-linear-transform': lazy(() => import('./MatrixLinearTransformExploreRoot')),
  'limits-riemann-sum': lazy(() => import('./LimitsRiemannSumExploreRoot')),
  'differential-equations-geometry': lazy(() => import('./DifferentialEquationsGeometryExploreRoot')),
  'complex-euler-formula': lazy(() => import('./ComplexEulerFormulaExploreRoot')),
  'sequences-and-series': lazy(() => import('./SequencesAndSeriesExploreRoot')),
  'permutations-combinations': lazy(() => import('./PermutationsCombinationsExploreRoot')),
  'probability-statistics': lazy(() => import('./ProbabilityStatisticsExploreRoot')),
  'discrete-random-variables': lazy(() => import('./DiscreteRandomVariablesExploreRoot')),
  'data-analysis': lazy(() => import('./DataAnalysisExploreRoot')),
  'exponential-logarithm': lazy(() => import('./ExponentialLogarithmExploreRoot')),
  vectors: lazy(() => import('./VectorsExploreRoot')),
  'trigonometry-fundamentals': lazy(() => import('./TrigonometryFundamentalsExploreRoot')),
  'function-equations': lazy(() => import('./FunctionEquationsExploreRoot')),
  'rational-functions-asymptotes': lazy(() => import('./RationalFunctionsAsymptotesExploreRoot')),
} satisfies Record<ExploreInteractiveSlug, ComponentType>;

export const exploreStageRootSlugs = Object.keys(rootBySlug).sort() as ExploreInteractiveSlug[];

type Props = {
  slug: string;
};

export default function ExploreInteractiveStage({ slug }: Props) {
  if (!isExploreInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return (
    <Suspense
      fallback={
        <div
          className="interactive-loading interactive-loading--explore"
          role="status"
          aria-live="polite"
          aria-label="互動內容載入中"
        >
          <span className="interactive-loading__mark" />
        </div>
      }
    >
      <Root />
    </Suspense>
  );
}
