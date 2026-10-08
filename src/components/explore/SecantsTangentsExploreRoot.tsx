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

const TEXT = {
  zh: {
    modes: [
      { value: 'secants' as const, label: '兩條割線' },
      { value: 'tangent' as const, label: '切線' },
    ],
    title: '割線與切線',
    captionSecants: '水平割線與另一條割線',
    captionTangent: '水平割線與上方切線',
    aria: '割線與切線：水平割線留著，另一條在割線與切線之間換',
    caseTitle: '截法',
    position: '位置',
    readout: '讀數',
    horizontal: '水平',
    slanted: '斜線',
    tangentSquare: '切線平方',
  },
  en: {
    modes: [
      { value: 'secants' as const, label: 'Two secants' },
      { value: 'tangent' as const, label: 'Tangent' },
    ],
    title: 'Secants and tangents',
    captionSecants: 'Horizontal secant and a second secant',
    captionTangent: 'Horizontal secant and the upper tangent',
    aria: 'Secants and tangents: the horizontal secant stays, and the other line switches between a secant and the upper tangent',
    caseTitle: 'Case',
    position: 'Position',
    readout: 'Readout',
    horizontal: 'Horizontal',
    slanted: 'Slanted',
    tangentSquare: 'Tangent squared',
  },
} as const;

type Props = {
  locale?: 'en';
};

export default function SecantsTangentsExploreRoot({ locale }: Props) {
  const text = locale === 'en' ? TEXT.en : TEXT.zh;
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
      ? [text.slanted, format3(slantedSecant(settled.p, settled.thetaDeg).product)]
      : [text.tangentSquare, format3(upperTangent(settled.p).square)];

  return (
    <div className="secants-tangents-explore">
      <div className="secants-tangents-explore__stage">
        <div className="secants-tangents-explore__visual">
          <p className="secants-tangents-explore__visual-title">{text.title}</p>
          <p className="secants-tangents-explore__visual-sub">
            {mode === 'secants' ? text.captionSecants : text.captionTangent}
          </p>
          <div
            ref={canvasHostRef}
            className="secants-tangents-explore__canvas"
            role="img"
            aria-label={text.aria}
          />
        </div>

        <aside className="secants-tangents-explore__sidebar">
          <div className="secants-tangents-explore__block">
            <p className="secants-tangents-explore__block-title">{text.caseTitle}</p>
            <div className="secants-tangents-explore__modes">
              {text.modes.map((item) => (
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
                <span>{text.position}</span>
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
            <p className="secants-tangents-explore__block-title">{text.readout}</p>
            <p className="secants-tangents-explore__reading">
              <span>{text.horizontal}</span>
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
