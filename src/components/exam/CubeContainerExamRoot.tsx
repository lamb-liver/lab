import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  OPTIONS,
  fits,
  type OptionKey,
} from "../../exam/gaokao-2023-i-cube-container/geometry";
import { renderCubeContainerExam } from '../../systems/rendering/cubeContainerExamRender';
import {
  useRectP5CanvasHost,
  type CanvasSize,
} from "../curve/useRectP5CanvasHost";
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(320, Math.round(width * 0.62)) };
}

const NAMES: Record<
  OptionKey,
  { zh: string; en: string; limitZh: string; limitEn: string }
> = {
  A: {
    zh: '直徑 0.99 的球',
    en: 'Ball of diameter 0.99',
    limitZh: '內切球直徑 1',
    limitEn: 'inscribed ball, diameter 1',
  },
  B: {
    zh: '棱長 1.4 的正四面體',
    en: 'Regular tetrahedron, edge 1.4',
    limitZh: '面對角線 √2 ≈ 1.414',
    limitEn: 'face diagonal √2 ≈ 1.414',
  },
  C: {
    zh: '底面直徑 0.01、高 1.8 的圓柱',
    en: 'Cylinder, base 0.01, height 1.8',
    limitZh: '體對角線 √3 ≈ 1.732',
    limitEn: 'body diagonal √3 ≈ 1.732',
  },
  D: {
    zh: '底面直徑 1.2、高 0.01 的圓柱',
    en: 'Cylinder, base 1.2, height 0.01',
    limitZh: '六邊形截面內切圓 √6/2 ≈ 1.225',
    limitEn: 'hexagon section incircle √6/2 ≈ 1.225',
  },
};

type Props = { locale?: 'en' };

export default function CubeContainerExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [option, setOption] = useState<OptionKey>('A');
  const [yaw, setYaw] = useState(0.6);
  const current = OPTIONS.find((o) => o.key === option)!;
  const ok = fits(current);

  const draw = useCallback(
    (p: p5) =>
      renderCubeContainerExam(p, {
        width: p.width,
        height: p.height,
        option,
        yaw,
      }),
    [option, yaw],
  );
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [],
    measureCanvas,
    undefined,
    {
      loop: false,
      redrawKey: `${option}-${yaw}`,
    },
  );

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'A unit cube as a box' : '棱長 1 的正方體容器'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? ' Every object is longer than 1 somewhere except the ball. Which longest direction inside the cube does each one need?'
              : '除了球，每個物體都有超過 1 的尺寸。它們各自要用正方體裡哪一條最長的方向？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Gold is the object, cyan is the limit the cube allows.'
              : '金色是物體，青色是正方體能給的極限'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Option ${option}: ${NAMES[option].en} in a unit cube`
                : `選項 ${option}：${NAMES[option].zh}放進正方體`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Option' : '選項'}
            </p>
            <div className="exam-interactive-explore__modes">
              {OPTIONS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={o.key === option ? 'true' : 'false'}
                  aria-pressed={o.key === option}
                  onClick={() => setOption(o.key)}
                >
                  {o.key}
                </button>
              ))}
            </div>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Turn' : '轉動'}</span>
              <output>{Math.round((yaw * 180) / Math.PI)}°</output>
              <input
                id="cube-yaw"
                type="range"
                aria-label={en ? 'Turn the cube' : '轉動正方體'}
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={yaw}
                onInput={(event) => setYaw(Number(event.currentTarget.value))}
              />
            </label>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? NAMES[option].en : NAMES[option].zh}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {current.size} {ok ? '≤' : '>'} {current.limit.toFixed(3)}{" "}
              {ok ? (en ? 'fits' : '放得進') : en ? 'does not fit' : '放不進'}
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'Limit: ' : '極限：'}
              {en ? NAMES[option].limitEn : NAMES[option].limitZh}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
