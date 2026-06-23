import { useCallback, useState } from 'react';
import {
  MODE_DECAY,
  MODE_GROWTH,
  exponentialGrowthDecayModule,
} from '../../curve/modules/exponential-growth-decay';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useExponentialGrowthDecayP5 } from '../curve/useExponentialGrowthDecayP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

const modeOptions = [
  { value: MODE_GROWTH, label: '成長' },
  { value: MODE_DECAY, label: '衰減' },
];

export default function ExponentialGrowthDecayCurveRoot({ controlsMountId }: Props) {
  const module = exponentialGrowthDecayModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useExponentialGrowthDecayP5({
    targetParams,
    onRevealPctChange,
  });


  const mode = Math.round(targetParams.mode ?? MODE_GROWTH);
  const logScale = (targetParams.logScale ?? 0) !== 0;
  const tangentMode = (targetParams.tangentMode ?? 0) !== 0;

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });

  const visibleSchema = tangentMode
    ? module.paramSchema
    : module.paramSchema.filter((field) => field.key !== 'tNorm');

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="模式">
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

      <div className="curve-work-mode-toggle" aria-label="顯示選項">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={logScale}
          onClick={() => patchParams({ logScale: logScale ? 0 : 1 })}
        >
          ln y 尺度
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={tangentMode}
          onClick={() => patchParams({ tangentMode: tangentMode ? 0 : 1 })}
        >
          切線斜率
        </button>
      </div>

      <ParamControls
        module={{ ...module, paramSchema: visibleSchema }}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="指數成長與衰減互動視覺化"
      />
      {controls}
    </>
  );
}
