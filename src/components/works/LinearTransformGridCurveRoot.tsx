import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { linearTransformGridModule } from '../../curve/modules/linear-transform-grid';
import type { CurveMetadata } from '../../curve/types';
import { useLinearTransformGridP5 } from '../curve/useLinearTransformGridP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Linear transform grid' };
}

export default function LinearTransformGridCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={linearTransformGridModule}
      useCanvas={useLinearTransformGridP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Linear transform grid' : '線性變換網格動畫'}
      locale={locale}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={
        en
          ? {
              shearX: 'X shear b',
              scaleY: 'Y scale d',
              transformSpeed: 'Transform speed ω',
            }
          : undefined
      }
    />
  );
}
