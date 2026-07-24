import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  SAMPLE_TARGET,
  SUCCESS_PROBABILITY,
  atLeastOneProbability,
  generateGeometricSamples,
  trialsForChanceAbove,
} from '../../exam/ast-113-geometric-distribution/geometry';
import { renderGeometricDistributionExamScene } from '../../systems/rendering/geometricDistributionExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(330, Math.round(width * 0.64)) };
}

export default function GeometricDistributionExamRoot() {
  const [seed, setSeed] = useState(113);
  const [tokens, setTokens] = useState(10);
  const samples = useMemo(
    () => generateGeometricSamples(SAMPLE_TARGET, SUCCESS_PROBABILITY, seed),
    [seed],
  );
  const samplesRef = useRef(samples);
  const countRef = useRef(0);

  useEffect(() => {
    samplesRef.current = samples;
    countRef.current = 0;
  }, [samples]);

  const draw = useCallback((p: p5) => {
    const batch = Math.max(1, Math.round((SAMPLE_TARGET * Math.min(p.deltaTime, 50)) / 2400));
    countRef.current = Math.min(SAMPLE_TARGET, countRef.current + batch);
    renderGeometricDistributionExamScene(p, {
      width: p.width,
      height: p.height,
      samples: samplesRef.current,
      count: countRef.current,
      p: SUCCESS_PROBABILITY,
    });
    return { keepLooping: countRef.current < SAMPLE_TARGET };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, undefined, {
    restartOn: [seed],
  });
  const chance = atLeastOneProbability(tokens);
  const threshold = trialsForChanceAbove(0.9);

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">一萬次等待實驗</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            抽 10 次，中獎率會等於 100% 嗎？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            長條是模擬、短線是理論；最右格合併所有 X≥24
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label="幾何分佈一萬次模擬直方圖與樣本平均收斂"
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">代幣數</p>
            <label className="exam-interactive-explore__range">
              <span>最多抽獎 n 次</span>
              <output>{tokens}</output>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={tokens}
                onInput={(event) => setTokens(Number(event.currentTarget.value))}
              />
            </label>
            <p className="exam-interactive-explore__result" aria-live="polite">
              中獎率 {(chance * 100).toFixed(1)}%
            </p>
            <p className="exam-interactive-explore__note">
              1−0.9ⁿ；
              {tokens < threshold
                ? '還沒超過 90%，繼續增加 n。'
                : tokens === threshold
                  ? `這是第一次超過 90%，最少需要 ${threshold} 個代幣。`
                  : '已超過 90%，試著往左找最小值。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">等待次數</p>
            <p className="exam-interactive-explore__result">E(X)=1/0.1=10</p>
            <p className="exam-interactive-explore__note">
              P(X=k)=0.9ᵏ⁻¹×0.1；有限次抽獎的中獎率永遠小於 100%。
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setSeed((current) => current + 1)}
          >
            重新模擬一萬次
          </button>
        </aside>
      </div>
    </div>
  );
}
