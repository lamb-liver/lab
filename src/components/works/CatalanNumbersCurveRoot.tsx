import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_PAREN,
  MODE_PATH,
  MODE_TRIANGULATION,
  catalanNumbersModule,
} from '../../curve/modules/catalan-numbers';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useCatalanNumbersP5 } from '../curve/useCatalanNumbersP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

const modeOptions = [
  { value: MODE_PATH, label: 'Dyck path' },
  { value: MODE_PAREN, label: 'Parentheses' },
  { value: MODE_TRIANGULATION, label: 'Triangulation' },
];

export default function CatalanNumbersCurveRoot({ controlsMountId = 'catalan-numbers-controls' }: Props) {
  const module = catalanNumbersModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [nextNonce, setNextNonce] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useCatalanNumbersP5({
    defaultParams: module.defaultParams,
    targetParams,
    nextNonce,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const mode = Math.round(targetParams.mode ?? MODE_PATH);
  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams: targetParams });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="Catalan model">
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

          <div className="curve-work-mode-toggle" aria-label="object">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={false}
              onClick={() => setNextNonce((prev) => prev + 1)}
            >
              next object
            </button>
          </div>

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="卡特蘭數互動視覺化" />
      {controls}
    </>
  );
}
