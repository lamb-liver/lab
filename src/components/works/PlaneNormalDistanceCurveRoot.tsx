import CurveWorkRoot from '../curve/CurveWorkRoot';
import { planeNormalDistanceModule } from '../../curve/modules/plane-normal-distance';

type Props = {
  controlsMountId: string;
};

export default function PlaneNormalDistanceCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={planeNormalDistanceModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="平面法向量與點面距離動畫"
    />
  );
}
