import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { eulerFormulaRotationModule } from '../../curve/modules/euler-formula-rotation';
import type { CurveMetadata } from '../../curve/types';
import { useEulerFormulaRotationP5 } from '../curve/useEulerFormulaRotationP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  amplitude: 'Amplitude A',
  frequency: 'Angular frequency ω',
  phase: 'Initial phase δ',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: "Euler's formula, rotating",
  };
}

export default function EulerFormulaRotationCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={eulerFormulaRotationModule}
      useCanvas={useEulerFormulaRotationP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? "Euler's formula, rotating" : '尤拉公式旋轉動畫'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
