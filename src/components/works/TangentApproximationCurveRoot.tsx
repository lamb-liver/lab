import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { tangentApproximationModule } from '../../curve/modules/tangent-approximation';
import type { CurveMetadata } from '../../curve/types';
import { useTangentApproximationP5 } from '../curve/useTangentApproximationP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  dx: 'Target span Δx',
  waveFrequency: 'Wave frequency k',
  timeSpeed: 'Time speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Tangent approximation',
  };
}

export default function TangentApproximationCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={tangentApproximationModule}
      useCanvas={useTangentApproximationP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Tangent approximation' : '切線逼近動畫'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
