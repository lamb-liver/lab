import CurveWorkRoot from '../curve/CurveWorkRoot';
import { lpVertexOptimumModule } from '../../curve/modules/lp-vertex-optimum';

type Props = {
  controlsMountId: string;
};

export default function LpVertexOptimumCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={lpVertexOptimumModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="頂點法求最優解動畫"
    />
  );
}
