import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { riemannSumModule } from '../../curve/modules/riemann-sum';
import { useRiemannSumP5 } from '../curve/useRiemannSumP5';

type Props = {
  controlsMountId: string;
};

export default function RiemannSumCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={riemannSumModule}
      useCanvas={useRiemannSumP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="黎曼和動態圖"
    />
  );
}
