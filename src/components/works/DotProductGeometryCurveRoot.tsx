import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS,
  dotProductGeometryModule,
  type DotProductGeometryParams,
  type DotProductMode,
} from '../../curve/modules/dot-product-geometry';
import type { ParamValues } from '../../curve/types';
import StatsPanel from '../curve/StatsPanel';
import { useDotProductGeometryP5 } from '../curve/useDotProductGeometryP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

function paramsForMetadata(params: DotProductGeometryParams): ParamValues {
  return {
    ux: params.ux,
    uy: params.uy,
    vx: params.vx,
    vy: params.vy,
    mode: params.mode === 'work' ? 1 : 0,
  };
}

export default function DotProductGeometryCurveRoot({
  controlsMountId = 'dot-product-geometry-controls',
}: Props) {
  const module = dotProductGeometryModule;
  const [params, setParams] = useState<DotProductGeometryParams>(
    DEFAULT_DOT_PRODUCT_GEOMETRY_PARAMS,
  );
  const [showAngle, setShowAngle] = useState(true);
  const [showProjection, setShowProjection] = useState(true);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onParamsChange = useCallback((patch: Partial<DotProductGeometryParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useDotProductGeometryP5({
    params,
    showAngle,
    showProjection,
    onParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(paramsForMetadata(params), {
    revealPct: 100,
    smoothParams: paramsForMetadata(params),
  });

  const setMode = (mode: DotProductMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>
          <div className="curve-work-mode-toggle">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.mode === 'dot'}
              onClick={() => setMode('dot')}
            >
              內積 u · v
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.mode === 'work'}
              onClick={() => setMode('work')}
            >
              功 W = F · d
            </button>
          </div>
          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showAngle}
              onClick={() => setShowAngle((prev) => !prev)}
            >
              夾角 θ
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showProjection}
              onClick={() => setShowProjection((prev) => !prev)}
            >
              投影 proj
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
              重設
            </button>
          </div>
          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="內積的幾何意義互動"
      />
      {controls}
    </>
  );
}
