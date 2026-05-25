import type { ComponentType } from 'react';
import {
  type ExploreInteractiveSlug,
  isExploreInteractive,
} from '../../explore/interactiveRegistry';
import FourierSeriesExploreRoot from './FourierSeriesExploreRoot';
import WaveSuperpositionExploreRoot from './WaveSuperpositionExploreRoot';

const rootBySlug = {
  'fourier-series': FourierSeriesExploreRoot,
  'trig-wave-interference': WaveSuperpositionExploreRoot,
} satisfies Record<ExploreInteractiveSlug, ComponentType>;

type Props = {
  slug: string;
};

export default function ExploreInteractiveStage({ slug }: Props) {
  if (!isExploreInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return <Root />;
}
