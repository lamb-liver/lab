import type { ComponentType } from 'react';
import {
  type ExploreInteractiveSlug,
  isExploreInteractive,
} from '../../explore/interactiveRegistry';
import FourierSeriesExploreRoot from './FourierSeriesExploreRoot';

const rootBySlug = {
  'fourier-series': FourierSeriesExploreRoot,
} satisfies Record<ExploreInteractiveSlug, ComponentType>;

type Props = {
  slug: string;
};

export default function ExploreInteractiveStage({ slug }: Props) {
  if (!isExploreInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return <Root />;
}
