import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { vectorFieldStreamlinesModule } from '../../curve/modules/vector-field-streamlines';
import { useVectorFieldStreamlinesP5 } from '../curve/useVectorFieldStreamlinesP5';

type Props = {
  controlsMountId: string;
};

export default function VectorFieldStreamlinesCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveHookWorkRoot
      module={vectorFieldStreamlinesModule}
      useCanvas={useVectorFieldStreamlinesP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="向量場流線動畫"
    />
  );
}
