import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  B_RANGE,
  EQUAL_LINES,
  K_AT_MAX,
  K_RANGE,
  MAX_SUM,
  SUM3_LINES,
  chordSum,
  chords,
} from '../../exam/gaokao-2026-i-three-circles-chords/geometry';
import { renderThreeCirclesChordsExam } from '../../systems/rendering/threeCirclesChordsExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(420, Math.round(width * 0.8)) };
}

const fmt = (v: number | null) => (v === null ? '—' : v.toFixed(3));

type Props = { locale?: 'en' };

type Preset = { key: string; label: string; k: number; b: number };

export default function ThreeCirclesChordsExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [k, setK] = useState(0.15);
  const [b, setB] = useState(0.8);
  const s = chords(k, b);
  const sum = chordSum(k, b);

  const presets: Preset[] = [
    ...EQUAL_LINES.map((l, i) => ({ key: `eq${i}`, label: `${en ? 'Equal' : '等長'} ${i + 1}`, ...l })),
    ...SUM3_LINES.slice(2).map((l, i) => ({ key: `s3${i}`, label: `${en ? 'Sum 3' : '和為 3'} ${i + 1}`, ...l })),
    { key: 'a', label: 'k = √3/3', k: Math.sqrt(3) / 3, b: 0.6 },
    { key: 'max', label: en ? 'b = 0 max' : 'b = 0 最大', k: K_AT_MAX, b: 0 },
  ];

  const draw = useCallback(
    (p: p5) => renderThreeCirclesChordsExam(p, { width: p.width, height: p.height, k, b, locale }),
    [k, b, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${k}-${b}`,
  });

  const equal = s.every((v) => v !== null) && Math.abs((s[0] as number) - (s[1] as number)) < 1e-6 && Math.abs((s[1] as number) - (s[2] as number)) < 1e-6;

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'One line, three chords' : '一條直線，三條弦'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'Equal chords means equal distances to the three centers. How many lines are equally far from three points that form a triangle?'
              : '弦等長就是三個圓心到直線等距。到三角形三個頂點等距的直線有幾條？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Top: the three unit circles and the line y = kx + b. Bottom: with b = 0, the chord sum against k.'
              : '上方是三個單位圓與直線 y = kx + b。下方是 b = 0 時弦長和對 k 的曲線'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Line y = ${k.toFixed(2)}x + ${b.toFixed(2)} cutting chords ${s.map(fmt).join(', ')}`
                : `直線 y = ${k.toFixed(2)}x + ${b.toFixed(2)}，三條弦長 ${s.map(fmt).join('、')}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Line' : '直線'}</p>
            <label className="exam-interactive-explore__range">
              <span>k</span>
              <output>{k.toFixed(2)}</output>
              <input
                type="range"
                aria-label={en ? 'Slope k' : '斜率 k'}
                min={-K_RANGE}
                max={K_RANGE}
                step={0.01}
                value={k}
                onInput={(event) => setK(Number(event.currentTarget.value))}
              />
            </label>
            <label className="exam-interactive-explore__range">
              <span>b</span>
              <output>{b.toFixed(2)}</output>
              <input
                type="range"
                aria-label={en ? 'Intercept b' : '截距 b'}
                min={-B_RANGE}
                max={B_RANGE}
                step={0.01}
                value={b}
                onInput={(event) => setB(Number(event.currentTarget.value))}
              />
            </label>
            <div className="exam-interactive-explore__modes">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={Math.abs(preset.k - k) < 1e-9 && Math.abs(preset.b - b) < 1e-9}
                  aria-pressed={Math.abs(preset.k - k) < 1e-9 && Math.abs(preset.b - b) < 1e-9}
                  onClick={() => {
                    setK(preset.k);
                    setB(preset.b);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Chord lengths' : '弦長'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              s₁ = {fmt(s[0])}，s₂ = {fmt(s[1])}，s₃ = {fmt(s[2])}
            </p>
            <p className="exam-interactive-explore__note">
              {sum === null
                ? en
                  ? 'The line misses at least one circle.'
                  : '直線至少和一個圓不相交。'
                : `s₁ + s₂ + s₃ = ${sum.toFixed(3)}${equal ? (en ? ', all equal' : '，三弦等長') : ''}`}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Options' : '選項'}</p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'A. False: with k = ±√3/3 the line is perpendicular to C₁C₃ or C₂C₃. Those centers are 2 apart along the line’s normal, so the line cannot be within 1 of both.'
                : 'A. 錯：k = ±√3/3 時直線垂直於 C₁C₃ 或 C₂C₃，這兩個圓心沿法向相距 2，直線無法同時離兩者都小於 1。'}
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'B. True: exactly 3 such lines.' : 'B. 對：恰有 3 條。'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'C. True: through the origin, k = ±√3 and k = ±√171/5 all give a sum of 3.'
                : 'C. 對：過原點時 k = ±√3、k = ±√171/5 都讓和為 3。'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `D. True: through the origin the largest sum is 2√21/3 ≈ ${MAX_SUM.toFixed(3)}.`
                : `D. 對：過原點時和的最大值是 2√21/3 ≈ ${MAX_SUM.toFixed(3)}。`}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
