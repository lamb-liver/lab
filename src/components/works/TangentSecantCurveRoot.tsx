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
import { tangentSecantModule } from '../../curve/modules/tangent-secant';
import {
  measureCirclePowerWorkCanvas,
  useCirclePowerP5,
} from '../curve/useCirclePowerP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function TangentSecantCurveRoot({ controlsMountId }: Props) {
  const [p, setP] = useState(P_DEFAULT);
  const [thetaDeg, setThetaDeg] = useState(THETA_DEFAULT_DEG);
  const { canvasHostRef } = useCirclePowerP5(
    { kind: 'tangent-secant', p, thetaDeg },
    measureCirclePowerWorkCanvas,
  );
  const metadata = tangentSecantModule.getMetadata({ p, thetaDeg });

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="切線與割線：切線段平方與斜割線乘積"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <div className="control-field">
          <label htmlFor="tangent-secant-p">
            <span>位置 p</span>
            <span className="control-field__value">{p.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="tangent-secant-p"
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
          <label htmlFor="tangent-secant-theta">
            <span>偏角</span>
            <span className="control-field__value">{formatDegrees(thetaDeg)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="tangent-secant-theta"
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
