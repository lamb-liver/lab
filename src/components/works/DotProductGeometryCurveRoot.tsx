import { useCallback, useState } from 'react';
import {
  DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS,
  dotProductGeometryModule,
  type DotProductGeometryParams,
  type DotProductMode,
} from '../../curve/modules/dot-product-geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useDotProductGeometryP5 } from '../curve/useDotProductGeometryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function englishMetadata(metadata: CurveMetadata, mode: DotProductMode): CurveMetadata {
  return {
    ...metadata,
    title: mode === 'work' ? 'Work as a dot product' : 'Dot product',
  };
}

function paramsForMetadata(params: DotProductGeometryParams): ParamValues {
  return {
    ux: params.ux,
    uy: params.uy,
    vx: params.vx,
    vy: params.vy,
    mode: params.mode === 'work' ? 1 : 0,
  };
}

export default function DotProductGeometryCurveRoot({ controlsMountId, locale }: Props) {
  const module = dotProductGeometryModule;
  const [params, setParams] = useState<DotProductGeometryParams>(
    DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS,
  );
  const [showAngle, setShowAngle] = useState(true);
  const [showProjection, setShowProjection] = useState(true);

  const onParamsChange = useCallback((patch: Partial<DotProductGeometryParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useDotProductGeometryP5({
    params,
    showAngle,
    showProjection,
    onParamsChange,
  });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata, params.mode) : metadata;

  const setMode = (mode: DotProductMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'dot'}
          onClick={() => setMode('dot')}
        >
          {locale === 'en' ? 'Dot product u · v' : '內積 u · v'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'work'}
          onClick={() => setMode('work')}
        >
          {locale === 'en' ? 'Work W = F · d' : '功 W = F · d'}
        </button>
      </div>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showAngle}
          onClick={() => setShowAngle((prev) => !prev)}
        >
          {locale === 'en' ? 'Angle θ' : '夾角 θ'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showProjection}
          onClick={() => setShowProjection((prev) => !prev)}
        >
          {locale === 'en' ? 'Projection' : '投影 proj'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => {
            setParams(DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS);
            setShowAngle(true);
            setShowProjection(true);
          }}
        >
          {locale === 'en' ? 'Reset' : '重設'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en' ? 'Dot product: angle, projection, and work' : '內積的幾何意義互動'
        }
      />
      {controls}
    </>
  );
}
