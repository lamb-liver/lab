import CurveWorkRoot from '../curve/CurveWorkRoot';
import { roseModule } from '../../curve/modules/rose';

type Props = {
  controlsMountId?: string;
};

export default function RoseCurveRoot({
  controlsMountId = 'rose-curve-controls',
}: Props) {
  return (
    <CurveWorkRoot
      module={roseModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="玫瑰曲線動畫"
    />
  );
}
