import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_COUNT,
  MODE_OVERLAY,
  MODE_SINGLE,
  combinatorialPathCountingModule,
} from '../../curve/modules/combinatorial-path-counting';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useCombinatorialPathCountingP5 } from '../curve/useCombinatorialPathCountingP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

const modeOptions = [
  { value: MODE_SINGLE, label: 'single path' },
  { value: MODE_OVERLAY, label: 'all paths overlay' },
  { value: MODE_COUNT, label: 'count field' },
];

export default function CombinatorialPathCountingCurveRoot({
  controlsMountId = 'combinatorial-path-counting-controls',
}: Props) {
  const module = combinatorialPathCountingModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [rerollNonce, setRerollNonce] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useCombinatorialPathCountingP5({
    defaultParams: module.defaultParams,
    targetParams,
    rerollNonce,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams: targetParams });
  const mode = Math.round(targetParams.mode ?? MODE_SINGLE);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="路徑模式">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={mode === option.value}
                onClick={() => setTargetParams((prev) => ({ ...prev, mode: option.value }))}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
          />

          <div className="curve-work-mode-toggle" aria-label="路徑控制">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={false}
              onClick={() => setRerollNonce((prev) => prev + 1)}
            >
              new path
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
        aria-label="組合路徑計數互動視覺化"
      />
      {controls}
    </>
  );
}
