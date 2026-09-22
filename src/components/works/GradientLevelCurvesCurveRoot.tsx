import { useCallback, useState } from 'react';
import {
  DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  SURFACE_KINDS,
  gradientLevelCurvesModule,
  gradientLevelCurvesParamsForMetadata,
  type GradientLevelCurvesParams,
  type SurfaceKind,
} from '../../curve/modules/gradient-level-curves';
import { useGradientLevelCurvesP5 } from '../curve/useGradientLevelCurvesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const KIND_LABELS: Record<SurfaceKind, string> = {
  paraboloid: '圓 x²+y²',
  saddle: '鞍 x²−y²',
  product: '雙曲 xy',
};

export default function GradientLevelCurvesCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<GradientLevelCurvesParams>(
    DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<GradientLevelCurvesParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useGradientLevelCurvesP5({ params, onParamsChange });

  const metadata = gradientLevelCurvesModule.getMetadata(
    gradientLevelCurvesParamsForMetadata(params),
  );

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {SURFACE_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.kind === kind}
            onClick={() => onParamsChange({ kind })}
          >
            {KIND_LABELS[kind]}
          </button>
        ))}
      </div>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showFamily}
          onClick={() => onParamsChange({ showFamily: !params.showFamily })}
        >
          等位線族
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS)}
        >
          重設
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="梯度與等位線互動：可拖動測試點"
      />
      {controls}
    </>
  );
}
