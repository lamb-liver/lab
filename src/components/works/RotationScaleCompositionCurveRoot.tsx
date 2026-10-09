import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { rotationScaleCompositionModule } from '../../curve/modules/rotation-scale-composition';
import type { CurveMetadata } from '../../curve/types';
import { useRotationScaleCompositionP5 } from '../curve/useRotationScaleCompositionP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  rotationStepDeg: 'Rotation step θ',
  scaleFactor: 'Scale factor s',
  evolutionSpeed: 'Evolution speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Rotation and scaling, composed' };
}

export default function RotationScaleCompositionCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={rotationScaleCompositionModule}
      useCanvas={useRotationScaleCompositionP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Rotation and scaling, composed' : '旋轉縮放疊加動畫'}
      locale={locale}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
