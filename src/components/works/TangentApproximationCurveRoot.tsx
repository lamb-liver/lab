import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { tangentApproximationModule } from '../../curve/modules/tangent-approximation';
import { useTangentApproximationP5 } from '../curve/useTangentApproximationP5';

type Props = {
  controlsMountId: string;
};

export default function TangentApproximationCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={tangentApproximationModule}
      useCanvas={useTangentApproximationP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="切線逼近動畫"
    />
  );
}
