import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexPolarFormModule } from '../../curve/modules/complex-polar-form';
import type { CurveMetadata } from '../../curve/types';
import { useComplexPolarFormP5 } from '../curve/useComplexPolarFormP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  r: 'Modulus r',
  theta: 'Argument θ',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Polar form of a complex number',
  };
}

export default function ComplexPolarFormCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={complexPolarFormModule}
      useCanvas={useComplexPolarFormP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Polar form of a complex number' : '複數極座標形式動畫'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
