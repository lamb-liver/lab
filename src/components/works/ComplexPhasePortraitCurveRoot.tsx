import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { complexPhasePortraitModule } from '../../curve/modules/complex-phase-portrait';
import { useComplexPhasePortraitP5 } from '../curve/useComplexPhasePortraitP5';

type Props = {
  controlsMountId?: string;
};

export default function ComplexPhasePortraitCurveRoot({
  controlsMountId = 'complex-phase-portrait-controls',
}: Props) {
  return (
    <CurveHookWorkRoot
      module={complexPhasePortraitModule}
      useCanvas={useComplexPhasePortraitP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="相位圖"
      initialRevealPct={100}
    />
  );
}
