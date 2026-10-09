import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { riemannSumModule } from '../../curve/modules/riemann-sum';
import type { CurveMetadata } from '../../curve/types';
import { useRiemannSumP5 } from '../curve/useRiemannSumP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  partitionCount: 'Number of partitions n',
  waveFrequency: 'Wave frequency k',
  timeSpeed: 'Time speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Riemann sum',
  };
}

export default function RiemannSumCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={riemannSumModule}
      useCanvas={useRiemannSumP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Riemann sum' : '黎曼和動態圖'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
