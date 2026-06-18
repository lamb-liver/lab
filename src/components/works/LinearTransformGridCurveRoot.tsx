import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { linearTransformGridModule } from '../../curve/modules/linear-transform-grid';
import { useLinearTransformGridP5 } from '../curve/useLinearTransformGridP5';

type Props = {
  controlsMountId?: string;
};

export default function LinearTransformGridCurveRoot({
  controlsMountId = 'linear-transform-grid-controls',
}: Props) {
  return (
    <CurveHookWorkRoot
      module={linearTransformGridModule}
      useCanvas={useLinearTransformGridP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="線性變換網格動畫"
    />
  );
}
