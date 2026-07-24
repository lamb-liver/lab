import { lazy, Suspense, type ComponentType } from 'react';
import {
  type ExamInteractiveSlug,
  isExamInteractive,
} from '../../exam/interactiveRegistry';

const rootBySlug = {
  'ast-113-geometric-distribution': lazy(() => import('./GeometricDistributionExamRoot')),
  'ast-114-solid-of-revolution': lazy(() => import('./SolidOfRevolutionExamRoot')),
  'gsat-112-rotation-composition': lazy(() => import('./RotationCompositionExamRoot')),
  'gsat-112-sinusoid-superposition': lazy(() => import('./SinusoidSuperpositionExamRoot')),
  'gsat-112-skew-line-distance': lazy(() => import('./SkewLineDistanceExamRoot')),
} satisfies Record<ExamInteractiveSlug, ComponentType>;

export const examStageRootSlugs = Object.keys(rootBySlug).sort() as ExamInteractiveSlug[];

type Props = {
  slug: string;
};

export default function ExamInteractiveStage({ slug }: Props) {
  if (!isExamInteractive(slug)) return null;

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
