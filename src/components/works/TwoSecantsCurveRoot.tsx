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
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function TwoSecantsCurveRoot({ controlsMountId }: Props) {
  const [p, setP] = useState(P_DEFAULT);
  const [thetaDeg, setThetaDeg] = useState(THETA_DEFAULT_DEG);
  const { canvasHostRef } = useCirclePowerP5(
    { kind: 'two-secants', p, thetaDeg },
    measureCirclePowerWorkCanvas,
  );
  const metadata = twoSecantsModule.getMetadata({ p, thetaDeg });

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="兩條割線：水平割線與斜割線的兩段乘積"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <div className="control-field">
          <label htmlFor="two-secants-p">
            <span>位置 p</span>
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
            <span>偏角</span>
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
