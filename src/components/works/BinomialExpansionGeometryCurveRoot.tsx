import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_CUBE,
  MODE_SQUARE,
  binomialExpansionGeometryModule,
} from '../../curve/modules/binomial-expansion-geometry';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useBinomialExpansionGeometryP5 } from '../curve/useBinomialExpansionGeometryP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

const modeOptions = [
  { value: MODE_SQUARE, label: 'n = 2 平方' },
  { value: MODE_CUBE, label: 'n = 3 立方' },
];

export default function BinomialExpansionGeometryCurveRoot({
  controlsMountId = 'binomial-expansion-geometry-controls',
}: Props) {
  const module = binomialExpansionGeometryModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);
  const { canvasHostRef } = useBinomialExpansionGeometryP5({
    targetParams,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams);
  const mode = Math.round(targetParams.mode ?? MODE_SQUARE);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle" aria-label="維度模式">
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
        aria-label="二項式展開幾何互動視覺化"
      />
      {controls}
    </>
  );
}
