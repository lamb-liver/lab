import { useState } from 'react';
import {
  P_DEFAULT,
  P_MAX,
  P_MIN,
  THETA_DEFAULT_DEG,
  THETA_MIN_DEG,
  clampTheta,
  formatDegrees,
  thetaMaxDeg,
} from '../../curve/circlePower';
import { twoSecantsModule } from '../../curve/modules/two-secants';
import {
  measureCirclePowerWorkCanvas,
  useCirclePowerP5,
} from '../curve/useCirclePowerP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import type { CurveMetadata } from '../../curve/types';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  horizontal: 'Horizontal',
  slanted: 'Slanted',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Two secants',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function TwoSecantsCurveRoot({ controlsMountId, locale }: Props) {
  const [p, setP] = useState(P_DEFAULT);
  const [thetaDeg, setThetaDeg] = useState(THETA_DEFAULT_DEG);
  const { canvasHostRef } = useCirclePowerP5(
    { kind: 'two-secants', p, thetaDeg },
    measureCirclePowerWorkCanvas,
  );
  const metadata = twoSecantsModule.getMetadata({ p, thetaDeg });
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en'
            ? 'Two secants: products along the horizontal secant and the slanted secant'
            : '兩條割線：水平割線與斜割線的兩段乘積'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="two-secants-p">
            <span>{locale === 'en' ? 'Position p' : '位置 p'}</span>
            <span className="control-field__value">{p.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="two-secants-p"
              type="range"
              className="range"
              min={P_MIN}
              max={P_MAX}
              step={0.01}
              value={p}
              onInput={(event) => {
                const next = Number(event.currentTarget.value);
                setP(next);
                setThetaDeg((prev) => clampTheta(next, prev));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="two-secants-theta">
            <span>{locale === 'en' ? 'Angle' : '偏角'}</span>
            <span className="control-field__value">{formatDegrees(thetaDeg)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="two-secants-theta"
              type="range"
              className="range"
              min={THETA_MIN_DEG}
              max={thetaMaxDeg(p)}
              step={0.5}
              value={thetaDeg}
              onInput={(event) => setThetaDeg(Number(event.currentTarget.value))}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
