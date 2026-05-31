import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DEFAULT_VECTOR_PROJECTION_PARAMS,
  vectorProjectionModule,
  vectorProjectionParamsForMetadata,
  type ProjectionMode,
  type ProjectionViewMode,
  type VectorProjectionParams,
} from '../../curve/modules/vector-projection';
import StatsPanel from '../curve/StatsPanel';
import { useVectorProjectionP5 } from '../curve/useVectorProjectionP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function VectorProjectionCurveRoot({
  controlsMountId = 'vector-projection-controls',
}: Props) {
  const module = vectorProjectionModule;
  const [params, setParams] = useState<VectorProjectionParams>(
    DEFAULT_VECTOR_PROJECTION_PARAMS,
  );
  const [showDrop, setShowDrop] = useState(true);
  const [showError, setShowError] = useState(true);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onParamsChange = useCallback((patch: Partial<VectorProjectionParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useVectorProjectionP5({
    params,
    showDrop,
    showError,
    onParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadataParams = vectorProjectionParamsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setProjectionMode = (projectionMode: ProjectionMode) => {
    setParams((prev) => ({ ...prev, projectionMode }));
  };

  const setViewMode = (viewMode: ProjectionViewMode) => {
    setParams((prev) => ({ ...prev, viewMode }));
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
              aria-pressed={params.projectionMode === 'a_on_b'}
              onClick={() => setProjectionMode('a_on_b')}
            >
              a 投影到 b
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.projectionMode === 'b_on_a'}
              onClick={() => setProjectionMode('b_on_a')}
            >
              b 投影到 a
            </button>
          </div>
          <div className="curve-work-mode-toggle">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.viewMode === 'projection'}
              onClick={() => setViewMode('projection')}
            >
              投影分解
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.viewMode === 'basis'}
              onClick={() => setViewMode('basis')}
            >
              正交基 e1,e2
            </button>
          </div>
          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showDrop}
              onClick={() => setShowDrop((prev) => !prev)}
            >
              分解動畫
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showError}
              onClick={() => setShowError((prev) => !prev)}
            >
              誤差長度
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed="false"
              onClick={() => {
                setParams(DEFAULT_VECTOR_PROJECTION_PARAMS);
                setShowDrop(true);
                setShowError(true);
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
        aria-label="向量投影與分解互動"
      />
      {controls}
    </>
  );
}
