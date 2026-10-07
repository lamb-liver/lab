import { useState } from 'react';
import {
  P_DEFAULT,
  P_MAX,
  P_MIN,
  THETA_DEFAULT_DEG,
  format3,
  horizontalSecant,
  settle,
  slantedSecant,
  upperTangent,
} from '../../curve/circlePower';
import {
  measureCirclePowerExploreCanvas,
  useCirclePowerP5,
} from '../curve/useCirclePowerP5';
import '../../styles/components/explore/secants-tangents-explore.css';

type Mode = 'secants' | 'tangent';

const MODES: Array<{ value: Mode; label: string }> = [
  { value: 'secants', label: '兩條割線' },
  { value: 'tangent', label: '切線' },
];

export default function SecantsTangentsExploreRoot() {
  const [p, setP] = useState(P_DEFAULT);
  const [mode, setMode] = useState<Mode>('secants');
  const settled = settle(p, THETA_DEFAULT_DEG);
  const kind = mode === 'secants' ? 'explore-secants' : 'explore-tangent';
  const { canvasHostRef } = useCirclePowerP5(
    { kind, p: settled.p, thetaDeg: settled.thetaDeg },
    measureCirclePowerExploreCanvas,
  );

  const horizontal = format3(horizontalSecant(settled.p).product);
  const second =
    mode === 'secants'
      ? ['斜線', format3(slantedSecant(settled.p, settled.thetaDeg).product)]
      : ['切線平方', format3(upperTangent(settled.p).square)];

  return (
    <div className="secants-tangents-explore">
      <div className="secants-tangents-explore__stage">
        <div className="secants-tangents-explore__visual">
          <p className="secants-tangents-explore__visual-title">割線與切線</p>
          <p className="secants-tangents-explore__visual-sub">
            {mode === 'secants' ? '水平割線與另一條割線' : '水平割線與上方切線'}
          </p>
          <div
            ref={canvasHostRef}
            className="secants-tangents-explore__canvas"
            role="img"
            aria-label="割線與切線：水平割線留著，另一條在割線與切線之間換"
          />
        </div>

        <aside className="secants-tangents-explore__sidebar">
          <div className="secants-tangents-explore__block">
            <p className="secants-tangents-explore__block-title">截法</p>
            <div className="secants-tangents-explore__modes">
              {MODES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="secants-tangents-explore__mode-button"
                  data-active={mode === item.value}
                  aria-pressed={mode === item.value}
                  onClick={() => setMode(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="secants-tangents-explore__block">
            <div className="control-field">
              <label htmlFor="secants-tangents-p">
                <span>位置</span>
                <span className="control-field__value">{settled.p.toFixed(2)}</span>
              </label>
              <div className="range-wrap">
                <input
                  id="secants-tangents-p"
                  type="range"
                  className="range"
                  min={P_MIN}
                  max={P_MAX}
                  step={0.01}
                  value={settled.p}
                  onInput={(event) => setP(Number(event.currentTarget.value))}
                />
              </div>
            </div>
          </div>

          <div className="secants-tangents-explore__block">
            <p className="secants-tangents-explore__block-title">讀數</p>
            <p className="secants-tangents-explore__reading">
              <span>水平</span>
              <span>{horizontal}</span>
            </p>
            <p className="secants-tangents-explore__reading">
              <span>{second[0]}</span>
              <span>{second[1]}</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
