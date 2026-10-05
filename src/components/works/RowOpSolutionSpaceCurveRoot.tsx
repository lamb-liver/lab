import { useCallback, useState } from 'react';
import { rowOpSolutionSpaceModule } from '../../curve/modules/row-op-solution-space';
import {
  DEFAULT_ROW_OP_PARAMS,
  PRESETS,
  type RowOpParams,
} from '../../curve/modules/row-op-solution-space/geometry';
import { useRowOpSolutionSpaceP5 } from '../curve/useRowOpSolutionSpaceP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function RowOpSolutionSpaceCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<RowOpParams>({ ...DEFAULT_ROW_OP_PARAMS });
  const onPreset = useCallback((preset: RowOpParams['preset']) => {
    setParams((prev) => ({ ...prev, preset }));
  }, []);
  const { canvasHostRef } = useRowOpSolutionSpaceP5({ params });
  const metadata = rowOpSolutionSpaceModule.getMetadata(params);

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="列運算與解空間：三張平面的交集"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <div className="curve-work-mode-toggle">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.preset === preset.id}
              onClick={() => onPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="control-field">
          <label htmlFor="row-op-solution-space-k">
            <span>第三列係數 k</span>
            <span className="control-field__value">{params.k.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="row-op-solution-space-k"
              type="range"
              className="range"
              min={-2}
              max={2}
              step={0.05}
              value={params.k}
              onInput={(event) => {
                const k = Number(event.currentTarget.value);
                setParams((prev) => ({ ...prev, k }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
