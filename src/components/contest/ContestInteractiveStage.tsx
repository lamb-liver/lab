import { lazy, Suspense, type ComponentType } from 'react';
import {
  type ContestInteractiveSlug,
  isContestInteractive,
} from '../../contest/interactiveRegistry';

const rootBySlug = {
  'homogeneous-normalization': lazy(() => import('./HomogeneousNormalizationContestRoot')),
} satisfies Record<ContestInteractiveSlug, ComponentType>;

export const contestStageRootSlugs = Object.keys(rootBySlug).sort() as ContestInteractiveSlug[];

type Props = { slug: string };

export default function ContestInteractiveStage({ slug }: Props) {
  if (!isContestInteractive(slug)) return null;
  const Root = rootBySlug[slug];
  return (
    <Suspense
      fallback={
        <div
          className="interactive-loading interactive-loading--contest"
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
