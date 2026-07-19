import { useState } from 'react';
import {
  MODE_BINOMIAL,
  MODE_GEOMETRIC,
  binomialGeometricDistributionModule,
} from '../../curve/modules/binomial-geometric-distribution';
import type { CurveModule, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBinomialGeometricDistributionP5 } from '../curve/useBinomialGeometricDistributionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

const modeOptions = [
  { value: MODE_BINOMIAL, label: '二項' },
  { value: MODE_GEOMETRIC, label: '幾何' },
];

export default function BinomialGeometricDistributionCurveRoot({ controlsMountId }: Props) {
  const module = binomialGeometricDistributionModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const { canvasHostRef } = useBinomialGeometricDistributionP5({ targetParams });
  const mode = Math.round(targetParams.mode ?? MODE_BINOMIAL);
  const metadata = module.getMetadata(targetParams);
  const controlsModule =
    mode === MODE_GEOMETRIC
      ? ({ ...module, paramSchema: module.paramSchema.filter((def) => def.key === 'p') } as CurveModule)
      : module;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle" aria-label="分佈">
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
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) =>
          setTargetParams((prev) => ({
            ...prev,
            [key]: key === 'n' ? Math.round(value) : value,
          }))
        }
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="二項分佈與幾何分佈互動視覺化"
      />
      {controls}
    </>
  );
}
