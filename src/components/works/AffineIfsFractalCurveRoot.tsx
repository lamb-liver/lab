import CurveHookWorkRoot from '../curve/CurveHookWorkRoot';
import { affineIfsFractalModule } from '../../curve/modules/affine-ifs-fractal';
import { useAffineIfsFractalP5 } from '../curve/useAffineIfsFractalP5';

type Props = {
  controlsMountId?: string;
};

export default function AffineIfsFractalCurveRoot({
  controlsMountId = 'affine-ifs-fractal-controls',
}: Props) {
  return (
    <CurveHookWorkRoot
      module={affineIfsFractalModule}
      useCanvas={useAffineIfsFractalP5}
      controlsMountId={controlsMountId}
      canvasAriaLabel="碎形仿射疊代動畫"
    />
  );
}
