import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { affineTransformPatternModule } from '../../curve/modules/affine-transform-pattern';
import type { CurveMetadata } from '../../curve/types';
import { useAffineTransformPatternP5 } from '../curve/useAffineTransformPatternP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  rotationDeg: 'Rotation angle θ',
  translation: 'Translation e',
  evolutionSpeed: 'Evolution speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Affine transform pattern' };
}

export default function AffineTransformPatternCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={affineTransformPatternModule}
      useCanvas={useAffineTransformPatternP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Affine transform pattern' : '仿射變換圖樣動畫'}
      locale={locale}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
