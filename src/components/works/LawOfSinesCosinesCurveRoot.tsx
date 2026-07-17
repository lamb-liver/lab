import { useCallback, useState } from 'react';
import {
  DEFAULT_LAW_OF_SINES_COSINES_PARAMS,
  lawOfSinesCosinesModule,
  type LawOfSinesCosinesParams,
  type LawMode,
} from '../../curve/modules/law-of-sines-cosines';
import { resetTriangle } from '../../curve/modules/law-of-sines-cosines/geometry';
import type { ParamValues } from '../../curve/types';
import { useLawOfSinesCosinesP5 } from '../curve/useLawOfSinesCosinesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

function paramsForMetadata(params: LawOfSinesCosinesParams): ParamValues {
  // triangle 是 TriangleVerts 而非 number；getMetadata 內部以 asLawParams 還原
  return {
    mode: params.mode === 'cosine' ? 1 : 0,
    advanced: params.advanced ? 1 : 0,
    triangle: params.triangle,
  } as unknown as ParamValues;
}

export default function LawOfSinesCosinesCurveRoot({ controlsMountId }: Props) {
  const module = lawOfSinesCosinesModule;
  const [params, setParams] = useState<LawOfSinesCosinesParams>({
    ...DEFAULT_LAW_OF_SINES_COSINES_PARAMS,
    triangle: resetTriangle(),
  });


  const onTriangleChange = useCallback((triangle: LawOfSinesCosinesParams['triangle']) => {
    setParams((prev) => ({ ...prev, triangle }));
  }, []);

  const { canvasHostRef } = useLawOfSinesCosinesP5({
    params,
    onTriangleChange,
  });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setMode = (mode: LawMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'sine'}
          onClick={() => setMode('sine')}
        >
          正弦定理
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'cosine'}
          onClick={() => setMode('cosine')}
        >
          餘弦定理
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.advanced}
          onClick={() => setParams((prev) => ({ ...prev, advanced: !prev.advanced }))}
        >
          {params.advanced ? '輔助線：開' : '輔助線：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() =>
            setParams({
              ...DEFAULT_LAW_OF_SINES_COSINES_PARAMS,
              triangle: resetTriangle(),
            })
          }
        >
          重置三角形
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="正弦定理與餘弦定理互動"
      />
      {controls}
    </>
  );
}
