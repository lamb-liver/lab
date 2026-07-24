import { useCallback, useEffect, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  exactVolume,
  midpointDiskVolume,
} from '../../exam/ast-114-solid-of-revolution/geometry';
import { renderSolidOfRevolutionExamScene } from '../../systems/rendering/solidOfRevolutionExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

const ANIMATION_MS = 1200;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(330, Math.round(width * 0.64)) };
}

export default function SolidOfRevolutionExamRoot() {
  const [a, setA] = useState(1);
  const [slices, setSlices] = useState(10);
  const [replayKey, setReplayKey] = useState(0);
  const aRef = useRef(a);
  const slicesRef = useRef(slices);
  const progressRef = useRef(0);

  useEffect(() => {
    aRef.current = a;
    progressRef.current = 0;
  }, [a, replayKey]);

  useEffect(() => {
    slicesRef.current = slices;
  }, [slices]);

  const draw = useCallback((p: p5) => {
    progressRef.current = Math.min(
      1,
      progressRef.current + Math.min(p.deltaTime, 50) / ANIMATION_MS,
    );
    renderSolidOfRevolutionExamScene(p, {
      width: p.width,
      height: p.height,
      a: aRef.current,
      slices: slicesRef.current,
      sweep: progressRef.current,
    });
    return { keepLooping: progressRef.current < 1 };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, undefined, {
    restartOn: [a, slices, replayKey],
  });
  const approximate = midpointDiskVolume(a, slices);
  const exact = exactVolume(a);
  const exactLabel = a === 1 ? '18π/5' : `[2+(8/5)×(${a.toFixed(1)})²]π`;

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">圓盤掃成旋轉體</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            每條曲線圍出的面積都等於 2，繞 x 軸後的體積也會都相等嗎？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            金色截線代表圓盤；增加 n 會讓中點和靠近積分值
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`函數 3ax 平方加 1 減 a 繞 x 軸形成的旋轉體，a=${a.toFixed(1)}，切成 ${slices} 片`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">改變函數</p>
            <label className="exam-interactive-explore__range">
              <span>參數 a</span>
              <output>{a.toFixed(1)}</output>
              <input
                type="range"
                aria-label="函數參數 a"
                min="-0.5"
                max="1"
                step="0.1"
                value={a}
                onInput={(event) => setA(Number(event.currentTarget.value))}
              />
            </label>
            <p className="exam-interactive-explore__result" aria-live="polite">
              V={exactLabel}≈{exact.toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              V=2π+(8/5)πa²；面積固定，不代表半徑平方的積分固定。
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">圓盤近似</p>
            <label className="exam-interactive-explore__range">
              <span>切片數 n</span>
              <output>{slices}</output>
              <input
                type="range"
                aria-label="圓盤切片數 n"
                min="4"
                max="32"
                step="1"
                value={slices}
                onInput={(event) => setSlices(Number(event.currentTarget.value))}
              />
            </label>
            <p className="exam-interactive-explore__note">
              中點和 {approximate.toFixed(3)}；誤差 {Math.abs(approximate - exact).toFixed(3)}
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setReplayKey((current) => current + 1)}
          >
            重播旋轉掃掠
          </button>
        </aside>
      </div>
    </div>
  );
}
