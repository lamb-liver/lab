import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexPhasePortraitModule } from '../../curve/modules/complex-phase-portrait';
import type { CurveMetadata } from '../../curve/types';
import { useComplexPhasePortraitP5 } from '../curve/useComplexPhasePortraitP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  ampA: 'Amplitude A',
  freqB: 'Frequency B',
  phase: 'Phase δ',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Phasor diagram',
  };
}

export default function ComplexPhasePortraitCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={complexPhasePortraitModule}
      useCanvas={useComplexPhasePortraitP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Phasor diagram' : '相位圖'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
