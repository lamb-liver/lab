import { useState } from 'react';
import {
  MODE_COUNT,
  MODE_OVERLAY,
  MODE_SINGLE,
  combinatorialPathCountingModule,
} from '../../curve/modules/combinatorial-path-counting';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useCombinatorialPathCountingP5 } from '../curve/useCombinatorialPathCountingP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const modeOptions = [
  { value: MODE_SINGLE, label: '單一路徑' },
  { value: MODE_OVERLAY, label: '路徑疊合' },
  { value: MODE_COUNT, label: '計數場' },
];

export default function CombinatorialPathCountingCurveRoot({ controlsMountId }: Props) {
  const module = combinatorialPathCountingModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [rerollNonce, setRerollNonce] = useState(0);

  const { canvasHostRef } = useCombinatorialPathCountingP5({
    targetParams,
    rerollNonce,
  });

  const metadata = module.getMetadata(targetParams);
  const mode = Math.round(targetParams.mode ?? MODE_SINGLE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
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
          新路徑
        </button>
      </div>
    </WorkControlsPortal>
  );

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
