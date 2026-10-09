import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { fibonacciSpiralModule } from '../../curve/modules/fibonacci-spiral';
import type { CurveMetadata } from '../../curve/types';
import { useFibonacciSpiralP5 } from '../curve/useFibonacciSpiralP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  n: 'Number of terms n',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Fibonacci spiral' };
}

export default function FibonacciSpiralCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={fibonacciSpiralModule}
      useCanvas={useFibonacciSpiralP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Fibonacci spiral' : '費波那契螺線'}
      locale={locale}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
