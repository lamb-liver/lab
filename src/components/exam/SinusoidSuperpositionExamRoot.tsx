import { useCallback, useEffect, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  fmt,
  formatRad,
} from '../../curve/modules/sinusoid-amplitude-period-phase/geometry';
import {
  DEFAULT_SINUSOID_COEFFICIENTS,
  sinusoidForm,
  symmetryAxes,
  type SinusoidCoefficients,
} from '../../exam/gsat-112-sinusoid-superposition/geometry';
import { renderSinusoidSuperpositionExamScene } from '../../systems/rendering/sinusoidSuperpositionExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

const ANIMATION_MS = 650;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(280, Math.round(width * 0.56)) };
}

export default function SinusoidSuperpositionExamRoot() {
  const [coefficients, setCoefficients] = useState<SinusoidCoefficients>(
    DEFAULT_SINUSOID_COEFFICIENTS,
  );
  const [replayKey, setReplayKey] = useState(0);
  const coefficientsRef = useRef(coefficients);
  const progressRef = useRef(0);
  const form = sinusoidForm(coefficients);
  const axes = symmetryAxes(coefficients);

  useEffect(() => {
    coefficientsRef.current = coefficients;
    progressRef.current = 0;
  }, [coefficients, replayKey]);

  const draw = useCallback((p: p5) => {
    progressRef.current = Math.min(
      1,
      progressRef.current + Math.min(p.deltaTime, 50) / ANIMATION_MS,
    );
    renderSinusoidSuperpositionExamScene(p, {
      width: p.width,
      height: p.height,
      ...coefficientsRef.current,
      progress: 1 - (1 - progressRef.current) ** 3,
    });
    return { keepLooping: progressRef.current < 1 };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, undefined, {
    restartOn: [coefficients.a, coefficients.b, replayKey],
  });
  const phase = formatRad(form.phase);
  const phaseExpression =
    form.phase < 0 ? `x − ${formatRad(-form.phase)}` : `x + ${phase}`;

  const setCoefficient = (key: keyof SinusoidCoefficients, value: number) => {
    setCoefficients((current) => ({ ...current, [key]: value }));
  };
  const bText =
    Math.abs(coefficients.b - Math.sqrt(3)) < 0.005
      ? `√3 ≈ ${fmt(coefficients.b)}`
      : fmt(coefficients.b);

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">正弦與餘弦疊合</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            改變兩個係數時，振幅與波峰位置會怎麼移動？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            圖例標出兩個分量與合成波；虛線是對稱軸
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label="正弦與餘弦疊合、相位平移及對稱軸"
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">係數</p>
            <div className="exam-interactive-explore__ranges">
              <label className="exam-interactive-explore__range">
                <span>a · sin x</span>
                <output>{fmt(coefficients.a)}</output>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={coefficients.a}
                  onInput={(event) => setCoefficient('a', Number(event.currentTarget.value))}
                />
              </label>
              <label className="exam-interactive-explore__range">
                <span>b · cos x</span>
                <output>{bText}</output>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={coefficients.b}
                  onInput={(event) => setCoefficient('b', Number(event.currentTarget.value))}
                />
              </label>
            </div>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                onClick={() => {
                  setCoefficients(DEFAULT_SINUSOID_COEFFICIENTS);
                  setReplayKey((current) => current + 1);
                }}
              >
                回到原題 a=1、b=√3
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                onClick={() => setReplayKey((current) => current + 1)}
              >
                重播相位平移
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">疊合式</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {fmt(form.amplitude)} sin({phaseExpression})
            </p>
            <p className="exam-interactive-explore__note">
              a=R cos φ、b=R sin φ；R = √(a²+b²) = {fmt(form.amplitude)}，φ = {phase}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">對稱軸</p>
            <p className="exam-interactive-explore__note">
              {axes.length > 0
                ? axes.map((axis) => `x=${formatRad(axis)}`).join('、')
                : '函數為 0，任意鉛直線皆可視為對稱軸'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
