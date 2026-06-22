import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { eulerFormulaRotationModule } from '../../curve/modules/euler-formula-rotation';
import { useEulerFormulaRotationP5 } from '../curve/useEulerFormulaRotationP5';

type Props = {
  controlsMountId: string;
};

export default function EulerFormulaRotationCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={eulerFormulaRotationModule}
      useCanvas={useEulerFormulaRotationP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="尤拉公式旋轉動畫"
    />
  );
}
