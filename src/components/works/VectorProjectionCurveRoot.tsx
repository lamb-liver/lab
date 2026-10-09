import { useCallback, useState } from 'react';
import {
  DEFAULT_VECTOR_PROJECTION_PARAMS,
  vectorProjectionModule,
  vectorProjectionParamsForMetadata,
  type ProjectionMode,
  type ProjectionViewMode,
  type VectorProjectionParams,
} from '../../curve/modules/vector-projection';
import type { CurveMetadata } from '../../curve/types';
import { useVectorProjectionP5 } from '../curve/useVectorProjectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STAT: Record<string, string> = {
  a: 'Vector a',
  b: 'Vector b',
  c1: 'Coefficient c₁',
  c2: 'Coefficient c₂',
};

function englishMetadata(metadata: CurveMetadata, viewMode: ProjectionViewMode): CurveMetadata {
  return {
    ...metadata,
    title: viewMode === 'basis' ? 'Orthonormal basis' : 'Vector projection',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STAT[stat.key] ?? stat.label,
    })),
  };
}

export default function VectorProjectionCurveRoot({ controlsMountId, locale }: Props) {
  const module = vectorProjectionModule;
  const [params, setParams] = useState<VectorProjectionParams>(
    DEFAULT_VECTOR_PROJECTION_PARAMS,
  );
  const [showDrop, setShowDrop] = useState(true);
  const [showError, setShowError] = useState(true);

  const onParamsChange = useCallback((patch: Partial<VectorProjectionParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useVectorProjectionP5({
    params,
    showDrop,
    showError,
    onParamsChange,
    locale,
  });

  const metadataParams = vectorProjectionParamsForMetadata(params);
  const metadata = module.getMetadata(metadataParams);
  const shown = locale === 'en' ? englishMetadata(metadata, params.viewMode) : metadata;

  const setProjectionMode = (projectionMode: ProjectionMode) => {
    setParams((prev) => ({ ...prev, projectionMode }));
  };

  const setViewMode = (viewMode: ProjectionViewMode) => {
    setParams((prev) => ({ ...prev, viewMode }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.projectionMode === 'a_on_b'}
          onClick={() => setProjectionMode('a_on_b')}
        >
          {locale === 'en' ? 'a onto b' : 'a 投影到 b'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.projectionMode === 'b_on_a'}
          onClick={() => setProjectionMode('b_on_a')}
        >
          {locale === 'en' ? 'b onto a' : 'b 投影到 a'}
        </button>
      </div>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.viewMode === 'projection'}
          onClick={() => setViewMode('projection')}
        >
          {locale === 'en' ? 'Decomposition' : '投影分解'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.viewMode === 'basis'}
          onClick={() => setViewMode('basis')}
        >
          {locale === 'en' ? 'Basis e1, e2' : '正交基 e1,e2'}
        </button>
      </div>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showDrop}
          onClick={() => setShowDrop((prev) => !prev)}
        >
          {locale === 'en' ? 'Drop animation' : '分解動畫'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showError}
          onClick={() => setShowError((prev) => !prev)}
        >
          {locale === 'en' ? 'Error length' : '誤差長度'}
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
        aria-label={locale === 'en' ? 'Vector projection onto a direction' : '向量投影與分解互動'}
      />
      {controls}
    </>
  );
}
