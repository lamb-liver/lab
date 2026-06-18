import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { fibonacciSpiralModule } from '../../curve/modules/fibonacci-spiral';
import { useFibonacciSpiralP5 } from '../curve/useFibonacciSpiralP5';

type Props = {
  controlsMountId?: string;
};

export default function FibonacciSpiralCurveRoot({
  controlsMountId = 'fibonacci-spiral-controls',
}: Props) {
  return (
    <CurveHookWorkRoot
      module={fibonacciSpiralModule}
      useCanvas={useFibonacciSpiralP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="費波那契螺線"
    />
  );
}
