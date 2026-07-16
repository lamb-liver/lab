import CurveWorkRoot from '../curve/CurveWorkRoot';
import { crossProductGeometryModule } from '../../curve/modules/cross-product-geometry';

type Props = {
  controlsMountId: string;
};

export default function CrossProductGeometryCurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={crossProductGeometryModule}
      controlsMountId={controlsMountId}
      canvasAriaLabel="外積的幾何意義動畫"
    />
  );
}
