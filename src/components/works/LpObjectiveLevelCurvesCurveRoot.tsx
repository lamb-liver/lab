import CurveWorkRoot from '../curve/CurveWorkRoot';
import { lpObjectiveLevelCurvesModule } from '../../curve/modules/lp-objective-level-curves';

type Props = {
  controlsMountId: string;
};

export default function LpObjectiveLevelCurvesCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={lpObjectiveLevelCurvesModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="目標函數等值線動畫"
    />
  );
}
