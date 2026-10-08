import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { vectorFieldStreamlinesModule } from '../../curve/modules/vector-field-streamlines';
import type { CurveMetadata } from '../../curve/types';
import { useVectorFieldStreamlinesP5 } from '../curve/useVectorFieldStreamlinesP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  streamlineCount: 'Number of streamlines',
  integrationSteps: 'Integration steps',
  flowSpeed: 'Flow speed',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Vector field streamlines',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'count') return { ...stat, label: 'Streamlines' };
      if (stat.key === 'steps') return { ...stat, label: 'Steps N' };
      return stat;
    }),
  };
}

export default function VectorFieldStreamlinesCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={vectorFieldStreamlinesModule}
      useCanvas={useVectorFieldStreamlinesP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Vector field streamlines' : '向量場流線動畫'}
      locale={locale}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
