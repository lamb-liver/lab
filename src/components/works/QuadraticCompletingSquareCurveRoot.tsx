import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PRESETS } from '../../curve/modules/quadratic-completing-square/constants';
import {
  DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  isPresetActive,
  paramsForMetadata,
  quadraticCompletingSquareModule,
  sanitizeA,
  type QuadraticCompletingSquareParams,
} from '../../curve/modules/quadratic-completing-square';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useQuadraticCompletingSquareP5 } from '../curve/useQuadraticCompletingSquareP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function QuadraticCompletingSquareCurveRoot({ controlsMountId }: Props) {
  const module = quadraticCompletingSquareModule;
  const [params, setParams] = useState<QuadraticCompletingSquareParams>(
    DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  );
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onParamsChange = useCallback((patch: Partial<QuadraticCompletingSquareParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useQuadraticCompletingSquareP5({
    params,
    onParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const sliderValues = paramsForMetadata(params);
  const metadata = module.getMetadata(sliderValues, {
    revealPct: 100,
    smoothParams: sliderValues,
  });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <p className="curve-work-controls__formula">=a(x-h)²+k</p>

          <p className="curve-work-controls__formula">快速狀態</p>
          <div
            className="curve-work-mode-toggle"
            style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={isPresetActive(params, preset)}
                onClick={() =>
                  onParamsChange({ a: preset.a, b: preset.b, c: preset.c })
                }
              >
                {preset.label}
              </button>
            ))}
          </div>

          <ParamControls
            module={module}
            values={sliderValues}
            onChange={(key, value) => {
              if (key === 'a') {
                onParamsChange({ a: sanitizeA(value) });
                return;
              }
              if (key === 'b' || key === 'c') {
                onParamsChange({ [key]: value });
              }
            }}
          />

          <div className="curve-work-mode-toggle">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.advanced}
              onClick={() => onParamsChange({ advanced: !params.advanced })}
            >
              {params.advanced ? '配方 guide：開' : '配方 guide：關'}
            </button>
          </div>

          <p className="curve-work-controls__formula">也可在圖上拖動頂點 V</p>
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
        aria-label="二次函數配方視覺化"
      />
      {controls}
    </>
  );
}
