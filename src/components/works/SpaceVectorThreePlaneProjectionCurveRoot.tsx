import CurveWorkRoot from '../curve/CurveWorkRoot';
import { spaceVectorThreePlaneProjectionModule } from '../../curve/modules/space-vector-three-plane-projection';

type Props = {
  controlsMountId: string;
};

export default function SpaceVectorThreePlaneProjectionCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={spaceVectorThreePlaneProjectionModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="空間向量與三平面投影動畫"
    />
  );
}
