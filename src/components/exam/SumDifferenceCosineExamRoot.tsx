import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_PRODUCT,
  PRODUCT_MAX,
  PRODUCT_MIN,
  readSumDifference,
  type SumDifferenceReading,
} from '../../exam/gaokao-2024-i-sum-difference-cosine/geometry';
import { renderSumDifferenceExam } from '../../systems/rendering/sumDifferenceCosineExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

function factorBody(factor: number): string {
  const nearest = Math.round(factor);
  const text = Math.abs(factor - nearest) < 1e-6 ? String(nearest) : factor.toFixed(3);
  return text.replace('-', '−');
}

function sumText(reading: SumDifferenceReading): string {
  if (reading.atGiven) return 'cos(α+β) = m';
  if (reading.sumVanishes) return 'cos(α+β) ≈ 0';
  return `cos(α+β) ≈ ${reading.sumCos.toFixed(3).replace('-', '−')}`;
}

function diffText(en: boolean, reading: SumDifferenceReading): string {
  if (reading.atGiven) return 'cos(α−β) = −3m';
  if (reading.sumVanishes) {
    return en ? 'The cosine of the sum is near 0, so no multiple shows' : '和的餘弦接近 0，看不出倍數';
  }
  return `cos(α−β) ≈ ${factorBody(reading.factor ?? 0)} m`;
}

type Props = { locale?: 'en' };

export default function SumDifferenceCosineExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const reading = readSumDifference(product);

  const draw = useCallback(
    (p: p5) => {
      renderSumDifferenceExam(p, { width: p.width, height: p.height, product });
    },
    [product],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: product,
  });

  const trap = reading.atGiven
    ? en
      ? 'Dropping the minus writes 3m. Swapping the sum and the difference writes −m/3.'
      : '漏掉負號會寫成 3m。和與差對調會寫成 −m/3。'
    : reading.sumVanishes
      ? en
        ? 'The sum is near a right angle, and its cosine projection shrinks to a point.'
        : '和角接近直角，餘弦的投影縮成一點。'
      : en
        ? 'The factor here is (1+k)/(1−k).'
        : '這裡的倍數是 (1+k)/(1−k)。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Two rays, then the cosines' : '兩條射線，再看餘弦'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The tangent product is 2. What goes wrong if the difference cosine is written as 3m, or as −m/3?'
              : '正切乘積是 2。把差的餘弦寫成 3m 或 −m/3，各自錯在哪一步？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'White is α, gold is β. The white point is α+β and the gold point is α−β. The segments on the horizontal axis are their cosines.'
              : '白線是 α，金線是 β。白點是 α+β，金點是 α−β，橫軸上的線段是兩點的餘弦。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Unit circle with tangent product ${reading.product.toFixed(2)}, rays α and β, and the sum and difference`
                : `正切乘積 ${reading.product.toFixed(2)} 的單位圓，射線 α、β，以及和角與差角`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Tangent product' : '正切乘積'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Tangent product' : '正切乘積'}</span>
              <output>{reading.product.toFixed(2)}</output>
              <input
                id="tan-product"
                type="range"
                aria-label={en ? 'Tangent product' : '正切乘積'}
                min={PRODUCT_MIN}
                max={PRODUCT_MAX}
                step={0.01}
                value={product}
                onInput={(event) => setProduct(readSumDifference(Number(event.currentTarget.value)).product)}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The first ray stays at π/4, so the second ray’s tangent is this product.'
                : '第一條射線停在 π/4，第二條的正切就是這個乘積。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Cosine of the sum' : '和的餘弦'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {sumText(reading)}
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'The problem calls this value m.' : '題目把這個值記成 m。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Cosine of the difference' : '差的餘弦'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {diffText(en, reading)}
            </p>
            <p className="exam-interactive-explore__note">{trap}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
