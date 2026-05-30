import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { logisticCurveModule } from '../../curve/modules/logistic-curve';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useLogisticCurveP5 } from '../curve/useLogisticCurveP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

export default function LogisticCurveCurveRoot({
  controlsMountId = 'logistic-curve-controls',
}: Props) {
  const module = logisticCurveModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useLogisticCurveP5({
    defaultParams: module.defaultParams,
    targetParams,
    resetNonce,
    onRevealPctChange,
    onSmoothParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const showDyDt = (targetParams.showDyDt ?? 1) !== 0;
  const showExpCompare = (targetParams.showExpCompare ?? 1) !== 0;

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams,
  });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
            <p className="curve-work-controls__formula">連續時間模型，不是離散分岔圖</p>
          </div>

          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
          />

          <div className="curve-work-mode-toggle" aria-label="顯示選項">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showDyDt}
              onClick={() =>
                setTargetParams((prev) => ({
                  ...prev,
                  showDyDt: showDyDt ? 0 : 1,
                }))
              }
            >
              顯示 dy/dt
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showExpCompare}
              onClick={() =>
                setTargetParams((prev) => ({
                  ...prev,
                  showExpCompare: showExpCompare ? 0 : 1,
                }))
              }
            >
              指數對照 Ce^kt
            </button>
          </div>

          <div className="curve-work-mode-toggle" aria-label="重置">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={false}
              onClick={() => {
                setTargetParams(module.defaultParams);
                setResetNonce((prev) => prev + 1);
              }}
            >
              重置參數
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
        aria-label="邏輯斯諦曲線互動視覺化"
      />
      {controls}
    </>
  );
}
