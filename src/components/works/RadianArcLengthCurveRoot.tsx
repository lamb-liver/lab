import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DEFAULT_RADIAN_ARC_LENGTH_PARAMS,
  radianArcLengthModule,
  type RadianArcLengthParams,
  type RadiusMode,
} from '../../curve/modules/radian-arc-length';
import {
  THETA_MAX,
  THETA_MIN,
  formatRad,
  radiusFromMode,
} from '../../curve/modules/radian-arc-length/geometry';
import type { ParamValues } from '../../curve/types';
import { useRadianArcLengthP5 } from '../curve/useRadianArcLengthP5';
import StatsPanel from '../curve/StatsPanel';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

function paramsForMetadata(params: RadianArcLengthParams): ParamValues {
  return {
    theta: params.theta,
    radius: radiusFromMode(params.radiusMode),
    showSpecialAngles: params.showSpecialAngles ? 1 : 0,
  };
}

export default function RadianArcLengthCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<RadianArcLengthParams>({
    ...DEFAULT_RADIAN_ARC_LENGTH_PARAMS,
  });
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const onThetaChange = useCallback((theta: number) => {
    setParams((prev) => ({ ...prev, theta }));
  }, []);

  const { canvasHostRef } = useRadianArcLengthP5({ params, onThetaChange });

  const metadataParams = paramsForMetadata(params);
  const metadata = radianArcLengthModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setRadiusMode = (radiusMode: RadiusMode) => {
    setParams((prev) => ({ ...prev, radiusMode }));
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
              aria-pressed={params.radiusMode === 'unit'}
              onClick={() => setRadiusMode('unit')}
            >
              r = 1
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.radiusMode === 'double'}
              onClick={() => setRadiusMode('double')}
            >
              r = 2
            </button>
          </div>

          <div className="control-field">
            <label htmlFor="radian-arc-theta">
              角度 θ
              <span className="control-field__value">{formatRad(params.theta)}</span>
            </label>
            <div className="range-wrap">
              <input
                id="radian-arc-theta"
                type="range"
                className="range"
                min={THETA_MIN}
                max={THETA_MAX}
                step={0.01}
                value={params.theta}
                onInput={(event) =>
                  setParams((prev) => ({
                    ...prev,
                    theta: Number((event.target as HTMLInputElement).value),
                  }))
                }
              />
            </div>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.showSpecialAngles}
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  showSpecialAngles: !prev.showSpecialAngles,
                }))
              }
            >
              {params.showSpecialAngles ? '特殊角：開' : '特殊角：關'}
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed="false"
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  theta: DEFAULT_RADIAN_ARC_LENGTH_PARAMS.theta,
                }))
              }
            >
              重置 θ
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
        aria-label="弧度與圓弧長互動"
      />
      {controls}
    </>
  );
}
