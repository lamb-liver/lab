import { useCallback, useState } from 'react';
import {
  MODE_AREA,
  MODE_COMPARE,
  MODE_EULER,
  MODE_PARAM,
  MODE_PARTIAL,
  MODE_PSERIES,
  baselProblemModule,
} from '../../curve/modules/basel-problem';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBaselProblemP5 } from '../curve/useBaselProblemP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const modeOptions = [
  { value: MODE_PARTIAL, label: '部分和' },
  { value: MODE_AREA, label: '面積' },
  { value: MODE_COMPARE, label: '比較' },
  { value: MODE_EULER, label: 'Euler' },
  { value: MODE_PSERIES, label: 'p-級數' },
  { value: MODE_PARAM, label: '零點' },
];

export default function BaselProblemCurveRoot({ controlsMountId }: Props) {
  const module = baselProblemModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [replayNonce, setReplayNonce] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);

  const { canvasHostRef } = useBaselProblemP5({
    targetParams,
    playing,
    replayNonce,
    onRevealPctChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const mode = Math.round(targetParams.mode ?? MODE_PARTIAL);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="巴塞爾視圖">
        {modeOptions.map((option) => (
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
        onChange={(key, value) => {
          patchParams({ [key]: value });
        }}
      />

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
        aria-label="巴塞爾問題視覺化"
      />
      {controls}
    </>
  );
}
