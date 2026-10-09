import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexArithmeticGeometryModule } from '../../curve/modules/complex-arithmetic-geometry';
import type { CurveMetadata } from '../../curve/types';
import { useComplexArithmeticGeometryP5 } from '../curve/useComplexArithmeticGeometryP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  r1: 'z₁ modulus r₁',
  theta1: 'z₁ argument θ₁',
  r2: 'z₂ modulus r₂',
  theta2: 'z₂ argument θ₂',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Geometric significance of complex arithmetic',
  };
}

export default function ComplexArithmeticGeometryCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={complexArithmeticGeometryModule}
      useCanvas={useComplexArithmeticGeometryP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Geometric significance of complex arithmetic' : '複數四則運算幾何動畫'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
