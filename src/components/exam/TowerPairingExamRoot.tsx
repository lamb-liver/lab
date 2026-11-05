import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { D_OPTIONS, blockerFor, pairingsFor, targetSums, type DOption } from '../../exam/gaokao-2026-i-tower-pairing/geometry';
import { renderTowerPairingExam } from '../../systems/rendering/towerPairingExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

const PAIRINGS = new Map(D_OPTIONS.map((d) => [d, pairingsFor(d)]));

type Props = { locale?: 'en' };

export default function TowerPairingExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [d, setD] = useState<DOption>(2);
  const [index, setIndex] = useState(0);
  const list = PAIRINGS.get(d) ?? [];
  const pairing = list.length > 0 ? list[index % list.length] : null;
  const blocker = blockerFor(d);
  const sums = targetSums(d);

  const draw = useCallback(
    (p: p5) => renderTowerPairingExam(p, { width: p.width, height: p.height, d, pairing, locale }),
    [d, pairing, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${d}-${index}`,
  });

  const result = (() => {
    if (blocker === 'non-positive')
      return en ? `d = ${d}: b₁ = ${sums[0]} is not positive.` : `d = ${d}：b₁ = ${sums[0]} 不是正數。`;
    if (blocker === 'odd-sum')
      return en
        ? `d = ${d}: some target sums are odd, but odd + odd is always even.`
        : `d = ${d}：有組和是奇數，但奇數加奇數一定是偶數。`;
    if (blocker === 'no-pairing') return en ? `d = ${d}: no pairing fits.` : `d = ${d}：配不出來。`;
    return en
      ? `d = ${d} works. Pairing ${(index % list.length) + 1} of ${list.length}.`
      : `d = ${d} 可行，第 ${(index % list.length) + 1} 種配法，共 ${list.length} 種。`;
  })();

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Six pair sums, one common difference' : '六個組和，一個公差'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The six sums average 18, so b₁ = 18 − 5d/2. Which d keeps every sum even and positive?'
              : '六個組和平均是 18，所以 b₁ = 18 − 5d/2。哪個 d 能讓每個組和都是正的偶數？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Each bar is one pair: the two segments are the two rows, and the full length is the pair sum. The chips below are the 12 rows.'
              : '每一條是一組：兩段是兩列的座數，總長就是組和。下方是 12 列的座數'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Target sums ${sums.join(', ')} for d = ${d}${pairing ? ', with one pairing filled in' : ', no pairing'}`
                : `d = ${d} 時的組和 ${sums.join('、')}${pairing ? '，已填入一種配法' : '，配不出來'}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Common difference d' : '公差 d'}</p>
            <div className="exam-interactive-explore__modes">
              {D_OPTIONS.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={d === option}
                  aria-pressed={d === option}
                  onClick={() => {
                    setD(option);
                    setIndex(0);
                  }}
                >
                  {'ABCD'[i]}. d = {option}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Result' : '結果'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {result}
            </p>
            {list.length > 1 && (
              <div className="exam-interactive-explore__modes">
                <button type="button" className="exam-interactive-explore__mode-button" onClick={() => setIndex((v) => v + 1)}>
                  {en ? 'Another pairing' : '換一種配法'}
                </button>
              </div>
            )}
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Two filters' : '兩道篩選'}</p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The smallest and largest sums add to 36, so 5d = 36 − 2b₁ and d is even. Every sum is even, so b₁ = 18 − 5d/2 is even too: d is a multiple of 4.'
                : '最小與最大的組和相加是 36，推出 5d = 36 − 2b₁，d 是偶數。組和都是偶數，b₁ = 18 − 5d/2 也要是偶數，所以 d 是 4 的倍數。'}
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'b₁ > 0 gives d < 7.2, leaving d = 4.' : 'b₁ > 0 得 d < 7.2，只剩 d = 4。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
