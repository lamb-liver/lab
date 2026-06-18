import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { affineTransformPatternModule } from '../../curve/modules/affine-transform-pattern';
import { useAffineTransformPatternP5 } from '../curve/useAffineTransformPatternP5';

type Props = {
  controlsMountId?: string;
};

export default function AffineTransformPatternCurveRoot({
  controlsMountId = 'affine-transform-pattern-controls',
}: Props) {
  return (
    <CurveHookWorkRoot
      module={affineTransformPatternModule}
      useCanvas={useAffineTransformPatternP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="仿射變換圖樣動畫"
    />
  );
}
