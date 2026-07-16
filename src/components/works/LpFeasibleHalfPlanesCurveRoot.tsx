import CurveWorkRoot from '../curve/CurveWorkRoot';
import { lpFeasibleHalfPlanesModule } from '../../curve/modules/lp-feasible-half-planes';

type Props = {
  controlsMountId: string;
};

export default function LpFeasibleHalfPlanesCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={lpFeasibleHalfPlanesModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="約束半平面與可行域動畫"
    />
  );
}
