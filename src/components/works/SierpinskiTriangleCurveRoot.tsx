import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_CHAOS,
  MODE_COMPARE,
  MODE_RECURSIVE,
  sierpinskiTriangleModule,
} from '../../curve/modules/sierpinski-triangle';
import type { ParamValues } from '../../curve/types';
import StatsPanel from '../curve/StatsPanel';
import { useSierpinskiTriangleP5 } from '../curve/useSierpinskiTriangleP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function SierpinskiTriangleCurveRoot({ controlsMountId }: Props) {
  const module = sierpinskiTriangleModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const { canvasHostRef } = useSierpinskiTriangleP5({
    targetParams,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams);

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const mode = Math.round(targetParams.mode ?? MODE_COMPARE);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle" aria-label="生成模式">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={mode === MODE_RECURSIVE}
              onClick={() => patchParams({ mode: MODE_RECURSIVE })}
            >
              遞迴
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={mode === MODE_CHAOS}
              onClick={() => patchParams({ mode: MODE_CHAOS })}
            >
              混沌
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={mode === MODE_COMPARE}
              onClick={() => patchParams({ mode: MODE_COMPARE })}
            >
              對照
            </button>
          </div>

          <div className="control-field">
            <label htmlFor="sierpinski-depth">
              <span>遞迴深度 n</span>
              <span className="control-field__value">{Math.round(targetParams.depth ?? 6)}</span>
            </label>
            <div className="range-wrap">
              <input
                id="sierpinski-depth"
                type="range"
                className="range"
                min={1}
                max={8}
                step={1}
                value={targetParams.depth ?? 6}
                onChange={(event) => patchParams({ depth: Number(event.target.value) })}
                onInput={(event) => patchParams({ depth: Number(event.currentTarget.value) })}
              />
            </div>
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
        aria-label="謝爾賓斯基三角形"
      />
      {controls}
    </>
  );
}
