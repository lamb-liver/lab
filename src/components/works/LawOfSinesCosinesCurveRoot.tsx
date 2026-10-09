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
  locale?: 'en';
};

function paramsForMetadata(params: LawOfSinesCosinesParams): ParamValues {
  // triangle 是 TriangleVerts 而非 number；getMetadata 內部以 asLawParams 還原
  return {
    mode: params.mode === 'cosine' ? 1 : 0,
    advanced: params.advanced ? 1 : 0,
    triangle: params.triangle,
  } as unknown as ParamValues;
}

export default function LawOfSinesCosinesCurveRoot({ controlsMountId, locale }: Props) {
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
    locale,
  });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown =
    locale === 'en'
      ? {
          ...metadata,
          title: params.mode === 'cosine' ? 'Cosine law' : 'Sine law',
        }
      : metadata;

  const setMode = (mode: LawMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'sine'}
          onClick={() => setMode('sine')}
        >
          {locale === 'en' ? 'Sine law' : '正弦定理'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'cosine'}
          onClick={() => setMode('cosine')}
        >
          {locale === 'en' ? 'Cosine law' : '餘弦定理'}
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.advanced}
          onClick={() => setParams((prev) => ({ ...prev, advanced: !prev.advanced }))}
        >
          {locale === 'en'
            ? params.advanced
              ? 'Guides: on'
              : 'Guides: off'
            : params.advanced
              ? '輔助線：開'
              : '輔助線：關'}
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
          {locale === 'en' ? 'Reset triangle' : '重設三角形'}
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
          locale === 'en'
            ? 'Sine law and cosine law: sides, angles, and the circumradius'
            : '正弦定理與餘弦定理互動'
        }
      />
      {controls}
    </>
  );
}
