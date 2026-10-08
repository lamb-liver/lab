import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { affineIfsFractalModule } from '../../curve/modules/affine-ifs-fractal';
import type { CurveMetadata } from '../../curve/types';
import { useAffineIfsFractalP5 } from '../curve/useAffineIfsFractalP5';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  leafBend: 'Leaf bend b',
  branchHeight: 'Side branch height d',
  generationSpeed: 'Generation speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Iterated affine fractal' };
}

export default function AffineIfsFractalCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  return (
    <CurveHookWorkRoot
      module={affineIfsFractalModule}
      useCanvas={useAffineIfsFractalP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel={en ? 'Iterated affine fractal' : '碎形仿射疊代動畫'}
      locale={locale}
      presentMetadata={en ? englishMetadata : undefined}
      paramLabels={en ? EN_LABELS : undefined}
    />
  );
}
