import { useState } from 'react';
import {
  MODE_BIFURCATION,
  MODE_COBWEB,
  MODE_COMPARE,
  MODE_ORBIT,
  logisticBifurcationModule,
} from '../../curve/modules/logistic-bifurcation';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useLogisticBifurcationP5 } from '../curve/useLogisticBifurcationP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const modes = [
  { value: MODE_BIFURCATION, label: '分岔' },
  { value: MODE_ORBIT, label: '軌道' },
  { value: MODE_COBWEB, label: '蛛網' },
  { value: MODE_COMPARE, label: '對照' },
];

export default function LogisticBifurcationCurveRoot({ controlsMountId }: Props) {
  const module = logisticBifurcationModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [playing, setPlaying] = useState(true);
  const [replayNonce, setReplayNonce] = useState(0);

  const { canvasHostRef } = useLogisticBifurcationP5({
    targetParams,
    playing,
    replayNonce,
  });

  const metadata = module.getMetadata(targetParams);

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const mode = Math.round(targetParams.mode ?? MODE_COMPARE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle" aria-label="邏輯斯諦視圖">
        {modes.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === option.value}
            onClick={() => patchParams({ mode: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />

      <div className="curve-work-mode-toggle" aria-label="顯示選項">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={targetParams.showFeig !== 0}
          onClick={() => patchParams({ showFeig: targetParams.showFeig === 0 ? 1 : 0 })}
        >
          Feigenbaum
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={targetParams.showCobweb !== 0}
          onClick={() => patchParams({ showCobweb: targetParams.showCobweb === 0 ? 1 : 0 })}
        >
          Cobweb
        </button>
      </div>

      <div className="curve-work-mode-toggle" aria-label="播放控制">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={!playing}
          onClick={() => setPlaying((prev) => !prev)}
        >
          {playing ? '暫停' : '播放'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => {
            setPlaying(true);
            setReplayNonce((prev) => prev + 1);
          }}
        >
          重播
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="邏輯斯諦映射分岔圖"
      />
      {controls}
    </>
  );
}
