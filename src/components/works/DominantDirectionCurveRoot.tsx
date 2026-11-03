import { useState } from 'react';
import { dominantDirectionModule } from '../../curve/modules/dominant-direction';
import {
  DEFAULT_DOMINANT_PARAMS,
  STEPS_MAX,
  STEPS_MIN,
  THETA_MAX,
  THETA_MIN,
  type DominantParams,
} from '../../curve/modules/dominant-direction/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useDominantDirectionP5 } from '../curve/useDominantDirectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  angle: 'Angle to λ1',
  stretch: 'Next stretch',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Dominant direction',
    formula: 'u ← Au / ||Au||',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function DominantDirectionCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<DominantParams>({ ...DEFAULT_DOMINANT_PARAMS });
  const { canvasHostRef } = useDominantDirectionP5({ params });
  const metadata = dominantDirectionModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const en = locale === 'en';

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Dominant direction: repeated multiplication settles onto the line of the larger eigenvalue'
            : '主方向：反覆乘上並取回單位長度後，方向靠向較大特徵值的直線'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="dominant-direction-theta">
            <span>{en ? 'Start angle θ' : '起始角 θ'}</span>
            <span className="control-field__value">{params.thetaDeg.toFixed(0)}°</span>
          </label>
          <div className="range-wrap">
            <input
              id="dominant-direction-theta"
              type="range"
              className="range"
              min={THETA_MIN}
              max={THETA_MAX}
              step={1}
              value={params.thetaDeg}
              onInput={(event) => {
                const thetaDeg = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, thetaDeg }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="dominant-direction-steps">
            <span>{en ? 'Steps n' : '次數 n'}</span>
            <span className="control-field__value">{params.steps.toFixed(0)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="dominant-direction-steps"
              type="range"
              className="range"
              min={STEPS_MIN}
              max={STEPS_MAX}
              step={1}
              value={params.steps}
              onInput={(event) => {
                const steps = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, steps }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
