import CurveWorkRoot from '../curve/CurveWorkRoot';
import { roseModule } from '../../curve/modules/rose';
import type { CurveMetadata } from '../../curve/types';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  k: 'Petal count k',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Rose curve' };
}

export default function RoseCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveWorkRoot
      module={roseModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Rose curve' : '玫瑰曲線動畫'}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
