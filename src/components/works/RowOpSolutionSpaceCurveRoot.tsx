import { useCallback, useState } from 'react';
import { rowOpSolutionSpaceModule } from '../../curve/modules/row-op-solution-space';
import {
  DEFAULT_ROW_OP_PARAMS,
  PRESETS,
  presetLabel,
  sceneFromParams,
  solutionLabel,
  type RowOpParams,
} from '../../curve/modules/row-op-solution-space/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useRowOpSolutionSpaceP5 } from '../curve/useRowOpSolutionSpaceP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const STAT_LABEL_EN: Record<string, string> = {
  state: 'Status',
  solution: 'Solution',
  r1: 'First equation',
  r2: 'Second equation',
  r3: 'Third equation',
};

function englishMetadata(metadata: CurveMetadata, params: RowOpParams): CurveMetadata {
  const scene = sceneFromParams(params);
  return {
    title: 'Row operations and the solution space',
    formula: 'row 3 := row 3 + k × row 1',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: STAT_LABEL_EN[stat.key] ?? stat.label,
      value:
        stat.key === 'state'
          ? presetLabel(params.preset, 'en')
          : stat.key === 'solution'
            ? solutionLabel(scene.solution, 'en')
            : stat.value,
    })),
  };
}

export default function RowOpSolutionSpaceCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const [params, setParams] = useState<RowOpParams>({ ...DEFAULT_ROW_OP_PARAMS });
  const onPreset = useCallback((preset: RowOpParams['preset']) => {
    setParams((prev) => ({ ...prev, preset }));
  }, []);
  const { canvasHostRef } = useRowOpSolutionSpaceP5({ params, locale });
  const metadata = rowOpSolutionSpaceModule.getMetadata(params);
  const shown = en ? englishMetadata(metadata, params) : metadata;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Row operations and the solution space: the intersection of three planes'
            : '列運算與解空間：三張平面的交集'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="curve-work-mode-toggle">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.preset === preset.id}
              onClick={() => onPreset(preset.id)}
            >
              {en ? presetLabel(preset.id, 'en') : preset.label}
            </button>
          ))}
        </div>
        <div className="control-field">
          <label htmlFor="row-op-solution-space-k">
            <span>{en ? 'Third-row coefficient k' : '第三列係數 k'}</span>
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
