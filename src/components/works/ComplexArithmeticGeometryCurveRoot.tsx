import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexArithmeticGeometryModule } from '../../curve/modules/complex-arithmetic-geometry';
import { useComplexArithmeticGeometryP5 } from '../curve/useComplexArithmeticGeometryP5';

type Props = {
  controlsMountId: string;
};

export default function ComplexArithmeticGeometryCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={complexArithmeticGeometryModule}
      useCanvas={useComplexArithmeticGeometryP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="複數四則運算幾何動畫"
    />
  );
}
