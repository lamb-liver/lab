import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MODE_SIM, MODE_X, MODE_Z, binomialToNormalModule } from '../../curve/modules/binomial-to-normal';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useBinomialToNormalP5 } from '../curve/useBinomialToNormalP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

const modeOptions = [
  { value: MODE_X, label: 'X distribution' },
  { value: MODE_Z, label: 'Z standardized' },
  { value: MODE_SIM, label: 'Bernoulli simulation' },
];

export default function BinomialToNormalCurveRoot({ controlsMountId = 'binomial-to-normal-controls' }: Props) {
  const module = binomialToNormalModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [runNonce, setRunNonce] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useBinomialToNormalP5({
    defaultParams: module.defaultParams,
    targetParams,
    runNonce,
    resetNonce,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const mode = Math.round(targetParams.mode ?? MODE_X);
  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams: targetParams });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="mode">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={mode === option.value}
                onClick={() => {
                  setTargetParams((prev) => ({ ...prev, mode: option.value }));
                  setResetNonce((prev) => prev + 1);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => {
              setTargetParams((prev) => ({ ...prev, [key]: value }));
              setResetNonce((prev) => prev + 1);
            }}
          />

          <div className="curve-work-mode-toggle" aria-label="simulation control">
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setRunNonce((prev) => prev + 1)}>
              run sample
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setResetNonce((prev) => prev + 1)}>
              reset
            </button>
          </div>

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="二項分佈到常態分佈互動視覺化" />
      {controls}
    </>
  );
}
