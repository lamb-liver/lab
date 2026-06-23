import { useState } from 'react';
import { MODE_SIM, MODE_X, MODE_Z, binomialToNormalModule } from '../../curve/modules/binomial-to-normal';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBinomialToNormalP5 } from '../curve/useBinomialToNormalP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

const modeOptions = [
  { value: MODE_X, label: 'X 分佈' },
  { value: MODE_Z, label: 'Z 標準化' },
  { value: MODE_SIM, label: '伯努利模擬' },
];

export default function BinomialToNormalCurveRoot({ controlsMountId }: Props) {
  const module = binomialToNormalModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [runNonce, setRunNonce] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);

  const { canvasHostRef } = useBinomialToNormalP5({
    targetParams,
    runNonce,
    resetNonce,
  });


  const mode = Math.round(targetParams.mode ?? MODE_X);
  const metadata = module.getMetadata(targetParams);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="視圖模式">
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

      <div className="curve-work-mode-toggle" aria-label="模擬控制">
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setRunNonce((prev) => prev + 1)}>
          抽樣
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setResetNonce((prev) => prev + 1)}>
          重設
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="二項分佈到常態分佈互動視覺化" />
      {controls}
    </>
  );
}
