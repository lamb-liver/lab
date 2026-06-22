import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexPolarFormModule } from '../../curve/modules/complex-polar-form';
import { useComplexPolarFormP5 } from '../curve/useComplexPolarFormP5';

type Props = {
  controlsMountId: string;
};

export default function ComplexPolarFormCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={complexPolarFormModule}
      useCanvas={useComplexPolarFormP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="複數極座標形式動畫"
    />
  );
}
