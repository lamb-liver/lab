import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexPhasePortraitModule } from '../../curve/modules/complex-phase-portrait';
import { useComplexPhasePortraitP5 } from '../curve/useComplexPhasePortraitP5';

type Props = {
  controlsMountId: string;
};

export default function ComplexPhasePortraitCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={complexPhasePortraitModule}
      useCanvas={useComplexPhasePortraitP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="相位圖"
    />
  );
}
