import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { prefersReducedMotion } from '../../lib/reducedMotion';
import {
  EXACT_PROBABILITY,
  SAMPLE_TARGET,
  choiceFor,
  generateSamples,
  isSmall,
} from '../../exam/amc12a-2024-20-random-points-area-probability/geometry';
import {
  fractionOnSide,
  randomPointsLayout,
  renderRandomPointsAreaProbabilityExamScene,
  squareFromScreen,
  squareToScreen,
  trianglePointScreens,
} from '../../systems/rendering/randomPointsAreaProbabilityExamRender';
import {
  useRectP5CanvasHost,
  type CanvasSize,
  type ExtendSketch,
} from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type DragTarget = 'p' | 'q' | 'square' | null;

type Props = { locale?: 'en' };

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  const height = width < 520 ? Math.round(width * 1.75) : Math.round(width * 0.8);
  return { width, height: Math.max(380, height) };
}

export default function RandomPointsAreaProbabilityExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [x, setX] = useState(0.8);
  const [y, setY] = useState(0.7);
  const [squeeze, setSqueeze] = useState(false);
  const [seed, setSeed] = useState(2024);
  const [estimate, setEstimate] = useState<number | null>(null);

  const samples = useMemo(() => generateSamples(SAMPLE_TARGET, seed), [seed]);
  const samplesRef = useRef(samples);
  const countRef = useRef(0);
  const viewRef = useRef({ x, y, squeeze });
  viewRef.current = { x, y, squeeze };
  const dragRef = useRef<DragTarget>(null);

  useEffect(() => {
    samplesRef.current = samples;
    countRef.current = 0;
    setEstimate(null);
  }, [samples]);

  const draw = useCallback((p: p5) => {
    // 減少動態：一次算完兩萬次，不逐步累積
    const batch = prefersReducedMotion()
      ? SAMPLE_TARGET
      : Math.max(1, Math.round((SAMPLE_TARGET * Math.min(p.deltaTime, 50)) / 3200));
    const before = countRef.current;
    countRef.current = Math.min(SAMPLE_TARGET, countRef.current + batch);
    const current = viewRef.current;
    renderRandomPointsAreaProbabilityExamScene(p, {
      width: p.width,
      height: p.height,
      x: current.x,
      y: current.y,
      samples: samplesRef.current,
      count: countRef.current,
      squeeze: current.squeeze,
      locale,
    });
    const finished = countRef.current >= SAMPLE_TARGET;
    if (finished && before < SAMPLE_TARGET) {
      let hits = 0;
      for (const sample of samplesRef.current) if (sample.small) hits += 1;
      setEstimate(hits / samplesRef.current.length);
    }
    return { keepLooping: !finished };
  }, [locale]);

  const extendSketch = useMemo<ExtendSketch>(() => {
    return (p) => {
      const inside = () => p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
      const pick = (): DragTarget => {
        const layout = randomPointsLayout(p.width, p.height);
        const { x: cx, y: cy } = viewRef.current;
        const screens = trianglePointScreens(layout, cx, cy);
        const mouse = { x: p.mouseX, y: p.mouseY };
        const dist = (a: { x: number; y: number }) => Math.hypot(a.x - mouse.x, a.y - mouse.y);
        const candidates: Array<[DragTarget, number]> = [
          ['p', dist(screens.p)],
          ['q', dist(screens.q)],
          ['square', dist(squareToScreen(layout, cx, cy))],
        ];
        candidates.sort((a, b) => a[1] - b[1]);
        if (candidates[0][1] <= 36) return candidates[0][0];
        return squareFromScreen(layout, mouse.x, mouse.y) ? 'square' : null;
      };
      const update = () => {
        const layout = randomPointsLayout(p.width, p.height);
        const target = dragRef.current;
        if (target === 'p') setX(fractionOnSide(layout, 'p', p.mouseX, p.mouseY));
        else if (target === 'q') setY(fractionOnSide(layout, 'q', p.mouseX, p.mouseY));
        else if (target === 'square') {
          const point = squareFromScreen(layout, p.mouseX, p.mouseY);
          if (point) {
            setX(point.x);
            setY(point.y);
          }
        }
      };
      const press = () => {
        if (!inside()) return;
        dragRef.current = pick();
        if (!dragRef.current) return;
        update();
        return false;
      };
      const move = () => {
        if (!dragRef.current || !inside()) return;
        update();
        return false;
      };
      const release = () => {
        dragRef.current = null;
      };
      p.mousePressed = press;
      p.mouseDragged = move;
      p.mouseReleased = release;
      p.touchStarted = press;
      p.touchMoved = move;
      p.touchEnded = release;
    };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw, extendSketch], measureCanvas, extendSketch, {
    restartOn: [seed, x, y, squeeze],
  });

  const small = isSmall(x, y);

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Two random points, area ratio xy' : '兩點隨機、面積比 xy'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'When P and Q are both midpoints, triangle APQ is only 1/4 of the whole. How far above 1/2 is the chance it is less than half?'
              : 'P、Q 都取在各邊中點時，△APQ 只有全體的 1/4。那「小於一半」的機率會比 1/2 大多少？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Left: drag P and Q. Right: the same (x, y) in the unit square. Blue is xy < 1/2.'
              : '左：拖曳 P、Q；右：同一組 (x, y) 在單位正方形裡的位置，藍色區域是 xy<1/2'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `P and Q on an equilateral triangle, and the region xy < 1/2 in the unit square. Area ratio ${(x * y).toFixed(3)}, with 20,000 samples settling near 0.8466.`
                : `正三角形邊上的 P、Q 與單位正方形中的 xy<1/2 區域；目前面積比 ${(x * y).toFixed(3)}，並有兩萬次模擬收斂到約 0.8466`
            }
            style={{ cursor: 'grab', touchAction: 'none' }}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'This pair P, Q' : '這一組 P、Q'}</p>
            <label className="exam-interactive-explore__range">
              <span>x = AP/AB</span>
              <output>{x.toFixed(2)}</output>
              <input
                type="range"
                aria-label={en ? 'Position x of P on AB' : 'P 在 AB 上的位置 x'}
                min="0"
                max="1"
                step="0.01"
                value={x}
                onInput={(event) => setX(Number(event.currentTarget.value))}
              />
            </label>
            <label className="exam-interactive-explore__range">
              <span>y = AQ/AC</span>
              <output>{y.toFixed(2)}</output>
              <input
                type="range"
                aria-label={en ? 'Position y of Q on AC' : 'Q 在 AC 上的位置 y'}
                min="0"
                max="1"
                step="0.01"
                value={y}
                onInput={(event) => setY(Number(event.currentTarget.value))}
              />
            </label>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {en
                ? `Area ratio xy=${(x * y).toFixed(3)} (${small ? 'less than half' : 'not less than half'})`
                : `面積比 xy=${(x * y).toFixed(3)}（${small ? '小於一半' : '不小於一半'}）`}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The two triangles share angle A, so the area ratio is (AP·AQ)/(AB·AC) = xy.'
                : '兩三角形共用 ∠A，面積比 = (AP·AQ)/(AB·AC) = xy。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Probability' : '機率'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {estimate === null
                ? en
                  ? 'Simulating…'
                  : '模擬中…'
                : en
                  ? `Simulated ${estimate.toFixed(4)}, in (${choiceFor(estimate) ?? '—'})`
                  : `模擬 ${estimate.toFixed(4)}，落在 (${choiceFor(estimate) ?? '—'})`}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `Exact value (1+ln2)/2≈${EXACT_PROBABILITY.toFixed(4)}, in choice (D) (3/4, 7/8].`
                : `精確值 (1+ln2)/2≈${EXACT_PROBABILITY.toFixed(4)}，落在選項 (D) (3/4, 7/8]。`}
            </p>
            <button
              type="button"
              className="exam-interactive-explore__mode-button"
              onClick={() => setSeed((current) => current + 1)}
            >
              {en ? 'Resimulate 20,000 times' : '重新模擬兩萬次'}
            </button>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'No integral' : '不用積分'}</p>
            <button
              type="button"
              className="exam-interactive-explore__mode-button"
              data-active={squeeze}
              aria-pressed={squeeze}
              onClick={() => setSqueeze((current) => !current)}
            >
              {squeeze ? (en ? 'Hide the bounds' : '隱藏夾擠圖形') : en ? 'Show the bounds' : '顯示夾擠圖形'}
            </button>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The red region xy ≥ 1/2 sits inside the dashed square (area 1/4) and contains the gold triangle (area 1/8), so the probability is between 3/4 and 7/8.'
                : '紅色區域 xy≥1/2 裝在虛線正方形裡（面積 1/4），又包住金色三角形（面積 1/8），所以機率在 3/4 與 7/8 之間。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
