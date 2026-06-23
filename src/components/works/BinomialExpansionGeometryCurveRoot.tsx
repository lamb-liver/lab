import { useState } from 'react';
import {
  MODE_CUBE,
  MODE_SQUARE,
  binomialExpansionGeometryModule,
} from '../../curve/modules/binomial-expansion-geometry';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBinomialExpansionGeometryP5 } from '../curve/useBinomialExpansionGeometryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const modeOptions = [
  { value: MODE_SQUARE, label: 'n = 2 平方' },
  { value: MODE_CUBE, label: 'n = 3 立方' },
];

export default function BinomialExpansionGeometryCurveRoot({ controlsMountId }: Props) {
  const module = binomialExpansionGeometryModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const { canvasHostRef } = useBinomialExpansionGeometryP5({
    targetParams,
  });

  const metadata = module.getMetadata(targetParams);
  const mode = Math.round(targetParams.mode ?? MODE_SQUARE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
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
    </WorkControlsPortal>
  );

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
