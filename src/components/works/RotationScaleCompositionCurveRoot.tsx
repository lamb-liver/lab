import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { rotationScaleCompositionModule } from '../../curve/modules/rotation-scale-composition';
import { useRotationScaleCompositionP5 } from '../curve/useRotationScaleCompositionP5';

type Props = {
  controlsMountId: string;
};

export default function RotationScaleCompositionCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={rotationScaleCompositionModule}
      useCanvas={useRotationScaleCompositionP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="旋轉縮放疊加動畫"
    />
  );
}
