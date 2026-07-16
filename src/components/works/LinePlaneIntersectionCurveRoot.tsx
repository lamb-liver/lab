import CurveWorkRoot from '../curve/CurveWorkRoot';
import { linePlaneIntersectionModule } from '../../curve/modules/line-plane-intersection';

type Props = {
  controlsMountId: string;
};

export default function LinePlaneIntersectionCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={linePlaneIntersectionModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="空間直線與平面交點動畫"
    />
  );
}
